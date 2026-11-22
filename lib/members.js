import { cache } from 'react';
import { getSupabaseClient } from './supabaseClient.js';
import { MEMBERS } from './data.js';
import { getRoleDetails } from './roleResponsibilities.js';
import { safeUrl } from './safeUrl.js';

const STATIC_BY_ID = new Map(MEMBERS.map((m) => [m.id, m]));
const STATIC_BY_NAME = new Map(MEMBERS.map((m) => [m.name, m]));

// Verify build constraint: every static member must have role responsibilities
for (const m of MEMBERS) {
  const details = getRoleDetails(m.id) || getRoleDetails(m.name);
  if (!details) {
    throw new Error(`Integrity error: Member ${m.id} (${m.name}) lacks role responsibilities!`);
  }
}

function withRoleDetails(member) {
  const details = getRoleDetails(member.id) || getRoleDetails(member.name);
  return {
    ...member,
    photoUrl: safeUrl(member.photoUrl) || null,
    posterUrl: safeUrl(member.posterUrl) || null,
    linkedinUrl: safeUrl(member.linkedinUrl) || null,
    instagramUrl: safeUrl(member.instagramUrl) || null,
    team: details?.team || null,
    responsibilities: details?.summary || null,
  };
}

let membersCache = null;
let membersCacheTime = 0;
let membersInFlight = null;
const CACHE_TTL_MS = 60 * 1000;

async function fetchDbMembersFromSupabase() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('members')
      .select('id, name, role, department, year, photo_url, bio, linkedin_url, instagram_url')
      .eq('is_active', true)
      .order('role_rank', { ascending: true });

    if (error) {
      console.error('[Supabase getMembers error, falling back to static]:', error.message || error);
      return null;
    }

    if (!data || !Array.isArray(data) || !data.length) {
      return null;
    }

    return data.map((m) => {
      const fallback = STATIC_BY_ID.get(m.id) || STATIC_BY_NAME.get(m.name);
      return withRoleDetails({
        id: String(m.id),
        name: m.name,
        role: m.role,
        bio: m.bio || fallback?.bio || null,
        department: m.department || fallback?.department || null,
        year: m.year || fallback?.year || null,
        photoUrl: safeUrl(m.photo_url) || fallback?.photoUrl || null,
        posterUrl: safeUrl(m.poster_url) || fallback?.posterUrl || null,
        linkedinUrl: safeUrl(m.linkedin_url) || fallback?.linkedinUrl || null,
        instagramUrl: safeUrl(m.instagram_url) || fallback?.instagramUrl || null,
      });
    });
  } catch (err) {
    console.error('[Supabase getMembers unexpected exception]:', err.message || err);
    return null;
  }
}

/**
 * Retrieves core committee members.
 * Bundled data from `lib/data.js` ensures zero-downtime static rendering.
 * In-memory cache returns in 0ms, refreshing asynchronously in the background.
 */
export const getMembers = cache(async function getMembers() {
  const now = Date.now();
  const staticFallback = MEMBERS.map(withRoleDetails);

  if (membersCache && now - membersCacheTime < CACHE_TTL_MS) {
    return membersCache;
  }

  if (membersCache) {
    if (!membersInFlight) {
      membersInFlight = fetchDbMembersFromSupabase()
        .then((fresh) => {
          if (fresh && fresh.length > 0) {
            membersCache = fresh;
            membersCacheTime = Date.now();
          }
        })
        .finally(() => {
          membersInFlight = null;
        });
    }
    return membersCache;
  }

  if (!membersInFlight) {
    membersInFlight = fetchDbMembersFromSupabase()
      .then((fresh) => {
        if (fresh && fresh.length > 0) {
          membersCache = fresh;
          membersCacheTime = Date.now();
          return fresh;
        }
        return staticFallback;
      })
      .finally(() => {
        membersInFlight = null;
      });
  }

  const result = await membersInFlight;
  return result || staticFallback;
});
