# Git History Purge & Remediation Runbook

> [!CAUTION]
> **GATE REQUIREMENT:** Do NOT execute any git history rewriting commands in this document without the repository owner explicitly confirming with the phrase:
> `PURGE APPROVED`
> Rewriting git history modifies commit SHAs across the entire repository history. All existing clones will become incompatible and require re-cloning.

---

## 1. Audit Summary

An automated audit of the repository git history (`.git/objects/pack`) and revision logs identified two targets for historical cleanup:

### A. Large Historical Blobs (9.8 MB Logo)
* **Blob SHA:** `084dd834e91779f473aaae938078370ee0e9fa37` (9.37 MB compressed / 9.83 MB uncompressed)
* **Path:** `assets/brand/source/infinitus-logo.png`
* **Introduced in Commit:** `343f723353f2b575ebd28f106d49b4e21feb9f01`
* **Current Status:** In Commit `d2306c18627543296cf57ae121ac40e486d70049` (Phase 8.2), the working tree file was shrunk to **217 KB** and the original 4096×4096 master was archived offline. However, git still retains the 9.37 MB packed object in historical commits prior to `d2306c1`.

### B. Name Typo Occurrences ("shyam sundar" / "Shyam Sundar")
* **Tree Content Occurrences:**
  - Introduced in Commit `4b689a5` (`lib/data.js`, `lib/roleResponsibilities.js`, `docs/INFINITUS_Official_Website_Content.md`, `INFINITUS_Member_Role_Responsibilities.md`, `components/sections/home/HomeSections.jsx`).
  - Removed in Commit `df407ae`.
* **Commit Message Occurrences:**
  - Commit `df407ae`: `"Remove Shyam Sundar (C. Shyam Sundar) completely from website and documentation"`.
* **Intended Correction:** Replace historical mentions with `"Shyam Sundar"` or eliminate them cleanly from historical trees.

---

## 2. Step 1: Create a Mirror Backup (Required Before Rewriting)

Before executing any history rewrite, a pristine bare mirror of the repository MUST be saved to a safe, offline location:

```bash
# From an independent working directory outside the current repo:
git clone --mirror https://github.com/Austin-Joshua/infinitus.git infinitus-backup-mirror.git

# Verify backup integrity:
cd infinitus-backup-mirror.git
git fsck --full
```

Keep `infinitus-backup-mirror.git` in cold storage. If any errors occur during the purge, this backup can restore the repository exactly to its pre-rewrite state.

---

## 3. Step 2: History Purge Execution (git-filter-repo)

We recommend [`git-filter-repo`](https://github.com/newren/git-filter-repo) (officially recommended by the Git project over `git filter-branch` and BFG).

### A. Install git-filter-repo
```bash
pip install git-filter-repo
```

### B. Prepare Text Replacement Rules
Create a text file `replace-rules.txt` with expressions to redact:
```text
regex:shyam sundar==>shyam sundar
regex:Shyam Sundar==>Shyam Sundar
regex:Shyam Sundar==>Shyam Sundar
regex:shyam sundar==>shyam sundar
```

Create a commit message replacement file `replace-messages.txt`:
```text
regex:Remove Shyam Sundar \(C\. Shyam Sundar\)==>Update committee member records
```

### C. Execute git-filter-repo
Run the rewrite in a fresh clone of the repository:

```bash
# 1. Clone fresh working copy
git clone https://github.com/Austin-Joshua/infinitus.git infinitus-purge-work
cd infinitus-purge-work

# 2. Strip blobs larger than 500 KB (eliminates historical 9.8 MB logo without affecting modern 217 KB logo)
git filter-repo --strip-blobs-bigger-than 500K

# 3. Replace residual name typos in tree history and commit messages
git filter-repo --replace-text ../replace-rules.txt --replace-message ../replace-messages.txt

# 4. Aggressive garbage collection to shrink the pack file locally
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

---

## 4. Step 3: Verifying the Rewritten Repository

Before pushing back to GitHub:
```bash
# Verify 9.8 MB blob is gone:
git verify-pack -v .git/objects/pack/*.idx | sort -k 3 -n -r | head -n 5

# Verify typo strings do not exist anywhere in git log:
git log --all -S"shyam sundar" -i --oneline
git log --all --grep="shyam sundar" -i --oneline

# Run full project test suite
npm run lint
npm test
npm run build
```

---

## 5. Step 4: Force Push & Team Impact

> [!WARNING]
> Force pushing rewrites commit history on GitHub. All downstream commit SHAs will change.

```bash
# Force push all branches and tags:
git push origin --force --all
git push origin --force --tags
```

### Downstream Impact & Team Remediation:
1. **Collaborators:** Any collaborator (e.g. Austin Joshua, Aakash) who pulls with `git pull` will experience divergent branch conflicts. Every collaborator must run:
   ```bash
   git fetch origin
   git reset --hard origin/main
   # Or delete and re-clone fresh:
   # git clone https://github.com/Austin-Joshua/infinitus.git
   ```
2. **Open Pull Requests:** Any existing pull requests targeting branches rewritten by filter-repo will break and must be rebased or recreated.
3. **External Commit Links:** Any external links targeting old 40-character commit SHAs will no longer match the rewritten commit tree.

---

## 6. Step 5: Purging GitHub Internal Caches

Even after running `git push --force`, GitHub retains dangling commit objects in its internal cache for up to 90 days. Anyone with the direct SHA URL (e.g., `https://github.com/Austin-Joshua/infinitus/commit/343f7233...`) could still view the old commit view until garbage collected.

To purge the cache immediately, the repository owner must contact GitHub Support:

### GitHub Support Ticket Template
```text
Subject: Request repository cache purge / GC after sensitive data / large blob removal

Repository: Austin-Joshua/infinitus

Hello GitHub Support Team,

We have rewritten our git history to purge a historical 9.8 MB image blob and redact typos.
The force push to 'main' has completed successfully.

Could you please trigger a repository cache purge and manual garbage collection (git gc) on our repository (Austin-Joshua/infinitus) so that dangling unreferenced commits and their cached web views are fully purged?

Thank you,
Austin Joshua M (Repository Owner)
```
