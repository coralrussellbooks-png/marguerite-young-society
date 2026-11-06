"""Check that quotations on chapter pages are exact quotations from the novel.

Usage: python3 tools/quotecheck.py [N ...]   (no numbers = every chapter)

Every passage in curly quotation marks of five words or more is looked up in
the novel text ($MYS_WORK/book/all.txt). A quotation is skipped when a citation
in parentheses follows it (Bible, Shakespeare, interviews, other books), since
those quote other sources. Passages broken by ellipses are checked piece by
piece. Anything not found is printed: it is either a misquotation, a paraphrase
dressed as a quotation, or a quotation from another source that needs a citation.
"""
import json, os, re, sys

W = os.environ.get('MYS_WORK', 'work').rstrip('/') + '/'
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def norm(s):
    s = re.sub(r'-\s*\n\s*', '-', s)
    s = s.replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"')
    s = re.sub(r'[—–-]+', ' ', s)
    s = re.sub(r"[^a-z0-9' ]+", ' ', s.lower())
    return re.sub(r'\s+', ' ', s).strip()


def main():
    book = norm(open(W + 'book/all.txt', encoding='utf-8').read())
    d = json.load(open(os.path.join(ROOT, 'site/data/chapters.json')))
    want = [int(x) for x in sys.argv[1:]] or range(1, 83)
    total = 0
    for n in want:
        h = d.get('chapter-%02d' % n)
        if not h:
            continue
        t = re.sub(r'<[^>]+>', '', h)
        bad = []
        for m in re.finditer(r'“([^”]{10,}?)”', t):
            q = m.group(1)
            after = t[m.end():m.end() + 4]
            if re.match(r'\s*[.,;:]?\s*\(', after):
                continue  # cited to another source
            parts = [norm(p) for p in re.split(r'\.\s?\.\s?\.|…|\[[^\]]*\]', q)]
            parts = [p for p in parts if len(p.split()) >= 5]
            miss = [p for p in parts if p not in book]
            if miss:
                bad.append(q)
        if bad:
            total += len(bad)
            print('Chapter %d: %d' % (n, len(bad)))
            for q in bad:
                print('   “%s”' % (q if len(q) < 160 else q[:157] + '...'))
    print('total not found:', total)


if __name__ == '__main__':
    main()
