const TRIP = {
  title:"Almaty Trip",
  dates:"2026.10.03 — 10.10",
  flight:[
    {flight:"DV468",from:"ICN",to:"CIT",depart:"10/03 05:45",arrive:"10/03 09:40",duration:"6h 55m"},
    {flight:"DV707",from:"CIT",to:"ALA",depart:"10/03 13:40",arrive:"10/03 14:50",duration:"1h 10m",transfer:"췸켄트 경유 4시간"},
    {flight:"DV708",from:"ALA",to:"CIT",depart:"10/09 11:30",arrive:"10/09 12:40",duration:"1h 10m"},
    {flight:"DV467",from:"CIT",to:"ICN",depart:"10/09 18:30",arrive:"10/10 04:45",duration:"7h 15m",transfer:"췸켄트 경유 5시간 50분"}
  ],
  days:[
    {date:"10/03",dow:"토",title:"알마티 도착 · 구시가지",tag:"DAY 1",items:[
      ["01:35","삼성역 N6703","인천공항 T1 이동"],
      ["02:50","인천공항 T1","체크인 · 면세품 수령"],
      ["05:45","DV468","ICN → CIT / 6h 55m"],
      ["09:40","췸켄트","4시간 경유"],
      ["13:40","DV707","CIT → ALA / 1h 10m"],
      ["14:50","알마티 T1","입국 → 체크인"],
      ["17:00","판필로프 공원 → 젠코브 성당","도보 관광"],
      ["18:30","그린 바자르","시간 여유 시"],
      ["20:30","아르바트","저녁 후 산책"],
      ["22:00","펍 / 바","Harat's · All Saints · BUL BAR"]
    ]},
    {date:"10/04",dow:"일",title:"메데우 · 쉼블락 · 콕토베",tag:"DAY 2",items:[
      ["08:00","호텔 출발",""],
      ["08:30","메데우","산악 풍경 · 산책"],
      ["09:30","쉼블락 케이블카",""],
      ["10:00","쉼블락","전망 · 산책 · 카페"],
      ["14:00","점심",""],
      ["15:00","알마티 복귀",""],
      ["17:00","콕토베","노을 · 야경 / 일몰 약 18:08"],
      ["21:00","칵테일 바","Queen of the Darkness · BUL BAR"]
    ]},
    {date:"10/05",dow:"월",title:"알틴에멜 · 바씨",tag:"DAY 3",items:[
      ["이른 아침","알마티 출발","2박 3일 투어 시작"],
      ["낮","알틴에멜","악타우 · 카투타우 · 싱잉듄"],
      ["저녁","바씨 마을","숙박"]
    ]},
    {date:"10/06",dow:"화",title:"콜사이 · 카인디 · 차른 · 문 캐년",tag:"DAY 4",items:[
      ["아침","콜사이 호수",""],
      ["오전~낮","카인디 호수",""],
      ["낮","차른 캐년","Valley of the Castles"],
      ["낮","문 캐년",""],
      ["낮~저녁","그 외 협곡·명소","투어사 최종 확정 필요"],
      ["저녁","사티 마을","숙박"]
    ]},
    {date:"10/07",dow:"수",title:"추가 명소 · 알마티 복귀",tag:"DAY 5",items:[
      ["낮","그 외 명소 탐방","투어사 최종 확정 필요"],
      ["저녁","알마티 복귀","복귀 후 휴식"]
    ]},
    {date:"10/08",dow:"목",title:"빅알마티호수 · 쇼핑 · 마지막 밤",tag:"DAY 6",items:[
      ["08:00","호텔 출발",""],
      ["09:00","빅알마티호수","전망 · 산책 · 사진"],
      ["12:30","점심",""],
      ["14:00","Esentai / Dostyk","쇼핑"],
      ["16:00","Arbat · Panfilov","카페 · 시내 산책"],
      ["18:30","마지막 저녁","Darejani · Alasha 등"],
      ["20:30","칵테일","BUL BAR · All Saints"],
      ["22:30","클럽 선택","Barcode"]
    ]},
    {date:"10/09",dow:"금",title:"알마티 → 췸켄트 → 인천",tag:"DAY 7",items:[
      ["07:00","기상 · 아침",""],
      ["08:00","호텔 출발",""],
      ["08:30","알마티 공항 T1","출국 준비"],
      ["11:30","DV708","ALA → CIT / 1h 10m"],
      ["12:40","췸켄트","5h 50m 경유"],
      ["18:30","DV467","CIT → ICN / 7h 15m"],
      ["10/10 04:45","인천공항","여행 종료"]
    ]}
  ],
  places:[
    {name:"Almaty",desc:"도시 · Arbat · Panfilov · Green Bazaar",emoji:"🏙️",img:"https://commons.wikimedia.org/wiki/Special:FilePath/Zenkov_Cathedral,_Almaty.jpg?width=1000"},
    {name:"Medeu · Shymbulak",desc:"산악 풍경 · 케이블카 · 전망",emoji:"🏔️",img:"https://commons.wikimedia.org/wiki/Special:FilePath/View_from_Shymbulak.jpg?width=1000"},
    {name:"Altyn-Emel",desc:"Aktau · Katutau · Singing Dune",emoji:"🏜️",img:"https://commons.wikimedia.org/wiki/Special:FilePath/Altynemel_dune.jpg"},
    {name:"Kolsai Lake",desc:"산악 호수 · 숲 · 트레킹",emoji:"🌲",img:"https://commons.wikimedia.org/wiki/Special:FilePath/Kolsai_lake.jpg?width=1000"},
    {name:"Kaindy Lake",desc:"침수 숲 · 산악 호수",emoji:"🌲",img:"https://commons.wikimedia.org/wiki/Special:FilePath/Kaindy_lake.jpg?width=1000"},
    {name:"Charyn Canyon",desc:"Valley of the Castles",emoji:"🏜️",img:"https://commons.wikimedia.org/wiki/Special:FilePath/Charyn_Canyon_kazakhstan.jpg?width=1000"},
    {name:"Moon Canyon",desc:"10/6 투어 일정",emoji:"🌙",img:"https://commons.wikimedia.org/wiki/Special:FilePath/Kolsai_lake.jpg?width=1000"},
    {name:"Big Almaty Lake",desc:"10/8 반일 자연 일정",emoji:"💧",img:"https://commons.wikimedia.org/wiki/Special:FilePath/Big_Almaty_Lake_(144054115).jpeg?width=1000"}
  ],
  bars:[
    ["BUL BAR","🍸 Cocktail","10/3 · 10/4 · 10/8"],
    ["All Saints","🍺 Bar","10/8 후보"],
    ["Queen of the Darkness","🍸 Bar","10/4 후보"],
    ["Harat's Pub","🍺 Pub","10/3 후보"],
    ["Barcode","🕺 Club","10/8 선택"]
  ],
  route:["Almaty","Altyn-Emel","Basshy","Kolsai","Kaindy","Charyn Canyon","Moon Canyon","Saty","Almaty"],
  packing:["여권","항공권","eSIM","여행자보험","투어 예약 확인","환전","보조배터리","충전기","바람막이","긴바지","운동화","선글라스","카메라","SD카드"]
};