# Brand assets

| Folder | Purpose |
|---|---|
| `source/` | Master Infinitus + RIT logos (optimized master <= 500 KB in git; raw uncompressed 9.8 MB offline). Edit these, then run `npm run branding:optimize`. |
| `../../public/brand/` | Optimized WebP/PNG files served by the website. |

TODO(owner): supply the logo as SVG (vector paths only, no base64).
Do not put large master files in `public/` — keep them here.
