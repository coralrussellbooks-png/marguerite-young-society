"""Build the eBook editions (EPUB and PDF) of a study book from the built site pages, in the order of its home page.
Each h2 section of the home page becomes a title page in the contents; every linked page of the book follows in order.
Usage: python3 tools/book_generic.py BOOK [OUTDIR]   (run build.py first; default site/downloads)
BOOK is one of the keys in BOOKS below.
KDP_OUT=DIR also writes NAME-kdp.epub there (copyright page added, links to the website turned into plain text)."""
import os, re, sys, html, json, subprocess, datetime, tempfile, shutil, base64

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, 'site')
URL = 'https://marguerite-young-society.coralrussellbooks.workers.dev'
BOOKS = {
    'llt': ('llt-home', 'llt', 'life-love-and-truth-that-doesnt-fail', 'Life, Love, and Truth That Doesn’t Fail', 'llt-home.jpg'),
    'masterclass': ('master-class-home', 'masterclass', 'teaching-a-writing-masterclass', 'Teaching a Writing Masterclass', 'master-class-home.jpg'),
    'woman': ('woman-in-mmmd-home', 'woman', 'woman-in-youngs-magnum-opus', "Woman in Young’s Magnum Opus", 'woman-in-mmmd-home.jpg'),
    'religion': ('religion-in-mmmd-home', 'essays', 'christianity-and-religion-in-miss-macintosh-my-darling', 'Christianity and Religion in Miss MacIntosh, My Darling: The Sacred Is Here', 'mmmd-studies.jpg'),
    'comedy': ('comedy-in-mmmd-home', 'essays', 'comedy-in-miss-macintosh-my-darling', 'Comedy in Miss MacIntosh, My Darling', 'mmmd-studies.jpg'),
    'intertextual-index': ('intertextual-index-home', 'refindex', 'the-intertextual-index', 'The Intertextual Index of Miss MacIntosh, My Darling', None),
    'index': ('index-of-mmmd-home', 'essays', 'index-to-miss-macintosh-my-darling', 'Index to Miss MacIntosh, My Darling', None),
}
BOOK = sys.argv[1]
HOMEKEY, DATAFILE, NAME, TITLE, CFILE = BOOKS[BOOK]
OUT = os.path.abspath(sys.argv[2] if len(sys.argv) > 2 else os.path.join(SITE, 'downloads'))
SUBTITLE = ''
AUTHOR = 'Coral Russell'
PUBLISHER = 'The Marguerite Young Society'
COVER = os.path.join(SITE, 'img', 'covers', CFILE) if CFILE else ''
HAVE_COVER = bool(COVER) and os.path.exists(COVER)
DATA = json.load(open(os.path.join(SITE, 'data', DATAFILE + '.json'), encoding='utf-8'))
HOME = DATA[HOMEKEY]
HOME = re.sub(r'<h2>Read It Anywhere \(offline\)</h2>.*?(?=<h2>)', '', HOME, flags=re.S)
HOME = re.sub(r'<h2>Download the book</h2>.*?(?=<h2>)', '', HOME, flags=re.S)
ITEMS = []
LABEL = {}
DIVIDER = {}
if BOOK == 'index':
    ITEMS = [(HOMEKEY, 'page')]
else:
    seen_pages = set()
    for blk in re.split(r'(?=<h2>)', HOME):
        m = re.match(r'<h2>(.*?)</h2>', blk)
        slugs = [s for s in re.findall(r'<li><a href="#([^"]+)">', blk) if s in DATA and s != HOMEKEY and s not in seen_pages]
        if not slugs:
            continue
        if m:
            head = html.unescape(re.sub(r'<[^>]+>', '', m.group(1)))
            mid = 'movement-%d' % (sum(1 for _, k in ITEMS if k == 'movement') + 1)
            ITEMS.append((mid, 'movement')); LABEL[mid] = head
            DIVIDER[mid] = '<h1 id="%s">%s</h1>' % (mid, html.escape(head))
        for slug in slugs:
            seen_pages.add(slug); ITEMS.append((slug, 'page'))
PAGES = [i for i, k in ITEMS if k == 'page']


