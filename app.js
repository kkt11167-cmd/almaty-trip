const app=document.getElementById("app"), nav=document.getElementById("nav");
const STORAGE="almaty-trip-v3-data";
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
function photoStyle(url){return `background-image:url("${url}")`}
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
 `;
 document.head.appendChild(s);
}

function render(){
 document.querySelectorAll(".nav").forEach(b=>b.classList.toggle("active",b.dataset.tab===current));
 if(current==="home") renderHome();
 else if(current==="schedule") renderSchedule();
 else if(current==="flight") renderFlight();
 else if(current==="places") renderPlaces();
 else renderMore();
 window.scrollTo({top:0,behavior:"instant"});
}
function hero(){return `<section class="hero"><div class="kicker">KAZAKHSTAN · 2026 · V3</div><h1>ALMATY<br>TRIP</h1><p>${TRIP.dates}</p><div class="hero-grid"><div class="stat"><small>여행</small><b>10/03 — 10/10</b></div><div class="stat"><small>편집</small><b>직접 추가 · 수정</b></div></div></section>`}

function renderHome(){
 const d=state.days[0];
 app.innerHTML=hero()+`<main class="content">
 <div class="card card-pad"><b>✏️ 내 여행 플래너</b><p class="sub" style="margin-top:6px">일정, 준비물, 메모를 직접 바꾸고 추가할 수 있어요. 변경사항은 이 휴대폰에 자동 저장됩니다.</p>
 <div class="backup"><button class="btn" id="addHome">+ 일정 추가</button><button class="btn light" id="noteHome">📝 메모</button></div></div>
 <h2 class="section-title">📅 여행 시작 일정</h2>
 <div class="card day"><div class="day-head"><b>${esc(d.title)}</b><span class="pill">${d.date}</span></div><div class="timeline">${d.items.slice(0,7).map(x=>`<div class="item"><div class="time">${esc(x.time)}</div><div><div class="item-title">${esc(x.title)}</div><div class="item-note">${esc(x.note)}</div></div></div>`).join("")}</div><div class="day-add"><button class="btn light" id="editFirst">이 날짜 편집하기</button></div></div>
 <h2 class="section-title">⭐ 여행 핵심</h2><div class="place-grid">${TRIP.places.slice(1,5).map(p=>`<div class="card place"><div class="photo" style="${photoStyle(p.img)}"><div class="photo-label">${p.emoji} ${p.name}</div></div><div class="card-pad"><p>${p.desc}</p></div></div>`).join("")}</div>
 </main>`;
 document.getElementById("addHome").onclick=()=>openDayPicker();
 document.getElementById("noteHome").onclick=()=>openNotes();
 document.getElementById("editFirst").onclick=()=>openDayEditor(0);
}

function renderSchedule(){
 app.innerHTML=`<main class="content"><div class="section-title">📅 전체 일정</div><div class="sub">내가 직접 수정할 수 있는 여행 일정표</div>
 ${state.days.map((d,i)=>`<div class="card day"><div class="day-head"><b>${d.tag} · ${d.date} (${d.dow})</b><span class="pill">${esc(d.title)}</span></div>
 <div class="timeline">${d.items.length?d.items.map((x,j)=>`<div class="item"><div class="time">${esc(x.time)}</div><div><div class="item-title">${esc(x.title)}</div><div class="item-note">${esc(x.note)}</div><div class="item-actions"><button data-edit="${i}" data-item="${j}">수정</button><button class="danger" data-del="${i}" data-item="${j}">삭제</button></div></div></div>`).join(""):`<div class="empty">아직 일정이 없습니다.</div>`}</div>
 <div class="day-add"><button class="btn light" data-add="${i}">＋ 이 날짜에 일정 추가</button> <button class="smallbtn" data-dayedit="${i}">날짜/제목 편집</button></div></div>`).join("")}</main>`;
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
 app.innerHTML=`<main class="content"><div class="section-title">📸 PLACES</div><div class="sub">관광지를 추가해 나만의 장소 리스트로 만들 수 있어요.</div>
 <button class="btn" id="addPlace">＋ 장소 추가</button>
 <div class="place-grid" style="margin-top:10px">${all.map((p,i)=>`<article class="card place custom-place"><div class="photo" style="${photoStyle(p.img||"")}"><div class="photo-label">${p.emoji||"📍"} ${esc(p.name)}</div></div><div class="card-pad"><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p>${i>=TRIP.places.length?`<button class="smallbtn danger del" data-pdel="${i-TRIP.places.length}">삭제</button>`:`<a class="btn light" style="margin-top:10px" target="_blank" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name+" Kazakhstan")}">📍 지도에서 보기</a>`}</div></article>`).join("")}</div></main>`;
 document.getElementById("addPlace").onclick=()=>openPlaceEditor();
 document.querySelectorAll("[data-pdel]").forEach(b=>b.onclick=()=>{state.customPlaces.splice(+b.dataset.pdel,1);saveState();renderPlaces()});
}

function renderMore(){
 app.innerHTML=`<main class="content">
 <div class="section-title">🎒 준비물</div><div class="sub">직접 추가하고 체크할 수 있어요.</div>
 <div class="card card-pad"><div id="packing">${state.packing.map((p,i)=>`<div class="check ${p.done?"done":""}"><input type="checkbox" data-pack="${i}" ${p.done?"checked":""}><label>${esc(p.name)}</label><button class="smallbtn danger" data-pdel2="${i}" style="margin-left:auto">삭제</button></div>`).join("")}</div><button class="btn light" id="addPack" style="margin-top:12px">＋ 준비물 추가</button></div>
 <div class="section-title" style="margin-top:22px">📝 여행 메모</div><div class="card card-pad"><textarea id="notes" class="note-box form" placeholder="맛집, 투어사 연락처, 현지에서 생긴 일정 등을 자유롭게 적어보세요.">${esc(state.notes)}</textarea><button class="btn" id="saveNotes" style="margin-top:9px">메모 저장</button></div>
 <div class="section-title" style="margin-top:22px">🍸 NIGHTLIFE</div><div class="card card-pad">${state.bars.map(b=>`<div class="bar"><div><b>${esc(b.name)}</b><div class="sub" style="margin:3px 0 0">${esc(b.note)}</div></div><span class="tag">${esc(b.type)}</span></div>`).join("")}</div>
 <div class="section-title" style="margin-top:22px">💾 데이터 관리</div><div class="card card-pad"><p class="sub">여행 일정과 준비물은 이 브라우저에 저장됩니다. 다른 휴대폰에서도 쓰려면 백업 파일을 내려받아 복원할 수 있어요.</p><div class="backup"><button class="btn" id="export">백업 내보내기</button><button class="btn light" id="import">백업 복원</button></div><input type="file" id="fileInput" accept=".json" hidden></div>
 </main>`;
 document.querySelectorAll("[data-pack]").forEach(x=>x.onchange=()=>{state.packing[+x.dataset.pack].done=x.checked;localStorage.setItem(STORAGE,JSON.stringify(state));x.closest(".check").classList.toggle("done",x.checked)});
 document.querySelectorAll("[data-pdel2]").forEach(b=>b.onclick=()=>{state.packing.splice(+b.dataset.pdel2,1);saveState();renderMore()});
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
 modal("준비물 추가",`<div class="form"><input id="pname" placeholder="예: 삼각대"><button class="btn" id="savePack">추가하기</button></div>`,m=>m.querySelector("#savePack").onclick=()=>{const v=m.querySelector("#pname").value.trim();if(!v)return;state.packing.push({name:v,done:false});saveState();m.remove();renderMore()});
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
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js"));
styles();render();
