#!/usr/bin/env tsx
//
// Export Casa-Privé's member + event catalogue as a JSON dump for the
// OnePass importer at
// blacheinc/multi-tenant-ticketing:scripts/import-casa-prive.ts.
//
// Casa stays read-only for the duration of the migration: this script
// produces ONE canonical dump file that the operator can re-run
// against staging + production OnePass DBs from the same source of
// truth. No DB-to-DB pipe, no implicit "the network was OK at the
// time" assumptions.
//
// Usage:
//   pnpm tsx scripts/export-for-onepass-migration.ts > casa-dump.json
//   pnpm tsx scripts/export-for-onepass-migration.ts --output casa-dump.json
//
// The dump version (`meta.version`) is part of the contract with the
// importer. Bump on the OnePass side and here in lockstep when the
// shape needs to evolve.
//
// Schema tolerance: the upstream Casa schema declares
// `membershipType MembershipType @default(STANDARD)` on Member, but
// forks of this repo have been seen WITHOUT that field. We read it
// through a typed cast so the export works on either shape; when
// the field is missing every member imports as the "standard" plan
// on OnePass and the operator promotes VIPs via /platform.

import { writeFileSync, realpathSync } from 'node:fs';
import { hostname } from 'node:os';
import { fileURLToPath } from 'node:url';
import { PrismaClient, MemberStatus } from '@prisma/client';

const DUMP_VERSION = 1;

// Casa stores prices as Float (NGN); OnePass uses int-minor (kobo).
// 100 kobo = 1 NGN. Round to int so we don't seed fractional kobo
// (rare but possible if a price was entered with > 2 decimals).
export function toMinor(amount: number): number {
  return Math.round(amount * 100);
}

// Match free-form Casa tier names into the OnePass TicketTier enum.
// Order matters — the specific patterns must come before REGULAR
// (which is the fallback bucket).
export function normalizeTier(
  name: string,
): 'EARLY_BIRD' | 'REGULAR' | 'VIP' | 'TABLE' {
  const n = name.toLowerCase();
  if (n.includes('early')) return 'EARLY_BIRD';
  if (n.includes('vvip') || n.includes('vip') || n.includes('platinum')) return 'VIP';
  if (n.includes('table') || n.includes('booth') || n.includes('section')) return 'TABLE';
  return 'REGULAR';
}

// Casa's `membershipType` (when present) is two values; OnePass has
// a freeform plan slug. We emit a hint that the OnePass importer's
// resolvePlanSlug() will route correctly (vip/standard). When the
// field is absent on the source schema, we hand back 'Standard'.
export function tierHintFor(membershipType: string | null | undefined): string {
  return membershipType === 'PREMIUM' ? 'VIP' : 'Standard';
}

// Slugify Casa event names. Casa's Event has no slug; OnePass keys
// events by (tenantId, slug). Lowercase, alphanum + hyphens, trim,
// collapse runs. Collisions across events are resolved by
// appending `-N` from a counter in the export loop — keeps the
// dump deterministic on a given source DB state.
export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'event'
  );
}

function parseArgs(): { output: string | null } {
  const args = process.argv.slice(2);
  let output: string | null = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--output') output = args[++i] ?? null;
  }
  return { output };
}

// Shape Member rows are read as, AFTER widening to tolerate missing
// schema fields. Casts through `unknown` so TypeScript doesn't
// reject the access when the generated Prisma client lacks a field.
type MemberRow = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  membershipCode: string;
  joinedAt: Date;
  expiresAt: Date | null;
  // Present in the upstream schema; may be absent in forks.
  membershipType?: string | null;
};

