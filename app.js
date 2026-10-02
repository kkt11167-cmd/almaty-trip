const app=document.getElementById("app"), nav=document.getElementById("nav");
const STORAGE="almaty-trip-v7-data";
let current=localStorage.getItem("almaty-tab")||"home";
let deferredPrompt=null;

const DEFAULT={
  days: TRIP.days.map(d=>({date:d.date,dow:d.dow,title:d.title,tag:d.tag,items:d.items.map(x=>({time:x[0],title:x[1],note:x[2]||""}))})),
  packing: TRIP.packing.map(x=>({name:x,done:false})),
  notes: "",
  customPlaces: [],
  bars: TRIP.bars.map(x=>({name:x[0],type:x[1],note:x[2]}))
};
let state=loadState();

function loadState(){
  try{
    const saved=JSON.parse(localStorage.getItem(STORAGE));
    if(saved && saved.days && saved.packing) return saved;
    // 기존 v3/v4에서 사용자가 저장한 일정이 있으면 이어받기
    for(const oldKey of ["almaty-trip-v3-1-data","almaty-trip-v4-data"]){
      const previous=JSON.parse(localStorage.getItem(oldKey));
      if(previous && previous.days && previous.packing){
        localStorage.setItem(STORAGE,JSON.stringify(previous));
        return previous;
      }
    }
  }catch(e){}
  return structuredClone(DEFAULT);
}
function saveState(){localStorage.setItem(STORAGE,JSON.stringify(state)); toast("저장했어요 ✓");}
function toast(msg){
  let t=document.getElementById("toast");
  if(!t){t=document.createElement("div");t.id="toast";document.body.appendChild(t)}
  t.textContent=msg;t.className="toast show";
  clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),1400);
}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function photoStyle(url){return `background-image:linear-gradient(135deg,rgba(139,214,232,.10),rgba(255,204,131,.10)),url("${url}")`}
function go(tab){current=tab;localStorage.setItem("almaty-tab",tab);render()}

