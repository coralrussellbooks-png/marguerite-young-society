# Helps AI search tools (ChatGPT, Perplexity, Claude, Gemini, Google AI Overviews) understand and cite the site.
# build.py uses this file for: page titles that name the book, the line under each page heading, the
# "cite this page" line, the structured data, robots.txt and llms.txt.
import html, json, re, hashlib, datetime, os

NOVEL_NAME = 'Miss MacIntosh, My Darling'
AUTHOR = 'Coral Russell'
AUTHOR_URL = 'https://coralrussell.substack.com/'

# ---------- page titles ----------
def expand(s):
    return s.replace('MMMD', NOVEL_NAME)

# what each section is, in a few words, for titles of chapter pages ("Chapter 4 of Miss MacIntosh, My Darling: Comedy")
TOPIC = {
    'Christianity and Religion in MMMD': 'Christianity and Religion',
    'Comedy in MMMD': 'Comedy',
    "Woman in Young's Magnum Opus": 'Woman in the Novel',
    'To All My Darlings': 'To All My Darlings',
    'The Wheel and the Spokes': 'The Wheel and the Spokes',
    'Life, Love, and Truth That Doesn’t Fail': 'Life, Love, and Truth',
}
NOVEL_FILES = {'chapters', 'concepts', 'guide', 'curious', 'architecture', 'pillars', 'wheel', 'references', 'refindex',
               'essays', 'hubs', 'llt', 'masterclass', 'woman'}
BARE = re.compile(r'(Chapters? \d+( to \d+)?|Introduction|Epilogue|Preface)$')

def names_subject(t):
    return bool(re.search(r'MacIntosh|MMMD|Marguerite|Young', t))

def seo_titles(P):
    """One title per page for the <title> tag, social cards and schema. The heading on the page is unchanged."""
    out = {}
    book_title = {}
    for pid, (title, label, f) in P.items():
        mm = re.match(r'([a-z]+-\d\d)-[a-z]', pid)
        if mm and not re.match(r'[a-z]+-\d\d-\d', pid): book_title[mm.group(1)] = title.split(':')[0]
    for pid, (title, label, f) in P.items():
        t = expand(title)
        if BARE.match(title) and label in TOPIC:
            t = title + ' of ' + NOVEL_NAME + ': ' + TOPIC[label]
        elif not names_subject(title):
            if f in NOVEL_FILES or 'MMMD' in label:
                t = t + ' · ' + NOVEL_NAME
            elif label != 'The Marguerite Young Society':
                t = t + ' · ' + expand(label)
        out[pid] = t
    # anything still shared gets its book (for workbooks) or its section name
    from collections import Counter
    seen = Counter(out.values())
    for pid, t in list(out.items()):
        if seen[t] > 1:
            mm = re.match(r'([a-z]+-\d\d)-\d', pid)
            extra = book_title.get(mm.group(1)) if mm else None
            if not extra or extra in t: extra = expand(P[pid][1])
            if extra in t: extra = 'Introduction' if pid.endswith('introduction') else 'Overview'
            out[pid] = t + ' (' + extra + ')'
    return out

# ---------- the line under each page heading ----------
WORK_SECTIONS = {
    'Angel in the Forest': ('Angel in the Forest', ' (1945), Marguerite Young’s history of the two failed utopias at New Harmony, Indiana'),
    'Harp Song for a Radical': ('Harp Song for a Radical', ' (1999), Marguerite Young’s life of Eugene Victor Debs'),
    'Exploring Young\'s Poetry': ('The Collected Poems of Marguerite Young', ' (2022)'),
    'Inviting the Muses': ('Inviting the Muses', ' (1994), Marguerite Young’s stories, essays and reviews'),
    'Marguerite Young, Our Darling': ('Marguerite Young, Our Darling', ' (1994), a book of tributes and essays about her'),
}
RI_FILES = {'ri'}
PSYCH_FILES = {'psych': 'the psychology', 'politics': 'the politics'}

