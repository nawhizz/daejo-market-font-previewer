# 대조시장 폰트 체험 웹페이지

## 프로젝트 개요

대조시장 재디자인 프로젝트의 전용 폰트를 사용자가 직접 체험하고 꾸며볼 수 있는 인터랙티브 웹 애플리케이션입니다. 사용자는 텍스트를 입력하고, 폰트 스타일(색상, 크기, 굵기, 기울임)과 배경색을 자유롭게 조정한 후 저장할 수 있습니다. 줄간격은 1.5, 글자간격은 0.0em으로 고정되어 최적의 가독성을 제공합니다. iPad 화면에 최적화된 레이아웃과 터치 타겟으로 태블릿 환경에서 최상의 사용자 경험을 제공합니다.

## 현재 프로젝트 상태

**✅ MVP 개발 완료 (Production Ready)**

이 프로젝트는 모든 필수 기능이 구현되고 철저한 테스트를 통과한 프로덕션 준비 상태입니다.

### 핵심 성과
- **스크롤 없는 디자인**: iPad에 최적화된 h-screen 레이아웃으로 몰입감 있는 체험 제공
- **간편한 UX**: 복잡한 설정 없이 핵심 스타일만 조절하여 폰트 체험에 집중
- **고정 가독성**: 줄간격 1.5, 글자간격 0em 고정으로 일관된 최적의 가독성 보장
- **다층 보안**: Zod + sanitize-html + React 이스케이프로 견고한 XSS 방지
- **완벽한 테스트**: E2E 테스트 통과, 모든 기능 검증 완료

### 배포 가능 상태
- ✅ 모든 MVP 기능 구현 완료
- ✅ 보안 강화 완료 (XSS, SQL Injection 방지)
- ✅ iPad 최적화 완료 (터치 타겟 44px+ 준수)
- ✅ E2E 테스트 통과
- ✅ 데이터베이스 스키마 안정화
- ✅ 에러 처리 및 Toast 알림 구현

## 주요 기능 (MVP)

### 구현 완료된 기능
- ✅ 대조시장 전용 폰트 적용 (DaejoMarket-Regular.ttf 커스텀 폰트)
- ✅ 텍스트 입력 영역 (ContentEditable 메모창, 줄바꿈 지원)
- ✅ 스타일 편집 툴바
  - 폰트 색상 선택 (7가지 프리셋)
  - 배경색 선택 (7가지 프리셋)
  - 폰트 크기 조절 (16px ~ 72px)
  - 굵게(Bold) 토글
  - 기울임(Italic) 토글
  - 줄간격 1.5 고정 (최적 가독성)
  - 글자간격 0em 고정 (최적 가독성)
- ✅ 메모 저장 기능 (PostgreSQL)
- ✅ 저장된 메모 전용 페이지 (독립적인 뷰)
- ✅ 페이지 라우팅 (홈/저장된 메모)
- ✅ Toast 알림
- ✅ 다층 XSS 방지 (Zod schema + sanitize-html + client-side validation)
- ✅ 엄격한 입력값 검증 (정규식, enum)
- ✅ iPad 최적화 (터치 타겟 44px+ 준수)
- ✅ 반응형 디자인
- ✅ 다크 모드 지원 (UI 토글 제거, 코드 레벨 지원 유지)

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
│   │   │   ├── home.tsx          # 메인 에디터 페이지
│   │   │   ├── saved-memos.tsx   # 저장된 메모 페이지
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
    fontStyle: string,    # 'normal' | 'italic'
    lineHeight: number,   # 줄간격 (0.8-2.0, 고정값 1.5)
    letterSpacing: string # 글자간격 (em 단위, 고정값 0em)
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
    "fontStyle": "italic",
    "lineHeight": 1.5,
    "letterSpacing": "0em"
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
  - 줄간격: Number (0.8-2.0 범위 검증)
  - 글자간격: Regex `/^-?[0-9]*\.?[0-9]+em$/`
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
- 줄간격: 1.5 (고정)
- 글자간격: 0.0em (고정)
- 폰트 스택: `"DaejoMarket", "Black Han Sans", "Noto Sans KR", sans-serif`

### 반응형 브레이크포인트
- Mobile: < 768px
- Tablet (iPad): ≥ 768px (최적화 타겟)
- Desktop: ≥ 1024px

### iPad 최적화
- **터치 타겟 크기** (Apple HIG 준수):
  - 색상 선택 버튼: 48px × 48px
  - 컨트롤 버튼 (크기, Bold, Italic): 44-48px
  - 액션 버튼 (저장하기, 메모 보기): 48px 높이, 전체 너비
- **레이아웃**:
  - **스크롤 없는 디자인**: h-screen으로 화면 전체 활용
  - 2열 구조: 사이드바(320px) + 에디터(flex-1)
  - 사이드바 내부만 필요시 스크롤
  - 에디터는 항상 전체 높이 표시

## 사용자 경험

### 홈 페이지 (/) - 스크롤 없는 2열 레이아웃
**레이아웃 구조:**
- **왼쪽 사이드바 (320px)**:
  1. 헤더: "대조시장체" 타이틀
  2. 스타일 컨트롤 (필요시 내부 스크롤):
     - 배경색 선택 (4×2 그리드)
     - 폰트색 선택 (4×2 그리드)
     - 폰트 크기 조절 (+/- 버튼)
     - Bold/Italic 토글
  3. 액션 버튼 (하단 고정):
     - 전체 지우기
     - 저장하기
     - 메모 보기

