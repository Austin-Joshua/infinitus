# INFINITUS — Instagram & Website Integration Guide

This document defines the single-identity integration between the **INFINITUS website** (`https://infinitus-seven.vercel.app`) and the official **Instagram handle** (`@infinitus_club.rit`).

---

## 1. Single Source of Truth

- **Official Handle:** `@infinitus_club.rit`
- **Instagram URL:** [https://www.instagram.com/infinitus_club.rit/](https://www.instagram.com/infinitus_club.rit/)
- **Configuration File:** `lib/site.js` (`SOCIAL.instagram`, `SOCIAL.instagramHandle`, `SITE.contactEmail`)
- **Website URL:** `https://infinitus-seven.vercel.app`

---

## 2. Action for Club President / Owner: Instagram Profile Update

Please update the `@infinitus_club.rit` Instagram profile so both sides present one unified brand:

### Name
```
INFINITUS | Mathematics Club RIT
```

### Bio Text (Copy & Paste)
```
Cultivating mathematical curiosity beyond the lecture hall.
Competitions, workshops, innovation & analytical problem solving.
Mathematics Club of Rajalakshmi Institute of Technology, Chennai.
```

### Link in Bio
```
https://infinitus-seven.vercel.app
```

---

## 3. Stable Short Redirects for Stories & Captions

The website provides permanent short paths configured via `next.config.mjs` that can be pasted directly into Instagram story link stickers or post captions:

| Short URL | Destination | Purpose |
| :--- | :--- | :--- |
| `https://infinitus-seven.vercel.app/join` | Active Google Form (`forms.gle/wMbC1SEdAXYYbFvn9`) | Club recruitment & queries |
| `https://infinitus-seven.vercel.app/instagram` | `@infinitus_club.rit` | Direct Instagram link |
| `https://infinitus-seven.vercel.app/ig` | `@infinitus_club.rit` | Ultra-short Instagram link |
| `https://infinitus-seven.vercel.app/feedback` | Active Google Form | Feedback & inquiries |
| `https://infinitus-seven.vercel.app/events/<id>` | Event detail page (e.g. `/events/shinka-2026`) | Deep link for event announcements |

---

## 4. Content Flow Architectures

### Phase A: Curated Self-Hosted Feed (Active Now)
- **Data Source:** `lib/instagram.js` (`INSTAGRAM_POSTS`)
- **Assets:** Self-hosted in `public/gallery/` and `public/events/`
- **Zero Third-Party Scripts:** No Instagram SDKs, tracking pixels, or heavy iframes that slow down load times or trigger layout shifts.
- **Privacy & Performance:** 100% compliant with privacy standards; images are optimized via Next.js `Image` component.
- **Cross-linking:** All cards link directly to the respective Instagram post with `rel="noreferrer noopener"`.

### Phase B: Server-Side Graph API Sync (Optional Future Upgrade)
When the club desires automated synchronization with Instagram:
1. **Prerequisites:**
   - Instagram Professional/Creator account connected to a Facebook Page.
   - Meta for Developers app created with `instagram_basic` and `pages_read_engagement` permissions.
   - Long-lived User/Page Access Token.
2. **Environment Variable:**
   ```bash
   INSTAGRAM_ACCESS_TOKEN="<long_lived_graph_api_token>"
   ```
3. **Server Implementation Rules:**
   - Fetch server-side only in Next.js App Router (ISR with `revalidate: 3600`).
   - Hard 4-second fetch timeout (`AbortController`).
   - If the token expires or Meta's API returns an error, fallback immediately to `lib/instagram.js`.
   - Never prefix with `NEXT_PUBLIC_` to avoid leaking tokens to the browser bundle.

---

## 5. Event Cross-Checking

All 15 events in `lib/data.js` are matched to their authentic Instagram post permalinks:
- `shinka-2026` ➔ `https://www.instagram.com/p/Dba4vhGzc9k/`
- `beyond-the-numbers` ➔ `https://www.instagram.com/p/DbN_iIyzuzM/`
- `pidoku` ➔ `https://www.instagram.com/p/DbA8cpRE0hY/`
- `graphquest` ➔ `https://www.instagram.com/p/Damrl7YT4fT/`
- `pi-quest` ➔ `https://www.instagram.com/p/DVoQBMPE_dy/`
- `treasure-hunt` ➔ `https://www.instagram.com/p/DSfF1AIk0ka/`
- `nature-geometer` ➔ `https://www.instagram.com/p/DP5vmDhk86Z/`
- `stat-story` ➔ `https://www.instagram.com/p/DNyCwan5ikd/`
- `mathspire` ➔ `https://www.instagram.com/p/DM0NtN8z3fx/`
- `matrix-reloaded` ➔ `https://www.instagram.com/p/DMKHGZgzcFn/`
- `remote-rush` ➔ `https://www.instagram.com/p/DHXeWr3zIYT/`
- `algebruh` ➔ `https://www.instagram.com/p/DGpWu6aTjxU/`
- `beauty-of-maths` ➔ `https://www.instagram.com/p/DFc2oQUTgtn/`
- `infinity-quest` ➔ `https://www.instagram.com/p/DDuePdaTYpp/`
- `guest-lecture` ➔ `https://www.instagram.com/p/C7BWNHNsa5L/`