def context_line(pid, title, label, f, hub_href):
    name = html.escape(expand(label))
    sec = '<a href="%s">%s</a>' % (html.escape(hub_href), name) if hub_href else name
    ch = re.match(r'Chapters? (\d+)( to (\d+))?$', title) or re.search(r'\(Ch (\d+)\)', title) or re.match(r'Chapter (\d+):', title)
    novel = '<cite>' + NOVEL_NAME + '</cite>'
    if label in WORK_SECTIONS:
        w, rest = WORK_SECTIONS[label]
        if label == w:
            wl = '<a href="%s">%s</a>' % (html.escape(hub_href), html.escape(w)) if hub_href else html.escape(w)
            return 'Part of a reading of <cite>%s</cite>%s.' % (wl, rest)
        return 'Part of %s, a reading of <cite>%s</cite>%s.' % (sec, w, rest)
    if label == "Young's Interviews Analyzed":
        return 'Part of %s, a study of what Marguerite Young (1908 to 1995) said in interviews about her work and life.' % sec
    if f in PSYCH_FILES:
        return 'Part of %s, on %s in the work of Marguerite Young (1908 to 1995).' % (sec, PSYCH_FILES[f])
    if f in RI_FILES or label in ('The Eleven Pillars', 'A Course in Radical Immanence'):
        return 'Part of %s, on Radical Immanence, the philosophy Coral Russell draws from the work of Marguerite Young (1908 to 1995).' % sec
    if f in NOVEL_FILES or 'MMMD' in label or f == 'nav':
        if ch and f != 'nav':
            n = ch.group(1) if not (ch.lastindex and ch.lastindex >= 3 and ch.group(3)) else ch.group(1) + ' to ' + ch.group(3)
            return 'On Chapter%s %s of Marguerite Young’s novel %s (1965). Part of %s.' % ('s' if ' to ' in n else '', n, novel, sec)
        return 'Part of %s, a study of Marguerite Young’s novel %s (1965).' % (sec, novel)
    return 'From The Marguerite Young Society, a free companion to the life and work of Marguerite Young (1908 to 1995).'

def pretty_date(iso):
    d = datetime.date.fromisoformat(iso)
    return d.strftime('%B ') + str(d.day) + d.strftime(', %Y')

def page_meta(ctx, iso):
    return ('<p class="pagemeta">' + ctx + '<br><span>By ' + AUTHOR + ' · Updated <time datetime="' + iso + '">' +
            pretty_date(iso) + '</time></span></p>')

def cite_line(title, url, iso):
    return ('<p class="cite">Cite this page: Russell, Coral. “' + html.escape(title) + '.” <cite>The Marguerite Young Society</cite>, updated ' +
            pretty_date(iso) + '. <a href="' + html.escape(url) + '">' + html.escape(url) + '</a></p>')

def add_after_h1(content, block):
    i = content.find('</h1>')
    return content[:i + 5] + block + content[i + 5:] if i != -1 else block + content

# ---------- last updated dates ----------
# src/updated.json keeps a fingerprint of each page's text and the date it last changed.
class Dates:
    def __init__(self, path):
        self.path = path
        try: self.d = json.load(open(path))
        except (OSError, ValueError): self.d = {}
        self.today = datetime.date.today().isoformat()
    def get(self, pid, raw):
        h = hashlib.sha1(raw.encode('utf-8')).hexdigest()[:16]
        old = self.d.get(pid)
        if not old or old[0] != h: self.d[pid] = [h, self.today]
        return self.d[pid][1]
    def save(self):
        with open(self.path, 'w') as fh: json.dump(self.d, fh, indent=0, sort_keys=True)

# ---------- structured data ----------
def org(site, url): return {"@type": "Organization", "@id": url + "/#org", "name": site, "url": url + "/",
                            "founder": {"@id": url + "/#coral-russell"}, "sameAs": [AUTHOR_URL]}
def author(url): return {"@type": "Person", "@id": url + "/#coral-russell", "name": AUTHOR, "url": AUTHOR_URL,
                         "description": "Retired ESOL and writing teacher with a Master's in Education; author of Radical Immanence and writer of The Marguerite Young Society on Substack.",
                         "knowsAbout": ["Marguerite Young", NOVEL_NAME, "Radical Immanence"]}
def young(url): return {"@type": "Person", "@id": url + "/#marguerite-young", "name": "Marguerite Young", "birthDate": "1908", "deathDate": "1995",
                        "birthPlace": {"@type": "Place", "name": "Indianapolis, Indiana"}, "nationality": "American",
                        "jobTitle": "Novelist, historian and poet", "image": url + "/img/young-portrait.jpg",
                        "description": "American novelist, historian and poet, author of Miss MacIntosh, My Darling (1965) and Angel in the Forest (1945).",
                        "alumniOf": [{"@type": "CollegeOrUniversity", "name": "Butler University"}, {"@type": "CollegeOrUniversity", "name": "University of Chicago"}],
                        "award": "Guggenheim Fellowship", "sameAs": ["https://en.wikipedia.org/wiki/Marguerite_Young"]}

