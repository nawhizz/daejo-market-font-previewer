# Technical Requirements Document (TRD): 대조시장 폰트 체험 웹페이지

## 1. 기술 개요 (Technical Overview)

- **프로젝트 목표:** PRD의 비즈니스 목표(폰트 홍보)를 달성하기 위해, 빠르고 안정적이며 iPad에 최적화된 인터랙티브 웹 애플리케이션을 구축한다.
    
- **핵심 기술 과제:**
    - ✅ 웹폰트의 최적화된 로딩 (FOUC 방지) - @font-face로 구현
    - ✅ 사용자 스타일(CSS)을 텍스트와 함께 DB에 저장하고 처리하는 로직 구현 - JSONB 타입 사용
    - ✅ 줄바꿈을 포함한 텍스트 저장 및 표시 - innerText + whitespace-pre-wrap
    - ✅ XSS 공격 방지 - 다층 보안 시스템 구축
    - ⏳ 별도 인증 없는 API의 스팸 방지 처리 - 향후 개선 필요
        
- **관련 문서:** [docs/PRD.md], [design_guidelines.md], [replit.md]
- **현재 상태:** ✅ MVP 개발 완료 (2025-11-17)

## 2. 시스템 아키텍처 (System Architecture)

### 실제 구현 아키텍처

```
[User (Browser - iPad)]
         |
         v
[Frontend (React SPA - Vite)]
    - Wouter (Client-side routing)
    - TanStack Query (Data fetching)
    - Tailwind CSS + Shadcn UI
         |
         v (API Call: POST /api/memos, GET /api/memos)
[Backend (Express Server - Node.js)]
    - Express API Routes
    - Drizzle ORM
    - sanitize-html
         |
         v (SQL Queries)
[Database (PostgreSQL - Neon)]
    - memos 테이블
```

### 핵심 컴포넌트 설명

- **Frontend (클라이언트):**
  - React 18 기반 SPA
  - Vite 번들러 사용
  - 페이지 라우팅: Wouter
  - 상태 관리: React Hooks + TanStack Query
  - UI 컴포넌트: Shadcn UI (Radix UI 기반)
  - 스타일링: Tailwind CSS
  - 폰트: DaejoMarket-Regular.ttf (client/public/fonts/)
  
- **Backend (서버):**
  - Node.js + Express
  - API 라우트: server/routes.ts
  - 스토리지 레이어: server/storage.ts
  - ORM: Drizzle (TypeScript-first)
  - 보안: sanitize-html, Zod validation
  
- **Database (데이터베이스):**
  - PostgreSQL (Neon - Serverless Postgres)
  - 스키마 관리: Drizzle ORM
  - 마이그레이션: npm run db:push

### 배포 환경
- **개발:** Replit 환경 (0.0.0.0:5000)
- **프로덕션:** Replit Deployments (Publishing)

## 3. 기술 스택 (Technology Stack)

### 실제 사용 기술 스택

| **구분**       | **기술 / 라이브러리**                          | **선택 사유**                                                |
| :----------- | :--------------------------------------- | :------------------------------------------------------- |
| **프론트엔드**    | React 18 + TypeScript                    | 타입 안정성, 컴포넌트 기반 개발                                      |
| **번들러**      | Vite                                     | 빠른 개발 서버, HMR 지원                                        |
| **라우팅**      | Wouter                                   | 경량 클라이언트 사이드 라우팅 (React Router 대비 가벼움)                  |
| **상태 관리**    | TanStack Query v5                        | 서버 상태 관리, 캐싱, 자동 리페칭                                    |
| **폼 관리**     | React Hook Form + Zod                    | 폼 검증, 타입 안전성                                            |
| **UI 컴포넌트**  | Shadcn UI (Radix UI)                     | 접근성 높은 headless UI, 커스터마이징 용이                           |
| **스타일링**     | Tailwind CSS + CSS Variables             | 유틸리티 우선, 다크 모드 지원                                       |
| **아이콘**      | Lucide React                             | 경량, 일관된 디자인                                             |
| **백엔드**      | Node.js + Express                        | 간단한 API 서버, JavaScript 생태계 활용                           |
| **ORM**      | Drizzle ORM                              | TypeScript 네이티브, 타입 안전성, 경량                            |
| **데이터베이스**   | PostgreSQL (Neon)                        | 관계형 구조, JSONB 지원, Serverless                           |
| **보안**       | sanitize-html, Zod                       | XSS 방지, 입력값 검증                                          |
| **폰트**       | DaejoMarket-Regular.ttf (커스텀 폰트)        | 대조시장 전용 폰트                                              |
| **개발 환경**    | Replit                                   | 클라우드 IDE, 자동 배포, 통합 개발 환경                              |
| **세션 관리**    | express-session + memorystore            | 서버 세션 관리 (현재 미사용, 향후 확장 대비)                            |