def article(p):
    h = open(os.path.join(SITE, p + '.html'), encoding='utf-8').read()
    a = h[h.index('<article id="page">') + len('<article id="page">'):h.index('</article>')]
    a = re.sub(r'<p class="pagemeta">.*?</p>\s*', '', a, flags=re.S)
    a = re.sub(r'<p class="cite">.*?</p>\s*', '', a, flags=re.S)
    if p != HOMEKEY:
        a = re.sub(r'<p>[^\n]*?href="%s\.html"[^\n]*?</p>\s*' % re.escape(HOMEKEY), '', a)   # previous / home / next line
    a = re.sub(r'<h2[^>]*>Read It Anywhere \(offline\)</h2>.*?(?=<h2)', '', a, flags=re.S)
    a = re.sub(r'<h2[^>]*>Download the book</h2>.*?(?=<h2)', '', a, flags=re.S)
    a = re.sub(r'<p><strong>(?:Characters|Themes|Symbols|Philosophy|Allusions):</strong>[^\n]*?</p>\s*', '', a)   # site links; Pillars and Chapters discussed stay
    a = re.sub(r'<h2[^>]*>Related concepts</h2>\s*<p>.*?</p>\s*', '', a, flags=re.S)
    a = re.sub(r' (?:target|rel)="[^"]*"', '', a)
    LABEL[p] = html.unescape(re.sub(r'<[^>]+>', '', re.search(r'<h1>(.*?)</h1>', a).group(1)))
    seen = {}
    def ident(m):
        i = '%s__%s' % (p, m.group(1)); seen[i] = seen.get(i, 0) + 1
        return ' id="%s"' % (i if seen[i] == 1 else '%s-%d' % (i, seen[i]))
    a = re.sub(r' id="([^"]+)"', ident, a)

    def link(m):
        u = m.group(1)
        if u.startswith(('http:', 'https:', 'mailto:')):
            return 'href="%s"' % u
        if u.startswith('#'):
            return 'href="#%s__%s"' % (p, u[1:])
        name, _, frag = u.partition('#')
        name = re.sub(r'\.html$', '', name)
        if name in PAGES:
            return 'href="#%s"' % (name + ('__' + frag if frag else ''))
        return 'href="%s/%s%s"' % (URL, '' if name in ('home', 'index') else name, '#' + frag if frag else '')
    a = re.sub(r'href="([^"]+)"', link, a)
    if BOOK == 'index':
        a = re.sub(r'href="#%s__s-([a-z])"' % re.escape(p), lambda m: 'href="#%s__%s"' % (p, m.group(1).upper()), a)
    a = a.replace('<h1>', '<h1 id="%s">' % p, 1)
    return a.strip()


parts = [DIVIDER[i] if k == 'movement' else article(i) for i, k in ITEMS]
ORDER = [i for i, k in ITEMS]
dates = [re.search(r'datetime="([\d-]+)"', open(os.path.join(SITE, p + '.html'), encoding='utf-8').read()).group(1) for p in PAGES]
date = max(dates)
nice = datetime.date.fromisoformat(date).strftime('%B %-d, %Y')
year = date[:4]
os.makedirs(OUT, exist_ok=True)
TMP = tempfile.mkdtemp()

# ---------- EPUB ----------
css = ('body{line-height:1.4}h1{page-break-before:always;margin-top:1em}h2{margin-top:1.4em}'
       'ol li,ul li{margin:.3em 0}p.notice{font-style:italic}')
cssf = os.path.join(TMP, 'epub.css'); open(cssf, 'w', encoding='utf-8').write(css)
src = os.path.join(TMP, NAME + '-epub.html')
open(src, 'w', encoding='utf-8').write('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>%s</title></head><body>%s</body></html>'
                                       % (html.escape(TITLE), '\n'.join(parts)))
subprocess.run(['pandoc', src, '-f', 'html', '-t', 'epub3', '-o', os.path.join(OUT, NAME + '.epub'),
                '--toc', '--toc-depth=1', '--split-level=1', '--css', cssf, ] + (['--epub-cover-image=' + COVER] if HAVE_COVER else []) + [
                '--metadata', 'title=' + TITLE, '--metadata', 'author=' + AUTHOR, '--metadata', 'lang=en-US',
                '--metadata', 'date=' + date, '--metadata', 'publisher=' + PUBLISHER,
                '--metadata', 'rights=© %s %s' % (year, AUTHOR), '--metadata', 'toc-title=Contents'], check=True)

# ---------- Kindle (KDP) EPUB: set KDP_OUT=DIR to also write NAME-kdp.epub there ----------
# Adds a copyright page, and turns links to the website into plain text (the eBook reads on its own).
KDP_OUT = os.environ.get('KDP_OUT')
if KDP_OUT:
    kparts = [re.sub(r'<a [^>]*?href="https?://[^"]*"[^>]*>(.*?)</a>', r'\1', x, flags=re.S) for x in parts]
    copy = ('<h1>Copyright</h1><div class="copyright"><p>%s</p><p>by %s</p><p>Copyright © %s %s. All rights reserved.</p>'
            '<p>Published by %s.</p><p>Quotations from <em>Miss MacIntosh, My Darling</em> by Marguerite Young (1965) are given for commentary and study.</p>'
            '<p>The Marguerite Young Society: %s</p></div>'
            % (TITLE, AUTHOR, year, AUTHOR, PUBLISHER, URL.replace('https://', '')))
    kcss = css + '.copyright{margin-top:3em;text-align:center}.copyright p{margin:.6em 0;text-indent:0}'
    kcssf = os.path.join(TMP, 'kdp.css'); open(kcssf, 'w', encoding='utf-8').write(kcss)
    ksrc = os.path.join(TMP, NAME + '-kdp.html')
    open(ksrc, 'w', encoding='utf-8').write('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>%s</title></head><body>%s%s</body></html>'
                                            % (html.escape(TITLE), copy, '\n'.join(kparts)))
    os.makedirs(KDP_OUT, exist_ok=True)
    subprocess.run(['pandoc', ksrc, '-f', 'html', '-t', 'epub3', '-o', os.path.join(KDP_OUT, NAME + '-kdp.epub'),
                    '--toc', '--toc-depth=1', '--split-level=1', '--css', kcssf, ] + (['--epub-cover-image=' + COVER] if HAVE_COVER else []) + [
                    '--metadata', 'title=' + TITLE, '--metadata', 'author=' + AUTHOR, '--metadata', 'lang=en-US',
                    '--metadata', 'date=' + date, '--metadata', 'publisher=' + PUBLISHER,
                    '--metadata', 'rights=© %s %s' % (year, AUTHOR), '--metadata', 'toc-title=Contents'], check=True)