def books(url):
    Y = {"@id": url + "/#marguerite-young"}
    def b(pid, name, year, **kw):
        d = {"@type": "Book", "@id": url + "/" + pid + "#book", "name": name, "author": Y, "datePublished": year, "url": url + "/" + pid}
        d.update(kw); return d
    return [
        b('miss-macintosh-my-darling', NOVEL_NAME, '1965', genre='Novel', publisher="Charles Scribner's Sons", numberOfPages=1198,
          offers={"@type": "Offer", "url": "https://dalkeyarchive.store/products/miss-macintosh-my-darling", "seller": "Dalkey Archive Press"}),
        b('angel-in-the-forest', 'Angel in the Forest: A Fairy Tale of Two Utopias', '1945', about='The utopian communities of New Harmony, Indiana',
          offers={"@type": "Offer", "url": "https://dalkeyarchive.store/products/angel-in-the-forest", "seller": "Dalkey Archive Press"}),
        b('harp-song-for-a-radical', 'Harp Song for a Radical: The Life and Times of Eugene Victor Debs', '1999', publisher='Knopf',
          editor={"@type": "Person", "name": "Charles Ruas"}),
        b('inviting-the-muses', 'Inviting the Muses: Stories, Essays, Reviews', '1994'),
        b('the-collected-poems-of-marguerite-young', 'The Collected Poems of Marguerite Young', '2022',
          editor=[{"@type": "Person", "name": n} for n in ('Phil Bevis', 'Joshua Rothes', 'Jacob Siefring')],
          offers={"@type": "Offer", "url": "https://www.chatwinbooks.com/shop/p/the-collected-poems-of-marguerite-young", "seller": "Chatwin Books"}),
    ]

def faq_pairs(raw):
    """Reads the visible FAQ section on the home page, so the structured data always matches what readers see."""
    m = re.search(r'<section class="faq"[^>]*>(.*?)</section>', raw, re.S)
    if not m: return []
    pairs = re.findall(r'<h3[^>]*>(.*?)</h3>\s*<p>(.*?)</p>', m.group(1), re.S)
    clean = lambda s: re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', s))).strip()
    return [(clean(q), clean(a)) for q, a in pairs]

def home_ld(site, url, desc, raw):
    g = [{"@type": "WebSite", "@id": url + "/#website", "url": url + "/", "name": site, "description": desc, "inLanguage": "en",
          "publisher": {"@id": url + "/#org"}, "about": {"@id": url + "/#marguerite-young"}},
         org(site, url), author(url), young(url)] + books(url)
    qa = faq_pairs(raw)
    if qa:
        g.append({"@type": "FAQPage", "@id": url + "/#faq", "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in qa]})
    return {"@context": "https://schema.org", "@graph": g}

def page_ld(site, url, page_url, title, desc, img, crumb, iso, book_pid=None):
    d = {"@context": "https://schema.org", "@type": "Article", "headline": title[:110], "description": desc, "image": img,
         "url": page_url, "mainEntityOfPage": page_url, "inLanguage": "en", "articleSection": expand(crumb), "dateModified": iso,
         "isPartOf": {"@type": "WebSite", "@id": url + "/#website", "name": site, "url": url + "/"},
         "about": {"@type": "Person", "@id": url + "/#marguerite-young", "name": "Marguerite Young", "sameAs": "https://en.wikipedia.org/wiki/Marguerite_Young"},
         "author": {"@type": "Person", "@id": url + "/#coral-russell", "name": AUTHOR, "url": AUTHOR_URL},
         "publisher": {"@type": "Organization", "@id": url + "/#org", "name": site, "url": url + "/"}}
    if book_pid: d["mentions"] = {"@type": "Book", "@id": url + "/" + book_pid + "#book", "name": NOVEL_NAME}
    return d

# ---------- robots.txt and llms.txt ----------
AI_BOTS = ['OAI-SearchBot', 'ChatGPT-User', 'GPTBot', 'Claude-SearchBot', 'Claude-User', 'ClaudeBot', 'PerplexityBot',
           'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'Bingbot', 'CCBot']

def robots(url):
    s = '# The Marguerite Young Society is open to search engines and AI answer engines.\nUser-agent: *\nAllow: /\n\n'
    s += ''.join('User-agent: %s\nAllow: /\n\n' % b for b in AI_BOTS)
    return s + 'Sitemap: ' + url + '/sitemap.xml\n'

def llms(url, P, root):
    t = open(os.path.join(root, 'src', 'llms.txt')).read()
    for pid in re.findall(r'\{URL\}/([a-z0-9-]+)\)', t):
        if pid not in P and pid != 'all-pages': raise SystemExit('llms.txt links to a page that does not exist: ' + pid)
    return t.replace('{URL}', url)