- **오른쪽 에디터 (flex-1)**:
  - 전체 높이 활용
  - 센터 정렬 메모 입력
  - 실시간 스타일 프리뷰
  - 동적 배경색 변경
  - 고정 줄간격(1.5), 글자간격(0em) 적용

**주요 특징:**
- ✨ **완전한 스크롤 없는 디자인** (h-screen, overflow-hidden)
- 📝 메모 작성에 집중할 수 있는 깔끔한 인터페이스
- 🎨 실시간 스타일 프리뷰
- 💾 Toast 알림으로 저장 확인
- 🔄 "메모 보기" 버튼으로 저장된 메모 페이지 이동
- 📏 최적의 가독성을 위한 고정 줄간격/글자간격

### 저장된 메모 페이지 (/saved-memos) - 스크롤 가능
1. **그리드 레이아웃**: 저장된 모든 메모를 카드 형태로 표시
2. **스타일 보존**: 각 메모의 폰트 색상, 크기, 굵기, 기울임, 배경색 유지
3. **뒤로가기**: "폰트 체험하기" 버튼으로 홈 페이지 복귀
4. **반응형**: 1-3열 그리드 (화면 크기에 따라 자동 조정)
5. **스크롤 지원**: 저장된 메모가 많을 경우 세로 스크롤

### 공통
- **터치 최적화**: 모든 인터랙티브 요소 44px 이상 (Apple HIG 준수)

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
      "fontStyle": "italic",
      "lineHeight": 1.5,
      "letterSpacing": "0em"
    },
    "bgColor": "#FFF8E1",
    "createdAt": "2025-11-14T..."
  }
]
```

## 테스트

### E2E 테스트 (iPad 뷰포트 1024×768)
- ✅ **스크롤 없는 레이아웃** 검증 (vertical scroll 없음)
- ✅ 2열 레이아웃 정상 작동
- ✅ 텍스트 입력 및 편집 (contentEditable)
- ✅ 모든 스타일 컨트롤 접근 가능 및 작동
- ✅ 실시간 스타일 프리뷰 (색상, 크기, Bold, Italic)
- ✅ 줄간격/글자간격 슬라이더 UI에서 숨겨짐 확인
- ✅ 데이터베이스 저장 검증 (POST /api/memos 201)
- ✅ 고정값 저장 확인 (lineHeight: 1.5, letterSpacing: "0em")
- ✅ Toast 알림 표시
- ✅ 페이지 전환 (/ ↔ /saved-memos)
- ✅ 저장된 메모 표시 (스타일 보존 확인)
- ✅ 페이지 전환 후에도 스크롤 없는 상태 유지
- ✅ 터치 타겟 크기 검증 (모두 44px 이상)
- ✅ XSS 공격 차단 (악의적 API 호출 테스트)

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

3. **Client Layer** (`client/src/pages/home.tsx`, `client/src/pages/saved-memos.tsx`)
   - `onPaste` 핸들러로 HTML 붙여넣기 차단 (plain text만 허용)
   - useRef로 contentEditable의 textContent 안정적으로 읽기
   - 저장 시 state와 editor content 동기화
   - React의 자동 이스케이프 활용 (`{memo.content}`)
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

## 기술적 개선 사항

### ContentEditable 버그 수정 (2025-11-15)
**문제**: Playwright E2E 테스트에서 contentEditable에 입력한 텍스트가 저장 시 'undefined'로 표시됨
**원인**: onInput 이벤트가 자동화된 입력에서 발생하지 않아 state 업데이트 실패
**해결**: 
- `useRef` 추가하여 contentEditable DOM 요소 직접 참조
- `handleSave`에서 `editorRef.current?.textContent` 직접 읽기
- `setContent(actualContent)`로 state 동기화
- state와 실제 editor content 일관성 보장

**영향**: 
- 자동화된 테스트 통과
- undo/redo, 프로그래밍적 입력 지원
- state 기반 validation 신뢰성 향상

## 테마 설정
- **다크 모드**: CSS 및 Tailwind 설정은 유지되지만 UI에서 토글 버튼 제거됨
- **기본 테마**: 라이트 모드
- **전환 방법**: UI를 통한 테마 전환 불가 (개발자 도구/localStorage를 통해서만 가능)

## 최종 업데이트
- 2025-11-20: **줄간격/글자간격 고정** (lineHeight 1.5, letterSpacing 0em으로 고정, UI 컨트롤 숨김)
- 2025-11-15: **테마 토글 버튼 제거** (다크 모드 기능은 유지, UI 접근 불가)
- 2025-11-15: **스크롤 없는 2열 레이아웃** 구현 (h-screen, overflow-hidden)
- 2025-11-15: 사이드바 + 에디터 구조로 UI 재구성
- 2025-11-15: iPad 최적화 완료 (터치 타겟 44px+)
- 2025-11-15: 페이지 분리 (홈 에디터 + 저장된 메모 전용 페이지)
- 2025-11-15: ContentEditable 버그 수정 (useRef + state 동기화)
- 2025-11-15: E2E 테스트 통과 (스크롤 없는 레이아웃 검증)
- 2025-11-15: 보안 강화 완료 (다층 XSS 방지 시스템)
- 2025-11-15: 대조시장 전용 커스텀 폰트 적용 (DaejoMarket-Regular.ttf)
