# Builds the Dictionary page of Miss MacIntosh, My Darling. Run from this folder:
#     python3 dictionary.py && python3 build.py
# The words live in src/dictionary.json. Each entry has:
#   word         the headword as it should appear
#   definition   the short definition (may contain links written as href="#page-id")
#   chapters     the chapter numbers where the word appears in the novel
#   defined_in   the chapter whose Vocabulary section first defined it
#   pattern      the search pattern used to find the word in the novel's text
# This script writes the page into site/data/chapters.json (page id "dictionary"),
# lists it in the manifest, and links it from the To All My Darlings home page.
import json, os, html
ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'src', 'dictionary.json')
DATA = os.path.join(ROOT, 'site', 'data')
PID, TITLE, LABEL, FILE = 'dictionary', 'Dictionary', 'To All My Darlings', 'chapters'

words = json.load(open(SRC, encoding='utf-8'))['words']
words.sort(key=lambda w: w['word'].replace('’', '').lower())
covered = sorted({w['defined_in'] for w in words})

def chap_link(n):
    return '<a href="#chapter-%02d">%d</a>' % (n, n)

def covered_text():
    if len(covered) == 1: return 'Chapter %d' % covered[0]
    return 'Chapters ' + ', '.join(str(c) for c in covered[:-1]) + ' and ' + str(covered[-1])

letters = []
for w in words:
    L = w['word'][0].upper()
    if L not in letters: letters.append(L)

out = ['<h1>Dictionary of Miss MacIntosh, My Darling</h1>',
       '<p>Short definitions of unfamiliar words in Miss MacIntosh, My Darling, with every chapter where each word appears. '
       'Words are added as each chapter’s vocabulary is completed. The dictionary now covers the vocabulary of %s, %d words in all.</p>'
       % (covered_text(), len(words)),
       '<p>' + ' · '.join('<a href="#%s--%s">%s</a>' % (PID, L.lower(), L) for L in letters) + '</p>']
for L in letters:
    out.append('<h2>%s</h2>\n<dl class="gloss">' % L)
    for w in words:
        if w['word'][0].upper() != L: continue
        ch = w['chapters']
        found = ('Found in chapter ' if len(ch) == 1 else 'Found in chapters ') + ', '.join(chap_link(c) for c in ch)
        out.append('<dt>%s</dt><dd>%s</dd><dd><em>%s</em></dd>' % (html.escape(w['word'], quote=False), w['definition'], found))
    out.append('</dl>')
page = '\n'.join(out)

path = os.path.join(DATA, FILE + '.json')
d = json.load(open(path, encoding='utf-8'))
d[PID] = page
# link from the To All My Darlings home page, just below Allusions
# (kept short: build.py takes the home page's share description from its first long list item)
LINK = '<h2>Dictionary</h2>\n<ul>\n<li><a href="#%s">Dictionary of Miss MacIntosh, My Darling</a></li>\n</ul>' % PID
home = d['home']
if '<h2>Dictionary</h2>' not in home:
    i = home.index('<h2>Allusions</h2>')
    j = home.index('</ul>', i) + len('</ul>')
    home = home[:j] + '\n' + LINK + home[j:]
    d['home'] = home
open(path, 'w', encoding='utf-8').write(json.dumps(d, ensure_ascii=False))

mpath = os.path.join(DATA, 'manifest.json')
m = json.load(open(mpath, encoding='utf-8'))
if PID not in m['pages']:
    pages = {}
    for k, v in m['pages'].items():
        pages[k] = v
        if k == 'home': pages[PID] = [TITLE, LABEL, FILE]
    m['pages'] = pages
    open(mpath, 'w', encoding='utf-8').write(json.dumps(m, ensure_ascii=False, separators=(',', ':')))
print('dictionary:', len(words), 'words, covering', covered_text())