## 4. 데이터 모델 및 관리 (Data Model & Management)

### 테이블 스키마 (Drizzle ORM)

**memos 테이블:**
```typescript
// shared/schema.ts
export const memos = pgTable("memos", {
  id: varchar("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  content: text("content").notNull(),
  styles: jsonb("styles").notNull().$type<MemoStyles>(),
  bgColor: varchar("bg_color").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// MemoStyles 타입
type MemoStyles = {
  color: string;        // 폰트 색상 (hex)
  fontSize: string;     // 폰트 크기 (16-72px)
  fontWeight: string;   // 'normal' | 'bold'
  fontStyle: string;    // 'normal' | 'italic'
};
```

### Zod 스키마 검증

**다층 검증 시스템:**
```typescript
// shared/schema.ts
const memoStylesSchema = z.object({
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  fontSize: z.string().regex(/^(1[6-9]|[2-6][0-9]|7[0-2])px$/),
  fontWeight: z.enum(['normal', 'bold']),
  fontStyle: z.enum(['normal', 'italic']),
}).strict();

export const insertMemoSchema = createInsertSchema(memos)
  .omit({ id: true, createdAt: true })
  .extend({
    content: z.string().min(1).max(5000),
    styles: memoStylesSchema,
    bgColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  })
  .strict();
```

### 데이터 백업
- PostgreSQL (Neon)의 자동 백업 기능 활용
- Point-in-time recovery 지원

## 5. API 명세 (API Specification)

### 인증 방식
- **없음 (Public API)**
- 향후 Rate Limiting 추가 고려

### API 엔드포인트

#### 1. POST /api/memos (메모 생성)

**Description:** 사용자가 작성한 메모와 스타일을 DB에 저장합니다.

**Request Body (JSON):**
```json
{
  "content": "첫 번째 줄\n두 번째 줄\n세 번째 줄",
  "styles": {
    "color": "#D32F2F",
    "fontSize": "32px",
    "fontWeight": "bold",
    "fontStyle": "italic"
  },
  "bgColor": "#FFF8E1"
}
```

**Success Response (201 Created):**
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "createdAt": "2025-11-17T04:00:00.000Z",
  "message": "Memo saved successfully."
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Validation failed",
  "details": [...]
}
```

**보안 처리:**
- Zod 스키마 검증 (Regex, Enum, .strict())
- sanitize-html로 HTML 태그 제거
- content 길이 제한 (5000자)

#### 2. GET /api/memos (메모 목록 조회)

**Description:** 저장된 모든 메모를 조회합니다.

**Success Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "content": "첫 번째 줄\n두 번째 줄",
    "styles": {
      "color": "#D32F2F",
      "fontSize": "32px",
      "fontWeight": "bold",
      "fontStyle": "italic"
    },
    "bgColor": "#FFF8E1",
    "createdAt": "2025-11-17T04:00:00.000Z"
  }
]
```

## 6. 주요 비기능 요구사항 (Key Non-Functional Requirements)

