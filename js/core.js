/* ===== แกนกลาง: เสียง รูป ลากวาง ผลลัพธ์ ===== */
const $=s=>document.querySelector(s);let muted=false,AC=null;
const shuf=(a,s=3)=>{a=[...a];for(let i=a.length-1;i>0;i--){s=(s*9301+49297)%233280;const j=Math.floor(s/233280*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
/* รูป: ใช้ไฟล์ assets/images/<key>.svg ถ้าไม่มีใช้อีโมจิ (เปลี่ยนนามสกุลเป็น .png ได้ที่ IMG_EXT) */
const IMG_EXT='svg';
function fb(el,k){el.outerHTML=`<span class="pic">${(IT[k]||[])[1]||'❓'}</span>`}
const pic=k=>`<img class="pic" src="assets/images/${k}.${IMG_EXT}" onerror="fb(this,'${k}')">`;
/* เสียง: assets/audio/words/<key>.mp3 , assets/audio/fx/<correct|wrong|clap|tap|flip>.mp3 , assets/audio/bgm.mp3 ; ไม่มีไฟล์ = ใช้เสียงสังเคราะห์/เสียงอ่านของเบราว์เซอร์ */
function tone(f,d,t=0,ty='sine'){if(muted)return;try{AC=AC||new AudioContext();const o=AC.createOscillator(),g=AC.createGain();o.type=ty;g.gain.setValueAtTime(.18,AC.currentTime+t);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+t+d);o.frequency.value=f;o.connect(g);g.connect(AC.destination);o.start(AC.currentTime+t);o.stop(AC.currentTime+t+d)}catch(e){}}
function tts(t){if(muted||!window.speechSynthesis)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='th-TH';u.rate=.9;speechSynthesis.speak(u)}
function play(f,fallback){if(muted)return;const a=new Audio('assets/audio/'+f);a.onerror=()=>fallback&&fallback();a.play().catch(()=>fallback&&fallback())}
const FX={correct:()=>[660,880,1100].forEach((f,i)=>tone(f,.18,i*.09)),wrong:()=>{tone(220,.3,0,'triangle');tone(170,.3,.15,'triangle')},clap:()=>[0,1,2,3,4,5].forEach(i=>tone(700+i*120,.07,i*.08,'square')),tap:()=>tone(520,.08),flip:()=>tone(420,.1)};
const fx=n=>play('fx/'+n+'.mp3',FX[n]);
const say=k=>play('words/'+k+'.mp3',()=>tts((IT[k]||[k])[0]));
let bgm=new Audio('assets/audio/bgm.mp3');bgm.loop=true;bgm.volume=.25;
function setMute(m){
  muted=m;
  if(m){bgm.pause();window.speechSynthesis&&speechSynthesis.cancel()}
  else bgm.play().catch(()=>{});
  document.querySelectorAll('.snd').forEach(b=>{
    b.classList.toggle('off',m);
    if(b.querySelector('img')){
      b.querySelector('img').style.opacity = m ? '0.5' : '1';
    } else {
      b.textContent=m?'🔇':'🔊';
    }
  });
}
function star(x,y){const s=document.createElement('div');s.className='fly';s.textContent='🌟';s.style.left=x+'px';s.style.top=y+'px';document.body.append(s);setTimeout(()=>s.remove(),1000)}
/* ลากวาง + แตะภาพแล้วแตะเป้าหมาย */
function drag(items,targets,check,ok,bad){let sel=null;
 const hit=(x,y)=>document.elementFromPoint(x,y)?.closest('[data-t]');
 const go=(it,t,x,y)=>{if(check(it,t)){it.classList.add('done');if(!t.dataset.multi)t.classList.add('done');sel=null;ok(it,t,x,y)}else{it.classList.remove('sel');sel=null;bad(it)}};
 items.forEach(it=>it.onpointerdown=e=>{if(it.classList.contains('done'))return;const sx=e.clientX,sy=e.clientY;let g=null;
  const mv=v=>{if(!g&&Math.hypot(v.clientX-sx,v.clientY-sy)>8){g=document.createElement('div');g.className='ghost';g.innerHTML=it.querySelector('.pic')?.outerHTML||'';document.body.append(g)}
   if(g){g.style.left=v.clientX+'px';g.style.top=v.clientY+'px';const t=hit(v.clientX,v.clientY);targets.forEach(x=>x.classList.toggle('hot',x===t&&!x.classList.contains('done')))}};
  const up=v=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);
   if(g){g.remove();targets.forEach(x=>x.classList.remove('hot'));const t=hit(v.clientX,v.clientY);if(t&&!t.classList.contains('done'))go(it,t,v.clientX,v.clientY)}
   else{items.forEach(x=>x.classList.remove('sel'));if(sel===it)sel=null;else{sel=it;it.classList.add('sel');fx('tap')}}};
  addEventListener('pointermove',mv);addEventListener('pointerup',up)});
 targets.forEach(t=>{t.dataset.t=1;t.onclick=e=>{if(sel&&!t.classList.contains('done'))go(sel,t,e.clientX,e.clientY)}})}