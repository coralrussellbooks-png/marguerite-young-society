# concept pages: rebuild all chapter 19 blocks
hm=d['home']
def setmember(k,on):
    global hm
    v=c[k]; m2=re.search(r'(<strong>In the research:</strong> )(.*?)(</p>)',v)
    ls=set(re.findall(r'<a href="#chapter-(\d+)">Chapter \d+</a>',m2.group(2)))
    if ('51' in ls)==on: return
    old=len(ls); (ls.add if on else ls.discard)('51'); ls=sorted(ls,key=int); n=len(ls)
    c[k]=v.replace(m2.group(0),m2.group(1)+', '.join('<a href="#chapter-%s">Chapter %d</a>'%(x,int(x)) for x in ls)+m2.group(3))
    lm=re.search(r'<li><a href="#%s">[^<]+</a> \((\d+) chapters?\)</li>\n'%k,hm)
    if not lm: print('no home entry',k); return
    if int(lm.group(1))!=old: print('home mismatch kept',k,lm.group(1),old); return
    hm=hm.replace(lm.group(0),''); newli=re.sub(r'\(\d+ chapters?\)','(%d chapter%s)'%(n,'' if n==1 else 's'),lm.group(0))
    s0=hm.rfind('<ul>',0,lm.start()); e0=hm.index('</ul>',s0); p=e0
    for mm in re.finditer(r'<li>.*?\((\d+) chapters?\)</li>\n',hm[s0:e0]):
        if int(mm.group(1))<n: p=s0+mm.start(); break
    hm=hm[:p]+newli+hm[p:]; print('count',k,old,'->',n)
for k in c:
    if k=='opium': continue
    c[k]=re.sub(r'<h3><a href="#chapter-51">Chapter 51</a>[^<]*</h3>\n(?:<p><em>Listed as[^<]*</em></p>\n)?<ul>\n.*?</ul>\n','',c[k],flags=re.S)
blocks={}
plain={}; listed={}
ca=h.index('<h2>Research: Characters</h2>'); cb=h.index('<h2>',ca+5)
for m in re.finditer(r'<h3><a href="#([^"]+)">([^<]+)</a></h3>\n<ul>\n(.*?)</ul>',h[ca:cb],re.S):
    k,t,sec=m.groups()
    if k not in c: continue
    plain[k]=re.findall(r'<li>(.*?)</li>',sec,re.S)
    if t!=re.search(r'<h1>(.*?)</h1>',c[k]).group(1): listed[k]=t
strip=lambda t:re.sub(r' See (the )?<a .*$','',t)
a=h.index('<h2>Research: Resources</h2>'); b=h.index('<h2>Vocabulary</h2>')
for li_ in re.findall(r'<li>(.*?)(?=</li>|\n<ul>)',h[a:b]):
    for k in dict.fromkeys(t for t in re.findall(r'href="#([^"]+)"',li_) if t in c):
        plain.setdefault(k,[]).append(strip(li_))
for k,lis in plain.items():
    blocks.setdefault(k,[]).append('<h3><a href="#chapter-51">Chapter 51</a></h3>\n'+('<p><em>Listed as: %s</em></p>\n'%listed[k] if k in listed else '')+'<ul>\n'+''.join('<li>%s</li>\n'%x for x in lis)+'</ul>\n')
for m in re.finditer(r'<h3>([^<]+)</h3>\n<p><em>See:</em> (.*?)</p>\n<ul>\n(.*?)</ul>',h,re.S):
    title,links,body=m.groups()
    for k in re.findall(r'href="#([^"]+)"',links):
        if k in c: blocks.setdefault(k,[]).append('<h3><a href="#chapter-51">Chapter 51</a> · %s</h3>\n<ul>\n'%title+body+'</ul>\n')
for k in c:
    on=k in blocks; setmember(k,on)
    if not on: continue
    v=c[k]; hs=[mm.start() for mm in re.finditer(r'<h3><a href="#chapter-(\d+)"',v) if int(mm.group(1))>51]
    i=hs[0] if hs else (v.index('<h2>Related concepts</h2>') if '<h2>Related concepts</h2>' in v else len(v))
    c[k]=v[:i]+''.join(blocks[k])+v[i:]
d['home']=hm
# concepts present
chars=set(re.findall(r'href="#([^"]+)"',re.search(r'<h2>Characters present</h2>.*?</p>',h,re.S).group(0)))
ci=h.index('<h2>Concepts present</h2>'); ce=h.index('<h2',ci+5)
linked=sorted(k for k in blocks if k not in chars)
cats={}
for k in linked:
    i=hm.find('href="#%s"'%k); cat=re.findall(r'<h2[^>]*>(.*?)</h2>',hm[:i])[-1]; title=re.search(r'href="#%s">([^<]+)<'%k,hm).group(1)
    cats.setdefault(cat,[]).append(L(k,title))
order=[x for x in re.findall(r'<p><strong>([^<]+):</strong>',h[ci:ce])]
for x in cats:
    if x not in order: order.append(x)
print('categories',order)
old=set(re.findall(r'href="#([^"]+)"',h[ci:ce])); print('removed from concepts present:',old-set(linked)); print('added:',set(linked)-old)
newcp='<h2>Concepts present</h2>\n'+'\n'.join('<p><strong>%s:</strong> %s</p>'%(x,' · '.join(sorted(cats[x],key=lambda y:re.sub('<[^>]+>','',y).replace('’','').lower()))) for x in order if x in cats)+'\n'
h=h[:ci]+newcp+h[ce:]
