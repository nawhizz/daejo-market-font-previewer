# 대조시장체 폰트 체험 (Market Font Lab)

대조시장 폰트를 체험하고 나만의 메시지를 작성할 수 있는 웹 애플리케이션입니다.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green)

**Repository**: [https://github.com/nawhizz/daejo-market-font-previewer](https://github.com/nawhizz/daejo-market-font-previewer)

**Live Demo**: [https://daejo-market-font-previewer.vercel.app/](https://daejo-market-font-previewer.vercel.app/)

## ✨ 주요 기능

- 🏠 **반응형 랜딩 페이지**: 대조시장체 브랜딩 이미지가 화면 크기에 맞춰 자동 조정
- 🎯 **정밀한 버튼 클릭**: 홈 화면의 특정 버튼 영역("은평대조어울림체 체험하기") 클릭 시에만 체험 페이지로 이동
- 📱 **반응형 UI**: 화면 크기 변경 시 배경 이미지와 버튼이 동일한 비율로 확대/축소
- ⏱️ **자동 홈 복귀**: 20초간 사용자 활동이 없으면 자동으로 랜딩 페이지로 돌아감 (키오스크 모드)
- 🎨 **실시간 폰트 미리보기**: 대조시장체를 사용하여 실시간으로 텍스트 스타일 조정
- 🖌️ **다양한 커스터마이징**: 
  - 글자 색상 (7가지 프리셋)
  - 배경 색상 (7가지 프리셋)
  - 글자 크기 (16px ~ 72px)
  - 굵기 (보통/굵게)
  - 스타일 (보통/이탤릭)
- 💾 **메모 저장**: 작성한 메시지를 Supabase에 저장
- 📋 **메모 목록**: 저장된 모든 메모를 카드 형태로 확인

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **UI Components**: Radix UI + Shadcn/ui
- **Icons**: Lucide React

### Backend
- **Database**: Supabase PostgreSQL
- **ORM/Client**: Supabase Client SDK (`@supabase/supabase-js`)
- **Validation**: Zod
- **Security**: sanitize-html (XSS 방지)

### DevOps
- **Package Manager**: npm
- **Build Tool**: Next.js Turbopack

## 📦 설치 및 실행

### 사전 요구사항

- Node.js 18 이상
- npm 또는 yarn
- Supabase 계정 및 프로젝트

### 1. 프로젝트 클론

```bash
git clone https://github.com/nawhizz/daejo-market-font-previewer.git
cd daejo-market-font-previewer
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 입력:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> Supabase 프로젝트의 URL과 anon key는 Supabase 대시보드 → Settings → API에서 확인할 수 있습니다.

### 4. 데이터베이스 테이블 생성

Supabase SQL Editor에서 다음 쿼리를 실행:

```sql
CREATE TABLE memos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  styles JSONB NOT NULL,
  bg_color VARCHAR(7) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_memos_created_at ON memos(created_at DESC);
```

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📁 프로젝트 구조

```
MarketFontLab/
├── src/
│   ├── actions/          # Server Actions
│   │   ├── get-memos.ts  # 메모 목록 조회
│   │   └── save-memo.ts  # 메모 저장
│   ├── app/              # Next.js App Router
│   │   ├── page.tsx      # 홈 (폰트 체험)
│   │   ├── saved-memos/  # 저장된 메모 목록
│   │   ├── layout.tsx    # 루트 레이아웃
│   │   └── globals.css   # 전역 스타일
│   ├── components/       # UI 컴포넌트
│   │   └── ui/           # Shadcn/ui 컴포넌트
│   ├── hooks/            # React Hooks
│   │   └── use-toast.ts  # Toast 알림
│   └── lib/              # 유틸리티
│       ├── supabase/     # Supabase 클라이언트
│       ├── db/           # DB 스키마 (참고용)
│       └── utils.ts      # 헬퍼 함수
├── public/               # 정적 파일
│   ├── images/           # 이미지 리소스
│   │   ├── home-banner.png      # 홈 화면 배경 이미지
│   │   ├── home-cta.png         # 홈 화면 버튼 이미지
│   │   └── ...                  # 기타 UI 이미지
│   └── DaejoMarket-Regular.ttf  # 대조시장 폰트
└── _legacy/              # 마이그레이션 이전 코드
```

## 🚀 배포

### 배포된 애플리케이션

이 프로젝트는 Vercel을 통해 자동으로 배포되어 있습니다:

🔗 **[https://daejo-market-font-previewer.vercel.app/](https://daejo-market-font-previewer.vercel.app/)**

### Vercel 배포 방법 (권장)

1. Vercel 계정 연결 및 프로젝트 import
2. 환경 변수 설정 (`.env.local` 내용)
3. 자동 배포

```bash
npm run build
npm start
```

## 🔒 보안

- **XSS 방지**: `sanitize-html`을 사용하여 사용자 입력 검증
- **입력 검증**: Zod 스키마를 통한 서버 측 유효성 검사
- **Supabase RLS**: Row Level Security 설정 가능

## 📝 라이선스

MIT License

## 🤝 기여

이슈 및 풀 리퀘스트를 환영합니다!

---

**Made with ❤️ using 대조시장체**
