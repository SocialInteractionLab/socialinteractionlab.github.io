# SOIL Lab Website – Developer Guide

This is the source for our lab website: **https://socialinteractionlab.github.io/**  
Tech stack: Jekyll (Ruby) + GitHub Pages. Publications pages are generated from a TSV via a small Python script.

---

## 🚀 One-Time Setup (macOS)

1. **Install Ruby & Jekyll**
   - Follow the official macOS guide: https://jekyllrb.com/docs/installation/macos/

2. **Install the correct Bundler and gems**
   ```bash
   gem install bundler:2.4.20
   bundle install
   ```

3. **(Optional) Python for generators**
   - Uses standard Python 3 + `pandas`. If needed:
     ```bash
     python -m pip install pandas
     ```

---

## 💻 Run the site locally

From repo root:
```bash
bundle exec jekyll serve
```
Then open http://localhost:4000

> Tip: The site auto-reloads when you save files.

---

## 📝 Publications workflow (auto-generated)

**Never edit files in `_papers/` by hand.** They’re generated from `markdown_generator/publications.tsv`.

1. Edit `markdown_generator/publications.tsv`  
   Required columns (tab-separated):  
   `pub_date	title	venue	excerpt	citation	url_slug	paper_url`

2. Generate pages:
   ```bash
   cd markdown_generator
   python publications.py
   cd ..
   ```

3. Stage only related changes (avoid accidental deletions):
   ```bash
   git add _papers/*.md markdown_generator/publications.tsv markdown_generator/publications.py
   git commit -m "Add/update publications"
   ```

---

## 👥 Add a new lab member

1. Add their photo to `images/people/` (e.g., `misha_okeeffe.jpg`).
2. Create a new file in `_people/` (e.g., `misha_okeeffe.md`) with front matter like:
   ```yaml
   ---
   title: "Misha O'Keeffe"
   role: "Research Assistant"
   image: "/images/people/misha_okeeffe.jpg"
   website: "https://example.com"
   ---
   Short bio here.
   ```

---

## 📰 Add a news post

1. Create a file in `_posts/` named `YYYY-MM-DD-your-title.md`.
2. Minimal header:
   ```yaml
   ---
   layout: post
   title: "Our Lab Won a Cool Award!"
   ---
   ```
3. Write your post content below the header.

---

## ⬆️ Push changes live

```bash
git push
```

GitHub Pages will rebuild automatically within a minute or two.

> If you see **403** or auth errors, set up a Personal Access Token (PAT) or SSH (below).

---

## 🔐 Set up a GitHub Personal Access Token (PAT) for pushes

1. Create a token: https://github.com/settings/tokens  
   - Choose **“Fine-grained”** (preferred) or **“Classic”**.  
   - Scope:
     - Fine-grained: grant repo access to `SocialInteractionLab/socialinteractionlab.github.io` with **Contents: Read and write**.
     - Classic: check **`repo`**.
   - If your org uses SSO, click **Authorize** for the token after creating it.

2. Clear cached bad credentials (macOS Keychain):
   ```bash
   git credential-osxkeychain erase <<EOF
   protocol=https
   host=github.com
   EOF
   ```

3. Push and authenticate:
   ```bash
   git push
   ```
   - Username: your GitHub username (e.g., `M1shaaa`)
   - Password: **paste the PAT** (not your GitHub password)

4. Save for next time:
   ```bash
   git config --global credential.helper osxkeychain
   ```

---

## 🔑 SSH alternative (no PAT prompts)

1. Generate a key:
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   eval "$(ssh-agent -s)"
   ssh-add --apple-use-keychain ~/.ssh/id_ed25519
   ```

2. Add the public key to GitHub:  
   ```bash
   pbcopy < ~/.ssh/id_ed25519.pub
   ```  
   Paste at GitHub → Settings → **SSH and GPG keys** → New SSH key.

3. Switch remote to SSH and push:
   ```bash
   git remote set-url origin git@github.com:SocialInteractionLab/socialinteractionlab.github.io.git
   ssh -T git@github.com
   git push
   ```

---

## 🧰 Troubleshooting

**Bundler error (could not find bundler 2.4.20)**  
```bash
gem install bundler:2.4.20
bundle install
```

**Staged a bunch of accidental deletions**  
```bash
git status
git restore --staged .
git restore .
git add _papers/*.md markdown_generator/publications.tsv markdown_generator/publications.py
git commit -m "Add 2024–2025 publications"
```

**Jekyll serve not picking up changes**  
- Stop/restart `bundle exec jekyll serve`.
- Ensure you’re editing files in this repo (not a sibling clone).

---

## 🧾 Notes

- `url_slug` in the TSV must be simple, hyphenated (e.g., `my-paper-2025`).
- Leave `excerpt` blank if you don’t want a blurb on the paper page.
- External links go in `paper_url` (use full `https://…`).
