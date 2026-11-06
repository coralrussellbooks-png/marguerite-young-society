import os
import json,re
S=os.environ.get('MYS_WORK','work/')
cp='site/data/chapters.json'; kp='site/data/concepts.json'; dp='src/dictionary.json'
d=json.load(open(cp)); c=json.load(open(kp)); dj=json.load(open(dp)); h=d['chapter-51']
def curl(text):
    text=re.sub(r'(^|[\s(\[—-])"', r'\1“', text); text=text.replace('"','”')
    text=re.sub(r"(\w)'(\w)", r'\1’\2', text); text=re.sub(r"(^|[\s(\[])'", r'\1‘', text)
    return text.replace("'",'’')
def curl_html(s): return ''.join(p if p.startswith('<') else curl(p) for p in re.split(r'(<[^>]+>)',s))
def rp(a,b):
    global h
    assert h.count(a)==1,(a[:70],h.count(a)); h=h.replace(a,b)
def L(p,t): return '<a href="#%s">%s</a>'%(p,t)
C=lambda n:L('chapter-%02d--research-resources'%n,'Chapter %d resources'%n)
def see(*a):
    a=[x if not x.startswith('<a href="#chapter-') else 'the '+x for x in a]
    return ' See '+(', '.join(a[:-1])+(', and ' if len(a)>2 else ' and ') if len(a)>1 else '')+a[-1]+'.'
