// One-time seed script: pushes lib/data.js content into Supabase so the
// site has real rows to read once a project is provisioned. Run schema.sql
// in the Supabase SQL editor first.
//
// Usage: npm run db:seed [-- --dry-run]
// Reads SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY from .env.local or the environment.

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MEMBERS, EVENTS } from '../../lib/data.js';

function loadEnvLocal() {
  const path = fileURLToPath(new URL('../../.env.local', import.meta.url));
  if (!existsSync(path)) return;

  const contents = readFileSync(path, 'utf8');
  for (const line of contents.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed
      .slice(eq + 1)
      .trim()
      .replace(/^['"]|['"]$/g, '');
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

const isDryRun = process.argv.includes('--dry-run');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  if (isDryRun) {
    console.log('[DRY RUN] SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY not configured. Previewing payload:');
    console.log(`  Members to seed/upsert: ${MEMBERS.length}`);
    console.log(`  Events to seed/upsert: ${EVENTS.length}`);
    process.exit(0);
  }
  console.error(
    'Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY. Set them in .env.local or the environment before seeding.'
  );
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false },
});

async function seedMembers() {
  const rows = MEMBERS.map((m, i) => ({
    name: m.name,
    role: m.role,
    role_rank: i + 1,
    department: m.department,
    year: m.year,
    photo_url: m.photoUrl || null,
    bio: m.bio,
    linkedin_url: m.linkedinUrl,
    instagram_url: m.instagramUrl,
    is_active: true,
  }));

  if (isDryRun) {
    console.log(`[DRY RUN] Would upsert ${rows.length} members onConflict: "name"`);
    return;
  }

  const { error } = await supabase.from('members').upsert(rows, { onConflict: 'name' });
  if (error) throw error;
  console.log(`✓ Upserted ${rows.length} members successfully.`);
}

async function seedEvents() {
  const rows = EVENTS.map((e) => ({
    title: e.title,
    description: e.description,
    event_date: e.eventDate,
    end_date: e.endDate || null,
    event_type: e.eventType,
    status: e.status,
    cover_image_url: e.coverImageUrl,
    venue: e.venue,
    external_link: e.externalLink || null,
    registration_form_url: e.registrationFormUrl || null,
  }));

  if (isDryRun) {
    console.log(`[DRY RUN] Would upsert ${rows.length} events onConflict: "title,event_date"`);
    return;
  }

  const { error } = await supabase.from('events').upsert(rows, { onConflict: 'title,event_date' });
  if (error) throw error;
  console.log(`✓ Upserted ${rows.length} events successfully.`);
}

async function main() {
  console.log(isDryRun ? '--- DRY RUN SEED ---' : 'Seeding INFINITUS Supabase Database...');
  await seedMembers();
  await seedEvents();
  console.log(isDryRun ? 'Dry run finished with zero database writes.' : 'Seed complete — official INFINITUS committee data loaded.');
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