# ---------- PDF ----------
cover_page = ('<section class="cover"><img src="%s" alt="Cover of %s"></section>' % ('data:image/jpeg;base64,' + base64.b64encode(open(COVER, 'rb').read()).decode(), html.escape(TITLE))) if HAVE_COVER else ''
title_page = ('<section class="titlepage"><h1 class="booktitle">%s</h1><p class="by">%s</p>'
              '<p class="small">%s<br>%s<br>Updated %s<br>© %s %s</p></section>'
              % (TITLE, AUTHOR, PUBLISHER, URL.replace('https://', ''), nice, year, AUTHOR))
pcss = ('@page{size:Letter;margin:0.8in 0.85in 0.9in 0.85in}'
        'body{font-family:Arial,"Liberation Sans",Helvetica,sans-serif;font-size:12pt;line-height:1.25;color:#000;text-align:left}'
        'h1{font-size:20pt;margin:0 0 .6em;break-before:page}h2{font-size:15pt;margin:1.2em 0 .4em;break-after:avoid}'
        'h3{font-size:13pt;margin:1em 0 .3em;break-after:avoid}p,li{margin:.35em 0}ul,ol{padding-left:1.3em}'
        'a{color:#000;text-decoration:none}p.notice{font-style:italic}hr{border:0;border-top:1px solid #999}'
        '.cover{text-align:center;height:9in}.cover img{height:9in;max-width:100%}'
        '.titlepage{text-align:center;padding-top:2.6in;break-before:page}.titlepage h1{font-size:28pt;break-before:auto}'
        '.titlepage .sub{font-size:14pt;margin-top:1em}.titlepage .by{font-size:16pt;margin-top:1.5em}.titlepage .small{font-size:11pt;margin-top:3em}'
        '.toc ul{list-style:none;padding:0}.toc li{display:flex;justify-content:space-between;margin:.3em 0}.toc a{text-decoration:underline}'
        '.toc li.mv{font-weight:bold;margin-top:.9em}.toc li.pg{padding-left:1.2em}blockquote{margin:.6em 1.6em}')
psrc = os.path.join(TMP, NAME + '-pdf.html'); pdf = os.path.join(TMP, NAME + '.pdf')
from playwright.sync_api import sync_playwright
import pypdf
nums = {p: '' for p in ORDER}
with sync_playwright() as pw:
    br = pw.chromium.launch()
    for _ in range(4):                  # render, read each section's page from the outline, repeat until the contents page numbers settle
        toc = ('<section class="toc"><h1 class="contents">Contents</h1><ul>'
               + ''.join('<li class="%s"><a href="#%s">%s</a><span>%s</span></li>' % ('mv' if k == 'movement' else 'pg', p, html.escape(LABEL[p]), nums[p]) for p, k in ITEMS) + '</ul></section>')
        open(psrc, 'w', encoding='utf-8').write('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>%s</title><style>%s</style></head><body>%s%s%s%s</body></html>'
                                                % (html.escape(TITLE), pcss, cover_page, title_page, toc, '\n'.join(parts)))
        pg = br.new_page(); pg.goto('file://' + psrc, timeout=0)
        pg.pdf(path=pdf, prefer_css_page_size=True, outline=True, tagged=True, display_header_footer=True,
               header_template='<span></span>',
               footer_template='<div style="font-family:Arial,sans-serif;font-size:9pt;width:100%;text-align:center;color:#000"><span class="pageNumber"></span></div>')
        pg.close()
        r = pypdf.PdfReader(pdf)
        tops = [x for x in r.outline if not isinstance(x, list)][2 if HAVE_COVER else 2:]
        new = {p: str(r.get_destination_page_number(d) + 1) for p, d in zip(ORDER, tops)}
        if new == nums: break
        nums = new
    br.close()
subprocess.run(['qpdf', '--object-streams=generate', '--compress-streams=y', '--recompress-flate', '--compression-level=9',
                pdf, os.path.join(OUT, NAME + '.pdf')], check=True)
pages = len(pypdf.PdfReader(os.path.join(OUT, NAME + '.pdf')).pages)
shutil.rmtree(TMP)
print('sections:', len(ORDER), '(%d pages, %d halves)' % (len(PAGES), len(ORDER) - len(PAGES)), '| contents page numbers:', [nums[p] for p in ORDER], '| PDF pages:', pages)
for f in (NAME + '.epub', NAME + '.pdf'):
    print(f, os.path.getsize(os.path.join(OUT, f)))
