# To do

## Sitewide review pass (planned November 10, 2026)

All 82 chapters have had a first pass and a check pass. A scan of the live site after Chapter 82 found these items for one more sweep.

### Step 1: Mechanical fixes, sitewide, in one change
DONE November 10, 2026 (E914 to E920 and mechanical fixes). The 84 "dash" flags are dashes inside novel quotations and stay; repeated words, ellipsis spaces, and regnal-number "first person" flags were checked and left alone.
Show Coral anything that changes wording before it goes live.
- Doubled "See" links: 45 in chapters 43, 55 to 65, 67, and 71. Merge each into one "See" line, as in the Chapter 82 check pass (E912).
- Lint flags in 58 chapters, mostly chapters 1 to 35:
  - 84 spaced hyphens used as dashes
  - 30 stray spaces before punctuation
  - 23 repeated words
  - 13 punctuation marks outside closing quotes
  - 9 uses of "vs."
  - 53 "first person" flags, many of them false alarms like "Isabella I" and "Harold I"
- Run: `for n in $(seq 1 82); do python3 tools/lint.py $n; done`

### Step 2: Chapter by chapter, a few at a time, starting with Chapter 1
Present each batch as "Items that need your OK" (Current / Proposed / Why), then "Additions."
- Quotecheck: 785 quotes across the book are not found in the novel. Most are outside sources (interviews, the Bible, poems) or OCR slips in the working copy, but the early chapters were never checked line by line, so real misquotes are likely. Run `MYS_WORK=<scratchpad> python3 tools/quotecheck.py N`.
- Rules that came later:
  - Mark uncited Wikipedia text "(Wikipedia)".
  - Use King James wording for the Bible.
  - Remove softened language now that the content notes are in place.
- Consistency across chapters: the same allusion explained differently in two places, and corrections made late that earlier chapters still get wrong. Examples: Gabriel's horn (now sourced to "Blow Your Trumpet, Gabriel," Slave Songs of the United States, 1867), and nepenthe (Helen had it from Polydamna of Egypt and gave it to Menelaus and his guests).

Next E number: E1080. Step 2 progress: Chapters 1 to 29 done (E921 to E1008); Chapter 29 and Ch 28 weaving trims done (E1009 to E1039); next is Chapter 30 with trims. Ch 29 three souls sourced to Rinchen via Otgony Pürev (E1040). Trim sweep of earlier chapters (stock theme sentences, run $S/sweep.py N): Chapters 1 to 28 done (E1041 to E1079); sweep complete. Next is Chapter 30 with trims. Short plot-summary notes are left alone. Every general-summary note gets a source (see CLAUDE.md). Do not be Eurocentric (see CLAUDE.md). Coral approved treating encyclopedic passages as Wikipedia: mark them and list them for her OK. Unsourced search-summary notes: find a reference (Easton's, KJV, SEP, Wikipedia) and propose it.
