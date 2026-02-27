# Next.js + Supabase 이메일 인증 프로젝트

## 기술 스택
- **Next.js 14** (App Router)
- **TypeScript**
- **Supabase** (Auth + DB)
- **Tailwind CSS**

---

## 시작하기

### 1. 패키지 설치

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install clsx tailwind-merge
```

### 2. 환경변수 설정

`.env.local` 파일에 Supabase 프로젝트 정보를 입력하세요:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Supabase DB 스키마 적용

`supabase_schema.sql` 파일의 내용을 복사하여  
**Supabase 대시보드 → SQL Editor**에서 실행하세요.

### 4. Supabase Auth 설정

Supabase 대시보드 → Authentication → Providers → Email:
- ✅ Enable Email provider
- ✅ Confirm email (이메일 인증 활성화)

Supabase 대시보드 → Authentication → URL Configuration:
- Site URL: `http://localhost:3000` (개발) / 배포 URL (프로덕션)
- Redirect URLs: `http://localhost:3000/auth/callback`

### 5. 개발 서버 실행

```bash
npm run dev
```

---

## 폴더 구조

```
my-app-todo/
├── app/
│   ├── (auth)/               ← 로그인/회원가입 페이지 그룹
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/          ← 보호된 페이지 그룹
│   │   ├── dashboard/page.tsx
│   │   └── layout.tsx
│   ├── auth/callback/        ← 이메일 인증 콜백
│   │   └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/                 ← 인증 관련 컴포넌트
│   └── ui/                   ← 공통 UI 컴포넌트
├── lib/
│   └── supabase/             ← Supabase 클라이언트 설정
├── types/
│   └── supabase.ts           ← DB 타입 정의
├── middleware.ts              ← 라우트 보호
└── supabase_schema.sql       ← DB 스키마
```

---

## 인증 흐름

```
회원가입 (/signup)
  → signUp(email, password, metadata)
  → Supabase가 인증 메일 발송
  → 유저가 메일 링크 클릭
  → /auth/callback?code=xxx 도달
  → 세션 교환 완료
  → /dashboard 리다이렉트
  (동시에 DB 트리거 → profiles 테이블 자동 생성)

로그인 (/login)
  → signInWithPassword(email, password)
  → 쿠키에 세션 저장
  → /dashboard 리다이렉트
  
미인증 상태에서 /dashboard 접근
  → middleware가 감지 → /login 리다이렉트

로그아웃
  → signOut()
  → /login 리다이렉트
```

---

## 타입 자동 생성 (권장)

스키마 확정 후 CLI로 타입을 자동 생성하세요:

```bash
npm install supabase --save-dev
npx supabase login
npx supabase gen types typescript \
  --project-id your-project-id > types/supabase.ts
```
# my-app-todo
