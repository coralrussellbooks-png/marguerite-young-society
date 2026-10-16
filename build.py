# Builds the website. Run from this folder:  python3 build.py
# Reads site/data (page text) and site/img, then writes one page file per entry into site/.
# Also writes preview/index.html, the single-page version used for the preview on Claude.
import json, glob, os, re, html, shutil, sys
ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'site')
PREVIEW = os.path.join(ROOT, 'preview')
# The site's web address. Change this if the site moves to a new address, then run build.py again.
SITE_URL = 'https://marguerite-young-society.coralrussellbooks.workers.dev'
SITE = 'The Marguerite Young Society'
HOME = 'the-marguerite-young-society'
SITE_DESC = ('A home for the work of Marguerite Young (1908 to 1995): Miss MacIntosh, My Darling, '
             'her histories, essays and poems, and the philosophy of Radical Immanence.')

css = open(os.path.join(ROOT, 'src/site.css')).read()
js = open(os.path.join(ROOT, 'src/site.js')).read()
BASE = (":root{box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}"
        "html{scroll-padding-top:env(safe-area-inset-top,0px)}body{margin:0;padding:0}img{max-width:100%}"
        "[hidden]:not([hidden=until-found i]){display:none!important}\n")
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Condensed:wght@400;600'
         '&family=Libre+Caslon+Display&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;1,7..72,400&display=swap">\n')

m = json.load(open(SRC + '/data/manifest.json'))
P = m['pages']
data = {}
for f in glob.glob(SRC + '/data/*.json'):
    n = os.path.basename(f)[:-5]
    if n != 'manifest':
        data[n] = json.load(open(f))

def e(s): return html.escape(s, quote=True)

def link(i, sec='', find=''):
    u = 'index.html' if i == HOME else i + '.html'
    if find: return u + '#~f=' + find
    if sec: return u + '#s-' + sec
    return u

def rewrite(h):
    def r(mm):
        raw = mm.group(1)
        base, _, find = raw.partition('~f=')
        i, _, sec = base.partition('--')
        if i in P or i in ('substack', 'all-pages'):
            return 'href="' + e(link(i, sec, find)) + '"'
        return mm.group(0)
    return re.sub(r'href="#([^"]*)"', r, h)

def slug(t):
    t = t.lower()
    t = re.sub(r"[’']", '', t)
    t = re.sub(r'[^a-z0-9]+', '-', t).strip('-')
    return t[:80].rstrip('-')

def heading_ids(h):
    def r(mm):
        tag, attrs, inner = mm.group(1), mm.group(2), mm.group(3)
        if 'id=' in attrs: return mm.group(0)
        txt = html.unescape(re.sub(r'<[^>]+>', '', inner))
        return '<%s%s id="s-%s">%s</%s>' % (tag, attrs, slug(txt), inner, tag)
    return re.sub(r'<(h2|h3)([^>]*)>(.*?)</\1>', r, h, flags=re.S)

def describe(h):
    for p in re.findall(r'<p[^>]*>(.*?)</p>', h, re.S):
        t = html.unescape(re.sub(r'<[^>]+>', ' ', p))
        t = re.sub(r'\s+', ' ', t).strip()
        if '←' in t or '→' in t or len(t) < 50: continue
        if len(t) > 160: t = t[:157].rsplit(' ', 1)[0].rstrip(',;:') + '…'
        return t
    return SITE_DESC

# share image: a book's cover for every page in that book, otherwise the portrait
COVER_FILE = {k: 'mmmd-studies' for k in ['religion-in-mmmd-home', 'comedy-in-mmmd-home', 'history-in-mmmd-home', 'philosophy-of-mmmd-home', 'intertextuality-in-mmmd-home']}
COVER_IDS = ['home', 'guide-home', 'wheel-and-spokes-home', 'architecture-home', 'llt-home', 'master-class-home', 'woman-in-mmmd-home', 'reality-home',
             'collection-home', 'writing-life-home', 'whale-home', 'creative-home', 'art-home', 'poetry-home', 'weather-never-home', 'weather-inside-home',
             'floor-home'] + list(COVER_FILE)
