# 대조시장 폰트 체험 웹페이지

## 프로젝트 개요

대조시장 재디자인 프로젝트의 전용 폰트를 사용자가 직접 체험하고 꾸며볼 수 있는 인터랙티브 웹 애플리케이션입니다. 사용자는 텍스트를 입력하고, 폰트 스타일(색상, 크기, 굵기, 기울임)과 배경색을 자유롭게 조정한 후 저장할 수 있습니다.

## 주요 기능 (MVP)

### 구현 완료된 기능
- ✅ 대조시장 전용 폰트 적용 (DaejoMarket-Regular.ttf 커스텀 폰트)
- ✅ 텍스트 입력 영역 (ContentEditable 메모창)
- ✅ 스타일 편집 툴바
  - 폰트 색상 선택 (7가지 프리셋)
  - 배경색 선택 (7가지 프리셋)
  - 폰트 크기 조절 (16px ~ 72px)
  - 굵게(Bold) 토글
  - 기울임(Italic) 토글
- ✅ 메모 저장 기능 (PostgreSQL)
- ✅ 저장된 메모 불러오기 (사용자 요청)
- ✅ Toast 알림
- ✅ 다층 XSS 방지 (Zod schema + sanitize-html + client-side validation)
- ✅ 엄격한 입력값 검증 (정규식, enum)
- ✅ 반응형 디자인
- ✅ 다크 모드 지원
- ✅ 풍부한 히어로 섹션 (시장 분위기 표현)

## 기술 스택

### Frontend
- React 18
- TypeScript
- Wouter (라우팅)
- TanStack Query (데이터 페칭)
- Tailwind CSS (스타일링)
- Shadcn UI (컴포넌트)
- Lucide React (아이콘)

### Backend
- Node.js + Express
- PostgreSQL (Neon)
- Drizzle ORM
- sanitize-html (XSS 방지)

### 웹폰트
- **DaejoMarket-Regular.ttf** (대조시장 전용 커스텀 폰트, 메모 디스플레이용)
- Black Han Sans (폴백 폰트)
- Noto Sans KR (UI 및 폴백 폰트)
- 폰트 위치: `client/public/fonts/DaejoMarket-Regular.ttf`

## 프로젝트 구조

```
├── client/                 # 프론트엔드
│   ├── public/
│   │   └── fonts/        # 커스텀 폰트
│   │       └── DaejoMarket-Regular.ttf
│   ├── src/
│   │   ├── components/    # UI 컴포넌트
│   │   │   ├── ui/       # Shadcn UI 컴포넌트
│   │   │   └── theme-toggle.tsx
│   │   ├── pages/        # 페이지
│   │   │   ├── home.tsx  # 메인 페이지
│   │   │   └── not-found.tsx
│   │   ├── App.tsx
│   │   └── index.css     # 글로벌 스타일 + @font-face
│   └── index.html
├── server/                # 백엔드
│   ├── routes.ts         # API 라우트
│   └── storage.ts        # 데이터베이스 로직
├── shared/
│   └── schema.ts         # 공유 타입 & 스키마
└── db/
    └── index.ts          # 데이터베이스 연결
```

## 데이터베이스 스키마

### memos 테이블
```sql
- id: varchar (UUID, Primary Key)
- content: text (사용자 입력 텍스트, sanitized)
- styles: jsonb {
    color: string,        # 폰트 색상 (hex)
    fontSize: string,     # 폰트 크기 (16-72px)
    fontWeight: string,   # 'normal' | 'bold'
    fontStyle: string     # 'normal' | 'italic'
  }
- bg_color: varchar (배경색, hex)
- created_at: timestamp
```

## API 엔드포인트

### POST /api/memos
메모 저장

**Request Body:**
```json
{
  "content": "대조시장 폰트!",
  "styles": {
    "color": "#D32F2F",
    "fontSize": "32px",
    "fontWeight": "bold",
    "fontStyle": "italic"
  },
  "bgColor": "#FFF8E1"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "createdAt": "2025-11-14T...",
  "message": "Memo saved successfully."
}
```

**보안 처리 (다층 XSS 방지):**
- **Shared Schema**: Zod 엄격한 검증 (`memoStylesSchema`)
  - 색상: Regex `/^#[0-9A-Fa-f]{6}$/`
  - 폰트 크기: Regex `/^(1[6-9]|[2-6][0-9]|7[0-2])px$/`
  - 폰트 굵기: Enum `['normal', 'bold']`
  - 폰트 스타일: Enum `['normal', 'italic']`
  - `.strict()` 모드로 예상치 못한 필드 차단
- **Server**: sanitize-html로 content HTML 태그 제거 + Zod schema 검증
- **Client**: onPaste 핸들러 (plain text만 허용) + 렌더링 시 추가 검증 및 fallback

