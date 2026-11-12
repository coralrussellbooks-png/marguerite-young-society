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

Next E number: E1604. Introduction updated (E1080 to E1085). Step 2 progress: Chapters 1 to 82 done (E921 to E1008, Ch 30 E1086 to E1096, Ch 31 E1097 to E1113, Ch 32 E1114 to E1127, Ch 33-34 E1128 to E1139, Ch 35 E1140 to E1148, Ch 36-38 E1149 to E1175, Ch 39 E1176 to E1194, Ch 40 E1195 to E1206, Ch 41 E1207 to E1212, Ch 42 E1213 to E1220, Ch 43-44 E1222 to E1228, Ch 45 E1229 to E1240, Ch 46-47 E1241 to E1266, Ch 48 E1267 to E1271, Ch 49 E1272 to E1291, Ch 50 E1292 to E1298, Ch 51 E1299 to E1302, Ch 52 E1303 to E1334, Ch 53 E1335 to E1343, Ch 54 E1344 to E1355, Ch 55 E1356 to E1374, Ch 56-58 E1375 to E1379, Ch 59 E1380 to E1387, Ch 60-61 E1388 to E1400, Ch 62 E1401 to E1407, Ch 63-64 E1408 to E1422, Ch 65 E1423 to E1440, Ch 66-67 E1441 to E1454, Ch 68-69 E1455 to E1456, Ch 70 E1457 to E1460, Ch 71 E1461 to E1466, Ch 72 E1467 to E1470, Ch 73-74 E1471 to E1473, Ch 75-76 E1474 to E1476, Ch 77-78 E1477 to E1480, Ch 79-80 E1481 to E1485, Ch 81-82 E1486 to E1489); Chapter 29 and Ch 28 weaving trims done (E1009 to E1039). Ch 29 three souls sourced to Rinchen via Otgony Pürev (E1040). Trim sweep of earlier chapters (stock theme sentences, run $S/sweep.py N): Chapters 1 to 28 done (E1041 to E1079); sweep complete. Step 2 chapter pass complete through Chapter 82 (November 11, 2026) (batches of two or three chapters; long chapters alone). Short plot-summary notes are left alone. Every general-summary note gets a source (see CLAUDE.md). Do not be Eurocentric (see CLAUDE.md). Coral approved treating encyclopedic passages as Wikipedia: mark them and list them for her OK. Unsourced search-summary notes: find a reference (Easton's, KJV, SEP, Wikipedia) and propose it.

## Next: book files for Amazon KDP and Internet Archive (Coral, November 11, 2026)
To All My Darlings is done. Build a print-ready PDF and an EPUB of the book from the site data, each with an interactive (linked) table of contents.
- KDP formatting guide: https://kdp.amazon.com/en_US/help/topic/G200634390
- KDP interactive table of contents: https://kdp.amazon.com/en_US/help/topic/G201605700
- Read both pages first; confirm trim size, margins, fonts, and front matter with Coral before the full build.
- Same files go to the Internet Archive.
- Built November 12, 2026 with tools/book_tamd.py (eBook only, no paperback: Introduction, Chapters 1 to 82, Dictionary). EPUB passes EPUBCheck 5.1.0; PDF is Letter, 1,798 pages, with page-numbered contents and bookmarks. Both are in site/downloads and linked from the home page (Download the book). Rebuild them with python3 tools/book_tamd.py after site changes.

## A Guide to Reading Miss MacIntosh, My Darling (started November 12, 2026)
- Done: the 14 unmatched quotations checked (8 fixed, E1490 to E1496), dashes checked (all inside quotations), volume references removed from the Guide, Story Arcs, and the Read-Along schedule (E1497). Rules are in CLAUDE.md.
- Chapter by chapter, adding what is useful from To All My Darlings in the Guide's own voice (no changes to its writing): Ch 1 E1498 to E1504, Ch 2 E1505 to E1509, Ch 3 E1510 to E1516, Ch 4 E1517 to E1519, Ch 5 E1520 to E1524. Plot check of Ch 1 to 4 done (E1525 to E1527). Ch 6 E1528 to E1531, Ch 7 E1532 to E1536. Biography E1537 to E1538. Ch 8 E1539 to E1542, Ch 9 E1543 to E1546, Ch 10 E1547 to E1549, Ch 11 E1550 to E1553, Ch 12 E1554 to E1555, Ch 13 E1556 to E1557, Ch 14 E1558 to E1560, Ch 15 E1561 to E1567 (also Ch 13 revelation pointer), Ch 16 E1568 to E1571. Next: Ch 17. Leave For the Curious as set (Read-Along 2028). Keep additions few; no "considered and left" lists (Coral).
- TAMD plot check against the novel (Coral, November 12, 2026): every plot statement in chapters.json, hub summaries, and character notes checked against the novel text, in batches; corrections shown as E items first. Ch 1 to 4 done (E1572 to E1575; hub summaries synced to chapter summaries). Ch 5 to 8 done (E1576 to E1577; nav.json arc summaries synced; all 82 hub and arc summary copies now match). Ch 9 to 12 done (E1578 to E1581). Ch 13 to 16 done (E1582 to E1587). Ch 17 to 20 done (E1588 to E1590). Ch 21 to 24 done (E1591 to E1592). Ch 25 to 28 done (E1593 to E1597). Ch 29 to 32 done (E1598). Ch 33 to 36 done (E1599 to E1600). Ch 37 to 40 done (E1601). Ch 41 to 44 done (no corrections). Ch 45 to 48 done (E1602). Ch 49 to 52 done (E1603). Next: Ch 53 to 56. Coral wants small slips corrected too, not only major ones (propose every one found). Novel chapter files: $S/n1.txt to n82.txt; TAMD plot text: $S/tplot.py N. Rebuild and re-upload the eBooks only if major plot errors turn up (2026 is the cutoff).
- Builder for its EPUB and PDF already exists: ebook.py (not yet run).
