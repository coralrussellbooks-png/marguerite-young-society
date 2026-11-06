"""Build the downloadable eBook (EPUB) and PDF of A Guide to Reading Miss MacIntosh, My Darling from the built guide pages."""
import os, re, subprocess, html, tempfile
ROOT = os.path.dirname(os.path.abspath(__file__)); H = os.path.join(ROOT, 'site'); OUT = os.path.join(H, 'downloads')
SITE_URL = 'https://marguerite-young-society.coralrussellbooks.workers.dev'
NAME = 'a-guide-to-reading-miss-macintosh-my-darling'
TITLE = 'A Guide to Reading Miss MacIntosh, My Darling'
files = sorted((f for f in os.listdir(H) if re.match(r'guide-\d\d-.*\.html$', f)), key=lambda f: int(f[6:8]))
def body(f):
    h = open(os.path.join(H, f), encoding='utf-8').read()
    a = h[h.index('<article id="page">') + len('<article id="page">'):h.index('</article>')]
    a = re.sub(r'<p class="pagemeta">.*?</p>\s*', '', a, flags=re.S)
    a = re.sub(r'<p>[^\n]*?href="guide-home\.html"[^\n]*?</p>\s*', '', a)      # previous / home / next line
    a = re.sub(r'<p class="cite">.*?</p>\s*', '', a, flags=re.S)
    a = re.sub(r'href="(?!https?:|#|mailto:)([^"#]+?)(?:\.html)?(#[^"]*)?"', lambda m: 'href="%s/%s%s"' % (SITE_URL, '' if m.group(1) == 'index' else m.group(1), m.group(2) or ''), a)
    a = re.sub(r' id="s-', ' id="%s-s-' % f[:8], a)
    return a
parts = [body(f) for f in files]
heads = [('Introduction' if f.startswith('guide-00') else re.search(r'<h1>(.*?)</h1>', p_).group(1)) for p_, f in zip(parts, files)]
parts = [p_.replace('<h1>', '<h1 id="%s">' % f[:8], 1) for p_, f in zip(parts, files)]
date = re.search(r'datetime="([\d-]+)"', open(os.path.join(H, 'guide-home.html'), encoding='utf-8').read()).group(1)
import datetime
nice = datetime.date.fromisoformat(date).strftime('%B %-d, %Y')
title_page = ('<h1 class="booktitle">%s</h1><p class="byline">Coral Russell</p><p class="byline">The Marguerite Young Society</p>'
              '<p class="byline">%s</p><p class="byline">Updated %s</p>') % (TITLE, SITE_URL.replace('https://', ''), nice)
css = ('body{font-family:"DejaVu Serif",Georgia,serif;font-size:11.5pt;line-height:1.5;color:#000;margin:0 6%%}'
       'h1{font-size:1.6em;margin-top:0;page-break-before:always}h1.booktitle{page-break-before:avoid;margin-top:30%%;font-size:2.2em;text-align:center}'
       '.byline{text-align:center;margin:.3em 0}ol.toc{list-style:none;padding:0}ol.toc li{margin:.15em 0}h2{font-size:1.2em;margin-top:1.4em}a{color:#1d4c69;text-decoration:none}')
toc = '<h1 class="contents">Contents</h1><ol class="toc">' + ''.join('<li><a href="#%s">%s</a></li>' % (f[:8], h_) for f, h_ in zip(files, heads)) + '</ol>'
doc = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>%s</title><style>%s</style></head><body>%s%s</body></html>'
       % (html.escape(TITLE), css, title_page + toc, '\n'.join(parts)))
os.makedirs(OUT, exist_ok=True)
TMP = tempfile.mkdtemp()
src = os.path.join(TMP, NAME + '.html')
open(src, 'w', encoding='utf-8').write(doc)
epub_body = '\n'.join(parts)
eb = os.path.join(TMP, NAME + '-epub.html'); open(eb, 'w', encoding='utf-8').write('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>%s</title></head><body>%s</body></html>' % (html.escape(TITLE), epub_body))
subprocess.run(['pandoc', eb, '-f', 'html', '-o', os.path.join(OUT, NAME + '.epub'), '--toc', '--toc-depth=1', '--split-level=1',
                '--metadata', 'title=' + TITLE, '--metadata', 'author=Coral Russell', '--metadata', 'lang=en-US', '--metadata', 'date=' + date,
                '--metadata', 'publisher=The Marguerite Young Society', '--epub-cover-image=' + os.path.join(H, 'icon-512.png')], check=True)
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page()
    pg.goto('file://' + src); pg.pdf(path=os.path.join(OUT, NAME + '.pdf'), format='Letter', print_background=False,
        margin={'top': '18mm', 'bottom': '18mm', 'left': '18mm', 'right': '18mm'}, display_header_footer=True,
        header_template='<span></span>', footer_template='<div style="font-size:8pt;width:100%;text-align:center;color:#444"><span class="pageNumber"></span></div>')
    br.close()
print(len(files), 'guide pages ->', [(f, os.path.getsize(os.path.join(OUT, f))) for f in sorted(os.listdir(OUT))])