## 개발 가이드

### 로컬 개발
```bash
npm install
npm run dev
```

### 데이터베이스 마이그레이션
```bash
npm run db:push
```

## 디자인 시스템

### 색상 팔레트 (시장의 따뜻함)
- Primary: 주황-빨강 계열 (#F57C00 ~ #D32F2F)
- Background: 크림-노랑 계열
- 따뜻하고 생동감 있는 시장 분위기

### 타이포그래피
- **Display Font**: DaejoMarket (대조시장 전용 커스텀 폰트)
- **Fallback Fonts**: Black Han Sans → Noto Sans KR → system sans-serif
- UI Font: Noto Sans KR, system fonts
- 크기: 16px ~ 72px (사용자 조절 가능)
- 폰트 스택: `"DaejoMarket", "Black Han Sans", "Noto Sans KR", sans-serif`

### 반응형 브레이크포인트
- Mobile: < 768px
- Desktop: ≥ 768px

## 사용자 경험

1. **히어로 섹션**: 풍부한 그래디언트와 장식 요소로 시장 분위기 표현
2. **스타일 툴바**: 직관적인 색상 선택과 크기 조절
3. **메모 에디터**: 실시간 스타일 프리뷰
4. **저장 기능**: Toast 알림으로 저장 확인
5. **다크 모드**: 테마 토글 버튼

## API 엔드포인트 (추가)

### GET /api/memos
저장된 모든 메모 불러오기

**Response (200):**
```json
[
  {
    "id": "uuid",
    "content": "대조시장 폰트!",
    "styles": {
      "color": "#D32F2F",
      "fontSize": "32px",
      "fontWeight": "bold",
      "fontStyle": "italic"
    },
    "bgColor": "#FFF8E1",
    "createdAt": "2025-11-14T..."
  }
]
```

## 테스트

E2E 테스트 완료:
- ✅ 텍스트 입력 및 편집
- ✅ 모든 스타일 컨트롤 작동
- ✅ 데이터베이스 저장 검증
- ✅ Toast 알림 표시
- ✅ 저장된 메모 불러오기 및 표시
- ✅ XSS 공격 차단 (악의적 API 호출 테스트)
- ✅ 정상 사용자 플로우 검증

## 보안

### 다층 XSS 방지 시스템
1. **Shared Schema Layer** (`shared/schema.ts`)
   - `memoStylesSchema`로 엄격한 타입 검증
   - Regex 기반 색상 검증 (`/^#[0-9A-Fa-f]{6}$/`)
   - Regex 기반 폰트 크기 검증 (`/^(1[6-9]|[2-6][0-9]|7[0-2])px$/`)
   - Enum 기반 폰트 굵기/스타일 검증
   - `.strict()` 모드로 예상치 못한 필드 차단

2. **Server Layer** (`server/routes.ts`)
   - Zod schema 검증으로 악의적 페이로드 거부 (400 Bad Request)
   - `sanitize-html`로 content HTML 태그 완전 제거
   - 모든 입력값 검증 후 저장

3. **Client Layer** (`client/src/pages/home.tsx`)
   - `onPaste` 핸들러로 HTML 붙여넣기 차단 (plain text만 허용)
   - 렌더링 시 추가 검증 및 안전한 fallback 값 사용
   - `parseInt()` + clamping으로 fontSize 보호
   - Enum 검증으로 fontWeight/fontStyle 보호
   - Regex 테스트로 색상 검증

### 기타 보안
- SQL Injection 방지: Drizzle ORM 사용
- HTTPS 사용 (프로덕션)

## 참고 문서

- PRD: attached_assets/PRD_1763102663248.md
- TRD: attached_assets/TRD_1763102663250.md
- Design Guidelines: design_guidelines.md

## Client Exception Log

### November 14, 2025 - No Hero Image Requirement
**Client Decision:** Proceed without photographic hero images, using gradient-based treatment only.

**Context:** When asked "대조시장을 대표하는 이미지(시장 풍경, 간판 등)를 가지고 계신가요?", client explicitly chose "이미지 없이 색상과 타이포그래피로만 진행해주세요" (proceed with colors and typography only).

**Implementation:** Rich gradient hero section with decorative abstract patterns, dark mode support, and feature badges.

**Approval:** Client reconfirmed this approach when offered image generation alternatives, stating "현재 그래디언트 구현으로 충분합니다" (current gradient implementation is sufficient).

## 최종 업데이트
- 2025-11-15: 보안 강화 완료 (다층 XSS 방지 시스템)
- 2025-11-15: 대조시장 전용 커스텀 폰트 적용 (DaejoMarket-Regular.ttf)
