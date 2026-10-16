# The Marguerite Young Society

The website for The Marguerite Young Society, a home for the work of Marguerite Young (1908 to 1995).

Everything on this site is free to use and share.

## What is here

- `site/` is the finished website. Cloudflare publishes this folder.
- `site/data/` holds the text of every page.
- `site/img/` holds the images.
- `src/` holds the site's design (`site.css`) and behavior (`site.js`).
- `build.py` rebuilds the page files in `site/` from the text in `site/data/`.

## Where it is published

Cloudflare publishes the `site` folder at https://marguerite-young-society.coralrussellbooks.workers.dev and updates it whenever this repository changes.

If the site moves to a new address, change `SITE_URL` near the top of `build.py` and run `python3 build.py` again, so the sitemap and share links use the new address.
