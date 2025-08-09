# SOIL Lab Website README

source for our lab website: **https://socialinteractionlab.github.io/** 

---

## 🚀 setup

1. **first make sure you have/get ruby & jekyll**
   - https://jekyllrb.com/docs/installation/macos/

2. ** also bundler and gems**
   ```bash
   gem install bundler:2.4.20
   bundle install
   ```

---

## 💻 optional: run it locally

From root:
```bash
bundle exec jekyll serve
```
Then open http://localhost:4000

(should auto-reload when you save files)

---

## 📝 publications workflow

** don't edit files in `_papers/` by hand.** They’re generated from `markdown_generator/publications.tsv`

1. edit `markdown_generator/publications.tsv`  
   required columns (tab-separated):  
   `pub_date	title	venue	excerpt	citation	url_slug	paper_url`

2. generate pages:
   ```bash
   cd markdown_generator
   python publications.py
   cd ..
   ```

3. stage only related changes (!) :
   ```bash
   git add _papers/*.md markdown_generator/publications.tsv markdown_generator/publications.py
   git commit -m "Add/update publications"
   ```

---

## 👥 how to Add a new lab member

1. add their photo to `images/people/` (e.g., `misha_okeeffe.jpg`)
2. create a new file in `_people/` (e.g., `misha_okeeffe.md`):
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

## 📰 how to Add a new "news" post

fist, create a file in `_posts/` named `YYYY-MM-DD-your-title.md`
then, minimal header:
   ```yaml
   ---
   layout: post
   title: "Our Lab Won a Cool Award!"
   ---
   ```
& then write anything below the header

---

## ⬆️ how to push changes LIVE

```bash
git push
```

(should rebuild pretty quickly)
ps -- if you see **403** or auth errors, set up a Personal Access Token (PAT) or SSH

---
