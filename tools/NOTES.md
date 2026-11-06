# Working notes for editing The Marguerite Young Society site

These notes let any editing session pick up where the last one left off. Nothing in `tools/` is published; Cloudflare serves only the `site/` folder.

## Coral’s standing rules

- Coral has studied *Miss MacIntosh, My Darling* for seven years. *To All My Darlings* was not meant as an academic book, so its first two editions did not track citations; the aim was the most definitive coverage of the topics Young covered, adding richness and clarity to her work.
- “Before you remove something I need to see it first.”
- “I want to see the changes you made BEFORE you change the website.”
- “I do not want my views softened. I am not here to do fair and balanced when talking about racism or slavery or the abusive and cultish behavior of even established religions.”
- “Always add new topics to the course catalog.”
- “Leave the vocabulary in alphabetical order.”
- “Always pull things that I need to review into a separate category.” Proposals have an **Items that need your OK** section (each item numbered E###, with Current / Proposed / Why), then an **Additions** section for new material only.
- When a source is missing or needs a proper citation, look it up first (web search, interviews, catalogs), then show her what was found so she can OK it. Do not ask her for sources or propose cuts before searching.
- The 1964 cutoff is a suggestion, not a hard rule. Flag post-1964 items with their citation; do not cut them by default.
- No first person in resources outside quotations. No em dashes, en dashes, or straight quotes in her own writing (dashes inside quotations stay). Punctuation goes inside closing quotation marks.
- Cite properly. Use the King James Bible.
- Mark uncited Wikipedia-derived passages “(Wikipedia)”.
- Concepts present lists only concepts that are actually linked on the page.
- Remove her interpretations that conflict with Young’s own statements, but show them first.
- Writing: warm, direct, close third person; no notes or follow-up questions; conserve output.

## Standard citations

- FF = (Ellen G. Friedman and Miriam Fuchs, “A Conversation with Marguerite Young,” Review of Contemporary Fiction 23, no. 1, Spring 2003 (1989 original))
- T = (Marguerite Young, interview with Studs Terkel, WFMT radio, 1965)
- B = (Marguerite Young, interview with Kay Bonetti, American Audio Prose Library, May 1983)

## The two passes on each chapter

1. **“work on chapter N”**: first pass. Summary; characters present; key passages; twelve questions in four groups (Reading closely, Characters, Connections, Reflection); character, theme, and symbol fixes; resources keyed to quoted chapter phrases in chapter order with sub-items nested; E items; vocabulary (alphabetical); concept sync; course catalog topics.
2. **“check chapter N for edits, additions, and consistency”**: check pass. New resources, consistency fixes, vocabulary, catalog.

Each pass is a proposal shown in chat first, then published on her approval.

## Files

- `site/data/chapters.json`: chapter pages (`chapter-NN`).
- `site/data/concepts.json`: concept and character pages.
- `src/dictionary.json`: vocabulary (`{'words':[{word,definition,chapters,defined_in,pattern}],'vocab_chapters'}`).
- `src/curriculum.json`: course catalog.
- `src/site.js`, `src/site.css`: copied into `site/` by `build.py`.
- `ebook.py`: builds the guide EPUB and PDF into `site/downloads/`. **Do not run until Coral says the site is complete.**

## Working folder

Scripts read the chapter text and the full novel from a private working folder set by the environment variable `MYS_WORK` (default `work/`, which is not committed). It holds `cNN.txt` (chapter text), `book/b1.txt` to `book/b4.txt` and `book/all.txt` (the novel). The novel text is not kept in this repository; Coral uploads it when needed.

## Chapter scripts (`tools/chapter-template/`)

A chapter run is `head + mid + rebuild + tail` concatenated into one script:

- `head.py`: loads the data and defines `rp(a,b)` (replace exactly once), `L`, `C(n)` (link to Chapter n resources), `see(...)`, `curl_html`.
- `mid_first_pass_example.py`: the first-pass pattern (summary, questions, `add(key, body, kids)`, items sorted by position in `cNN.txt`, vocabulary).
- `mid_check_pass_example.py`: the check-pass pattern (parses top-level items, merges `NEW`, vocabulary `VV`).
- `rebuild.py`: rebuilds Concepts present from the page’s links. After it runs, “removed from concepts present” must be an empty set.
- `tail_first_pass.py`, `tail_check_pass.py`: write the files and add `TOP` catalog topics. Make sure the chapter number in `'chapter':N` is right (an earlier copy once filed topics under the wrong chapter; `fixcat_example.py` repaired it).

Make a new chapter’s head, rebuild, and tail from the last chapter’s with `sed` (`s/'N'/'N+1'/; s/chapter-N/chapter-N+1/; s/Chapter N/Chapter N+1/; s/>N/>N+1/`, and in the tail `chapter-N`, `(N,t)`, `'chapter':N`).

## Checks

- `python3 tools/lint.py N` before every publish. Known false positives: “I” in Roman numerals or “Meditation I”, dashes inside quotations, repeated words inside quotations.
- `python3 tools/grepsite.py "pattern" width` searches all chapter and concept pages.
- `python3 tools/find.py` searches the novel text.

## Publishing

1. Dry run on a branch, then discard: `git checkout -q -- . && git checkout -q main && git branch -D -q <branch>`.
2. After approval: `git checkout -q main && git pull -q && git checkout -q -b <branch>`, run the chapter script, `python3 tools/lint.py N`, then `python3 dictionary.py && python3 curriculum.py && python3 build.py`.
3. Commit, push the branch, open a pull request with `gh api`, and squash-merge it. Cloudflare deploys `main` automatically.

## Site features

- Offline reading: `site/sw.js` (service worker) and `site/app.webmanifest`. Pages are network-first, so online readers always get the newest copy. `build.py` writes `site/offline/guide.json`, the list used by “Save this guide offline” on the guide home page.
- “Save as PDF” button on every page, with print styles in `src/site.css`.
