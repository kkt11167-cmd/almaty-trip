(function () {
  const T = window.TRIP;
  const LS = k => 'almaty26.' + k;
  const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(LS(k))); return v ?? d; } catch (e) { return d; } };
  const save = (k, v) => localStorage.setItem(LS(k), JSON.stringify(v));
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  let doneMap = load('done', {});       // "d-i": true
  let packDone = load('pack', {});
  let packCustom = load('packCustom', []);
  let tab = load('tab', 'plan');

  // ---------- Almaty time (UTC+5) ----------
  function almatyNow() { const d = new Date(); return new Date(d.getTime() + d.getTimezoneOffset() * 60000 + 5 * 3600000); }
  const START = new Date(2026, 9, 3);
  function tripDayIndex() {
    const n = almatyNow(); const d0 = new Date(n.getFullYear(), n.getMonth(), n.getDate());
    const diff = Math.round((d0 - START) / 86400000);
    return diff; // 0 = day1
  }
  const todayIdx = tripDayIndex();
  let day = load('day', null);
  if (todayIdx >= 0 && todayIdx < 7 && load('autoDayFor', '') !== String(todayIdx)) { day = todayIdx + 1; save('autoDayFor', String(todayIdx)); }
  if (!day) day = 1;

  // D-day badge
  (function () {
    const el = $('#dday');
    if (todayIdx < 0) el.innerHTML = `<small>출발까지</small>D-${-todayIdx}`;
    else if (todayIdx < 7) el.innerHTML = `<small>여행 중</small>DAY ${todayIdx + 1}`;
    else if (todayIdx === 7) el.innerHTML = `<small>귀국</small>WELCOME`;
    else el.innerHTML = `<small>다녀왔어요</small>♡`;
  })();

  const ICON = {
    check: '<svg viewBox="0 0 12 12" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg>',
    plane: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M21 15.5v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V8.5l-8 5v2l8-2.5V18l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-5z"/></svg>',
    bus: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="4" y="3" width="16" height="15" rx="3"/><path d="M4 11h16M8 21v-3M16 21v-3"/><circle cx="8" cy="14.5" r=".6" fill="currentColor"/><circle cx="16" cy="14.5" r=".6" fill="currentColor"/></svg>',
    tabs: {
      plan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
      flight: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 15.5v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V8.5l-8 5v2l8-2.5V18l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-5z"/></svg>',
      map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6z"/><path d="M9 4v14M15 6v14"/></svg>',
      reco: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="m12 3.5 2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8L3.6 9.6l5.8-.8z"/></svg>',
      pack: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="7" width="16" height="13" rx="3"/><path d="M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2M8.5 13.5l2.3 2.3 4.7-4.8"/></svg>'
    }
  };

  // ---------- tabs ----------
  const TABS = [['plan', '일정'], ['flight', '항공'], ['map', '루트'], ['reco', '추천'], ['pack', '준비물']];
  function renderTabs() {
    $('#tabbar').innerHTML = TABS.map(([k, l]) => `<button class="tab ${tab === k ? 'on' : ''}" data-tab="${k}">${ICON.tabs[k]}${l}</button>`).join('');
    document.querySelectorAll('.view').forEach(v => v.classList.toggle('on', v.id === 'v-' + tab));
  }
  $('#tabbar').addEventListener('click', e => {
    const b = e.target.closest('[data-tab]'); if (!b) return;
    tab = b.dataset.tab; save('tab', tab); renderTabs();
    const hero = $('.hero'); window.scrollTo({ top: tab === 'plan' ? Math.min(window.scrollY, hero.offsetHeight) : hero.offsetHeight - 10, behavior: 'smooth' });
    if (tab === 'map') renderMap();
  });

  // ---------- plan ----------
  const isClock = t => /^\d{2}:\d{2}$/.test(t);
  function dayProgress(d) {
    const n = d.items.length; let c = 0;
    d.items.forEach((_, i) => { if (doneMap[d.id + '-' + i]) c++; });
    return [c, n];
  }
  function nowIndex(d) {
    if (todayIdx !== d.id - 1) return -1;
    const n = almatyNow(); const mins = n.getHours() * 60 + n.getMinutes();
    let idx = -1;
    d.items.forEach((it, i) => { if (isClock(it[0])) { const [h, m] = it[0].split(':').map(Number); if (h * 60 + m <= mins) idx = i; } });
    return idx;
  }
  function renderPlan() {
    const d = T.days[day - 1];
    document.documentElement.style.setProperty('--c', d.color);
    const [c, n] = dayProgress(d);
    const ni = nowIndex(d);
    const chips = T.days.map(x => {
      const [a, b] = dayProgress(x);
      return `<button class="chip ${x.id === day ? 'on' : ''} ${todayIdx === x.id - 1 ? 'today' : ''}" data-day="${x.id}" style="--cc:${x.color};--p:${Math.round(a / b * 100)}%"><b>D${x.id}</b><i>${x.date.slice(3)}일 ${x.dow}</i><span class="bar"></span></button>`;
    }).join('');
    const ph = d.photos.length ? `<div class="photos">${d.photos.map(p => `<div class="ph ${d.photos.length === 1 ? 'one' : 'two'}"><img src="${p.src}" alt="${esc(p.cap)}" loading="lazy"><span>${esc(p.cap)}</span></div>`).join('')}</div>` : '';
    const items = d.items.map((it, i) => {
      const key = d.id + '-' + i; const done = !!doneMap[key];
      const [tm, ti, pl, nt, warn] = it;
      return `<button class="it ${done ? 'done' : ''} ${i === ni ? 'now' : ''}" data-k="${key}">
        <div class="tm ${isClock(tm) ? '' : 'w'}">${esc(tm)}</div>
        <div class="rail"><span class="dot">${ICON.check}</span></div>
        <div class="box"><div class="ti">${esc(ti)}</div>${pl ? `<div class="pl">${esc(pl)}</div>` : ''}${nt ? `<span class="nt ${warn ? 'warn' : ''}">${esc(nt)}</span>` : ''}</div>
      </button>`;
    }).join('');
    $('#v-plan').innerHTML = `
      <div class="chips"><div class="chips-row" id="chipsRow">${chips}</div></div>
      <div class="dayhead">
        <div class="dh-top"><span class="dh-num">Day ${d.id}</span><span class="dh-date">10월 ${+d.date.slice(3)}일 (${d.dow})</span>${d.tour ? `<span class="dh-tour">${d.tour}</span>` : ''}</div>
        <h3>${esc(d.title)}</h3>
        <div class="dh-note">${esc(d.note)}</div>
        <div class="dh-prog"><div class="trk"><div style="width:${n ? c / n * 100 : 0}%"></div></div>${c}/${n} 완료</div>
      </div>
      ${ph}
      <div class="tl"><div class="tl-hint">일정을 탭하면 완료 체크돼요</div>${items}</div>
      <div class="daynav">
        <button data-go="-1" ${day === 1 ? 'disabled' : ''}>‹ Day ${day - 1 || ''}</button>
        <button class="nx" data-go="1" ${day === 7 ? 'disabled' : ''}>Day ${day < 7 ? day + 1 : ''} ›</button>
      </div>`;
    const row = $('#chipsRow'); const on = row.querySelector('.chip.on');
    if (on) row.scrollLeft = on.offsetLeft - row.clientWidth / 2 + on.clientWidth / 2;
  }
  $('#v-plan').addEventListener('click', e => {
    const ch = e.target.closest('[data-day]');
    if (ch) { day = +ch.dataset.day; save('day', day); renderPlan(); return; }
    const go = e.target.closest('[data-go]');
    if (go) { day = Math.min(7, Math.max(1, day + +go.dataset.go)); save('day', day); renderPlan(); const top = $('.chips').offsetTop; if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' }); return; }
    const it = e.target.closest('[data-k]');
    if (it) { const k = it.dataset.k; doneMap[k] = !doneMap[k]; if (!doneMap[k]) delete doneMap[k]; save('done', doneMap); renderPlan(); }
  });

  // ---------- flights ----------
  function renderFlights() {
    const card = f => {
      const fc = f.leg === 'out' ? '#1F6FD8' : '#7B3FC4';
      return `<div class="bp" style="--fc:${fc}">
        <div class="bp-top"><b>${f.no}</b><span>${f.date}</span></div>
        <div class="bp-mid">
          <div class="ap"><div class="code">${f.from[0]}</div><div class="city">${f.from[1]}</div><div class="t">${f.dep}</div></div>
          <div class="bp-line"><div class="ln"><i></i>${ICON.plane.replace('<svg', '<svg style="transform:rotate(90deg)"')}<i></i></div><small>${f.dur}</small></div>
          <div class="ap r"><div class="code">${f.to[0]}</div><div class="city">${f.to[1]}</div><div class="t">${f.arr}${f.plus ? `<sup>${f.plus}</sup>` : ''}</div></div>
        </div>
        ${f.memo ? `<div class="bp-foot">${f.memo}</div>` : ''}
      </div>`;
    };
    const lay = f => `<div class="lay">${f.layover} · ${f.time}<b>${f.dur}</b></div>`;
    const out = T.flights.slice(0, 3), back = T.flights.slice(3);
    $('#v-flight').innerHTML = `
      <div class="sec-h"><h2>Flight Journey</h2><span>항공 & 이동</span></div>
      <div class="fgroup">
        <h4>가는 날 · 10/03 (토)</h4>
        <div class="bus"><div class="ic">${ICON.bus}</div><div class="tx">삼성역 → 인천공항 T1<small>N6703 버스 · 체크인 · 면세품 수령</small></div><div class="tm2">01:35<small>02:50 도착</small></div></div>
        ${out.map(f => f.layover ? lay(f) : card(f)).join('')}
        <h4 style="margin-top:22px">오는 날 · 10/09 (금)</h4>
        ${back.map(f => f.layover ? lay(f) : card(f)).join('')}
      </div>`;
  }

  // ---------- map ----------
  const P = {
    ALA: [70, 196, '알마티'], KOK: [80, 188, ''], MED: [98, 212, '메데우·쉼블락'], BAL: [72, 236, '빅알마티호수'],
    ALT: [268, 110, '알틴에멜'], BAS: [300, 70, '바씨 마을'],
    KOL: [226, 244, '콜사이'], KAI: [258, 236, '카인디'], SAT: [236, 262, '사티 마을'],
    CHA: [330, 184, '차른 캐년'], MOON: [352, 204, '문 캐년']
  };
  const ROUTES = [
    { d: 1, pts: ['ALA'] },
    { d: 2, pts: ['ALA', 'MED', 'KOK'] },
    { d: 3, pts: ['ALA', 'ALT', 'BAS'] },
    { d: 4, pts: ['BAS', 'KOL', 'KAI', 'CHA', 'MOON', 'SAT'] },
    { d: 5, pts: ['SAT', 'ALA'] },
    { d: 6, pts: ['ALA', 'BAL'] },
    { d: 7, pts: ['ALA'] }
  ];
  const MAPDESC = ['시내 구경', '메데우 · 쉼블락 · 콕토베', '알틴에멜 → 바씨', '콜사이 · 카인디 · 차른', '사티 → 알마티', '빅알마티호수 · 쇼핑', '알마티 → 췸켄트 → 인천'];
  let mapSel = 0;
  function pathFor(pts) {
    if (pts.length < 2) return '';
    let s = `M${P[pts[0]][0]},${P[pts[0]][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = P[pts[i - 1]], [x1, y1] = P[pts[i]];
      const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, dx = x1 - x0, dy = y1 - y0;
      s += ` Q${mx - dy * 0.15},${my + dx * 0.15} ${x1},${y1}`;
    }
    return s;
  }
  function renderMap() {
    const active = mapSel;
    const paths = ROUTES.map(r => {
      const col = T.days[r.d - 1].color; const on = !active || active === r.d;
      return pathFor(r.pts) ? `<path d="${pathFor(r.pts)}" fill="none" stroke="${col}" stroke-width="${active === r.d ? 4 : 2.6}" stroke-dasharray="${r.d === 5 ? '2 6' : '7 6'}" stroke-linecap="round" opacity="${on ? 1 : .15}"/>` : '';
    }).join('');
    const used = new Set(); if (active) ROUTES[active - 1].pts.forEach(p => used.add(p));
    const pins = Object.entries(P).map(([k, [x, y, l]]) => {
      const on = !active || used.has(k); const big = k === 'ALA';
      const lx = ['BAL', 'SAT', 'KOL'].includes(k) ? x : x + (['MOON'].includes(k) ? -4 : 0);
      const ly = ['BAL', 'SAT', 'KOL', 'KAI'].includes(k) ? y + 18 : y - 11;
      const anchor = k === 'MOON' ? 'end' : k === 'MED' ? 'start' : 'middle';
      return `<g opacity="${on ? 1 : .3}">
        <circle cx="${x}" cy="${y}" r="${big ? 8 : 5}" fill="#fff" stroke="${big ? '#14233B' : '#14233B'}" stroke-width="${big ? 3 : 2}"/>
        ${big ? `<circle cx="${x}" cy="${y}" r="3" fill="#E0344C"/>` : ''}
        ${l ? `<text x="${k === 'MED' ? x + 8 : k === 'MOON' ? x + 6 : lx}" y="${k === 'MED' ? y + 4 : k === 'MOON' ? y + 16 : ly}" text-anchor="${k === 'MOON' ? 'middle' : anchor}" font-size="${big ? 14 : 11.5}" font-weight="${big ? 800 : 700}" fill="#14233B" paint-order="stroke" stroke="#fff" stroke-width="4" stroke-linejoin="round">${l}</text>` : ''}
      </g>`;
    }).join('');
    const svg = `<svg viewBox="0 0 400 300">
      <defs>
        <pattern id="dots" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#D7E0EB"/></pattern>
        <linearGradient id="mt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E7EEF6"/><stop offset="1" stop-color="#D5E1EE"/></linearGradient>
      </defs>
      <rect width="400" height="300" fill="#F7F9FC"/><rect width="400" height="300" fill="url(#dots)"/>
      <path d="M0 250 L40 226 L70 244 L110 218 L150 240 L190 222 L230 246 L270 226 L320 248 L360 232 L400 246 L400 300 L0 300Z" fill="url(#mt)"/>
      <text x="386" y="290" text-anchor="end" font-size="10" font-weight="700" fill="#9AABC0" letter-spacing="1.5">TIAN SHAN</text>
      <path d="M120 150 C150 140 170 128 196 132 C230 136 250 120 290 128 C320 134 350 120 400 112" fill="none" stroke="#B9D6F2" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="130" cy="150" rx="22" ry="8" transform="rotate(-18 130 150)" fill="#CFE3F7"/>
      <text x="150" y="124" font-size="9.5" fill="#7FA3C8" font-weight="600">일리 강 · 카프차가이</text>
      <g transform="translate(20,30)"><path d="M0 0 H38" stroke="#9AABC0" stroke-width="1.5" stroke-dasharray="3 3"/><text x="0" y="-6" font-size="10" fill="#7B8BA3" font-weight="700">← 췸켄트 (경유)</text></g>
      <g transform="translate(372,34)"><circle r="13" fill="#fff" stroke="#D5DEE9"/><path d="M0 -9 L3.5 0 L0 9 L-3.5 0Z" fill="#14233B"/><path d="M0 -9 L3.5 0 L-3.5 0Z" fill="#E0344C"/><text y="-16" text-anchor="middle" font-size="9" font-weight="800" fill="#14233B">N</text></g>
      ${paths}${pins}
    </svg>`;
    const lg = T.days.map((d, i) => `<button class="lg ${active === d.id ? 'on' : ''}" data-m="${d.id}" style="--cc:${d.color}"><b>${d.id}</b><span>${MAPDESC[i]}</span><small>${d.date} ${d.dow}</small></button>`).join('');
    $('#v-map').innerHTML = `
      <div class="sec-h"><h2>여행 루트 한눈에</h2><span>${active ? 'Day ' + active + ' 보는 중' : '전체 루트'}</span></div>
      <div class="mapcard">${svg}<div class="legend">${lg}</div></div>
      <p class="maptip" style="padding-top:10px">Day를 누르면 그날 동선만 보여요 · 한 번 더 누르면 전체</p>
      <div class="sec-h"><h2>체크 포인트</h2><span>메모</span></div>
      <div class="cps">${T.checkpoints.map((c, i) => `<div class="cp"><b>${i + 1}</b><div>${esc(c)}</div></div>`).join('')}</div>`;
  }
  $('#v-map').addEventListener('click', e => {
    const b = e.target.closest('[data-m]'); if (!b) return;
    mapSel = mapSel === +b.dataset.m ? 0 : +b.dataset.m; renderMap();
  });

  // ---------- recos ----------
  function renderReco() {
    $('#v-reco').innerHTML = `<div class="sec-h"><h2>추천 맛집 · 바 · 쇼핑</h2><span>일정 속 장소</span></div>` +
      T.recos.map(g => `<div class="rgroup" style="--rc:${g.color}"><h4>${g.cat}<small>${g.list.length}곳</small></h4>
        ${g.list.map(r => `<a class="ri" href="https://www.google.com/maps/search/${encodeURIComponent(r[0] + ' Almaty')}" target="_blank" rel="noopener"><div class="av">${esc(r[0][0])}</div><div><div class="n">${esc(r[0])}</div><div class="d">${esc(r[1])}</div></div><span class="tg">${esc(r[2])}</span></a>`).join('')}
      </div>`).join('') + `<p class="maptip">장소를 누르면 구글 지도에서 열려요</p>`;
  }

  // ---------- packing ----------
  function renderPack() {
    const groups = T.packing.map(g => ({ group: g.group, items: g.items.map(t => ({ t, k: g.group + '|' + t })) }));
    groups.push({ group: '내가 추가한 것', items: packCustom.map(t => ({ t, k: 'c|' + t, custom: true })), custom: true });
    const all = groups.flatMap(g => g.items); const c = all.filter(i => packDone[i.k]).length; const n = all.length;
    const pct = n ? c / n : 0; const R = 23, C = 2 * Math.PI * R;
    $('#v-pack').innerHTML = `
      <div class="sec-h"><h2>준비물 체크리스트</h2><span>탭해서 체크</span></div>
      <div class="pk-sum">
        <svg class="ring" viewBox="0 0 56 56"><circle cx="28" cy="28" r="${R}" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="6"/><circle cx="28" cy="28" r="${R}" fill="none" stroke="#FFD43B" stroke-width="6" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct)}" transform="rotate(-90 28 28)" style="transition:stroke-dashoffset .4s"/><text x="28" y="32.5" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">${Math.round(pct * 100)}%</text></svg>
        <div><b>${c === n && n ? '짐 싸기 완료!' : `${n - c}개 남았어요`}</b><small>${c} / ${n} 준비 완료</small></div>
        <button data-reset>초기화</button>
      </div>
      ${groups.map(g => {
        const gc = g.items.filter(i => packDone[i.k]).length;
        return `<div class="pk"><h4><span>${g.group}</span><span>${gc}/${g.items.length}</span></h4>
          ${g.items.map(i => `<div class="pi ${packDone[i.k] ? 'done' : ''}" data-pk="${esc(i.k)}" role="button"><span class="cb">${ICON.check}</span><span>${esc(i.t)}</span>${i.custom ? `<button class="x" data-del="${esc(i.t)}" aria-label="삭제">×</button>` : ''}</div>`).join('')}
          ${g.custom ? `<form class="addrow" id="addForm"><input id="addIn" placeholder="준비물 추가하기" maxlength="40"><button>추가</button></form>` : ''}
        </div>`;
      }).join('')}`;
  }
  $('#v-pack').addEventListener('click', e => {
    const del = e.target.closest('[data-del]');
    if (del) { e.stopPropagation(); const t = del.dataset.del; packCustom = packCustom.filter(x => x !== t); delete packDone['c|' + t]; save('packCustom', packCustom); save('pack', packDone); renderPack(); return; }
    if (e.target.closest('[data-reset]')) { if (confirm('준비물 체크를 모두 초기화할까요?')) { packDone = {}; save('pack', packDone); renderPack(); } return; }
    const p = e.target.closest('[data-pk]');
    if (p) { const k = p.dataset.pk; packDone[k] = !packDone[k]; if (!packDone[k]) delete packDone[k]; save('pack', packDone); renderPack(); }
  });
  $('#v-pack').addEventListener('submit', e => {
    e.preventDefault(); const v = $('#addIn').value.trim(); if (!v || packCustom.includes(v)) return;
    packCustom.push(v); save('packCustom', packCustom); renderPack(); $('#addIn').focus();
  });

  renderTabs(); renderPlan(); renderFlights(); renderMap(); renderReco(); renderPack();
  setInterval(() => { if (tab === 'plan') renderPlan(); }, 60000);
})();
