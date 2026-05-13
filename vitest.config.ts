import { defineConfig } from 'vitest/config';

// Minimal vitest setup for the migration-tooling tests added by the
// OnePass migration. The Casa-Privé app itself has no other tests
// today; if that changes, broaden `include` and add a setup file.
//
// Pure-Node environment so the export-script tests don't load a
// jsdom / happy-dom shim they don't need.
export default defineConfig({
  test: {
    include: ['scripts/**/*.test.ts'],
    environment: 'node',
    // The export script's main() opens a Prisma connection; the
    // main-guard in the script prevents that during test imports.
    // No globals / mocks needed beyond what vitest provides.
  },
});