function styles(){
 const s=document.createElement("style");
 s.textContent=`
 .editbar{display:flex;gap:8px;justify-content:flex-end;margin:8px 0}
 .smallbtn{border:0;border-radius:10px;padding:8px 10px;background:#edf4f7;color:#31596c;font-size:11px;font-weight:800}
 .smallbtn.primary{background:#0d2438;color:#fff}
 .danger{color:#b34e4e!important;background:#fff0f0!important}
 .item-actions{display:flex;gap:5px;margin-top:7px}.item-actions button{border:0;background:#eef4f7;color:#45636f;border-radius:8px;padding:5px 8px;font-size:10px;font-weight:700}
 .form{display:grid;gap:9px}.form input,.form textarea,.form select{width:100%;border:1px solid #dbe4e8;border-radius:11px;padding:11px;font:inherit;font-size:13px;background:#fff}.form textarea{min-height:82px;resize:vertical}
 .modal{position:fixed;inset:0;background:rgba(10,25,35,.5);z-index:100;display:flex;align-items:flex-end;justify-content:center}.modalbox{width:min(520px,100%);background:#fff;border-radius:22px 22px 0 0;padding:18px 16px calc(20px + env(safe-area-inset-bottom));max-height:90vh;overflow:auto}.modalhead{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}.modalhead b{font-size:18px}.x{border:0;background:#eef3f5;border-radius:50%;width:32px;height:32px}
 .toast{position:fixed;left:50%;bottom:88px;transform:translateX(-50%) translateY(15px);background:#0d2438;color:#fff;padding:10px 14px;border-radius:999px;font-size:12px;font-weight:700;opacity:0;z-index:150;transition:.2s}.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
 .note-box{min-height:110px}
 .day-add{padding:12px 15px;background:#fbfdfe;border-top:1px solid #edf1f3}
 .custom-place{position:relative}.custom-place .del{position:absolute;right:10px;top:10px}
 .backup{display:grid;grid-template-columns:1fr 1fr;gap:8px}
 
/* ===== Almaty Trip v3.1 Visual Refresh ===== */
:root{
 --ink:#102a43;--muted:#6c8291;--sky:#eaf7ff;--blue:#1976d2;--cyan:#36b8d8;
 --orange:#ff8b3d;--sun:#ffd166;--green:#5dbb63;--sand:#fff4e7;--line:#e6eef2;
 --shadow:0 12px 32px rgba(16,42,67,.10);--radius:22px;
}
body{background:linear-gradient(180deg,#f4fbff 0,#fff 35%,#f7fbf8 100%);color:var(--ink)}
header,.topbar{backdrop-filter:blur(16px)}
.hero{position:relative;overflow:hidden;background:
 linear-gradient(135deg,rgba(11,54,84,.94),rgba(20,122,160,.88) 55%,rgba(73,177,173,.82)),
 radial-gradient(circle at 88% 12%,rgba(255,209,102,.7),transparent 28%);
 border-radius:0 0 34px 34px;box-shadow:0 16px 40px rgba(12,61,91,.20);padding:30px 20px 22px}
.hero:before,.hero:after{content:"";position:absolute;border-radius:50%;filter:blur(2px);opacity:.35}
.hero:before{width:180px;height:180px;right:-55px;bottom:-80px;background:#ffd166}
.hero:after{width:120px;height:120px;left:-45px;top:-45px;background:#7ee8fa}
.hero>*{position:relative;z-index:1}
.hero .kicker{letter-spacing:.18em;font-weight:800;color:#cceffc;font-size:10px}
.hero h1{font-size:43px;line-height:.88;letter-spacing:-.045em;color:#fff;margin:10px 0 10px;text-shadow:0 4px 18px rgba(0,0,0,.18)}
.hero p{color:#e9fbff;font-weight:700}
.hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:18px}
.stat{background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.22);border-radius:16px;padding:10px 11px;box-shadow:inset 0 1px rgba(255,255,255,.15)}
.stat small{display:block;color:#cfeefa;font-size:9px;text-transform:uppercase;letter-spacing:.08em}.stat b{color:#fff;font-size:12px}
.content{max-width:620px;margin:auto;padding:16px 14px 100px}
.card{border:1px solid rgba(225,235,240,.95);box-shadow:var(--shadow);border-radius:var(--radius);background:rgba(255,255,255,.95);overflow:hidden}
.card-pad{padding:16px}
.section-title{font-weight:900;font-size:18px;letter-spacing:-.03em;margin:20px 2px 8px}
.sub{color:var(--muted);font-size:12px;line-height:1.55}
.btn{border:0;border-radius:14px;padding:12px 14px;background:linear-gradient(135deg,#0d4f78,#1598b4);color:#fff;font-weight:900;box-shadow:0 8px 18px rgba(20,132,164,.18)}
.btn.light{background:#edf7fb;color:#15506b;box-shadow:none;border:1px solid #dcecf2}
.day{margin:10px 0 16px}
.day-head{padding:15px 16px;background:linear-gradient(90deg,#eef9ff,#fff);display:flex;justify-content:space-between;align-items:center;gap:8px;border-bottom:1px solid var(--line)}
.day-head b{font-size:14px}.pill{background:#fff2dc;color:#a35a16;border:1px solid #ffe0ae;padding:5px 8px;border-radius:999px;font-size:10px;font-weight:900}
.timeline{padding:4px 16px}
.item{display:grid;grid-template-columns:54px 1fr;gap:10px;padding:14px 0;border-bottom:1px dashed #dfe8ec;position:relative}
.item:last-child{border-bottom:0}.time{font-size:11px;font-weight:900;color:#1687a2;padding-top:2px}
.item-title{font-weight:900;font-size:13px}.item-note{font-size:11px;color:var(--muted);line-height:1.45;margin-top:4px}
.place-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.place{transform:translateZ(0);transition:.18s}.place:active{transform:scale(.985)}
.place .photo{height:150px;background-size:cover;background-position:center;position:relative;background-color:#dbeef4}
.place .photo:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 45%,rgba(7,27,40,.70))}
.photo-label{position:absolute;z-index:1;left:11px;right:8px;bottom:10px;color:#fff;font-weight:900;font-size:12px;text-shadow:0 2px 6px rgba(0,0,0,.3)}
.place h3{font-size:14px;margin:0 0 6px}.place p{font-size:11px;color:var(--muted);line-height:1.45;margin:0}
.flight{margin:12px 0}.route{display:grid;grid-template-columns:1fr 1.2fr 1fr;align-items:center;gap:8px}.airport small{display:block;color:var(--muted);font-size:9px}.airport strong{font-size:22px;letter-spacing:-.04em}.flightline{text-align:center;font-size:10px;color:#1782a0;font-weight:800}.flightline b{font-size:9px;color:var(--muted)}
.transfer{background:#fff5e6;color:#9a5b1a;padding:10px 15px;font-size:11px;font-weight:800}
.bar{display:flex;justify-content:space-between;gap:10px;padding:12px 0;border-bottom:1px dashed #e2e9ec}.bar:last-child{border-bottom:0}.tag{align-self:flex-start;background:#eef8f2;color:#3c8a55;border-radius:999px;padding:5px 8px;font-size:9px;font-weight:900}
.check{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #edf2f4}.check input{width:19px;height:19px;accent-color:#1598b4}.check.done label{text-decoration:line-through;color:#9aabb4}
.nav{background:rgba(255,255,255,.9);backdrop-filter:blur(18px);border-top:1px solid #e4edf1}
.nav.active{color:#0786a4;font-weight:900}.nav.active:before{content:"";display:block;width:28px;height:3px;border-radius:3px;background:linear-gradient(90deg,#16a0bd,#ff9a3c);margin:0 auto 4px}
@media(max-width:390px){.place-grid{grid-template-columns:1fr}.place .photo{height:170px}.hero h1{font-size:38px}}

 .hero-photo{min-height:500px;border-radius:0 0 38px 38px;padding:0;position:relative;isolation:isolate;overflow:hidden;background:#092f45;box-shadow:0 18px 48px rgba(7,45,65,.22)}
 .hero-photo .hero-image{position:absolute;inset:0;background-image:linear-gradient(180deg,rgba(3,24,38,.05),rgba(3,19,31,.4)),url('https://commons.wikimedia.org/wiki/Special:FilePath/Big_Almaty_Lake_(144054115).jpeg?width=1400');background-size:cover;background-position:center 44%;transform:scale(1.03)}
 .hero-photo .hero-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(3,24,38,.08),rgba(3,28,42,.36) 42%,rgba(3,19,31,.95) 88%)}
 .hero-photo .hero-content{position:absolute;inset:auto 0 0;padding:24px 20px 28px;color:#fff}.hero-topline{display:flex;justify-content:space-between;font-size:10px;font-weight:900;letter-spacing:.12em;color:#e4f9ff;margin-bottom:13px}.hero-photo .kicker{font-size:9px;letter-spacing:.25em;color:#ffd47b;text-transform:uppercase}.hero-photo h1{font-size:51px;line-height:.84;margin:9px 0 11px;letter-spacing:-.055em;text-shadow:0 5px 25px rgba(0,0,0,.4)}.hero-photo h1 em{font-size:.60em;font-style:normal;font-weight:700;letter-spacing:-.035em}.hero-photo p{font-size:13px;margin:0;color:#effcff;font-weight:700}.hero-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:16px}.hero-chips span{padding:7px 9px;border-radius:999px;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.25);font-size:9px;font-weight:900;backdrop-filter:blur(10px)}.hero-caption{margin-top:18px;padding-left:12px;border-left:3px solid #ffd166;font-size:12px;line-height:1.55;color:#eafaff}.hero-caption b{color:#fff;font-size:14px}.cover-badge{position:absolute;right:15px;top:76px;background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.28);backdrop-filter:blur(12px);border-radius:16px;padding:9px 10px;text-align:center;color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.12)}.cover-badge strong{display:block;font-size:17px}.cover-badge small{font-size:8px;letter-spacing:.08em;color:#d8f3fb}
 .home-gallery{display:grid;grid-template-columns:1.4fr .9fr;grid-template-rows:135px 135px;gap:8px}.home-gallery .g{border-radius:18px;overflow:hidden;position:relative;background-size:cover;background-position:center;box-shadow:0 10px 24px rgba(12,44,62,.13)}.home-gallery .g:first-child{grid-row:1/3}.home-gallery .g:after{content:' ';position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(0,0,0,.66))}.home-gallery .gt{position:absolute;z-index:2;left:10px;bottom:9px;color:#fff;font-size:11px;font-weight:900}.photo-source{font-size:9px;color:#8aa0aa;margin-top:8px}.route-card{background:linear-gradient(135deg,#0b3651,#0e7082 58%,#59a86c);color:#fff;position:relative;overflow:hidden}.route-card:after{content:'✦';position:absolute;right:-8px;top:-24px;font-size:140px;color:rgba(255,255,255,.07);transform:rotate(15deg)}.route-title{font-size:19px;font-weight:900;letter-spacing:-.03em}.route-sub{font-size:10px;color:#d9f6f5;margin-top:4px}.route-line{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:16px;position:relative;z-index:1}.route-line span{background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.22);padding:7px 8px;border-radius:10px;font-size:9px;font-weight:900}.route-line i{font-style:normal;color:#bce9ec;font-size:10px}.quick-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.quick{border-radius:17px;padding:14px;background:#fff;border:1px solid #e4edf1;box-shadow:0 8px 22px rgba(16,42,67,.07)}.quick .qicon{font-size:23px}.quick b{display:block;margin-top:6px;font-size:12px}.quick span{font-size:10px;color:var(--muted)}@media(max-width:390px){.hero-photo{min-height:470px}.hero-photo h1{font-size:45px}.cover-badge{top:68px}.home-gallery{grid-template-rows:118px 118px}.route-line{gap:4px}.route-line span{padding:6px 7px;font-size:8px}}
`;
 document.head.appendChild(s);
}

