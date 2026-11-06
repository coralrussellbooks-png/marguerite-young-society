import json,re,sys
d=json.load(open('site/data/chapters.json'));c=json.load(open('site/data/concepts.json'))
A={**d,**c}
pat=sys.argv[1]; w=int(sys.argv[2]) if len(sys.argv)>2 else 250
seen=set()
for k,h in A.items():
    t=re.sub(r'<[^>]+>','',h)
    for m in re.finditer(pat,t,re.I):
        s=t[max(0,m.start()-w):m.end()+w].replace('\n',' ')
        sig=s[w-40:w+40]
        if sig in seen: continue
        seen.add(sig); print(k,'::',s);print()
