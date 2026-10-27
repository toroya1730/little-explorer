/* ===== หน้าจอและลำดับการเล่น: หน้าแรก → ชั้น → หมวด → บทเรียน → เล่น → สรุป(5วิ) → บทเรียน ===== */
const S = { cls: 0, cat: null, li: 0 }; let prog = {}, timer;
try { prog = JSON.parse(localStorage.getItem('explorer') || '{}') } catch (e) { }
const pk = (i) => `${S.cls}-${S.cat.id}-${i}`, save = () => { try { localStorage.setItem('explorer', JSON.stringify(prog)) } catch (e) { } };
const app = $('#app'), scr = (h, id) => { clearTimeout(timer); app.innerHTML = `<section class="scr" id="${id}">${h}</section>`; app.querySelector('[data-snd]') };
const bar = (back, mid, right = '') => `<div class="bar"><button class="ic" data-b>${back}</button><span class="pill">${mid}</span><span class="sp"></span>${right}<button class="ic snd" aria-label="เสียง"><img src="assets/images/bt-sound.png" alt="เสียง"></button></div>`;
const wire = (fn) => { app.querySelectorAll('.snd').forEach(b => b.onclick = () => setMute(!muted)); const b = app.querySelector('[data-b]'); if (b) b.onclick = fn };

function home() {
  scr(`<video class="home-video-bg" autoplay muted loop playsinline><source src="assets/videos/background-vdo2.mp4" type="video/mp4"></video><button class="play2" id="go" aria-label="เริ่มเล่น"><img src="assets/images/boton-s1.png"></button><div class="hb"><button class="ib snd ib-sound" aria-label="เปิดปิดเสียง"><img src="assets/images/bt-sound.png" alt="เสียง"></button><button class="ib" id="st" aria-label="ตั้งค่า"><img src="assets/images/bt-seting.png"></button></div>`, 'home');
  wire();
  $('#go').onclick = () => { bgm.play().catch(() => { }); fx('correct'); pickClass() };
  $('#st').onclick = () => alert('ตั้งค่า: เปิด/ปิดเสียงได้ที่ปุ่มลำโพง');
}

function pickClass() {
  scr(bar('🏠', '🎓 เลือกชั้นเรียน') + `<div class="row">${CLASSES.map(c => `
   <button class="class-card" data-c="${c.id}">
     <img class="pic" src="assets/images/class-${c.id + 1}.png" alt="${c.n}">
     <b>${c.n}</b>
   </button>
 `).join('')}</div>`, 'cls');
  wire(home);
  app.querySelectorAll('.class-card').forEach(b => b.onclick = () => { S.cls = +b.dataset.c; fx('tap'); pickCat() });
}

function pickCat() {
  scr(bar('🏠', '📖 เลือกหมวดการเรียนรู้') + `<div class="grid">${CATS.map(c => `
   <button class="cat-card" data-c="${c.id}">
     <img class="pic" src="assets/images/${c.e}" alt="${c.n}">
     <b>${c.n}</b>
   </button>
 `).join('')}</div>`, 'cat');
  wire(pickClass);
  app.querySelectorAll('.cat-card').forEach(b => b.onclick = () => { S.cat = CATS.find(c => c.id === b.dataset.c); S.li = 0; fx('tap'); lessons() });
}

function lessons() {
  const C = S.cat, L = C.L, done = L.filter((l, i) => prog[pk(i)]).length, cur = L[S.li];
  scr(bar('←', `${C.e} ${C.n}`, `<span class="pill dk">${done}/${L.length}</span>`) + `<div class="lay"><div class="list">${L.map((l, i) => `<button class="li ${i === S.li ? 'on' : ''}" data-i="${i}"><span class="n">${i + 1}</span>${l.t}<span class="st">${prog[pk(i)] ? '⭐'.repeat(prog[pk(i)]) : '›'}</span></button>`).join('')}</div>
 <div class="pv"><div class="big"><img class="pic" src="assets/images/kid02.gif"></div><p>${cur.desc || cur.t}</p><button class="btn" id="go">▶ เริ่มบทเรียน</button></div></div>`, 'les');
  wire(pickCat); app.querySelectorAll('.li').forEach(b => b.onclick = () => { S.li = +b.dataset.i; fx('tap'); lessons() }); $('#go').onclick = () => { fx('correct'); playLesson() }
}

function playLesson() {
  const L = S.cat.L[S.li], A = {
    n: 1, right: 0, d: 0, wr: {},
    ok(id, x, y, k) { if (!this.wr[id]) { this.right++; star(x || innerWidth / 2, y || innerHeight / 2) } this.d++; $('#sc').textContent = this.right; fx('correct'); k && setTimeout(() => say(k), 300); if (this.d >= this.n) setTimeout(() => summary(this.right, this.n), 2200) },
    bad(id) { this.wr[id] = 1; fx('wrong'); $('#mW').classList.add('on') }, mark(id) { this.wr[id] = 1 }, tip: t => $('#tip').textContent = t
  };
  scr(bar('🏠', `<span style="color:${S.cat.c}">●</span> ${L.t}`, `<span class="pill dk">⭐ <b id="sc">0</b>/<span id="nn">0</span></span>`) + '<div class="stage" id="stage"></div><div class="tip" id="tip"></div>', 'play'); wire(lessons);
  (GAMES[L.g] || GAMES.match)($('#stage'), L, A); $('#nn').textContent = A.n
}

$('#retry').onclick = () => $('#mW').classList.remove('on');

function summary(r, n) {
  const st = Math.max(1, Math.round(5 * r / n)), k = pk(S.li); prog[k] = Math.max(prog[k] || 0, st); save(); fx('clap');
  scr(`<div class="sum"><div class="rib">จบแล้ว!</div><div class="sc">คะแนนของคุณ<big>⭐ ${r} / ${n}</big><div class="stars">${'⭐'.repeat(st)}${'☆'.repeat(5 - st)}</div></div><div class="sb">${st >= 4 ? 'เก่งมาก! คุณทำได้ดีเลย' : st >= 2 ? 'เก่งแล้ว! ลองอีกครั้งนะ' : 'สู้ๆ! ลองใหม่อีกครั้งนะ'}</div>
 <div class="bt"><button class="btn" id="again">เล่นอีกครั้ง</button><button class="btn gr" id="main">กลับหน้าหลัก</button></div><div class="cdn"><i></i></div><small>กลับหน้าเลือกบทเรียนอัตโนมัติใน 5 วินาที</small></div><img class="mas" src="assets/images/kid02.gif"><img class="rob" src="assets/images/robot01.gif">`, 'sum');
  $('#again').onclick = playLesson; $('#main').onclick = home; timer = setTimeout(lessons, 5000)
}

home();