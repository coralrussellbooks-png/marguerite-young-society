# Builds the course catalog of "The Novel as a Liberal Arts Education". Run from this folder:
#     python3 curriculum.py && python3 build.py
# The subjects and topics live in src/curriculum.json:
#   subjects   id, title, group, blurb, related (concept page ids)
#   items      subject, chapter, topic  (one line per topic a chapter's Resources teach)
# This script writes one page per subject into site/data/chapters.json (page ids
# "liberal-arts-<subject id>"), lists them in the manifest, and rewrites the
# course catalog section at the end of the essay page.
import json, os, html
ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(ROOT, 'site', 'data')
ESSAY = 'the-novel-as-a-liberal-arts-education'
LABEL, FILE, TOTAL = 'To All My Darlings', 'chapters', 82
GROUPS = ['The arts of language', 'The arts of number', 'The humanities']

src = json.load(open(os.path.join(ROOT, 'src', 'curriculum.json'), encoding='utf-8'))
subjects, items = src['subjects'], src['items']
covered = sorted({i['chapter'] for i in items})
P = json.load(open(os.path.join(DATA, 'manifest.json'), encoding='utf-8'))['pages']

def pid(s): return 'liberal-arts-' + s['id']
def chapters_text(chs):
    if len(chs) == 1: return 'Chapter %d' % chs[0]
    return 'Chapters ' + ', '.join(str(c) for c in chs[:-1]) + ' and ' + str(chs[-1])
def ch_link(c): return '<a href="#chapter-%02d">Chapter %d</a>' % (c, c)

pages = {}
for s in subjects:
    mine = [i for i in items if i['subject'] == s['id']]
    chs = sorted({i['chapter'] for i in mine})
    out = ['<h1>%s</h1>' % html.escape(s['title'], quote=False),
           '<p>%s</p>' % s['blurb'],
           '<p><strong>Chapters covered so far:</strong> %s (%d of %d). This page grows as each chapter of To All My Darlings is completed.</p>'
           % (', '.join(ch_link(c) for c in chs) if chs else 'none yet', len(chs), TOTAL)]
    rel = [r for r in s.get('related', []) if r in P]
    if rel:
        out.append('<p><strong>Related pages:</strong> ' + ' · '.join('<a href="#%s">%s</a>' % (r, html.escape(P[r][0], quote=False)) for r in rel) + '</p>')
    for c in chs:
        out.append('<h2>%s</h2>\n<ul>\n%s\n</ul>' % (ch_link(c), '\n'.join('<li>%s</li>' % i['topic'] for i in mine if i['chapter'] == c)))
        out.append('<p>The full entries are in the <a href="#chapter-%02d--research-resources">Chapter %d Resources</a>.</p>' % (c, c))
    out.append('<p>Part of <a href="#%s">The Novel as a Liberal Arts Education</a>.</p>' % ESSAY)
    pages[pid(s)] = '\n'.join(out)

# the catalog section of the essay
cat = ['<h2>The course catalog</h2>',
       '<p>The novel’s references, sorted by subject the way a course catalog might sort them. Each subject page lists its topics chapter by chapter, with links to the full entries. The catalog now covers %s, %d of the novel’s %d chapters, and it grows as each chapter is completed.</p>'
       % (chapters_text(covered), len(covered), TOTAL)]
for g in GROUPS:
    rows = []
    for s in subjects:
        if s['group'] != g: continue
        n = sum(1 for i in items if i['subject'] == s['id'])
        rows.append('<li><a href="#%s">%s</a> (%d topic%s)</li>' % (pid(s), html.escape(s['title'], quote=False), n, '' if n == 1 else 's'))
    if g == 'The arts of language':
        rows.append('<li><a href="#dictionary">Language and Words</a>: the Dictionary of Miss MacIntosh, My Darling</li>')
    cat.append('<h3>%s</h3>\n<ul>\n%s\n</ul>' % (g, '\n'.join(rows)))

cp = os.path.join(DATA, FILE + '.json')
d = json.load(open(cp, encoding='utf-8'))
e = d[ESSAY]
for marker in ('<h2>The course catalog</h2>', '<h2>Chapter 43 by subject</h2>'):
    if marker in e:
        e = e[:e.index(marker)].rstrip('\n'); break
d[ESSAY] = e + '\n' + '\n'.join(cat)
d.update(pages)
open(cp, 'w', encoding='utf-8').write(json.dumps(d, ensure_ascii=False))

mp = os.path.join(DATA, 'manifest.json')
m = json.load(open(mp, encoding='utf-8'))
new = {}
for k, v in m['pages'].items():
    if k.startswith('liberal-arts-'): continue
    new[k] = v
    if k == ESSAY:
        for s in subjects: new[pid(s)] = ['Liberal Arts: ' + s['title'], LABEL, FILE]
m['pages'] = new
open(mp, 'w', encoding='utf-8').write(json.dumps(m, ensure_ascii=False, separators=(',', ':')))
print('curriculum:', len(subjects), 'subjects,', len(items), 'topics, covering', chapters_text(covered))