function render(){
 document.querySelectorAll(".nav").forEach(b=>b.classList.toggle("active",b.dataset.tab===current));
 if(current==="home") renderHome();
 else if(current==="schedule") renderSchedule();
 else if(current==="flight") renderFlight();
 else if(current==="places") renderPlaces();
 else if(current==="packing") renderPacking();
 else renderPacking();
 window.scrollTo({top:0,behavior:"instant"});
}
function hero(){return `<section class="hero hero-photo"><div class="hero-image"></div><div class="hero-shade"></div><div class="cover-badge"><strong>6N 7D</strong><small>ROAD TRIP</small></div><div class="hero-content"><div class="hero-topline"><span>🇰🇿 KAZAKHSTAN</span><span>2026.10</span></div><div class="kicker">MOUNTAINS · CITY · ROAD TRIP</div><h1>Almaty<br><em>& Kazakhstan</em></h1><p>${TRIP.dates} · 6박 7일</p><div class="hero-chips"><span>✈ ICN → CIT → ALA</span><span>🏔️ 7 DAYS</span><span>✏️ EDITABLE</span></div><div class="hero-caption">자연도, 도시도, 밤도<br><b>이번 여행은 전부 기록한다.</b></div></div></section>`}

function renderHome(){
 const d=state.days[0];
 app.innerHTML=hero()+`<main class="content">
 <div class="card card-pad"><b>✏️ MY TRIP PLANNER</b><p class="sub" style="margin-top:6px">여행 전에는 계획하고, 현지에서는 바로 수정하고, 여행 후에는 기록으로 남겨요.</p><div class="backup"><button class="btn" id="addHome">＋ 일정 추가</button><button class="btn light" id="noteHome">📝 메모</button></div></div>
 <h2 class="section-title">🗺️ THIS TRIP IN ONE LINE</h2><div class="card card-pad route-card"><div class="route-title">City → Desert → Lakes → Canyon</div><div class="route-sub">알마티에서 시작해 알틴에멜 · 콜사이 · 카인디 · 차른을 지나 다시 알마티로</div><div class="route-line">${TRIP.route.map((r,i)=>`<span>${esc(r)}</span>${i<TRIP.route.length-1?'<i>›</i>':''}`).join('')}</div></div>
 <h2 class="section-title">🌄 TRIP HIGHLIGHTS</h2><div class="card card-pad"><div class="home-gallery"><div class="g" style="background-image:url('https://commons.wikimedia.org/wiki/Special:FilePath/Big_Almaty_Lake_(144054115).jpeg?width=1200')"><span class="gt">Big Almaty Lake</span></div><div class="g" style="background-image:url('https://commons.wikimedia.org/wiki/Special:FilePath/Kolsai_lake.jpg?width=900')"><span class="gt">Kolsai Lake</span></div><div class="g" style="background-image:url('https://commons.wikimedia.org/wiki/Special:FilePath/Charyn_Canyon_kazakhstan.jpg?width=900')"><span class="gt">Charyn Canyon</span></div></div><div class="photo-source">실제 여행지 사진: Wikimedia Commons. 첫 로딩에는 인터넷이 필요할 수 있어요.</div><div class="photo-source">사진 출처: Pexels · 무료 사용으로 표시된 사진. 실제 사진 파일은 media 폴더에 추가하면 오프라인에서도 사용할 수 있어요.</div></div>
 <h2 class="section-title">⚡ QUICK ACCESS</h2><div class="quick-grid"><div class="quick" id="qSchedule"><div class="qicon">📅</div><b>전체 일정</b><span>DAY 1 — DAY 7</span></div><div class="quick" id="qFlight"><div class="qicon">✈️</div><b>항공편</b><span>DV468 · DV707 · DV708 · DV467</span></div><div class="quick" id="qPlaces"><div class="qicon">🏔️</div><b>여행지</b><span>Altyn-Emel · Kolsai · Charyn</span></div><div class="quick" id="qMore"><div class="qicon">🎒</div><b>준비물</b><span>체크리스트 · 여행 메모</span></div></div>
 <h2 class="section-title">📅 DAY 1 PREVIEW</h2><div class="card day"><div class="day-head"><b>${esc(d.title)}</b><span class="pill">${d.date}</span></div><div class="timeline">${d.items.slice(0,7).map(x=>`<div class="item"><div class="time">${esc(x.time)}</div><div><div class="item-title">${esc(x.title)}</div><div class="item-note">${esc(x.note)}</div></div></div>`).join('')}</div><div class="day-add"><button class="btn light" id="editFirst">첫날 일정 편집</button></div></div>
 <h2 class="section-title">⭐ MUST SEE</h2><div class="place-grid">${TRIP.places.slice(1,5).map(p=>`<div class="card place"><div class="photo" style="${photoStyle(p.img)}"><div class="photo-label">${p.emoji} ${esc(p.name)}</div></div><div class="card-pad"><p>${esc(p.desc)}</p></div></div>`).join('')}</div></main>`;
 document.getElementById('addHome').onclick=()=>openDayPicker();document.getElementById('noteHome').onclick=()=>openNotes();document.getElementById('editFirst').onclick=()=>openDayEditor(0);document.getElementById('qSchedule').onclick=()=>go('schedule');document.getElementById('qFlight').onclick=()=>go('flight');document.getElementById('qPlaces').onclick=()=>go('places');document.getElementById('qMore').onclick=()=>go('packing');
}

