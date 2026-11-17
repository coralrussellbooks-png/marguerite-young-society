"""Build the eBook editions (EPUB and PDF) of The Wheel and the Spokes
from the built site pages: the Introduction and all 82 chapters.
Usage: python3 tools/book_wheel.py [OUTDIR]   (run build.py first; default site/downloads, linked from wheel-and-spokes-home)"""
import os, re, sys, html, subprocess, datetime, tempfile, shutil, base64

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, 'site')
URL = 'https://marguerite-young-society.coralrussellbooks.workers.dev'
OUT = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(SITE, 'downloads'))
NAME = 'the-wheel-and-the-spokes'
TITLE = 'The Wheel and the Spokes'
SUBTITLE = 'The Eleven Pillars of Radical Immanence in Miss MacIntosh, My Darling, Chapter by Chapter'
AUTHOR = 'Coral Russell'
PUBLISHER = 'The Marguerite Young Society'
COVER = os.path.join(SITE, 'img', 'covers', 'wheel-and-spokes-home.jpg')
PAGES = ['radical-immanence-introduction'] + ['wheel-chapter-%02d' % n for n in range(1, 83)]
LABEL = {}


def article(p):
    h = open(os.path.join(SITE, p + '.html'), encoding='utf-8').read()
    a = h[h.index('<article id="page">') + len('<article id="page">'):h.index('</article>')]
    a = re.sub(r'<p class="pagemeta">.*?</p>\s*', '', a, flags=re.S)
    a = re.sub(r'<p class="cite">.*?</p>\s*', '', a, flags=re.S)
    a = re.sub(r'<p>[^\n]*?href="wheel-and-spokes-home\.html"[^\n]*?</p>\s*', '', a)   # previous / home / next line
    a = re.sub(r'<p><strong>Research notes:</strong>[^\n]*?</p>\s*', '', a)
    a = re.sub(r'<p>Pillar note: [^\n]*?</p>\s*', '', a)
    a = re.sub(r' (?:target|rel)="[^"]*"', '', a)
    LABEL[p] = re.sub(r'<[^>]+>', '', re.search(r'<h1>(.*?)</h1>', a).group(1)).replace('The Wheel and the Spokes: ', '')
    a = a.replace('<h1>The Wheel and the Spokes: Introduction</h1>', '<h1>Introduction</h1>', 1)
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
    a = a.replace('<h1>', '<h1 id="%s">' % p, 1)
    return a.strip()


parts = [article(p) for p in PAGES]
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
                '--toc', '--toc-depth=1', '--split-level=1', '--css', cssf, '--epub-cover-image=' + COVER,
                '--metadata', 'title=' + TITLE, '--metadata', 'subtitle=' + SUBTITLE, '--metadata', 'author=' + AUTHOR, '--metadata', 'lang=en-US',
                '--metadata', 'date=' + date, '--metadata', 'publisher=' + PUBLISHER,
                '--metadata', 'rights=© %s %s' % (year, AUTHOR), '--metadata', 'toc-title=Contents'], check=True)

# ---------- PDF ----------
cover = 'data:image/jpeg;base64,' + base64.b64encode(open(COVER, 'rb').read()).decode()
cover_page = '<section class="cover"><img src="%s" alt="Cover of %s"></section>' % (cover, html.escape(TITLE))
title_page = ('<section class="titlepage"><h1 class="booktitle">%s</h1><p class="sub">%s</p><p class="by">%s</p>'
              '<p class="small">%s<br>%s<br>Updated %s<br>© %s %s</p></section>'
              % (TITLE, SUBTITLE, AUTHOR, PUBLISHER, URL.replace('https://', ''), nice, year, AUTHOR))
pcss = ('@page{size:Letter;margin:0.8in 0.85in 0.9in 0.85in}'
        'body{font-family:Arial,"Liberation Sans",Helvetica,sans-serif;font-size:12pt;line-height:1.25;color:#000;text-align:left}'
        'h1{font-size:20pt;margin:0 0 .6em;break-before:page}h2{font-size:15pt;margin:1.2em 0 .4em;break-after:avoid}'
        'h3{font-size:13pt;margin:1em 0 .3em;break-after:avoid}p,li{margin:.35em 0}ul,ol{padding-left:1.3em}'
        'a{color:#000;text-decoration:none}p.notice{font-style:italic}hr{border:0;border-top:1px solid #999}'
        '.cover{text-align:center;height:9in}.cover img{height:9in;max-width:100%}'
        '.titlepage{text-align:center;padding-top:2.6in;break-before:page}.titlepage h1{font-size:28pt;break-before:auto}'
        '.titlepage .sub{font-size:14pt;margin-top:1em}.titlepage .by{font-size:16pt;margin-top:1.5em}.titlepage .small{font-size:11pt;margin-top:3em}'
        '.toc ul{list-style:none;padding:0}.toc li{display:flex;justify-content:space-between;margin:.3em 0}.toc a{text-decoration:underline}')
psrc = os.path.join(TMP, NAME + '-pdf.html'); pdf = os.path.join(TMP, NAME + '.pdf')
from playwright.sync_api import sync_playwright
import pypdf
nums = {p: '' for p in PAGES}
with sync_playwright() as pw:
    br = pw.chromium.launch()
    for _ in range(4):                  # render, read each section's page from the outline, repeat until the contents page numbers settle
        toc = ('<section class="toc"><h1 class="contents">Contents</h1><ul>'
               + ''.join('<li><a href="#%s">%s</a><span>%s</span></li>' % (p, html.escape(LABEL[p]), nums[p]) for p in PAGES) + '</ul></section>')
        open(psrc, 'w', encoding='utf-8').write('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>%s</title><style>%s</style></head><body>%s%s%s%s</body></html>'
                                                % (html.escape(TITLE), pcss, cover_page, title_page, toc, '\n'.join(parts)))
        pg = br.new_page(); pg.goto('file://' + psrc, timeout=0)
        pg.pdf(path=pdf, prefer_css_page_size=True, outline=True, tagged=True, display_header_footer=True,
               header_template='<span></span>',
               footer_template='<div style="font-family:Arial,sans-serif;font-size:9pt;width:100%;text-align:center;color:#000"><span class="pageNumber"></span></div>')
        pg.close()
        r = pypdf.PdfReader(pdf)
        tops = [x for x in r.outline if not isinstance(x, list)][2:]
        new = {p: str(r.get_destination_page_number(d) + 1) for p, d in zip(PAGES, tops)}
        if new == nums: break
        nums = new
    br.close()
subprocess.run(['qpdf', '--object-streams=generate', '--compress-streams=y', '--recompress-flate', '--compression-level=9',
                pdf, os.path.join(OUT, NAME + '.pdf')], check=True)
pages = len(pypdf.PdfReader(os.path.join(OUT, NAME + '.pdf')).pages)
shutil.rmtree(TMP)
print('sections:', len(PAGES), '| contents page numbers:', [nums[p] for p in PAGES], '| PDF pages:', pages)
for f in (NAME + '.epub', NAME + '.pdf'):
    print(f, os.path.getsize(os.path.join(OUT, f)))
