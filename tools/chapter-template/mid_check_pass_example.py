def K(k): return L(k,re.search(r'<h1>(.*?)</h1>',c[k]).group(1))
k_=dict(AW='american-writers',SH='shakespeare',GM='greek-mythology',PE='peron-spitzer',BM='butterflies-and-moths',AE='ancient-egypt',RP='romantic-poets',BI='the-bible',CL='clothing-hats-and-skirts',HC='horses-and-carriages')
for a,b in k_.items(): globals()[a]=K(b)
rp('<li>Idealism - The paragraph suggests','<li>Idealism: The paragraph suggests')
NEW=[('times when bells rang under water','Dunwich, once a great port on the Suffolk coast, was swallowed by the sea church by church, and legend says its bells can still be heard ringing beneath the waves.'),
('the gambler had become the celestial musician','The gambler is Peron and the musician Joachim; see Peron Spitzer.'+see(PE)),
('more hieroglyphs to the alphabet of reality','Egyptian hieroglyphs could not be read until Jean-François Champollion deciphered them from the Rosetta Stone in 1822.'+see(AE)),
('glimmering hedgerow of stars all must jump','See the steeplechase in the '+C(46)+'.'+see(HC)),
('the very king of castaways wearing a paper crown','“I was lord of the whole manor; or if I pleased, I might call myself king or emperor over the whole country which I had possession of” (Daniel Defoe, Robinson Crusoe, 1719).'),
('an almost weightless grain of musk','Musk is so lasting a scent that the Empress Josephine’s rooms at Malmaison were said to smell of it long after her death.'),
('the trumpeter or the trumpeter’s cry','“O body swayed to music, O brightening glance, / How can we know the dancer from the dance?” (W. B. Yeats, “Among School Children,” 1928).'),
('great Apennines of waves','See the Apennines in the '+C(33)+'.'),
('a left-handed portrait painter','Leonardo da Vinci was left-handed, and left-handedness was long suspect: the Latin for left is sinister.'),
('the lily’s spittle','The froth on plant stems, cuckoo spit, is made by the young of the spittlebug, which hides inside it.'),
('drawers of his dead brother’s butterfly correspondence','See Peron’s butterflies in the '+C(29)+'.'+see(BM)),
('The old waiter at the oyster bar','Boston’s Union Oyster House, serving oysters since 1826, is the city’s oldest restaurant.'),
('had even tipped his hat surreptitiously to a stranger where there was no one','“Yesterday, upon the stair, / I met a man who wasn’t there” (Hughes Mearns, “Antigonish,” written 1899).'+see(AW)),
('His cape had gonged','The passing bell was rung to mark a death; see Donne’s “for whom the bell tolls” in the '+C(49)+'.'),
('What Mona Lisa had he seen','The Mona Lisa was stolen from the Louvre in August 1911 and recovered in Florence in December 1913.'),
('It was not the arrow of Cupid','See Cupid’s gold and lead arrows in the '+C(48)+'.'+see(GM)),
('most believed she was its father, particularly as the antlers had sprouted from her brow','Reindeer are the only deer in which the females also grow antlers, so the antlers prove nothing about the father.')]
a=h.index('<h2>Research: Resources</h2>\n<ul>\n')+len('<h2>Research: Resources</h2>\n<ul>\n'); b=h.index('\n</ul>\n<h2>Vocabulary',a)
items=[]; cur=None; depth=0
for line in h[a:b].split('\n'):
    if depth==0 and line.startswith('<li>“'):
        if cur is not None: items.append(cur)
        cur=line
    else: cur+='\n'+line
    depth+=line.count('<ul>')-line.count('</ul>')
items.append(cur); assert len(items)==73,len(items)
T=open(S+'c51.txt').read(); T=re.sub(r'-\n\s*','-',T); T=re.sub(r'\s+',' ',T).replace('’',"'").lower()
pos=lambda k:T.find(k.replace('’',"'").lower())
allit=[(re.match(r'<li>“([^”]+)”',x).group(1),x) for x in items]+[(k,'<li>“%s”: %s</li>'%(k,b_)) for k,b_ in NEW]
for k,_ in allit: assert pos(k)>=0,k
allit.sort(key=lambda e:pos(e[0]))
h=h[:a]+'\n'.join(x for _,x in allit)+h[b:]
E=allit
h=curl_html(h)
text=''.join(open(f'{S}book/{f}.txt',encoding='utf-8').read()+'\n' for f in ['b1','b2','b3','b4'])
P=re.split(r'^\s*CHAPTER (\d+)\s*$',text,flags=re.M)
chap={int(P[k]):re.sub(r'\s+',' ',re.sub(r'-\n\s*','-',P[k+1])).replace('’',"'").lower() for k in range(1,len(P),2)}
def chs(pt):
    rx=re.compile(r'(?<![a-z])(?:'+pt+r')(?![a-z])'); return [n for n in range(1,83) if rx.search(chap[n])]
have={w['word'].lower() for w in dj['words']}
va=h.index('<h2>Vocabulary</h2>\n<dl class="gloss">\n')+len('<h2>Vocabulary</h2>\n<dl class="gloss">\n'); vb=h.index('\n</dl>',va)
rows=re.findall(r'<dt>(.*?)</dt><dd>(.*?)</dd>',h[va:vb])
VV=[('Warp','The lengthwise threads on a loom, crossed by the woof.','warp')]
for w,df,pt in VV:
    cc=chs(pt); assert 51 in cc and w.lower() not in have,(w,cc)
    dj['words'].append({'word':w,'definition':df,'chapters':cc,'defined_in':51,'pattern':pt}); rows.append((w,df))
rows.sort(key=lambda x:x[0].replace('’','').replace('é','e').lower())
h=h[:va]+'\n'.join('<dt>%s</dt><dd>%s</dd>'%r for r in rows)+h[vb:]
