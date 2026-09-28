window.TRIP = {
  days: [
    { id: 1, date: '10/03', dow: '토', color: '#1F6FD8', title: '알마티 도착 & 시내 구경',
      note: '첫날은 가볍게,\n알마티 분위기 적응!',
      photos: [{ src: 'img/zenkov.jpg', cap: '젠코브 성당' }],
      items: [
        ['01:35', '삼성역 출발 → 인천공항 T1', 'N6703 버스', '약 1시간 15분'],
        ['05:45', '인천 출발 → 췸켄트', 'DV468 · ICN → CIT', '6h 55m'],
        ['09:40', '췸켄트 도착 · 경유', 'CIT', '4시간 대기'],
        ['13:40', '췸켄트 출발 → 알마티', 'DV707 · CIT → ALA', ''],
        ['14:50', '알마티 국제공항 도착', 'Almaty · T1', '입국 → 호텔 체크인'],
        ['16:00', '숙소 이동 및 체크인', 'Almaty', ''],
        ['17:00', '판필로프 공원 → 젠코브 성당', 'Panfilov Park', ''],
        ['18:30', '그린 바자르', 'Green Bazaar', '시간 여유 시'],
        ['19:30', '전통식 저녁 식사', 'Almaty', ''],
        ['20:30', '아르바트 거리 산책', 'Arbat', ''],
        ['22:00', '펍 / 바', "Harat's Pub · All Saints · BUL BAR", '가볍게']
      ] },
    { id: 2, date: '10/04', dow: '일', color: '#EE7A12', title: '메데우 · 쉼블락 · 콕토베 노을',
      note: '노을은 17시 전후!\n멋진 풍경 놓치지 마세요',
      photos: [{ src: 'img/medeu2.jpg', cap: '메데우' }, { src: 'img/almatynight.jpg', cap: '콕토베 야경' }],
      items: [
        ['08:00', '호텔 출발', 'Almaty', ''],
        ['08:30', '메데우', 'Medeu', '스케이트장 · 산책'],
        ['09:30', '쉼블락 케이블카 탑승', 'Shymbulak', ''],
        ['10:00', '쉼블락 관광', 'Shymbulak', '전망 · 산책 · 카페'],
        ['14:00', '점심 식사', 'Shymbulak', ''],
        ['15:00', '알마티 시내 복귀', 'Almaty', ''],
        ['16:30', '콕토베 이동', 'Kok Tobe', ''],
        ['17:00', '콕토베 전망 + 노을 + 야경', 'Kok Tobe', '일몰 약 18:08'],
        ['19:30', '저녁 식사', 'Almaty', ''],
        ['21:00', '칵테일 바', 'Queen of the Darkness · BUL BAR', '']
      ] },
    { id: 3, date: '10/05', dow: '월', color: '#2E9A48', title: '알틴에멜 국립공원', tour: '투어 1일차',
      note: '광활한 대자연을\n만끽하는 첫날!',
      photos: [{ src: 'img/altyn2.jpg', cap: '알틴에멜' }, { src: 'img/dune2.jpg', cap: '싱잉듄' }],
      items: [
        ['이른 아침', '알마티 출발', 'Almaty → Altyn-Emel', '2박 3일 투어 시작'],
        ['낮', '알틴에멜 국립공원', 'Altyn-Emel', '악타우 · 카투타우 · 싱잉듄'],
        ['저녁', '바씨 마을 이동 및 숙박', 'Basshy Village', '']
      ] },
    { id: 4, date: '10/06', dow: '화', color: '#E0344C', title: '콜사이 · 카인디 · 차른 캐년', tour: '투어 2일차',
      note: '호수와 협곡을\n하루에 다 만나는 날!',
      photos: [{ src: 'img/kaindy.jpg', cap: '콜사이 호수' }, { src: 'img/charyn.jpg', cap: '차른 캐년' }],
      items: [
        ['아침', '콜사이 호수', 'Kolsai Lake', ''],
        ['오전~낮', '카인디 호수', 'Kaindy Lake', ''],
        ['낮', '차른 캐년', 'Charyn Canyon', ''],
        ['낮', '문 캐년', 'Moon Canyon', ''],
        ['낮~저녁', '그 외 협곡 / 명소 탐방', '투어 코스', '투어사 확정 필요', true],
        ['저녁', '사티 마을 이동 및 숙박', 'Saty Village', '']
      ] },
    { id: 5, date: '10/07', dow: '수', color: '#0E9488', title: '명소 탐방 & 알마티 복귀', tour: '투어 3일차',
      note: '투어 마지막 날,\n복귀 후엔 푹 쉬기',
      photos: [{ src: 'img/kolsai.jpg', cap: '산악 호수 코스' }],
      items: [
        ['낮', '그 외 명소 탐방', '투어 코스', '투어사 확정 필요', true],
        ['저녁', '알마티 복귀', 'Almaty', '복귀 후 휴식']
      ] },
    { id: 6, date: '10/08', dow: '목', color: '#7B3FC4', title: '빅알마티호수 + 쇼핑 + 마지막 밤',
      note: '마지막 밤까지\n알차게 즐기자!',
      photos: [{ src: 'img/bigalmaty.jpg', cap: '빅알마티호수' }],
      items: [
        ['08:00', '호텔 출발', 'Almaty', ''],
        ['09:00', '빅알마티호수', 'Big Almaty Lake', '전망 · 산책 · 사진'],
        ['12:30', '점심 식사', 'Almaty', ''],
        ['14:00', '쇼핑', 'Esentai Mall · Dostyk Plaza', ''],
        ['16:00', '카페 & 시내 산책', 'Arbat · Panfilov', ''],
        ['18:30', '마지막 저녁', 'Darejani · Alasha 등', ''],
        ['20:30', '칵테일 바', 'BUL BAR · All Saints 등', ''],
        ['22:30', '클럽 (선택)', 'Barcode Almaty', '무리하지 않기']
      ] },
    { id: 7, date: '10/09', dow: '금', color: '#1D4F91', title: '출국 · 인천으로',
      note: 'See you again,\nKazakhstan ♡',
      photos: [],
      items: [
        ['07:00', '기상 및 아침 식사', 'Almaty', ''],
        ['08:00', '호텔 출발', 'Almaty', ''],
        ['08:30', '알마티 공항 도착', 'ALA T1', '출국 준비'],
        ['11:30', '알마티 출발', 'DV708 · ALA → CIT', ''],
        ['12:40', '췸켄트 도착 / 경유', 'CIT', '5시간 50분 대기'],
        ['18:30', '췸켄트 출발', 'DV467 · CIT → ICN', '7h 15m'],
        ['+1 04:45', '인천공항 도착 · 여행 종료', 'ICN · 10/10 (토)', '']
      ] }
  ],
  flights: [
    { leg: 'out', date: '10/03 (토)', no: 'DV468', from: ['ICN', '인천'], to: ['CIT', '췸켄트'], dep: '05:45', arr: '09:40', dur: '6h 55m' },
    { layover: '췸켄트 공항 경유', time: '09:40 – 13:40', dur: '4시간' },
    { leg: 'out', date: '10/03 (토)', no: 'DV707', from: ['CIT', '췸켄트'], to: ['ALA', '알마티'], dep: '13:40', arr: '14:50', dur: '1h 10m', memo: 'T1 도착' },
    { leg: 'in', date: '10/09 (금)', no: 'DV708', from: ['ALA', '알마티'], to: ['CIT', '췸켄트'], dep: '11:30', arr: '12:40', dur: '1h 10m' },
    { layover: '췸켄트 공항 경유', time: '12:40 – 18:30', dur: '5시간 50분' },
    { leg: 'in', date: '10/09 (금)', no: 'DV467', from: ['CIT', '췸켄트'], to: ['ICN', '인천'], dep: '18:30', arr: '04:45', plus: '+1', dur: '7h 15m', memo: '10/10 (토) 도착' }
  ],
  recos: [
    { cat: '맛집', color: '#EE7A12', list: [
      ['Darejani', '조지아 음식', 'Day 6 마지막 저녁'],
      ['Alasha', '카자흐 · 우즈벡 전통식', 'Day 6 마지막 저녁'],
      ['전통식 레스토랑', '현지 전통 요리', 'Day 1 저녁']
    ] },
    { cat: '바 & 클럽', color: '#7B3FC4', list: [
      ["Harat's Pub", '아이리시 펍', 'Day 1'],
      ['BUL BAR', '칵테일 바', 'Day 1 · 2 · 6'],
      ['All Saints', '칵테일 바', 'Day 1 · 6'],
      ['Queen of the Darkness', '칵테일 바', 'Day 2'],
      ['Barcode Almaty', '클럽 (선택)', 'Day 6']
    ] },
    { cat: '쇼핑', color: '#0E9488', list: [
      ['Esentai Mall', '고급 쇼핑몰', 'Day 6 오후'],
      ['Dostyk Plaza', '대형 쇼핑몰', 'Day 6 오후'],
      ['Green Bazaar', '현지 재래시장 · 특산품', 'Day 1 저녁']
    ] }
  ],
  checkpoints: [
    '10/5~10/7 투어는 알틴에멜 → 콜사이/카인디 → 차른/문 캐년 및 기타 명소 → 알마티 복귀 구조.',
    "10/6~10/7의 '그 외 협곡/명소'는 투어사 최종 일정 확정 후 장소명을 업데이트하기.",
    '10/9 귀국편은 췸켄트에서 5시간 50분 경유.',
    '10/10 04:45 인천공항 도착 — 실제 여행 종료일은 10/10.'
  ],
  packing: [
    { group: '서류 · 돈', items: ['여권 (유효기간 6개월 이상)', '항공권 e-티켓', '숙소 · 투어 예약 확인서', '해외결제 카드', '텡게(KZT) 현금 · 투어 잔금', '여행자 보험'] },
    { group: '전자기기', items: ['휴대폰 충전기', '보조배터리', '멀티 어댑터 (C/F 타입)', 'eSIM / 유심', '카메라 · 메모리'] },
    { group: '의류', items: ['경량 패딩 (산악 지역 추위)', '바람막이', '편한 트레킹화', '모자 · 선글라스', '잠옷 · 속옷', '바 · 클럽용 옷 한 벌'] },
    { group: '생활 · 건강', items: ['선크림', '상비약 (소화 · 두통 · 멀미)', '물티슈 · 휴지', '립밤 · 보습제 (건조)', '텀블러 · 물병'] }
  ]
};
