import json,re,sys
d=json.load(open('site/data/chapters.json'))
for n in sys.argv[1:]:
    h=d['chapter-%02d'%int(n)]; out=[]
    t=re.sub(r'<[^>]+>',' ',h)
    for name,rx in [('double space',r'\S  \S'),('dash',r'[—–]'),('straight quote',r'["\']'),('punct outside quote',r'”[.,]'),('vs.',r'\bvs\.'),('repeated word',r'\b(\w+) \1\b'),('space before punct',r'\w [.,;:](?!\d)')]:
        for m in re.finditer(rx,re.sub(r'<[^>]+>','',h) if name!='double space' else re.sub(r'<[^>]+>','',h)):
            s=re.sub(r'<[^>]+>','',h); out.append((name,s[max(0,m.start()-40):m.end()+40].replace('\n',' ')))
    for li in re.findall(r'<li>(.*?)</li>',h,re.S):
        x=re.sub(r'<[^>]+>','',li).strip()
        if not x: out.append(('empty bullet',''))
        elif '\n' not in li and not re.search(r'[.?!”)]$',x): out.append(('no end punctuation',x[-60:]))
    r=re.sub(r'“[^”]*”','',re.sub(r'<[^>]+>','',h[h.find('<h2>Research: Resources'):]))
    for m in re.finditer(r'(?<!Charles )(?<!Charles I, )(?<!War )(?<!Seleucus )(?<!Attalus )\b(I|me|my|myself)\b(?! Don)(?! Nicator)',r): out.append(('first person',r[max(0,m.start()-40):m.end()+30]))
    print('Chapter',n,':',len(out),'issues')
    for o in out: print('  ',o[0],'::',o[1])
