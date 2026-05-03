# 데이터 스키마 합의안 (v1)

이 문서는 `data/index.json` 과 `data/passages/{id}.json` 의 필드별 의미·필수 여부·예시를 정의합니다. 첫 지문 작업 전에 이 문서를 합의하고, 이후 변경 시 `schemaVersion` 을 올립니다.

## 1. id 명명 규칙

지문 식별자는 `숫자세자리-슬러그` 형식을 사용합니다. 예: `001-bdnf`, `012-sino-korean-poetry`. 숫자 prefix는 출현 순서를 결정하고 정렬에 직접 쓰입니다. 슬러그는 영문 소문자와 하이픈만 사용합니다. 같은 id로 `data/passages/{id}.json` 과 `diagrams/{id}.svg` 가 짝을 이룹니다.

## 2. data/index.json (매니페스트)

허브 화면 렌더링에 필요한 최소한의 메타만 담습니다. 본문이나 도식을 포함하지 않습니다.

```json
{
  "version": 1,
  "updatedAt": "2026-05-01",
  "categories": {
    "method":     { "label": "독서 방법", "color": "#8b6f47", "order": 1 },
    "humanities": { "label": "인문",      "color": "#5e548e", "order": 2 },
    "social":     { "label": "사회",      "color": "#2a6f6f", "order": 3 },
    "science":    { "label": "과학·기술", "color": "#1f5582", "order": 4 },
    "arts":       { "label": "예술",      "color": "#a83a4a", "order": 5 }
  },
  "passages": [
    {
      "id": "001-bdnf",
      "order": 1,
      "category": "science",
      "title": "BDNF와 시냅스 가소성",
      "subtitle": "신경영양인자가 학습·기억의 물질적 기반이 되는 과정",
      "structure": "cause",
      "tags": ["인과", "메커니즘"],
      "estMinutes": 12
    }
  ]
}
```

`version` 은 매니페스트 자체의 형식 버전입니다. `categories` 는 5개 영역으로 고정합니다. `passages[]` 의 항목은 카드 한 장에 필요한 정보만 담고, 본문과 개념은 패시지 JSON에 둡니다.

## 3. data/passages/{id}.json (지문 상세)

```json
{
  "id": "001-bdnf",
  "schemaVersion": 1,
  "category": "science",
  "title": "BDNF와 시냅스 가소성",
  "subtitle": "신경영양인자가 학습·기억의 물질적 기반이 되는 과정",
  "source": {
    "book": "EBS 2027 수능특강 국어영역 독서",
    "section": "과학·기술",
    "page": 142
  },

  "predict": {
    "question": "기억은 뇌 안에서 어떤 '물리적' 흔적으로 남을까?",
    "hint": "도식을 보기 전에 잠깐 멈춰서 가설을 세워 봅시다. '아마 이런 내용이지 않을까' 정도면 충분합니다.",
    "tip": "예측이 틀렸을 때 가장 잘 기억에 남습니다."
  },

  "passage": {
    "structure": "cause",
    "paragraphs": [
      {
        "id": "p1",
        "role": "도입",
        "text": "원문 한 단락. 학생이 정독하는 텍스트.",
        "summaryPrompt": "이 문단을 한 줄로 요약해 보세요.",
        "summaryAnswer": "신경 활동이 시냅스 강도를 바꾼다는 도입 진술.",
        "vocab": [
          { "term": "시냅스", "def": "뉴런과 뉴런 사이 신호 전달 지점." }
        ],
        "revealsDiagram": ["node-bdnf"]
      }
    ]
  },

  "diagram": {
    "file": "diagrams/001-bdnf.svg",
    "structure": "cause",
    "caption": "자극에서 시냅스 강화에 이르는 인과 사슬",
    "reveal": {
      "mode": "byParagraph",
      "steps": [
        { "id": "node-bdnf",     "label": "BDNF 분비" },
        { "id": "node-receptor", "label": "수용체 결합" },
        { "id": "node-ltp",      "label": "장기 강화(LTP)" }
      ]
    },
    "altText": "스크린리더용 도식 설명. 자극이 BDNF 분비를 유도하고…"
  },

  "concepts": [
    { "k": "BDNF", "v": "신경 활동에 의해 분비되어 시냅스 강도를 조절하는 단백질." },
    { "k": "LTP",  "v": "반복 자극으로 시냅스 전달 효율이 장기간 강화되는 현상." }
  ],

  "examPoints": [
    {
      "id": "q1",
      "type": "mcq",
      "stem": "윗글에서 BDNF의 역할로 가장 적절한 것은?",
      "choices": [
        "수용체를 합성한다",
        "시냅스 강도를 조절한다",
        "신경전달물질을 분해한다",
        "신경세포를 분열시킨다",
        "자극을 차단한다"
      ],
      "answer": 1,
      "rationale": "본문 3문단의 인과 진술에 근거하여 BDNF가 시냅스 강도를 조절한다는 점을 추론할 수 있다.",
      "tags": ["사실적 이해"]
    }
  ],

  "selfEval": {
    "intervals": { "mastered": 7, "studying": 2, "review": 0 }
  }
}
```

