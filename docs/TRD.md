# Technical Requirements Document (TRD): 대조시장 폰트 체험 웹페이지

## 1. 기술 개요 (Technical Overview)

- **프로젝트 목표:** PRD의 비즈니스 목표(폰트 홍보)를 달성하기 위해, 빠르고 안정적이며 iPad에 최적화된 인터랙티브 웹 애플리케이션을 구축한다.
    
- **핵심 기술 과제:**
    - ✅ Next.js App Router 기반의 최신 웹 아키텍처 구축
    - ✅ 웹폰트의 최적화된 로딩 (FOUC 방지) - @font-face 및 Next.js Font Optimization
    - ✅ 사용자 스타일(CSS)을 텍스트와 함께 DB에 저장하고 처리하는 로직 구현 - JSONB 타입 사용
    - ✅ 줄바꿈을 포함한 텍스트 저장 및 표시 - innerText + whitespace-pre-wrap
    - ✅ XSS 공격 방지 - 다층 보안 시스템 구축
        
- **관련 문서:** [docs/PRD.md]
- **현재 상태:** ✅ MVP 개발 및 배포 완료 (2025-12-04)

## 2. 시스템 아키텍처 (System Architecture)

### 실제 구현 아키텍처

```
[User (Browser - iPad)]
         |
         v
[Frontend (Next.js 16 - Vercel)]
    - App Router (Server Components + Client Components)
    - Tailwind CSS + Shadcn UI
         |
         v (Server Actions)
[Backend Logic (Next.js Server Actions)]
    - src/actions/*.ts
    - Drizzle ORM
    - sanitize-html
         |
         v (SQL Queries)
[Database (Supabase - PostgreSQL)]
    - memos 테이블
```

### 핵심 컴포넌트 설명

- **Frontend (클라이언트):**
  - Next.js 16 (React 19)
  - App Router 구조
  - UI 컴포넌트: Shadcn UI (Radix UI 기반)
  - 스타일링: Tailwind CSS
  - 폰트: DaejoMarket-Regular.ttf (public/fonts/)
  
- **Backend (서버 로직):**
  - Next.js Server Actions (API Routes 대체)
  - ORM: Drizzle (TypeScript-first)
  - 보안: sanitize-html, Zod validation
  
- **Database (데이터베이스):**
  - Supabase (PostgreSQL)
  - 스키마 관리: Drizzle ORM
  - 마이그레이션: Drizzle Kit

### 배포 환경
- **플랫폼:** Vercel
- **DB:** Supabase Cloud

## 3. 기술 스택 (Technology Stack)

### 실제 사용 기술 스택

| **구분**       | **기술 / 라이브러리**                          | **선택 사유**                                                |
| :----------- | :--------------------------------------- | :------------------------------------------------------- |
| **프레임워크**    | Next.js 16 (App Router)                  | 최신 React 기능(Server Actions) 활용, SEO 및 성능 최적화              |
| **언어**        | TypeScript                               | 타입 안정성, 유지보수 용이                                        |
| **UI 라이브러리** | React 19                                 | 최신 UI 라이브러리                                            |
| **스타일링**     | Tailwind CSS + Shadcn UI                 | 유틸리티 우선, 컴포넌트 재사용성                                     |
| **아이콘**      | Lucide React                             | 경량, 일관된 디자인                                             |
| **백엔드 로직**   | Next.js Server Actions                   | 별도 API 서버 없이 함수처럼 백엔드 로직 호출 가능                         |
| **ORM**      | Drizzle ORM                              | TypeScript 네이티브, 타입 안전성, 경량                            |
| **데이터베이스**   | Supabase (PostgreSQL)                    | 강력한 오픈소스 DB, 관리 편의성                                     |
| **보안**       | sanitize-html, Zod                       | XSS 방지, 입력값 검증                                          |
| **배포**       | Vercel                                   | Next.js 최적화 배포 플랫폼                                       |

## 4. 데이터 모델 및 관리 (Data Model & Management)

### 테이블 스키마 (Drizzle ORM)