async function main() {
  const { output } = parseArgs();
  const db = new PrismaClient();
  try {
    // ─── Members ───
    // Only ACTIVE members carry over by default. EXPIRED / SUSPENDED
    // members would otherwise come back as ACTIVE on the OnePass
    // side (the importer starts every row ACTIVE), silently
    // undoing a revocation. The operator can re-import a single
    // legacy code manually via /platform if needed.
    //
    // We do NOT use a `select` projection here: Casa schema forks
    // vary on which fields exist (notably `membershipType`).
    // findMany() with just `where` + `orderBy` returns every column
    // the local Prisma client knows about, and we cast to MemberRow
    // to read the fields we care about + the optional ones we
    // tolerate. Selecting an unknown field is a hard Prisma
    // validation error; the full row read is the schema-agnostic
    // path.
    const rawMembers = await db.member.findMany({
      where: { status: MemberStatus.ACTIVE },
      orderBy: { joinedAt: 'asc' },
    });
    const members = rawMembers as unknown as MemberRow[];
    process.stderr.write(`[export] members: ${members.length}\n`);

    // ─── Events ───
    const events = await db.event.findMany({
      where: { isActive: true },
      include: {
        tiers: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
        },
      },
      orderBy: { date: 'asc' },
    });
    process.stderr.write(`[export] events: ${events.length}\n`);

    // De-dupe slugs across events. A stable counter on collision
    // keeps reruns deterministic for the same source DB state.
    const usedSlugs = new Set<string>();
    function uniqueSlug(name: string): string {
      const base = slugify(name);
      if (!usedSlugs.has(base)) {
        usedSlugs.add(base);
        return base;
      }
      let i = 2;
      while (usedSlugs.has(`${base}-${i}`)) i++;
      const next = `${base}-${i}`;
      usedSlugs.add(next);
      return next;
    }

    const dump = {
      meta: {
        version: DUMP_VERSION,
        exportedAt: new Date().toISOString(),
        sourceHost: hostname(),
        counts: {
          members: members.length,
          events: events.length,
        },
      },
      members: members.map((m) => ({
        legacyId: m.id,
        legacyCode: m.membershipCode,
        email: m.email.toLowerCase(),
        name: m.fullName,
        phone: m.phone,
        // m.membershipType is undefined if the Casa fork dropped the
        // column; tierHintFor() returns 'Standard' in that case so
        // every member lands on the standard plan post-import.
        tier: tierHintFor(m.membershipType),
        joinedAt: m.joinedAt.toISOString(),
        expiresAt: m.expiresAt ? m.expiresAt.toISOString() : null,
      })),
      events: events.map((ev) => {
        // Collision-safe tier collapse. Casa's free-form tier names
        // map into the OnePass 4-value enum via normalizeTier(); when
        // two Casa tiers route to the same bucket (e.g. "Standard"
        // and "General" both -> REGULAR), we MERGE rather than drop
        // the second — the previous version of this script silently
        // discarded the dropped tier's `sold` count, undercounting
        // ticket sales on imported events. We now:
        //   • keep the FIRST tier's name + priceMinor (sorted
        //     ascending by price, so the cheapest collapsed tier
        //     wins on naming)
        //   • SUM `sold` across all collapsed source tiers so the
        //     imported event reflects total tickets sold
        //   • SUM `quota` across all collapsed source tiers; capacity
        //     stays accurate even when two Casa tiers had separate
        //     limits
        const tierBuckets = new Map<
          'EARLY_BIRD' | 'REGULAR' | 'VIP' | 'TABLE',
          {
            name: string;
            priceMinor: number;
            quota: number;
            sold: number;
            collapsedFrom: string[];
          }
        >();
        for (const t of ev.tiers) {
          const bucket = normalizeTier(t.name);
          const existing = tierBuckets.get(bucket);
          if (existing) {
            existing.sold += t.sold;
            existing.quota += t.capacity ?? 0;
            existing.collapsedFrom.push(t.name);
          } else {
            tierBuckets.set(bucket, {
              name: t.name,
              priceMinor: toMinor(t.price),
              quota: t.capacity ?? 0,
              sold: t.sold,
              collapsedFrom: [],
            });
          }
        }
        // Emit warnings per tier bucket:
        //   • "merged with X, Y" when collapse happened, so the
        //     operator can spot misclassifications and, if needed,
        //     re-model them as separate events post-import.
        //   • "sold > quota" whenever the recorded sold count exceeds
        //     the capacity, whether or not collapse happened. The
        //     storefront "X tickets left" calc relies on quota-sold;
        //     a native over-sell from Casa (sold > capacity even with
        //     no merge) would land in OnePass and silently misreport.
        for (const [bucket, info] of tierBuckets) {
          if (info.collapsedFrom.length > 0) {
            process.stderr.write(
              `[export] WARN event "${ev.name}": tier ${bucket} merged with ${info.collapsedFrom
                .map((n) => `"${n}"`)
                .join(', ')} — sold/quota summed.\n`,
            );
          }
          if (info.sold > info.quota) {
            process.stderr.write(
              `[export] WARN event "${ev.name}": tier ${bucket} has sold (${info.sold}) > quota (${info.quota}); review post-import.\n`,
            );
          }
        }
        return {
          legacyId: ev.id,
          slug: uniqueSlug(ev.name),
          title: ev.name,
          description: ev.description ?? '',
          startsAt: ev.date.toISOString(),
          // Casa's Event has no end-time column (only `date` =
          // start). Emit null so OnePass treats the event as
          // single-point in time.
          endsAt: null,
          venueName: ev.venue ?? 'Casa Privé',
          // Casa events store Cloudinary URLs in `fliers[]`; first
          // image becomes the OnePass hero. Fall back to a stable
          // placeholder rather than a known-broken URL.
          heroImage:
            ev.fliers[0] ??
            'https://placehold.co/1200x600/14523B/F5E8C7?text=Casa+Priv%C3%A9',
          status: ev.isSalesOpen ? ('PUBLISHED' as const) : ('DRAFT' as const),
          tiers: Array.from(tierBuckets.entries()).map(([tier, t]) => ({
            tier,
            name: t.name,
            priceMinor: t.priceMinor,
            quota: t.quota,
            sold: t.sold,
          })),
        };
      }),
    };

    const json = JSON.stringify(dump, null, 2);
    if (output) {
      writeFileSync(output, json);
      process.stderr.write(`[export] wrote ${output}\n`);
    } else {
      // stdout = the dump itself; stderr = the human-readable
      // progress log. Lets the operator pipe to a file without
      // mixing logs in.
      process.stdout.write(json);
    }
  } finally {
    await db.$disconnect();
  }
}

// Only run main() when invoked directly (`tsx scripts/export….ts`).
// Tests that `import { normalizeTier } from './export-for-…'`
// should NOT trigger the CLI side-effect (which would open a
// Prisma connection during test runs).
//
// realpath both sides so the comparison is symlink-safe — on macOS
// process.argv[1] often resolves to a /private/var/… path while
// import.meta.url stays at /var/…; without realpath the equality
// silently fails and main() never runs.
const isDirectRun = (() => {
  if (!process.argv[1]) return false;
  try {
    return realpathSync(fileURLToPath(import.meta.url)) === realpathSync(process.argv[1]);
  } catch {
    return false;
  }
})();
if (isDirectRun) {
  main().catch((err) => {
    console.error('[export] FAILED', err);
    process.exitCode = 1;
  });
}