## 4. 필드 명세

다음은 패시지 JSON 각 필드의 의미입니다.

`id` 는 매니페스트와 동일한 식별자(필수). `schemaVersion` 은 패시지 JSON 형식 버전(필수, 현재 1). `category` 는 enum: `method | humanities | social | science | arts` (필수). `title` 과 `subtitle` 은 카드와 학습 헤더에서 같이 쓰입니다(필수).

`source` 는 출처 정보입니다(필수). `book`, `section`, `page` 가 들어가며, 학습 화면 헤더에 작게 노출됩니다(예: "EBS 2027 수능특강 · 과학·기술 · 142쪽"). 학생들이 원본을 펴서 같이 학습하는 흐름을 권장합니다.

`predict` 블록은 Step 1 사전 예측 화면에 그대로 매핑됩니다. `question` 은 화면 큰 글씨(필수), `hint` 는 박스 안 안내(선택, 비어 있으면 기본 문구 사용), `tip` 은 하단 작은 글씨(선택).

`passage.structure` 는 본 지문의 논리 구조 enum(필수). 합의된 6개 값: `compare`, `cause`, `inclusion`, `sequence`, `classification`, `thesis_support`. 각 값의 시각 메타포는 다음과 같이 매핑할 예정입니다.

- `compare` 는 두 항목을 좌우로 배치한 비교표 또는 벤다이어그램.
- `cause` 는 좌→우 단계 박스와 화살표의 인과 사슬.
- `inclusion` 은 큰 박스 안에 작은 박스를 포개는 위계 트리.
- `sequence` 는 가로 타임라인 또는 위→아래 단계 막대.
- `classification` 은 상위 개념에서 가지치기로 내려가는 분류 트리.
- `thesis_support` 는 주장 박스 + 근거 박스들의 뼈대 구조.

`passage.paragraphs[]` 는 단락 배열(필수, 1개 이상). 각 단락은 `id`(필수, 'p1' 'p2' 같은 짧은 식별자), `role`(선택, '도입'·'전개'·'결론' 등 자유 텍스트 라벨), `text`(필수, 원문 한 단락), `summaryPrompt`(선택, 비어 있으면 '이 문단을 한 줄로 요약해 보세요' 기본값), `summaryAnswer`(필수, 정답 한 줄 요약), `vocab[]`(선택, 어휘 hover 툴팁), `revealsDiagram[]`(선택, 이 단락이 끝났을 때 reveal될 SVG 그룹 id 배열)를 가집니다.

`diagram` 블록은 SVG 파일과 reveal 메타입니다. `file` 은 SVG 경로(필수). `structure` 는 도식의 구조 enum으로 보통 `passage.structure` 와 같지만, 도식만 다른 메타포로 그릴 때를 위해 분리합니다(필수). `caption` 은 도식 아래 캡션(선택). `reveal.mode` 는 `byParagraph` 가 기본이며, 단락 진행도와 연동됩니다. `reveal.steps[]` 는 SVG 안의 그룹 id와 라벨 매핑입니다(선택, 명시하지 않으면 단순히 단락당 하나씩 reveal). `altText` 는 스크린리더용 설명(필수).

`concepts[]` 는 Step 3 회상 카드입니다(필수, 3~7개 권장). 각 항목은 `k`(키워드, 필수)와 `v`(설명, 필수). 학생이 카드를 클릭하면 v가 펼쳐집니다.

`examPoints[]` 는 객관식·서답형 문항입니다(선택, 1차 지문에서는 비워두거나 0~1개). `id` 는 진도 저장용 식별자, `type` 은 `mcq | short` (1차 지원), `stem` 은 문항 줄기, `choices[]` 는 mcq 선지(5지선다 권장), `answer` 는 정답 인덱스(0-based), `rationale` 은 해설, `modelAnswer` 는 short type의 모범답안, `tags[]` 는 출제 의도 태그.

`selfEval.intervals` 는 자기평가 결과별 다음 복습까지의 일수입니다(선택, 비우면 전역 기본값 7/2/0). 지문별로 난이도에 따라 조정 가능합니다.

## 5. enum 값 정리

`category` 는 `method | humanities | social | science | arts`. 매니페스트의 `categories` 키와 일치해야 합니다.

`passage.structure` 와 `diagram.structure` 는 `compare | cause | inclusion | sequence | classification | thesis_support`.

`examPoints[].type` 은 `mcq | short`. 1차에서는 두 종류만 지원하고, 추후 `ordering`(순서 맞추기)·`fill`(빈칸 채우기)을 추가할 수 있습니다.

자기평가 키는 `mastered | studying | review`.

진도 저장 상태 파생값은 `untouched | studying | mastered | review`. 자기평가 시점이 만료되면 자동으로 review로 전환됩니다.

## 6. 변경 이력

v1 (2026-05-01) — 최초 합의안. 4단계 학습 흐름(예측·정독+도식·회상·평가) 안 A 채택. 인터랙션 미디엄 묶음(문단별 요약 + 도식 점진 reveal + 어휘 hover) 채택. structure enum 6개 채택. source 블록은 학습 화면 헤더에 노출.
