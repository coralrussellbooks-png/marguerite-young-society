# The Marguerite Young Society

The website for The Marguerite Young Society, a home for the work of Marguerite Young (1908 to 1995).

Everything on this site is free to use and share.

## What is here

- `site/` is the finished website. Cloudflare publishes this folder.
- `site/data/` holds the text of every page.
- `site/img/` holds the images.
- `src/` holds the site's design (`site.css`) and behavior (`site.js`).
- `build.py` rebuilds the page files in `site/` from the text in `site/data/`.
- `geo.py` helps AI search tools (ChatGPT, Perplexity, Claude, Gemini, Google AI Overviews) understand and cite the site. It sets each page's title so it names the book, adds the line under each heading (what the page is part of, the author, the date it was last updated) and the "Cite this page" line, and writes the structured data, `robots.txt` and `llms.txt`.
- `src/llms.txt` is the plain summary of the site written for AI tools. Edit it there; `build.py` copies it into `site/`.
- `src/updated.json` records when each page's text last changed. `build.py` updates it on its own, so leave it alone and commit it with your other changes.
- The questions and answers on the home page live in the home page text (`site/data/society.json`). The structured data is read from them, so edit the visible text and the two stay matched.

## Where it is published

Cloudflare publishes the `site` folder at https://marguerite-young-society.coralrussellbooks.workers.dev and updates it whenever this repository changes.

If the site moves to a new address, change `SITE_URL` near the top of `build.py` and run `python3 build.py` again, so the sitemap and share links use the new address.

## The Dictionary

The Dictionary of Miss MacIntosh, My Darling (`site/dictionary.html`) is built from `src/dictionary.json`, which holds each word, its short definition, the chapters where it appears, and the chapter whose Vocabulary first defined it. After adding words to that file, run `python3 dictionary.py` and then `python3 build.py`.

## The liberal arts course catalog

The subject pages linked from "The Novel as a Liberal Arts Education" (`site/liberal-arts-*.html`) are built from `src/curriculum.json`, which lists the subjects and, for each chapter, the topics its Resources teach. After adding a chapter's topics to that file, run `python3 curriculum.py` and then `python3 build.py`.
