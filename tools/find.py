import os
import re,sys
t=open(os.environ.get('MYS_WORK','work/')+'book/all.txt').read()
t=re.sub(r'\s+',' ',t)
marks=[(m.start(),int(m.group(1))) for m in re.finditer(r'CHAPTER (\d+)',t)]
def ch(p):
    c=0
    for s,n in marks:
        if s<=p:c=n
    return c
n=int(sys.argv[2]) if len(sys.argv)>2 else 5
w=int(sys.argv[3]) if len(sys.argv)>3 else 120
for k in sys.argv[1].split('|'):
    ms=list(re.finditer(k,t,re.I))
    print('##',k,len(ms),sorted(set(ch(m.start()) for m in ms)))
    for m in ms[:n]: print('  [%d]'%ch(m.start()),t[max(0,m.start()-w):m.end()+w])