WORKS = {'harp-song-for-a-radical': 'work-harp', 'the-collected-poems-of-marguerite-young': 'work-poems', 'miss-macintosh-my-darling': 'work-mmmd',
         'angel-in-the-forest': 'work-angel', 'inviting-the-muses': 'work-muses', 'marguerite-young-our-darling': 'work-our-darling'}
NOVEL = {'chapters','concepts','guide','curious','architecture','pillars','wheel','references','refindex','essays','nav','hubs','llt','masterclass','woman'}
label_cover = {}
for cid in COVER_IDS:
    if cid in P: label_cover.setdefault(P[cid][1], 'img/covers/' + COVER_FILE.get(cid, cid) + '.jpg')
def share_image(i):
    if i in WORKS: return 'img/covers/' + WORKS[i] + '.jpg'
    if i in COVER_IDS: return 'img/covers/' + COVER_FILE.get(i, i) + '.jpg'
    if i in P and P[i][1] in label_cover: return label_cover[P[i][1]]
    if i in P and P[i][2] in NOVEL: return 'img/covers/work-mmmd.jpg'
    return 'img/young-portrait.jpg'

def shell(content, crumb, static):
    home = 'index.html' if static else '#'
    sub = 'substack.html' if static else '#substack'
    allp = 'all-pages.html' if static else '#all-pages'
    return f'''<header class="top">
  <button class="menu-btn" id="menuBtn" type="button" aria-controls="side" aria-expanded="false">Menu</button>
  <a class="brand" href="{home}" id="brand">The Marguerite Young <span>Society</span></a>
  <div class="search"><input id="q" type="search" placeholder="Search titles, then all text" aria-label="Search the site" autocomplete="off"></div>
  <a class="subtop" href="{sub}">Subscribe</a>
</header>
<div class="layout">
  <nav class="side" id="side" aria-label="Contents"></nav>
  <main>
    <div class="column">
      <div class="crumbrow"><div class="crumb" id="crumb">{e(crumb)}</div><button class="findopen" id="findOpen" type="button">Find on this page</button></div>
      <article id="page">{content}</article>
      <section id="results" hidden></section>
    </div>
    <footer class="site-foot">
      <p>The Marguerite Young Society is dedicated to the work of Marguerite Young (1908 to 1995).</p>
      <p>Everything on this site is free to use and share.</p>
      <p>Contact: <a href="https://coralrussell.substack.com" target="_blank" rel="noopener">coralrussell.substack.com</a> · <a href="{allp}">All pages</a></p>
    </footer>
  </main>
</div>

<div class="findbar" id="findBar" hidden role="search" aria-label="Find on this page">
  <input id="findInput" type="search" placeholder="Find on this page" aria-label="Find on this page" autocomplete="off">
  <span class="findcount" id="findCount" aria-live="polite"></span>
  <button type="button" id="findPrev" aria-label="Previous match">&#8593;</button>
  <button type="button" id="findNext" aria-label="Next match">&#8595;</button>
  <button type="button" id="findClose" aria-label="Close find">&#10005;</button>
</div>
'''

def meta(title, desc, img, kind='article'):
    return (f'<meta name="description" content="{e(desc)}">\n'
            f'<meta property="og:site_name" content="{SITE}">\n<meta property="og:type" content="{kind}">\n'
            f'<meta property="og:title" content="{e(title)}">\n<meta property="og:description" content="{e(desc)}">\n'
            f'<meta property="og:image" content="{e(img)}">\n<meta name="twitter:card" content="summary_large_image">\n')

# ---------- 1. the preview published here (one page, "#" addresses) ----------
os.makedirs(PREVIEW, exist_ok=True)
prev = (f'<title>{SITE}</title>\n' + meta(SITE, SITE_DESC, 'img/young-portrait.jpg', 'website') + FONTS +
        '<style>\n' + css + '</style>\n' + shell('<p class="status">Opening the Society…</p>', '', False) +
        '<script>\n' + js + '</script>\n')
