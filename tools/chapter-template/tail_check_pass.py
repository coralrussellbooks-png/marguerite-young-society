ci=h.index('<h2>Concepts present</h2>'); ce=h.index('<h2',ci+5)
ps=re.findall(r'<p><strong>([^<]+):</strong>.*?</p>',h[ci:ce]); full=re.findall(r'<p><strong>[^<]+:</strong>.*?</p>',h[ci:ce])
order=['Characters','Themes','Symbols','Philosophy','Allusions']; full=[x for _,x in sorted(zip(ps,full),key=lambda t:order.index(t[0]))]
full=[x for x in full if not x.startswith('<p><strong>Characters:')]
h=h[:ci]+'<h2>Concepts present</h2>\n'+'\n'.join(full)+'\n'+h[ce:]
d['chapter-51']=h
open(cp,'w').write(json.dumps(d,ensure_ascii=False)); open(kp,'w').write(json.dumps(c,ensure_ascii=False,separators=(',',':')))

json.dump(dj,open(dp,'w',encoding='utf-8'),ensure_ascii=False,indent=1); open(dp,'a').write('\n')
cu=json.load(open('src/curriculum.json'))
TOP=[('history', 'The drowned bells of Dunwich'), ('history', 'Champollion and the Rosetta Stone'), ('literature', 'Robinson Crusoe, king of his island'), ('history', 'Josephine’s musk at Malmaison'), ('literature', 'Yeats: the dancer and the dance'), ('history', 'Left-handedness and the sinister'), ('astronomy-and-natural-science', 'Spittlebugs and cuckoo spit'), ('american-history-and-life', 'The Union Oyster House'), ('literature', 'Mearns: “Antigonish”'), ('history', 'The passing bell'), ('history', 'The theft of the Mona Lisa'), ('astronomy-and-natural-science', 'Antlered female reindeer')]
have={(i['chapter'],i['topic']) for i in cu['items']}; n=0
for s_,t in TOP:
    assert s_ in {x['id'] for x in cu['subjects']},s_
    if (51,t) not in have: cu['items'].append({'subject':s_,'chapter':51,'topic':t}); n+=1
open('src/curriculum.json','w').write(json.dumps(cu,ensure_ascii=False,indent=1)+'\n'); print(n,'topics',len(E),'resources',len(rows),'vocab')