function dayStops(d,i){
 const routes=[
  {stops:["인천공항 T1","알마티 공항","호텔","판필로프 공원","그린 바자르","아르바트"],mode:"transit"},
  {stops:["알마티 시내","메데우","쉼블락 케이블카","콕토베"],mode:"driving"},
  {stops:["알마티","알틴에멜 국립공원","악타우","카투타우","싱잉 듄","바씨"],mode:"driving"},
  {stops:["바씨","콜사이 호수","카인디 호수","차른 캐니언","문 캐니언","사티"],mode:"driving"},
  {stops:["사티","투어 추가 명소","알마티"],mode:"driving"},
  {stops:["알마티","빅알마티호수","Esentai / Dostyk","아르바트","호텔"],mode:"driving"},
  {stops:["호텔","알마티 공항 T1","췸켄트 공항","인천공항"],mode:"transit"}
 ];
 return routes[i]||{stops:["알마티"],mode:"driving"};
}
function mapsUrl(stops,mode){
 const clean=stops.map(s=>s+" Kazakhstan");
 const origin=encodeURIComponent(clean[0]);const destination=encodeURIComponent(clean[clean.length-1]);
 const waypoints=clean.slice(1,-1).map(encodeURIComponent).join("%7C");
 return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints?`&waypoints=${waypoints}`:""}&travelmode=${mode||"driving"}`;
}
function routeMapCard(d,i){
 const r=dayStops(d,i);const url=mapsUrl(r.stops,r.mode);
 return `<section class="route-map"><div class="route-map-head"><div><b>🗺️ ${d.date} 오늘의 이동 경로</b><br><small>${r.stops.length}개 주요 지점 · 지도 앱으로 경로 확인</small></div><span class="pill">${i===2||i===3||i===4?"투어":"시내 이동"}</span></div><div class="route-map-body"><div class="route-stops">${r.stops.map((s,j)=>`<span class="stop">${j+1}. ${esc(s)}</span>${j<r.stops.length-1?'<span class="arrow">→</span>':''}`).join("")}</div><div class="map-actions"><a class="btn" href="${url}" target="_blank" rel="noopener">📍 Google 지도에서 경로 보기</a><a class="btn light" href="https://www.openstreetmap.org/search?query=${encodeURIComponent(r.stops[Math.min(1,r.stops.length-1)]+" Kazakhstan")}" target="_blank" rel="noopener">OpenStreetMap</a></div><div class="map-note">※ 투어 구간은 실제 방문 순서와 도로 상황에 따라 달라질 수 있어요. 투어사가 확정한 경로를 최종 기준으로 확인해 주세요.</div></div></section>`;
}
function renderSchedule(){
 app.innerHTML=`<main class="content"><div class="section-title">📅 DAY BY DAY</div><div class="sub">날짜별 일정과 그날의 이동 경로를 함께 확인하고, 일정도 직접 수정할 수 있어요.</div>
 ${state.days.map((d,i)=>`<div class="card day"><div class="day-head"><b>${d.tag} · ${d.date} (${d.dow})</b><span class="pill">${esc(d.title)}</span></div>
 <div class="timeline">${d.items.length?d.items.map((x,j)=>`<div class="item"><div class="time">${esc(x.time)}</div><div><div class="item-title">${esc(x.title)}</div><div class="item-note">${esc(x.note)}</div><div class="item-actions"><button data-edit="${i}" data-item="${j}">수정</button><button class="danger" data-del="${i}" data-item="${j}">삭제</button></div></div></div>`).join(""):`<div class="empty">아직 일정이 없습니다.</div>`}</div>
 <div class="day-add"><button class="btn light" data-add="${i}">＋ 이 날짜에 일정 추가</button> <button class="smallbtn" data-dayedit="${i}">날짜/제목 편집</button></div></div>${routeMapCard(d,i)}`).join("")}</main>`;
 document.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>openItemEditor(+b.dataset.add,null));
 document.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>openItemEditor(+b.dataset.edit,+b.dataset.item));
 document.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>deleteItem(+b.dataset.del,+b.dataset.item));
 document.querySelectorAll("[data-dayedit]").forEach(b=>b.onclick=()=>openDayEditor(+b.dataset.dayedit));
}
function deleteItem(di,ii){if(confirm("이 일정을 삭제할까요?")){state.days[di].items.splice(ii,1);saveState();renderSchedule()}}

function renderFlight(){
 app.innerHTML=`<main class="content"><div class="section-title">✈️ FLIGHT</div><div class="sub">항공편 정보는 현재 여행 기준으로 표시됩니다.</div>${TRIP.flight.map(f=>`<div class="card flight card-pad"><div class="route"><div class="airport"><small>${f.depart}</small><strong>${f.from}</strong></div><div class="flightline">✈ ${f.flight}<br><b>${f.duration}</b>→</div><div class="airport"><small>${f.arrive}</small><strong>${f.to}</strong></div></div>${f.transfer?`<div class="transfer" style="margin:14px -15px -15px">${f.transfer}</div>`:""}</div>`).join("")}<div class="card card-pad"><b>🚌 10/03 공항 이동</b><p class="sub" style="margin-top:7px">01:35 삼성역 N6703 → 02:50 인천공항 T1</p></div></main>`;
}

function renderPlaces(){
 const all=[...TRIP.places,...state.customPlaces];
 app.innerHTML=`<main class="content"><div class="section-title">🏞️ TRAVEL SPOTS</div><div class="section-intro">알마티 도심부터 알틴에멜의 사막 지형, 콜사이·카인디 호수와 차른 협곡까지. 장소별 사진과 설명을 따로 모아뒀어요.</div><button class="btn" id="addPlace">＋ 장소 추가</button>
 <div class="place-grid" style="margin-top:12px">${all.map((p,i)=>`<article class="card place custom-place"><div class="photo" style="background-image:linear-gradient(135deg,#b8e6ef,#ffd49a),url('${esc(p.img||"")}')"><span class="photo-label">${p.emoji||"📍"} ${esc(p.name)}</span></div><div class="card-pad"><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p>${i>=TRIP.places.length?`<button class="smallbtn danger del" data-pdel="${i-TRIP.places.length}">삭제</button>`:`<a class="btn light" style="margin-top:10px" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name+" Kazakhstan")}">📍 지도에서 보기</a>`}</div></article>`).join("")}</div>
 <div class="section-title" style="margin-top:24px">🍸 BAR & NIGHTLIFE</div><div class="card card-pad">${state.bars.map(b=>`<div class="bar"><div><b>${esc(b.name)}</b><div class="sub" style="margin:3px 0 0">${esc(b.note)}</div></div><span class="tag">${esc(b.type)}</span></div>`).join("")}</div></main>`;
 document.getElementById("addPlace").onclick=()=>openPlaceEditor();
 document.querySelectorAll("[data-pdel]").forEach(b=>b.onclick=()=>{state.customPlaces.splice(+b.dataset.pdel,1);saveState();renderPlaces()});
}

function renderPacking(){
 const done=state.packing.filter(p=>p.done).length,total=state.packing.length,pct=total?Math.round(done/total*100):0;
 app.innerHTML=`<main class="content"><div class="section-title">🎒 PACKING LIST</div><div class="sub">준비물만 따로 모아 체크하고, 메모와 백업도 관리할 수 있어요.</div><div class="section-intro"><b>출발 전 체크</b><br>여권·항공편·예약 확인부터 고산지대 방한용품까지 하나씩 체크해 보세요.</div><div class="card card-pad"><div style="display:flex;justify-content:space-between;align-items:center"><b>준비 완료</b><strong>${done} / ${total} · ${pct}%</strong></div><div class="pack-progress"><i style="width:${pct}%"></i></div><div id="packing">${state.packing.map((p,i)=>`<div class="check ${p.done?"done":""}"><input type="checkbox" data-pack="${i}" ${p.done?"checked":""}><label>${esc(p.name)}</label><button class="smallbtn danger" data-pdel2="${i}" style="margin-left:auto">삭제</button></div>`).join("")}</div><button class="btn light" id="addPack" style="margin-top:12px">＋ 준비물 추가</button></div>
 <div class="section-title" style="margin-top:22px">📝 TRIP NOTES</div><div class="card card-pad"><textarea id="notes" class="note-box form" placeholder="맛집, 투어사 연락처, 현지에서 생긴 일정 등을 자유롭게 적어보세요.">${esc(state.notes)}</textarea><button class="btn" id="saveNotes" style="margin-top:9px">메모 저장</button></div>
 <div class="section-title" style="margin-top:22px">💾 데이터 백업</div><div class="card card-pad"><p class="sub">일정과 체크 상태는 이 브라우저에 저장됩니다. 다른 기기에서 사용하려면 백업 파일을 내보내고 복원하세요.</p><div class="backup"><button class="btn" id="export">백업 내보내기</button><button class="btn light" id="import">백업 복원</button></div><input type="file" id="fileInput" accept=".json" hidden></div></main>`;
 document.querySelectorAll("[data-pack]").forEach(x=>x.onchange=()=>{state.packing[+x.dataset.pack].done=x.checked;localStorage.setItem(STORAGE,JSON.stringify(state));renderPacking()});
 document.querySelectorAll("[data-pdel2]").forEach(b=>b.onclick=()=>{state.packing.splice(+b.dataset.pdel2,1);saveState();renderPacking()});
 document.getElementById("addPack").onclick=()=>openPackingEditor();
 document.getElementById("saveNotes").onclick=()=>{state.notes=document.getElementById("notes").value;saveState()};
 document.getElementById("export").onclick=exportData;
 document.getElementById("import").onclick=()=>document.getElementById("fileInput").click();
 document.getElementById("fileInput").onchange=importData;
}

function modal(title,body,onOpen){
 const m=document.createElement("div");m.className="modal";m.innerHTML=`<div class="modalbox"><div class="modalhead"><b>${title}</b><button class="x">×</button></div>${body}</div>`;
 document.body.appendChild(m);m.querySelector(".x").onclick=()=>m.remove();m.addEventListener("click",e=>{if(e.target===m)m.remove()});if(onOpen)onOpen(m);return m;
}
function openDayPicker(){
 modal("어느 날짜에 추가할까요?",`<div class="form">${state.days.map((d,i)=>`<button class="btn light" data-pick="${i}">${d.date} (${d.dow}) · ${esc(d.title)}</button>`).join("")}</div>`,m=>m.querySelectorAll("[data-pick]").forEach(b=>b.onclick=()=>{m.remove();openItemEditor(+b.dataset.pick,null)}));
}
function openItemEditor(di,ii){
 const x=ii===null?{time:"",title:"",note:""}:state.days[di].items[ii];
 modal(ii===null?"일정 추가":"일정 수정",`<div class="form"><input id="itime" placeholder="시간 (예: 15:30)" value="${esc(x.time)}"><input id="ititle" placeholder="일정 (예: Esentai Mall 쇼핑)" value="${esc(x.title)}"><textarea id="inote" placeholder="메모 / 장소 / 예약 정보">${esc(x.note)}</textarea><button class="btn" id="saveItem">${ii===null?"추가하기":"저장하기"}</button></div>`,m=>{
   m.querySelector("#saveItem").onclick=()=>{const item={time:m.querySelector("#itime").value.trim(),title:m.querySelector("#ititle").value.trim(),note:m.querySelector("#inote").value.trim()};if(!item.title){alert("일정 이름을 입력해주세요.");return}if(ii===null)state.days[di].items.push(item);else state.days[di].items[ii]=item;saveState();m.remove();renderSchedule()};
 });
}
function openDayEditor(di){
 const d=state.days[di];
 modal("날짜 정보 편집",`<div class="form"><input id="dtitle" value="${esc(d.title)}" placeholder="날짜 제목"><button class="btn" id="saveDay">저장하기</button></div>`,m=>m.querySelector("#saveDay").onclick=()=>{d.title=m.querySelector("#dtitle").value.trim()||d.title;saveState();m.remove();renderSchedule()});
}
function openPackingEditor(){
 modal("준비물 추가",`<div class="form"><input id="pname" placeholder="예: 삼각대"><button class="btn" id="savePack">추가하기</button></div>`,m=>m.querySelector("#savePack").onclick=()=>{const v=m.querySelector("#pname").value.trim();if(!v)return;state.packing.push({name:v,done:false});saveState();m.remove();renderPacking()});
}
function openNotes(){
 modal("여행 메모",`<div class="form"><textarea id="modalNotes" class="note-box">${esc(state.notes)}</textarea><button class="btn" id="saveModalNote">저장하기</button></div>`,m=>m.querySelector("#saveModalNote").onclick=()=>{state.notes=m.querySelector("#modalNotes").value;saveState();m.remove()});
}
function openPlaceEditor(){
 modal("장소 추가",`<div class="form"><input id="pname" placeholder="장소 이름"><input id="pemoji" placeholder="아이콘 (예: 📍)" value="📍"><input id="pdesc" placeholder="간단한 설명"><input id="pimg" placeholder="사진 URL (선택)"><button class="btn" id="savePlace">추가하기</button></div>`,m=>m.querySelector("#savePlace").onclick=()=>{const name=m.querySelector("#pname").value.trim();if(!name){alert("장소 이름을 입력해주세요.");return}state.customPlaces.push({name,emoji:m.querySelector("#pemoji").value||"📍",desc:m.querySelector("#pdesc").value||"",img:m.querySelector("#pimg").value||""});saveState();m.remove();renderPlaces()});
}
function exportData(){
 const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),a=document.createElement("a");
 a.href=URL.createObjectURL(blob);a.download="almaty-trip-v3-backup.json";a.click();URL.revokeObjectURL(a.href);toast("백업 파일을 만들었어요");
}
function importData(e){
 const file=e.target.files[0];if(!file)return;const r=new FileReader();
 r.onload=()=>{try{const d=JSON.parse(r.result);if(!d.days||!d.packing)throw Error();state=d;saveState();render();}catch(_){alert("올바른 Almaty Trip 백업 파일이 아닙니다.")}};r.readAsText(file)
}
nav.querySelectorAll(".nav").forEach(b=>b.addEventListener("click",()=>go(b.dataset.tab)));
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e});
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js",{updateViaCache:"none"}));
styles();render();