open(os.path.join(PREVIEW, 'index.html'), 'w').write(prev)

# ---------- 2. the version for the new host (one real file per page) ----------
H = SRC
for old in glob.glob(os.path.join(H, '*.html')):
    # keep the Google Search Console verification file
    if not os.path.basename(old).startswith('google'): os.remove(old)
open(H + '/site.css', 'w').write(BASE + css)
open(H + '/site.js', 'w').write(js)
open(H + '/robots.txt', 'w').write('User-agent: *\nAllow: /\n\nSitemap: ' + SITE_URL + '/sitemap.xml\n')
PAGE_URLS = []

def write_page(fname, pid, title, desc, img, crumb, content, kind='article'):
    full_title = SITE if title == SITE else title + ' | ' + SITE
    url = SITE_URL + '/' + ('' if fname == 'index.html' else fname[:-5])
    PAGE_URLS.append(url)
    head_extra = (f'<link rel="canonical" href="{e(url)}">\n<meta property="og:url" content="{e(url)}">\n')
    img = SITE_URL + '/' + img
    doc = (f'<!doctype html>\n<html lang="en" data-static="1" data-page="{pid}">\n<head>\n<meta charset="utf-8">\n'
           '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
           '<link rel="icon" href="favicon.ico" sizes="any">\n<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">\n'
           '<link rel="apple-touch-icon" href="apple-touch-icon.png">\n'
           f'<title>{e(full_title)}</title>\n' + head_extra + meta(title, desc, img, kind) + FONTS +
           '<link rel="stylesheet" href="site.css">\n</head>\n<body>\n' + shell(content, crumb, True) +
           '<script src="site.js"></script>\n</body>\n</html>\n')
    open(H + '/' + fname, 'w').write(doc)

count = 0
for pid, (title, label, f) in P.items():
    raw = data[f][pid]
    content = heading_ids(rewrite(raw))
    if pid == HOME:
        write_page('index.html', pid, SITE, SITE_DESC, 'img/young-portrait.jpg', label, content, 'website')
    else:
        write_page(pid + '.html', pid, title, describe(raw), share_image(pid), label, content)
    count += 1

# All pages index
groups, seen = [], {}
for pid, v in P.items():
    if v[1] not in seen: seen[v[1]] = []; groups.append(v[1])
    seen[v[1]].append(pid)
ap = '<h1>All pages</h1><p>Every page on the site, grouped by book and section.</p>'
for g in groups:
    ap += '<div class="all-group"><h2 id="s-%s">%s</h2><ul>' % (slug(g), e(g))
    ap += ''.join('<li><a href="%s">%s</a></li>' % (e(link(i)), e(P[i][0])) for i in seen[g])
    ap += '</ul></div>'
write_page('all-pages.html', 'all-pages', 'All pages', 'Every page of The Marguerite Young Society, grouped by book and section.', 'img/young-portrait.jpg', 'The Society', ap)
sub = ('<h1>Radical Immanence on Substack</h1><p>New essays, chapter readings, and reflections on Marguerite Young go out first on Substack. '
       'Subscribing is free, and each new post arrives by email.</p><p><a href="https://coralrussell.substack.com/subscribe" target="_blank" rel="noopener">Subscribe on Substack</a></p>')
write_page('substack.html', 'substack', 'Radical Immanence on Substack', 'New essays, chapter readings, and reflections on Marguerite Young, free by email.', 'img/young-portrait.jpg', 'The Society', sub)
sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
sm += ['<url><loc>%s</loc></url>' % e(u) for u in PAGE_URLS]
sm.append('</urlset>')
open(H + '/sitemap.xml', 'w').write('\n'.join(sm) + '\n')
print('pages', count + 2, '| sitemap entries', len(PAGE_URLS))