### 보안 (구현 완료)

**다층 XSS 방지 시스템:**

1. **Shared Schema Layer (shared/schema.ts)**
   - Zod 엄격한 타입 검증
   - Regex 기반 색상 검증: `/^#[0-9A-Fa-f]{6}$/`
   - Regex 기반 폰트 크기 검증: `/^(1[6-9]|[2-6][0-9]|7[0-2])px$/`
   - Enum 기반 fontWeight/fontStyle 검증
   - `.strict()` 모드로 예상치 못한 필드 차단

2. **Server Layer (server/routes.ts)**
   - Zod schema 검증으로 악의적 페이로드 거부 (400)
   - sanitize-html로 content HTML 태그 완전 제거
   - 모든 입력값 검증 후 저장

3. **Client Layer (client/src/pages/)**
   - onPaste 핸들러로 HTML 붙여넣기 차단 (plain text만)
   - React의 자동 이스케이프 활용
   - parseInt() + clamping으로 fontSize 보호
   - Enum 검증으로 fontWeight/fontStyle 보호
   - Regex 테스트로 색상 검증

**SQL Injection 방지:**
- Drizzle ORM 사용으로 Prepared Statement 자동 적용

**향후 개선 사항:**
- ⏳ API Rate Limiting (IP 기준)
- ⏳ CAPTCHA (Cloudflare Turnstile/hCaptcha)

### 성능 (달성됨)

**웹폰트 최적화:**
```css
/* client/src/index.css */
@font-face {
  font-family: 'DaejoMarket';
  src: url('/fonts/DaejoMarket-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap; /* FOUC 방지 */
}
```

**폰트 로딩 전략:**
- font-display: swap으로 FOUC 최소화
- 시스템 폰트 폴백: Black Han Sans → Noto Sans KR

**번들링 최적화:**
- Vite 빌드 시 자동 코드 스플리팅
- Tree-shaking으로 불필요한 코드 제거

### 확장성

**현재 구조:**
- Neon PostgreSQL의 Serverless 아키텍처
- 자동 확장 가능

**향후 개선:**
- 트래픽 급증 시 Read Replica 추가
- CDN을 통한 정적 자산 배포

### 안정성

**에러 핸들링:**
- Try-catch로 API 에러 처리
- Toast 알림으로 사용자 피드백
- Drizzle ORM의 자동 트랜잭션 관리

**로깅:**
- Express 서버 콘솔 로그
- Replit 환경의 자동 로그 수집

## 7. 프론트엔드 아키텍처

### 디렉토리 구조

```
client/
├── public/
│   └── fonts/
│       └── DaejoMarket-Regular.ttf
├── src/
│   ├── components/
│   │   ├── ui/              # Shadcn UI 컴포넌트
│   │   └── theme-toggle.tsx # 테마 토글 (UI에서 제거됨)
│   ├── pages/
│   │   ├── home.tsx         # 메인 에디터 페이지
│   │   ├── saved-memos.tsx  # 저장된 메모 페이지
│   │   └── not-found.tsx
│   ├── lib/
│   │   └── queryClient.ts   # TanStack Query 설정
│   ├── hooks/
│   │   └── use-toast.tsx    # Toast 훅
│   ├── App.tsx              # 라우팅 설정
│   └── index.css            # 글로벌 스타일
└── index.html
```

### 주요 컴포넌트

**Home (/) - 에디터 페이지:**
- 스크롤 없는 2열 레이아웃 (h-screen, overflow-hidden)
- 왼쪽 사이드바 (320px): 컨트롤 + 액션 버튼
- 오른쪽 에디터 (flex-1): contentEditable 메모창
- 터치 최적화 (모든 버튼 44px+)

**SavedMemos (/saved-memos) - 저장된 메모 페이지:**
- 반응형 그리드: 1-3열 (모바일-태블릿-데스크탑)
- 스타일 보존: whitespace-pre-wrap으로 줄바꿈 표시
- 스크롤 가능 (메모 많을 경우)

