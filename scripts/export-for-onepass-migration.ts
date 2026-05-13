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

import { writeFileSync } from 'node:fs';
import { hostname } from 'node:os';
import { PrismaClient, MemberStatus } from '@prisma/client';

const DUMP_VERSION = 1;

// Casa stores prices as Float (NGN); OnePass uses int-minor (kobo).
// 100 kobo = 1 NGN. Round to int so we don't seed fractional kobo
// (rare but possible if a price was entered with > 2 decimals).
function toMinor(amount: number): number {
  return Math.round(amount * 100);
}

// Match free-form Casa tier names into the OnePass TicketTier enum.
// Order matters — the specific patterns must come before REGULAR
// (which is the fallback bucket).
function normalizeTier(name: string): 'EARLY_BIRD' | 'REGULAR' | 'VIP' | 'TABLE' {
  const n = name.toLowerCase();
  if (n.includes('early')) return 'EARLY_BIRD';
  if (n.includes('vvip') || n.includes('vip') || n.includes('platinum')) return 'VIP';
  if (n.includes('table') || n.includes('booth') || n.includes('section')) return 'TABLE';
  return 'REGULAR';
}

// Casa's `membershipType` is two values; OnePass has a freeform
// plan slug. We emit a hint that the OnePass importer's
// resolvePlanSlug() will route correctly (vip/standard).
function tierHintFor(membershipType: string): string {
  return membershipType === 'PREMIUM' ? 'VIP' : 'Standard';
}

// Slugify Casa event names. Casa's Event has no slug; OnePass keys
// events by (tenantId, slug). Lowercase, alphanum + hyphens, trim,
// collapse runs. Collisions across events are resolved by
// appending `-N` from a counter in the export loop — keeps the
// dump deterministic on a given source DB state.
function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'event';
}

function parseArgs(): { output: string | null } {
  const args = process.argv.slice(2);
  let output: string | null = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--output') output = args[++i] ?? null;
  }
  return { output };
}

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
    const members = await db.member.findMany({
      where: { status: MemberStatus.ACTIVE },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        membershipCode: true,
        membershipType: true,
        joinedAt: true,
        expiresAt: true,
      },
      orderBy: { joinedAt: 'asc' },
    });
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
        tier: tierHintFor(m.membershipType),
        joinedAt: m.joinedAt.toISOString(),
        expiresAt: m.expiresAt ? m.expiresAt.toISOString() : null,
      })),
      events: events.map((ev) => {
        const tierBuckets = new Map<
          'EARLY_BIRD' | 'REGULAR' | 'VIP' | 'TABLE',
          { name: string; priceMinor: number; quota: number; sold: number }
        >();
        const dropped: string[] = [];
        for (const t of ev.tiers) {
          const bucket = normalizeTier(t.name);
          if (tierBuckets.has(bucket)) {
            // Two Casa tiers collapsed onto the same OnePass enum
            // value. Keep the first (which we sorted ascending by
            // price), log the dropped name so the operator can
            // recreate it manually after the import.
            dropped.push(t.name);
            continue;
          }
          tierBuckets.set(bucket, {
            name: t.name,
            priceMinor: toMinor(t.price),
            quota: t.capacity ?? 0,
            sold: t.sold,
          });
        }
        if (dropped.length > 0) {
          process.stderr.write(
            `[export] WARN event "${ev.name}": dropped tiers (collapsed onto OnePass enum): ${dropped.join(
              ', ',
            )}\n`,
          );
        }
        return {
          legacyId: ev.id,
          slug: uniqueSlug(ev.name),
          title: ev.name,
          description: ev.description ?? '',
          startsAt: ev.date.toISOString(),
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

main().catch((err) => {
  console.error('[export] FAILED', err);
  process.exitCode = 1;
});
