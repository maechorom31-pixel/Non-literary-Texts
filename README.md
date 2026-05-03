# 수능특강 독서 도식 자율학습

EBS 수능특강 독서 지문을 능동 회상과 분산 반복 원칙으로 학습하기 위한 단일 페이지 웹앱.
나주고등학교 3학년 자율학습용 정적 사이트로, GitHub Pages에 호스팅되어 학생들이 태블릿 브라우저에서 접속해 사용합니다.

## 학습 흐름

학습은 4단계로 진행됩니다.

1. 사전 예측 - 제재명만 보고 가설을 세웁니다.
2. 도식 + 정독 - 지문을 단락 단위로 읽고, 단락이 끝날 때마다 한 줄 요약을 떠올린 뒤 정답을 확인합니다. 단락이 끝날 때마다 SVG 도식이 점진적으로 reveal됩니다. 핵심 어휘는 길게 누르면 정의가 표시됩니다.
3. 핵심 개념 회상 - 키워드만 보고 머릿속으로 설명한 뒤 카드를 눌러 정답과 비교합니다.
4. 자기평가 - 세 단계(완전히 이해 / 대체로 이해 / 다시 보기) 중 선택해 다음 복습 시점을 결정합니다.

자기평가 결과에 따라 다음 복습 시점이 달라집니다. mastered는 7일 뒤, studying은 2일 뒤, review는 즉시 복습 권장으로 표시됩니다. 진도는 브라우저 localStorage(`suneung_dokseo_progress_v2`)에 저장되며 기기 간에는 동기화되지 않습니다.

## 폴더 구조

```
/
├─ index.html                      메인 진입점, 학습 셸
├─ README.md                       이 문서
├─ SCHEMA.md                       데이터 JSON 스키마 명세
├─ assets/
│  ├─ css/style.css                디자인 시스템과 화면 스타일
│  └─ js/
│     ├─ app.js                    라우팅, 화면 렌더링
│     ├─ store.js                  진도 저장과 SRS 간격 계산
│     └─ diagram.js                도식 SVG 단계별 reveal
├─ data/
│  ├─ index.json                   지문 메타 목록 (허브 화면용)
│  └─ passages/
│     └─ {id}.json                 지문 상세 (예: 001-bdnf.json)
└─ diagrams/
   └─ {id}.svg                     지문별 도식
```

## 지문 추가 절차

새 지문을 한 편 추가할 때 손대는 곳은 세 군데입니다.

먼저 `data/passages/` 에 `{id}.json` 파일을 하나 만듭니다. 스키마와 필드 의미는 SCHEMA.md를 참고합니다. id는 `001-슬러그` 형식을 권장하며, 숫자 prefix는 출현 순서를 결정합니다.

다음으로 `diagrams/` 에 같은 id의 `.svg` 파일을 추가합니다. SVG 안에는 단계별 reveal 그룹마다 `data-reveal-step="1"` 속성을 부여합니다.

마지막으로 `data/index.json` 의 `passages` 배열에 메타 한 줄을 추가합니다. id, category, title, subtitle, order 정도면 카드를 그릴 수 있습니다.

## 디자인 시스템

이전 프로토타입의 종이-잉크 editorial 스타일을 그대로 계승합니다.

배경 #f5f1e8, 잉크 #1a1612, 보조 잉크 #4a3f33, 룰 라인 #c9bfa8을 기본 토큰으로 두고, 영역별 색상은 독서법 #8b6f47, 인문 #5e548e, 사회 #2a6f6f, 과학·기술 #1f5582, 예술 #a83a4a로 구분합니다. 타이포그래피는 제목 Noto Serif KR, 본문 Pretendard 조합입니다. 매스헤드는 신문 1면 같은 헤더, 카드 그리드는 1px 격자선으로 분리합니다.

## 로컬 미리보기

이 프로젝트는 정적 사이트지만 `fetch()`를 사용하므로 `index.html`을 더블클릭으로 직접 열면 동작하지 않습니다(브라우저가 `file://` 프로토콜에서 데이터 파일 로딩을 막기 때문). 다음 둘 중 하나를 쓰세요.

방법 1 · macOS에서 더블클릭으로 한 번에 실행. 폴더 안의 `serve.command` 파일을 더블클릭하면 자동으로 로컬 서버가 뜨고 브라우저가 열립니다. 첫 실행 시 보안 경고가 나오면 Finder에서 마우스 우클릭 → 열기 → 열기를 한 번 거치면 이후로는 그냥 더블클릭만 해도 됩니다.

방법 2 · 터미널에서 직접 실행. 저장소 폴더로 이동한 뒤 아래 명령을 실행하고, 브라우저에서 `http://localhost:8000/`로 접속합니다.

```
python3 -m http.server 8000
```

## 배포

GitHub Pages에 이 디렉터리를 그대로 올리면 동작합니다. 별도 빌드 단계가 없는 정적 사이트입니다. 권장 워크플로:

```
git init
git add .
git commit -m "initial commit"
git remote add origin <repo-url>
git push -u origin main
```

저장소 Settings > Pages에서 Source를 main 브랜치 루트로 지정합니다. 배포 후 학생용 단축 링크를 학급 게시판에 공지합니다.

## 진도 데이터 초기화

학생이 진도를 초기화하려면 브라우저의 사이트 데이터를 지우거나, 콘솔에서 다음을 실행합니다.

```js
localStorage.removeItem('suneung_dokseo_progress_v2');
location.reload();
```

## 작업 단계

이 저장소는 다음 단계로 점진 개발합니다.

1. 폴더 구조 셋업 (현재)
2. 첫 지문 데이터 작성과 스키마 검증
3. 첫 지문 SVG 도식 설계와 구현
4. 메인 HTML 셸과 학습 흐름 구현
5. 검토 및 피드백
6. 두 번째 지문 추가로 구조 재검증, 이후 확장
