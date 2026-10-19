/* All the Darlings: draws the interactive character map wherever the page has an element with id atd-map. */
(function(){
function init(){
if(!document.getElementById('atd-map')||document.getElementById('atd-map').dataset.ready)return;
document.getElementById('atd-map').dataset.ready='1';

const BASE='character-hub-';
const R=s=>s.split(',').flatMap(p=>{const[a,b]=p.split('-').map(Number);return b?Array.from({length:b-a+1},(_,i)=>a+i):[a]});
/* [name, short label, side, chapters, hub slug] */
const D=[
 ['Catherine Cartwheel','Catherine','L','1,2,4,5,6,10-14,16,22,24-26,28-47,49-54,59,61-64,66,70,82','catherine-cartwheel'],
 ['Miss MacIntosh','Miss MacIntosh','L','1,3,4,9-23,63-66,68,70,82','miss-macintosh'],
 ['Joachim Spitzer','Mr. Spitzer','L','2,3,9,14,25-29,31,36,42-62,66,82','joachim-spitzer'],
 ['Peron Spitzer','Peron','L','2,10,14,25-29,31,37,41,44,48,51,53-60,78,82','peron-spitzer'],
 ['Cousin Hannah','Cousin Hannah','L','30-47,52','cousin-hannah'],
 ['The Black Coachman','Black coachman','L','14,33,40,42,51,53,55,59,62,63,66,82','the-black-coachman'],
 ['Mr. Chandelier','Mr. Chandelier','L','12,14,22,25,27,29,34,36,43,49,51,52,64','mr-chandelier'],
 ['Mr. Res Tacamah','Res Tacamah','L','2,11,14,22,39,64,70','mr-res-tacamah'],
 ['The Sea-House Servants','Servants','L','2,9,12,14,24,41,42,63,70','the-sea-house-servants'],
 ['James the Chauffeur','James','L','2,70,71','james-the-chauffeur'],
 ['Jock Cartwheel','Jock','L','2,30,33','jock-cartwheel'],
 ['Wellington, the Old Valet','Wellington','L','24,30,54','wellington-the-old-valet'],
 ['Vera’s Grandparents','Grandparents','L','2,6,12,14,15,19','veras-grandparents'],
 ['The Head-Hunter','Head-hunter','L','3,65,66','the-head-hunter'],
 ['The Old Clam Digger','Clam digger','L','3,14,25,53,82','the-old-clam-digger'],
 ['Solomon the Turtle','Solomon','L','9,10,16,20,64','solomon-the-turtle'],
 ['Friday (the Old Blind Sheep Dog)','Friday','L','15,18,21,22,64,66,82','friday'],
 ['Falada','Falada','L','16-18','falada'],
 ['The Canary','Canary','L','1,2,4,10,22,29,31,39,49,54,65,69','the-canary'],
 ['Martha the Passenger Pigeon','Martha','L','45,49,51','martha-the-passenger-pigeon'],
 ['The Pack Rat','Pack rat','L','48,62','the-pack-rat'],
 ['The Old Horn-Blower','Horn-blower','L','51,59,62','the-old-horn-blower'],
 ['Lorena','Lorena','L','64-66','lorena'],
 ['Richard MacIntosh','Richard MacIntosh','L','22,65','richard-macintosh'],
 ['The Arctic Explorer','Arctic explorer','L','65,66','the-arctic-explorer'],
 ['The Egyptian Sailor','Egyptian','L','2','the-egyptian-sailor'],
 ['The Preacher','Preacher','L','10','the-preacher'],
 ['The Phantom Lover','Phantom lover','L','18','the-phantom-lover'],
 ['Cousin Wilbur, Uncle Ronald, and Uncle Bernard','Relatives','L','24','cousin-wilbur-uncle-ronald-uncle-bernard'],
 ['Eustace','Eustace','L','30','eustace'],
 ['Lord Murdock Burdock Thrushmorton','Lord Murdock','L','39','lord-murdock-burdock-thrushmorton'],
 ['The Old Caretaker','Caretaker','L','49','the-old-caretaker'],
 ['Mr. Mouse','Mr. Mouse','L','51','mr-mouse'],
 ['The Sound Effects Man','Sound effects man','L','54','the-sound-effects-man'],
 ['The Great Tailor','Tailor','L','56','the-great-tailor'],
 ['The Old Violinist','Violinist','L','58','the-old-violinist'],
 ['The Old Mute','Old mute','L','61','the-old-mute'],
 ['The Singing Frog','Singing frog','L','61','the-singing-frog'],
 ['Mr. Titus Bonebreaker','Bonebreaker','L','65','mr-titus-bonebreaker'],
 ['John Knox MacIntosh','John Knox','L','65','john-knox-macintosh'],
 ['Mercy MacIntosh','Mercy','L','65','mercy-macintosh'],
 ['Mrs. Hogden','Mrs. Hogden','L','70','mrs-hogden'],
 ['Lisa Lunde','Lisa Lunde','L','70','lisa-lunde'],
 ['Justice O’Leary','Dr. O’Leary','R','5,7,8,67-69,71-73,75,77-79,81','justice-oleary'],
 ['Esther Longtree','Esther','R','72-82','esther-longtree'],
 ['Madge Capehorn','Madge','R','1,5-8,67,68','madge-capehorn'],
 ['Homer Capehorn','Homer','R','1,6-8,67','homer-capehorn'],
 ['The Long-Haired Bus Driver','Bus driver','R','5,7,8,67-69',''],
 ['Jackie White','Jackie White','R','6,7,67,68','jackie-white'],
 ['Moses Hunnecker','Moses','R','5,8','moses-hunnecker'],
 ['Josh and Rudolph Hathaway','The Hathaways','R','7,8,68','josh-and-rudolph-hathaway'],
 ['Mr. Weed','Mr. Weed','R','68,69,71','mr-weed'],
 ['Marie Weed','Marie Weed','R','68,71','marie-weed'],
 ['The Tavern Landlord','Landlord','R','68,69,71','the-tavern-landlord'],
 ['The Tavern Landlady','Landlady','R','69,71','the-tavern-landlady'],
 ['Sarah O’Leary','Sarah O’Leary','R','69,71','sarah-oleary'],
 ['The Chicago Detective','Detective','R','72-77','the-chicago-detective'],
 ['The Little Shadow Boxer','Shadow boxer','R','72,73,75,80,81','the-little-shadow-boxer'],
 ['The Little Toy Salesman','Toy salesman','R','72,81','the-little-toy-salesman'],
 ['The Fathers of Esther’s Children','Fathers','R','72,73,81','the-fathers-of-esthers-children'],
 ['Esther’s Father','Esther’s father','R','74,75,78,79','esthers-father'],
 ['The Old Woman Abortionist','Abortionist','R','74,77','the-old-woman-abortionist'],
 ['Esther’s Mother','Esther’s mother','R','78,79','esthers-mother'],
 ['Rosemary Longtree','Rosemary','R','78-80','rosemary-longtree'],
 ['The Other Woman (the Go-Between)','Other woman','R','79,80','the-other-woman'],
 ['The Fat Lady on the Train','Fat lady','R','4','the-fat-lady-on-the-train'],
 ['Miss Pebbles','Miss Pebbles','R','5','miss-pebbles'],
 ['Old Doc’s Imaginary Patients','Imaginary patients','R','5','old-docs-imaginary-patients'],
 ['Homer’s Classmates','Classmates','R','6','homers-classmates'],
 ['Madge’s Father (Mr. Edwards)','Madge’s father','R','6','madges-father'],
 ['Gertrude Hathaway','Gertrude','R','7','gertrude-hathaway'],
 ['Mrs. Tidings','Mrs. Tidings','R','7','mrs-tidings'],
 ['Musidora','Musidora','R','7','musidora'],
 ['Beatrice Fitzgerald','Beatrice','R','8','beatrice-fitzgerald'],
 ['Julia Weed','Julia Weed','R','68','julia-weed'],
 ['Imadaisy','Imadaisy','R','69','imadaisy'],
 ['Tillie','Tillie','R','69','tillie'],
 ['Simeon the Doctor','Simeon','R','71','simeon-the-doctor'],
 ['Tabitha','Tabitha','R','71','tabitha'],
 ['The Italian Thief','Italian thief','R','71','the-italian-thief'],
 ['The Woman in Curlers','Woman in curlers','R','71','the-woman-in-curlers'],
 ['The Fat Drummer (the Sad Father)','Fat drummer','R','72','the-fat-drummer'],
 ['Joe Goldberg','Joe Goldberg','R','73','joe-goldberg'],
 ['Phoebe','Phoebe','R','73','phoebe'],
 ['Abigail Porter','Abigail Porter','R','73','abigail-porter'],
 ['Coleman Bluebough','Coleman','R','73','coleman-bluebough'],
 ['The Fisherman','Fisherman','R','75','the-fisherman'],
 ['The Tall Child (the Mud Baby)','Tall child','R','75','the-tall-child'],
 ['The Little Boy','Little boy','R','77','the-little-boy'],
 ['The Miller','Miller','R','77','the-miller'],
 ['Esther’s Uncle','Uncle','R','79','esthers-uncle'],
 ['Walter','Walter','R','80','walter'],
 ['Walter’s Father','Walter’s father','R','80','walters-father'],
 ['Lucie Bell','Lucie Bell','R','82','lucie-bell'],
 ['The Stone Deaf Man','Stone deaf man','R','82','the-stone-deaf-man']
].map(([name,lab,side,ch,hub],i)=>({id:'c'+i,name,lab,side,ch:R(ch),hub}));
const VERA={id:'vera',name:'Vera Cartwheel',ch:R('1,3,4,5,7,8,9,12,13,15-19,22,66-82'),hub:'vera-cartwheel'};

const svg=document.getElementById('atd-map'),NS='http://www.w3.org/2000/svg';
const C={vellum:'#EEE5CF',ink:'#1C1813',red:'#B23A2C',green:'#3E7D5E',ochre:'#A1722A',gold:'#E3BE5E'};
const Y0=100,H=10,X=450,RW=7;
const mid=c=>Y0+(c-1)*H+H/2,top=c=>Y0+(c-1)*H;
const serif='IM Fell English, Georgia, serif',caps='IM Fell English SC, Georgia, serif';
function el(t,a,p){const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);(p||svg).appendChild(e);return e}
function txt(s,a,p){const e=el('text',a,p);e.textContent=s;return e}

txt('WHAT VERA REMEMBERS',{x:30,y:560,transform:'rotate(-90 30 560)','text-anchor':'middle','font-family':caps,'font-size':24,'letter-spacing':4,fill:C.green});
txt('WHOM VERA MEETS',{x:870,y:560,transform:'rotate(90 870 560)','text-anchor':'middle','font-family':caps,'font-size':24,'letter-spacing':4,fill:C.ochre});

const loops=D.filter(d=>d.ch.length>1),beads=D.filter(d=>d.ch.length===1);
['L','R'].forEach(s=>{loops.filter(d=>d.side===s).sort((a,b)=>(a.ch.at(-1)-a.ch[0])-(b.ch.at(-1)-b.ch[0])).forEach((d,k)=>{
  d.y1=mid(d.ch[0]);d.y2=mid(d.ch.at(-1));d.ry=(d.y2-d.y1)/2;d.cy=(d.y1+d.y2)/2;d.rx=14+d.ry*0.5+k*1.5})});
const layer=el('g',{});
loops.slice().sort((a,b)=>b.ry-a.ry).forEach(d=>{
  const col=d.side==='L'?C.green:C.ochre,x0=d.side==='L'?X-RW:X+RW;
  const p=d.side==='L'?`M${x0},${d.y2} A${d.rx},${d.ry} 0 0 1 ${x0},${d.y1}`:`M${x0},${d.y1} A${d.rx},${d.ry} 0 0 1 ${x0},${d.y2}`;
  const g=el('g',{class:'ch','data-id':d.id},layer);
  el('path',{d:p,class:'outer',fill:'none',stroke:col,'stroke-width':4.6},g);
  el('path',{d:p,class:'inner',fill:'none',stroke:C.vellum,'stroke-width':2.2},g);
  el('path',{d:p,class:'hit',fill:'none',stroke:'transparent','stroke-width':9,'pointer-events':'stroke','data-id':d.id},g);
});
const stack={};
beads.forEach(d=>{const c=d.ch[0],key=d.side+c;const k=stack[key]=(stack[key]||0)+1;
  const dir=d.side==='L'?-1:1;d.bx=X+dir*(RW+6+(k-1)*9);d.by=mid(c);
  const g=el('g',{class:'ch','data-id':d.id},layer);
  el('circle',{cx:d.bx,cy:d.by,r:3.6,class:'bead',fill:C.vellum,stroke:d.side==='L'?C.green:C.ochre,'stroke-width':1.7},g);
  el('circle',{cx:d.bx,cy:d.by,r:6,class:'hit',fill:'transparent','data-id':d.id},g)});

/* the staff (Vera) as a bird */
const yb=Y0+82*H;
[-44,-22,0,22,44].forEach(a=>{const t=a*Math.PI/180,cx=X+Math.sin(t)*30,cy=yb+6+Math.cos(t)*30;
  el('ellipse',{cx,cy,rx:6.5,ry:28,transform:`rotate(${-a} ${cx} ${cy})`,fill:C.red,stroke:C.ink,'stroke-width':1});
  el('line',{x1:X+Math.sin(t)*6,y1:yb+6+Math.cos(t)*6,x2:X+Math.sin(t)*54,y2:yb+6+Math.cos(t)*54,stroke:C.gold,'stroke-width':.9})});
el('rect',{x:X-RW-2,y:Y0-4,width:RW*2+4,height:82*H+8,fill:C.gold,stroke:C.ink,'stroke-width':.8});
el('rect',{x:X-RW,y:Y0,width:RW*2,height:82*H,fill:C.red});
const hl=el('g',{});
for(let c=1;c<=82;c++)txt(c,{x:X,y:mid(c)+2.2,'text-anchor':'middle','font-family':serif,'font-size':6.2,fill:C.vellum});
[9,25,30,53,63,67,72,82].forEach(a=>el('rect',{x:X-RW-5,y:top(a)-1,width:RW*2+10,height:2,fill:C.gold,stroke:C.ink,'stroke-width':.4}));
el('line',{x1:X-RW-9,x2:X+RW+9,y1:Y0+41*H,y2:Y0+41*H,stroke:C.ink,'stroke-width':1,'stroke-dasharray':'2 2'});
el('path',{d:`M${X-RW},${Y0} C${X-RW},${Y0-14} ${X-12},${Y0-22} ${X-12},${Y0-34} L${X+14},${Y0-30} C${X+RW+2},${Y0-20} ${X+RW},${Y0-12} ${X+RW},${Y0} Z`,fill:C.red,stroke:C.ink,'stroke-width':1,'stroke-linejoin':'round'});
el('circle',{cx:X+2,cy:Y0-42,r:19,fill:C.red,stroke:C.ink,'stroke-width':1});
el('path',{d:`M${X+18},${Y0-49} L${X+46},${Y0-41} L${X+18},${Y0-34} Z`,fill:C.gold,stroke:C.ink,'stroke-width':1,'stroke-linejoin':'round'});
el('line',{x1:X+20,y1:Y0-41.5,x2:X+44,y2:Y0-41,stroke:C.ink,'stroke-width':.7});
el('path',{d:`M${X-6},${Y0-60} C${X-12},${Y0-74} ${X-2},${Y0-78} ${X},${Y0-62} C${X+4},${Y0-76} ${X+14},${Y0-72} ${X+6},${Y0-59}`,fill:C.red,stroke:C.ink,'stroke-width':1});
el('circle',{cx:X+8,cy:Y0-46,r:3.2,fill:C.vellum,stroke:C.ink});el('circle',{cx:X+9,cy:Y0-46,r:1.4,fill:C.ink});
txt('chapter 1',{x:X-24,y:Y0-12,'text-anchor':'end','font-family':caps,'font-size':10,fill:C.red});
txt('chapter 82',{x:X,y:yb+76,'text-anchor':'middle','font-family':caps,'font-size':10,fill:C.red});

/* labels placed so none collide */
const boxes=[[X-RW-14,Y0-4,RW*2+28,82*H+8]];
const hits=b=>b[0]<70||b[0]+b[2]>830||b[1]<Y0-8||b[1]+b[3]>yb+8||boxes.some(o=>b[0]<o[0]+o[2]&&b[0]+b[2]>o[0]&&b[1]<o[1]+o[3]&&b[1]+b[3]>o[1]);
const lab=el('g',{});
function put(d,cands,fs,col){const w=d.lab.length*fs*0.47+2;
  for(const[px,py,anc]of cands){const b=[anc==='end'?px-w:px,py-fs*0.8,w,fs*1.05];if(!hits(b)){boxes.push(b);
    txt(d.lab,{x:px,y:py,'text-anchor':anc,'font-family':serif,'font-size':fs,fill:col,stroke:C.vellum,'stroke-width':3,'paint-order':'stroke',class:'ch','data-id':d.id},lab);return}}}
loops.slice().sort((a,b)=>b.ry-a.ry).forEach(d=>{const L=d.side==='L',cands=[];
  for(const a of[0,-12,12,-24,24,-36,36,-48,48,-60,60,-70,70]){const t=a*Math.PI/180,px=(L?X-RW-d.rx*Math.cos(t):X+RW+d.rx*Math.cos(t)),py=d.cy+d.ry*Math.sin(t)+3;
    cands.push([L?px-4:px+4,py,L?'end':'start'])}
  put(d,cands,9.6,L?C.green:C.ochre)});
beads.forEach(d=>{const L=d.side==='L';const n=stack[d.side+d.ch[0]];const xs=X+(L?-1:1)*(RW+6+(n-1)*9+8);const cands=[];
  for(const dy of[3,-6,12,-15,21,-24,30,-33])cands.push([xs,d.by+dy,L?'end':'start']);put(d,cands,8.4,L?C.green:C.ochre)});

/* interaction */
const info=document.getElementById('atd-info');
const byId=Object.fromEntries(D.concat([VERA]).map(d=>[d.id,d]));
const fmt=a=>{const o=[];for(let i=0;i<a.length;){let j=i;while(j+1<a.length&&a[j+1]===a[j]+1)j++;o.push(j>i+1?a[i]+'–'+a[j]:j===i+1?a[i]+', '+a[j]:''+a[i]);i=j+1}return o.join(', ')};
const total=D.length+1;
let pinned=null;
function show(id){svg.classList.toggle('focus',!!id);svg.querySelectorAll('.ch.on').forEach(e=>e.classList.remove('on'));hl.replaceChildren();
  document.querySelectorAll('.atd .cb').forEach(b=>b.setAttribute('aria-pressed',b.dataset.id===id?'true':'false'));
  info.replaceChildren();const s=document.createElement('strong');
  if(!id){s.textContent=total+' characters';info.append(s,`${beads.length} of them whole within a single chapter. Tap or hover any loop, knot, or name to light that character’s chapters on the staff.`);return}
  svg.querySelectorAll(`[data-id="${id}"]`).forEach(e=>{const g=e.closest('.ch');if(g)g.classList.add('on')});
  const d=byId[id];
  d.ch.forEach(c=>{el('rect',{x:X-RW-3,y:top(c)+.5,width:RW*2+6,height:H-1,fill:C.gold,stroke:C.ink,'stroke-width':.6},hl);txt(c,{x:X,y:mid(c)+2.3,'text-anchor':'middle','font-family':serif,'font-size':6.6,fill:C.ink},hl)});
  s.textContent=d.name;
  info.append(s,id==='vera'?`the staff itself · ${d.ch.length} chapters · ${fmt(d.ch)} · absent from 23 to 65`:d.ch.length===1?`whole within Chapter ${d.ch[0]}`:`${d.ch.length} chapters · loop from ${d.ch[0]} to ${d.ch.at(-1)} · ${fmt(d.ch)}`);
}
svg.addEventListener('pointerover',e=>{const t=e.target.closest('[data-id]');if(!pinned&&t)show(t.dataset.id)});
svg.addEventListener('pointerout',e=>{if(!pinned&&!e.relatedTarget?.closest?.('[data-id]'))show(null)});
svg.addEventListener('click',e=>{const t=e.target.closest('[data-id]');pinned=t&&pinned!==t.dataset.id?t.dataset.id:null;show(pinned)});
function list(side,host,extra){const arr=D.filter(d=>d.side===side).sort((a,b)=>a.ch[0]-b.ch[0]||b.ch.length-a.ch.length);if(extra)arr.unshift(extra);
  arr.forEach(d=>{const row=document.createElement('div');row.className='row';
    const b=document.createElement('button');b.className='cb';b.dataset.id=d.id;b.type='button';b.setAttribute('aria-pressed','false');
    b.textContent=d.id==='vera'?'Vera Cartwheel, the staff':d.name;
    if(d.ch.length===1){const o=document.createElement('span');o.className='one';o.textContent='one chapter';b.appendChild(o)}
    b.addEventListener('click',()=>{pinned=pinned===d.id?null:d.id;show(pinned)});
    const c=document.createElement('span');c.className='cs';c.textContent=fmt(d.ch);
    let a;if(d.hub){a=document.createElement('a');a.href=BASE+d.hub+'.html';a.textContent='Hub';a.setAttribute('aria-label',d.name+' hub')}else{a=document.createElement('span');a.className='nohub'}
    row.append(b,c,a);host.appendChild(row)})}
list('L',document.getElementById('atd-listL'),VERA);list('R',document.getElementById('atd-listR'));
const tl=document.getElementById('atd-tally');
[[total,'characters'],[loops.length,'loops across chapters'],[beads.length,'whole within one chapter'],[D.filter(d=>d.ch.at(-1)===82).length+1,'still present in Chapter 82']].forEach(([n,t])=>{const li=document.createElement('li');const b=document.createElement('b');b.textContent=n;li.append(b,t);tl.appendChild(li)});
show(null);

}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
