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

.  **Edit the Spreadsheet**
    Open `markdown_generator/publications.tsv`. **Heads up:** it's way easier to use Google Sheets or Excel (or numbers if you're like me) for this! Add a new row and fill in the columns.
    -   **Required:** `pub_date`, `title`, `venue`, `citation`, `url_slug`, `paper_url`
    -   **Optional:** `openmaterials_url`, `talk_url`, etc.

2.  **Generate the New Files**
    The generator is a Jupyter Notebook.
    -   In your terminal, go to the generator folder:
        ```bash
        cd markdown_generator
        ```
    -   Start the notebook server:
        ```bash
        jupyter notebook
        ```
    -   Your browser will open. Click on `publications.ipynb`, then in the top menu, click **Cell → Run All**. This will create the new files in `_papers`.

3.  **Commit Your Changes**
    Once you're happy with how the new papers look on your local site, commit! If you're not happy, you can go into the individual .md folders and add/remove sections (ie images, talk links, openmaterials links, etc etc)
    ```bash
    git add .
    git commit -m "Add new papers"
    git push
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