### 상태 관리

**TanStack Query 사용:**
```typescript
// 메모 저장 Mutation
const saveMemo = useMutation({
  mutationFn: async (memo: InsertMemo) => {
    return await apiRequest("POST", "/api/memos", memo);
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["/api/memos"] });
  },
});

// 메모 목록 Query
const { data: savedMemos = [] } = useQuery<Memo[]>({
  queryKey: ["/api/memos"],
});
```

### 스타일링 전략

**Tailwind CSS + CSS Variables:**
- index.css에 HSL 기반 색상 변수 정의
- tailwind.config.ts에서 변수 참조
- 다크 모드 지원 (CSS 인프라만, UI 토글 제거)

**디자인 시스템:**
- 따뜻한 색상 팔레트 (주황-빨강, 크림-노랑)
- 폰트: DaejoMarket (display) + Noto Sans KR (UI)
- 터치 타겟: 최소 44px (Apple HIG)

## 8. 백엔드 아키텍처

### 디렉토리 구조

```
server/
├── routes.ts     # API 라우트
├── storage.ts    # 데이터베이스 로직
└── vite.ts       # Vite 미들웨어

shared/
└── schema.ts     # Drizzle 스키마 + Zod 검증

db/
└── index.ts      # DB 연결
```

### 데이터 플로우

```
[Client Request]
      ↓
[Express Middleware]
      ↓
[API Route (routes.ts)]
      ↓
[Zod Validation]
      ↓
[sanitize-html]
      ↓
[Storage Layer (storage.ts)]
      ↓
[Drizzle ORM]
      ↓
[PostgreSQL (Neon)]
```

## 9. 개발 환경 및 도구

### 개발 도구
- **IDE:** Replit 클라우드 IDE
- **패키지 관리:** npm
- **TypeScript:** 타입 안전성
- **ESBuild:** 빠른 빌드 (Vite 내장)

### 개발 워크플로우
```bash
# 개발 서버 실행
npm run dev

# 데이터베이스 스키마 동기화
npm run db:push

# 타입 체크
npx tsc --noEmit
```

### 환경 변수
```
DATABASE_URL      # Neon PostgreSQL 연결 문자열
PGHOST            # PostgreSQL 호스트
PGPORT            # PostgreSQL 포트
PGUSER            # PostgreSQL 사용자
PGPASSWORD        # PostgreSQL 비밀번호
PGDATABASE        # 데이터베이스 이름
SESSION_SECRET    # 세션 암호화 키
```

## 10. 테스트 전략

### E2E 테스트 (Playwright)

**테스트 커버리지:**
- ✅ 텍스트 입력 및 편집
- ✅ 모든 스타일 컨트롤 (색상, 크기, Bold, Italic)
- ✅ 줄바꿈 기능 (엔터키)
- ✅ 전체 지우기 기능
- ✅ 메모 저장 (API + DB 검증)
- ✅ 저장된 메모 표시 (스타일 보존)
- ✅ 페이지 전환
- ✅ 스크롤 없는 레이아웃
- ✅ XSS 공격 차단

**테스트 환경:**
- iPad viewport (1024×768)
- Development database 사용

## 11. 배포 및 모니터링

### 배포 전략

**Replit Deployments:**
- Git 기반 자동 배포
- 환경 변수 자동 주입
- HTTPS 자동 설정

**배포 프로세스:**
1. 코드 변경 커밋
2. Replit에서 자동 재시작
3. 프로덕션 배포 시 "Publishing" 기능 사용

### 모니터링

**현재 구현:**
- Replit 환경 로그
- Express 콘솔 로그
- 브라우저 콘솔 (개발 환경)

**향후 개선:**
- Application Performance Monitoring (APM)
- Error Tracking (Sentry 등)
- Analytics (방문자 통계)

## 12. 기술적 리스크 및 해결 방안

