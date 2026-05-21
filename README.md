# social interaction lab — website guide

this is the lab website at [socialinteractionlab.github.io](https://socialinteractionlab.github.io). built with [Jekyll](https://jekyllrb.com/) and hosted on GitHub Pages. you don't need to know Jekyll deeply to maintain it — most tasks are just editing markdown files.

---

## how the site is organized

```
_data/
  papers.yml    → all papers (edit this to add/update papers)
  team.yml      → all lab members, current + alumni (edit this to add/update people)
  settings.yml  → site-wide settings (colors, nav, etc.)
pages/
  people.html   → people page template
  papers.html   → papers page template
  news.html     → news page
  joining.html  → join us page
images/
  papers/         → thumbnail images for papers
  people/         → headshots for lab members
  group_YYYY_YYYY.jpg  → lab group photos for the photo album
_data/, _layouts/, _includes/, _sass/, css/, js/  → theme internals (rarely touch)
```

**the two files you'll edit most:** `_data/papers.yml` and `_data/team.yml`

---

## adding a paper

open `_data/papers.yml` and add an entry at the top of the file (newest first):

```yaml
- title: "Paper Title Here"
  year: "2026"
  journal: "Journal or Conference Name"
  authors: "Author1, Author2, & Author3"
  url: "https://link-to-pdf-or-preprint"
```

**optional fields** — only add what you have:

```yaml
  materials: "https://github.com/..."
  dataset: "https://..."
  talk: "https://youtube.com/..."
  demo: "https://..."
  commentary: "https://..."
  precis: "https://..."
  image: "/images/papers/YourImage.png"
  context: "e.g. an earlier version appeared at CogSci 2025."
```

if you don't have a pdf link yet, just omit the `url` field entirely — no broken link will appear.

thumbnail images go in `images/papers/`. use CamelCase to match existing files (e.g. `ConvoPacts.png`)

---

## adding a person

open `_data/team.yml` and add an entry under `current:`. the `order` field controls display order within each role group (lower = earlier).

```yaml
  - name: "Full Name"
    role: "Graduate Students"
    order: 5
    website: "https://yourwebsite.com"
    image: "/images/people/yourphoto.jpg"
    bio: "One or two sentences about research interests."
```

**role options** (must match exactly, caps and all):
- `Principal Investigator`
- `Post-Doctoral Scholars`
- `Research Staff`
- `PhD Students`
- `Master's Students`
- `Research Assistants`
- `Lab Affilates`

headshots go in `images/people/`. square crop, ideally 300×300px or bigger.

**moving someone to alumni:** remove their entry from `current:` and add under `alumni:`:

```yaml
  - name: "Full Name"
    year: 2025
    role: "Research Staff"
    website: "https://..."
    note: "Full Name (2023–2025)"
```

**alumni role options** (must match exactly):
- `Post-Doctoral Scholars`
- `Research Staff`
- `PhD Students`
- `Master's Students`
- `Lab Affiliates`
- `Undergraduate Research Assistants`

`year` controls sort order within each role group (descending — most recent first). `website` is optional; if omitted the name renders as plain text.

---

## updating lab news

open `pages/news.html` and add an entry. pattern is:

```html
<h1>2026</h1>

<p><b>Month, 2026: </b> We're excited to ...</p>

<br>
```

keep newest year at the top.

---

## updating group photos

group photos live in `images/` named `group_YYYY_YYYY.jpg` (e.g. `group_2025_2026.jpg`).

to add a new year's photo:
1. add the photo to `images/` — name it `group_YYYY_YYYY.jpg`
2. open `pages/people.html` and add it in two places:
   - in the `<div class="photo-main">` block: add a new `<img id="photo-YYYY">` tag
   - in the `<div class="photo-thumbnails">` block: add a new `<div class="photo-thumb" data-year="YYYY">` entry
3. make the new photo the default: add `class="visible"` to its `<img>` and `class="active"` to its thumbnail (remove from the previous default)

---

## local preview & deploying

the site auto-deploys via GitHub Pages whenever you push to `main`. workflow:

1. make changes on a branch
2. test locally with `bundle exec jekyll serve`
3. merge to `main` when happy — site updates in ~1 min

**local setup** (one-time, if not already done):
```bash
brew install ruby@3.3
echo 'export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
gem install bundler
bundle install
```

then to preview:
```bash
bundle exec jekyll serve
# open http://localhost:4000
```
