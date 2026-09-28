Almaty Trip v2
================
모바일 PWA 여행 플래너입니다.

기능:
- 홈 대시보드 / 오늘 일정
- 10/03~10/09 상세 일정
- DV468 / DV707 / DV708 / DV467 항공편
- 관광지 사진 카드 + Google Maps 링크
- 알틴에멜/콜사이/카인디/차른/문 캐년/빅알마티호수 루트
- 바/클럽 추천
- 준비물 체크리스트 localStorage 저장
- PWA 설치 및 Service Worker 오프라인 캐시

GitHub Pages:
Repository 루트에 index.html, app.js, data.js, manifest.webmanifest, sw.js, icons 폴더를 업로드하고
Settings > Pages > Deploy from a branch > main / root로 설정하세요.

사진:
현재 장소 카드는 웹 이미지 URL을 사용합니다. 원하는 실제 관광지 사진 파일을 images 폴더에 넣고 data.js의 img 값을 로컬 경로로 바꾸면 완전 오프라인 사진도 가능합니다.


Almaty Trip v3 - 편집 기능
--------------------------
- 일정 추가 / 수정 / 삭제
- 날짜별 일정 제목 편집
- 준비물 추가 / 체크 / 삭제
- 여행 메모 저장
- 장소 추가 / 삭제
- LocalStorage 자동 저장
- JSON 백업 내보내기 / 복원
- 기존 항공편/장소/투어 정보는 기본 데이터로 유지