**memos 테이블:**
```typescript
// src/lib/db/schema.ts (예시)
export const memos = pgTable("memos", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  styles: jsonb("styles").notNull(), // color, fontSize, fontWeight, etc.
  bgColor: text("bg_color").notNull(),
  authorName: text("author_name").notNull(), // 작성자 이름 추가됨
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### Zod 스키마 검증

**다층 검증 시스템:**
- **Client:** React State 및 Event Handler에서 1차 검증
- **Server Action:** Zod Schema를 통한 2차 엄격 검증 (Server Actions 내부)

## 5. API 명세 (Server Actions)

Next.js Server Actions를 사용하므로 전통적인 REST API 엔드포인트 대신 함수 시그니처로 정의됩니다.

### 1. saveMemo (메모 저장)

- **Input:** `FormData` (content, styles(JSON), bgColor, authorName)
- **Process:**
  1. Zod Validation
  2. sanitize-html (XSS 방지)
  3. DB Insert via Drizzle
- **Output:** `{ success: boolean, error?: string }`

### 2. getMemos (메모 목록 조회)

- **Input:** 없음 (Pagination 추후 추가 가능)
- **Output:** `Memo[]` (DB 레코드 배열)

## 6. 주요 비기능 요구사항 (Key Non-Functional Requirements)

### 보안 (구현 완료)

**다층 XSS 방지 시스템:**
1. **Zod Validation:** 입력 데이터의 타입과 포맷을 엄격하게 검증
2. **Sanitize-html:** 저장 전 HTML 태그 제거
3. **React Escaping:** 렌더링 시 자동 이스케이프

### 성능 (달성됨)

**웹폰트 최적화:**
- `next/font` 또는 CSS `@font-face` 사용
- `font-display: swap`으로 FOUC 최소화

**이미지 최적화:**
- SVG 포맷 사용으로 해상도 독립적 선명함 제공
- `next/image` 컴포넌트 활용

### 안정성
- **에러 핸들링:** Server Actions 내 `try-catch` 블록 및 클라이언트 `toast` 알림
- **타입 안정성:** End-to-End TypeScript 적용 (DB ~ Client)

## 7. 프론트엔드 아키텍처

### 디렉토리 구조

```
src/
├── app/
│   ├── page.tsx             # 홈 (랜딩)
│   ├── experience/          # 체험 페이지 (에디터)
│   │   └── page.tsx
│   ├── saved-memos/         # 저장된 메모 목록
│   │   └── page.tsx
│   ├── layout.tsx           # Root Layout
│   └── globals.css          # 전역 스타일
├── components/
│   └── ui/                  # Shadcn UI 컴포넌트
├── lib/
│   ├── db/                  # Drizzle 설정
│   └── supabase/            # Supabase 클라이언트
├── actions/                 # Server Actions
│   ├── save-memo.ts
│   └── get-memos.ts
└── hooks/
    └── use-toast.ts         # Toast 훅
```

### 주요 컴포넌트

**ExperiencePage (src/app/experience/page.tsx):**
- 상태 관리: `useState` (content, styles, visibility)
- 20초 유휴 타이머 (키오스크 모드)
- 히든 컨트롤 패널 (Ctrl+Shift+P)

**SavedMemosPage (src/app/saved-memos/page.tsx):**
- Server Component로 구현하여 초기 로딩 속도 확보 (또는 Client Component + useEffect)
- Grid Layout

## 8. 개발 및 배포 워크플로우

### 개발
```bash
npm run dev
# 접속: http://localhost:3000
```

### DB 마이그레이션
```bash
npx drizzle-kit push
```

### 배포
- GitHub Main 브랜치 푸시 시 Vercel 자동 배포

## 9. 테스트 전략

### 테스트 커버리지
- ✅ 텍스트 입력 및 편집
- ✅ 스타일 적용 (색상, 크기, 굵기 등)
- ✅ 메모 저장 및 로드
- ✅ 페이지 이동 및 라우팅

---

**문서 관리:**
- 초안: Gemini (2025-11-12)
- 현행화: Replit Agent (2025-11-17)
- 최종 현행화: Antigravity (2025-12-04)
