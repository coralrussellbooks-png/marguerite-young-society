import json,re,sys
S=sys.argv[1]; cu=json.load(open('src/curriculum.json')); n=0
for f,ch in [('ch44c',44),('ch45c',45),('ch46c',46)]:
    TOP=eval(re.search(r'TOP=(\[.*?\])\n',open(S+f+'_tail.py').read(),re.S).group(1)); ts={t for _,t in TOP}
    for i in cu['items']:
        if i['chapter']==43 and i['topic'] in ts: i['chapter']=ch; n+=1
open('src/curriculum.json','w').write(json.dumps(cu,ensure_ascii=False,indent=1)+'\n'); print('moved',n)
