# Contributing to INFINITUS

Thank you for contributing to the INFINITUS Mathematics Club web portal.

## Local Development Workflow

1. **Install Dependencies:**
   ```bash
   npm ci
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Code Quality Gates:**
   Before submitting changes, ensure all automated verification checks pass:
   ```bash
   npm run lint        # ESLint static code analysis
   npm test            # Node test runner unit tests
   npm run check:assets # Asset presence, format, and dimension verification
   npm run build       # Production Next.js build
   npm run check:links # Route crawling and link integrity
   npm run test:e2e    # Playwright browser end-to-end regression suite
   ```

---

## Dependency Upgrade Routine

To protect reproducible builds and prevent silent runtime regressions across serverless runtimes (such as Vercel Edge and Node functions), core framework dependencies are **strictly pinned to exact versions** in `package.json`:
- `next`
- `react`
- `react-dom`

### Upgrading Core Dependencies
When performing intentional version upgrades:
1. Review the framework release notes and changelog for breaking changes, deprecations, or streaming payload alterations.
2. Upgrade using exact version pinning:
   ```bash
   npm install --save-exact next@<version> react@<version> react-dom@<version>
   ```
3. Execute the full verification suite:
   ```bash
   npm run lint && npm test && npm run build && npm run test:e2e
   ```
4. Verify Content Security Policy (CSP) compatibility by running:
   ```bash
   npx playwright test e2e/csp-check.spec.js
   ```
5. Commit both `package.json` and `package-lock.json` together.

### Automated Minor & Patch Updates
Dependabot is configured to check weekly (`.github/dependabot.yml`) and automatically group minor and patch updates into unified pull requests to minimize noise while keeping security patches fresh.
