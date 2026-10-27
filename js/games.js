/* ===== แม่แบบเกม 10 แบบ: เกมคือฟังก์ชัน (st=เวที, L=ข้อมูลบทเรียน, A=api ตัวนับคะแนน) ===== */
const capK=L=>L.k.slice(0,Math.max(3,Math.min(L.k.length,CLASSES[S.cls].cap+1)));
const GAMES={
pairs(st,L,A,shadow){const K=capK(L);A.n=K.length;
 const names=[...K].reverse().map(k=>`<div class="nm ${shadow?'sh':''}" data-k="${k}">${shadow?pic(k):IT[k][0]}</div>`).join('');
 st.innerHTML=`<div class="two"><div class="col">${K.map(k=>`<div class="cd" data-k="${k}">${pic(k)}</div>`).join('')}</div><div class="panel"><div class="col">${names}</div></div></div>`;
 A.tip(shadow?'ลากภาพไปวางบนเงาที่ตรงกัน':'ลากภาพไปวางบนชื่อ หรือแตะภาพแล้วแตะชื่อ');
 drag([...st.querySelectorAll('.cd')],[...st.querySelectorAll('.nm')],(c,n)=>c.dataset.k===n.dataset.k,(c,n,x,y)=>A.ok(c.dataset.k,x,y,c.dataset.k),c=>A.bad(c.dataset.k))},
match:(st,L,A)=>GAMES.pairs(st,L,A,0),shadow:(st,L,A)=>GAMES.pairs(st,L,A,1),
memory(st,L,A){const K=capK(L).slice(0,6);A.n=K.length;const d=shuf([...K,...K]);A.tip('💡 พลิกการ์ด แล้วหาคู่ที่เหมือนกัน!');
 st.innerHTML=`<div class="mem">${d.map(k=>`<button class="mc" data-k="${k}"><div class="f"><img src="assets/images/card-back.svg"></div><div class="b">${pic(k)}</div></button>`).join('')}</div>`;
 let op=[],lock=false;st.querySelectorAll('.mc').forEach(c=>c.onclick=e=>{if(lock||c.classList.contains('up'))return;c.classList.add('up');fx('flip');op.push(c);if(op.length<2)return;lock=true;const[a,b]=op;
  if(a.dataset.k===b.dataset.k)setTimeout(()=>{a.classList.add('ok');b.classList.add('ok');A.ok(a.dataset.k,e.clientX,e.clientY,a.dataset.k);op=[];lock=false},500);
  else{A.mark(a.dataset.k);A.mark(b.dataset.k);setTimeout(()=>{a.classList.remove('up');b.classList.remove('up');op=[];lock=false},900)}})},
listen(st,L,A){const K=capK(L);A.n=K.length;let r=0;const R=()=>{const k=K[r],o=shuf([k,K[(r+1)%K.length],K[(r+2)%K.length]],r+5);
  st.innerHTML=`<button class="spk">🔊</button><div class="opts">${o.map(x=>`<div class="opt" data-k="${x}">${pic(x)}<b>${IT[x][0]}</b></div>`).join('')}</div>`;A.tip(`ฟังเสียงแล้วแตะภาพที่ถูกต้อง (${r+1}/${K.length})`);
  st.querySelector('.spk').onclick=()=>say(k);setTimeout(()=>say(k),300);
  st.querySelectorAll('.opt').forEach(p=>p.onclick=e=>{if(p.dataset.k===k){p.classList.add('done');A.ok(r,e.clientX,e.clientY,k);if(++r<K.length)setTimeout(R,1500)}else A.bad(r)})};R()},
sort(st,L,A){const items=[];L.groups.forEach((g,gi)=>g.k.forEach(k=>items.push([k,gi])));const I=shuf(items,9);A.n=I.length;
 st.innerHTML=`<div class="itrow">${I.map(([k,g])=>`<div class="cd" data-k="${k}" data-g="${g}">${pic(k)}</div>`).join('')}</div><div class="buckets">${L.groups.map((g,i)=>`<div class="bk" data-g="${i}" data-multi="1" style="background:${g.c}">${g.n}</div>`).join('')}</div>`;A.tip('ลากสัตว์ไปใส่ตะกร้าที่ถูกต้อง');
 drag([...st.querySelectorAll('.cd')],[...st.querySelectorAll('.bk')],(c,b)=>c.dataset.g===b.dataset.g,(c,b,x,y)=>A.ok(c.dataset.k,x,y,c.dataset.k),c=>A.bad(c.dataset.k))},
order(st,L,A){const S2=L.steps;A.n=S2.length;const mix=shuf(S2.map((s,i)=>i),4);
 const sty='style="inset:4% 4% 30% 4%;width:auto;height:auto"';
 st.innerHTML=`<div class="slots">${S2.map((s,i)=>`<div class="nm" data-i="${i}"><i>${i+1}</i></div>`).join('')}</div><div class="slots">${mix.map(i=>`<div class="cd" data-i="${i}"><span class="pic" ${sty}>${S2[i][0]}</span><b style="position:absolute;bottom:.8vh;font-size:2.6vh">${S2[i][1]}</b></div>`).join('')}</div>`;A.tip('เรียงภาพตามลำดับขั้นตอน 1 → '+S2.length);
 drag([...st.querySelectorAll('.cd')],[...st.querySelectorAll('.nm')],(c,n)=>c.dataset.i===n.dataset.i,(c,n,x,y)=>{n.insertAdjacentHTML('beforeend',c.querySelector('.pic').outerHTML.replace('class="pic"','class="pic" style="font-size:9vh"'));A.ok(c.dataset.i,x,y,null)},c=>A.bad(c.dataset.i))},
find(st,L,A){const W=L.w;A.n=W.length;const P=[[10,12],[42,8],[72,14],[18,52],[50,46],[78,55]];
 st.innerHTML=`<div class="want">${W.map(k=>`<span data-w="${k}">${IT[k][1]} ${IT[k][0]}</span>`).join('')}</div><div class="scene">${L.objs.map((k,i)=>`<button class="ob" data-k="${k}" style="left:${P[i][0]}%;top:${P[i][1]+14}%">${IT[k][1]}</button>`).join('')}</div>`;A.tip('แตะหาของที่ซ่อนอยู่ในห้อง');
 st.querySelectorAll('.ob').forEach(o=>o.onclick=e=>{const k=o.dataset.k;if(W.includes(k)){o.classList.add('found');st.querySelector(`[data-w="${k}"]`).classList.add('got');A.ok(k,e.clientX,e.clientY,k)}else A.bad(k)})},
count(st,L,A){A.n=L.ns.length;let r=0;const R=()=>{const n=L.ns[r],o=shuf([n,n+1,n+2>9?n-2:n+2],r+2);
  st.innerHTML=`<div class="cnt">${L.e.repeat(n)}</div><div class="opts">${o.map(x=>`<div class="opt num" data-n="${x}">${x}</div>`).join('')}</div>`;A.tip(`นับดูสิ มีกี่ชิ้น? (${r+1}/${L.ns.length})`);
  st.querySelectorAll('.opt').forEach(p=>p.onclick=e=>{if(+p.dataset.n===n){p.classList.add('done');A.ok(r,e.clientX,e.clientY,null);if(++r<L.ns.length)setTimeout(R,1300)}else A.bad(r)})};R()},
puzzle(st,L,A){A.n=4;const k=L.k,mix=[2,0,3,1];
 const im=i=>`<div class="pc" data-i="${i}"><img src="assets/images/${k}.${IMG_EXT}" style="left:-${i%2*100}%;top:-${Math.floor(i/2)*100}%"></div>`;
 st.innerHTML=`<div class="pz"><div class="pcs">${mix.map(im).join('')}</div><div class="pg">${[0,1,2,3].map(i=>`<div class="nm" data-i="${i}"></div>`).join('')}</div></div>`;A.tip('ลากชิ้นส่วนไปประกอบให้เป็นภาพ');
 drag([...st.querySelectorAll('.pc')],[...st.querySelectorAll('.nm')],(c,n)=>c.dataset.i===n.dataset.i,(c,n,x,y)=>{c.style.cssText='position:absolute;inset:0;opacity:1';n.append(c);A.ok(c.dataset.i,x,y,null)},c=>A.bad(c.dataset.i))},
trace(st,L,A){A.n=3;let r=0;const amp=[.18,.3,.38];st.innerHTML='<canvas></canvas>';A.tip('ลากนิ้วตามเส้นประ ให้ผึ้งไปถึงดอกไม้');
 const cv=st.querySelector('canvas'),W=cv.width=cv.clientWidth,H=cv.height=cv.clientHeight,c=cv.getContext('2d'),N=80;let P,nx,on;
 const setup=()=>{P=[];for(let i=0;i<=N;i++)P.push([W*.12+W*.76*i/N,H*.5+Math.sin(i/N*Math.PI*(2+r))*H*amp[r]]);nx=0;draw()};
 const draw=()=>{c.clearRect(0,0,W,H);c.setLineDash([H*.02,H*.02]);c.lineWidth=H*.012;c.strokeStyle='#4a90d9';c.beginPath();P.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.stroke();c.setLineDash([]);c.strokeStyle='#ffb02e';c.lineWidth=H*.03;c.lineCap='round';c.beginPath();for(let i=0;i<nx;i++)i?c.lineTo(...P[i]):c.moveTo(...P[i]);c.stroke();
  c.font=H*.14+'px serif';c.textAlign='center';c.textBaseline='middle';c.fillText('🌸',...P[N]);c.fillText('🐝',...P[Math.max(0,nx-1)])};
 const xy=e=>{const b=cv.getBoundingClientRect();return[(e.clientX-b.left)*W/b.width,(e.clientY-b.top)*H/b.height]};
 const mv=e=>{if(!on)return;const[x,y]=xy(e);while(nx<=N&&Math.hypot(x-P[nx][0],y-P[nx][1])<H*.1)nx++;draw();if(nx>N){on=0;A.ok(r,e.clientX,e.clientY,null);if(++r<3)setTimeout(setup,1200)}};
 cv.onpointerdown=e=>{on=1;cv.setPointerCapture(e.pointerId);mv(e)};cv.onpointermove=mv;cv.onpointerup=()=>on=0;setup()}
};