### 리스크 1: 스팸/악성 데이터 저장
- **현재 상태:** 인증 없는 Public API
- **완화 조치:** XSS 방지, 입력값 검증, 길이 제한
- **향후 개선:** Rate Limiting, CAPTCHA

### 리스크 2: 데이터베이스 성능
- **현재 상태:** 단순 INSERT/SELECT, 인덱스 없음
- **완화 조치:** Neon Serverless의 자동 확장
- **향후 개선:** created_at 인덱스, 페이지네이션

### 리스크 3: 폰트 로딩 지연
- **현재 상태:** font-display: swap으로 FOUC 방지
- **완화 조치:** 시스템 폰트 폴백
- **향후 개선:** 폰트 프리로드, woff2 포맷 변환

## 13. 개발 완료 내역

### Phase 1 (MVP) - ✅ 완료 (2025-11-17)

**Sprint 1: 기본 UI 구현**
- ✅ 개발 환경 구축 (Replit, PostgreSQL Neon)
- ✅ 웹폰트 적용 (DaejoMarket-Regular.ttf)
- ✅ 2열 레이아웃 (사이드바 + 에디터)
- ✅ 스타일 편집 툴바 (색상, 크기, Bold, Italic)
- ✅ contentEditable 메모창

**Sprint 2: 백엔드 및 저장 기능**
- ✅ PostgreSQL 스키마 설계 (Drizzle ORM)
- ✅ POST /api/memos 엔드포인트
- ✅ GET /api/memos 엔드포인트
- ✅ 저장 버튼 연동
- ✅ Toast 알림

**Sprint 3: 추가 기능 및 최적화**
- ✅ 저장된 메모 페이지 (/saved-memos)
- ✅ 전체 지우기 버튼
- ✅ 줄바꿈 지원 (innerText + whitespace-pre-wrap)
- ✅ XSS 방지 (다층 보안)
- ✅ iPad 터치 최적화
- ✅ E2E 테스트 (Playwright)

### Phase 2 (추가 기능) - 📋 계획

**이미지 다운로드:**
- html2canvas 라이브러리 사용
- PNG/JPG 포맷 지원

**SNS 공유:**
- Web Share API
- 인스타그램, 트위터 연동

**모바일 최적화:**
- 사이드바를 토글 메뉴로 변경
- 반응형 레이아웃

## 14. 기술 의존성 매트릭스

| **기술**            | **버전** | **용도**           | **대체 가능성** |
| :---------------- | :----- | :--------------- | :-------- |
| React             | 18     | UI 프레임워크         | 낮음        |
| TypeScript        | 5      | 타입 안전성          | 낮음        |
| Vite              | 5      | 빌드 도구           | 중간 (esbuild) |
| Wouter            | 3      | 라우팅             | 높음 (React Router) |
| TanStack Query    | 5      | 서버 상태 관리        | 중간 (SWR) |
| Tailwind CSS      | 3      | 스타일링            | 중간 (CSS-in-JS) |
| Shadcn UI         | -      | UI 컴포넌트         | 높음 (직접 구현) |
| Express           | 4      | HTTP 서버         | 중간 (Fastify) |
| Drizzle ORM       | 0.x    | ORM             | 중간 (Prisma) |
| PostgreSQL        | 15     | 데이터베이스          | 낮음        |
| sanitize-html     | 2      | XSS 방지          | 중간 (DOMPurify) |
| Zod               | 3      | 스키마 검증          | 중간 (Yup) |

---

**문서 관리:**
- 초안: Gemini (2025-11-12)
- 현행화: Replit Agent (2025-11-17)
- 다음 리뷰: Phase 2 기능 추가 시 또는 아키텍처 변경 시

**참고 문서:**
- [docs/PRD.md] - 제품 요구사항 문서
- [design_guidelines.md] - 디자인 가이드라인
- [replit.md] - 프로젝트 개요 및 기술 노트
