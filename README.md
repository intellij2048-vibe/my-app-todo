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
│   │   ├── verify-email/page.tsx
│   │   └── layout.tsx
│   │   └── page.tsx
│   ├── (dashboard)/          ← 보호된 페이지 그룹
│   │   ├── dashboard/page.tsx
│   │   └── layout.tsx
│   ├── auth/callback/        ← 이메일 인증 콜백
│   │   └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/                 ← 인증 관련 컴포넌트
│   │   └── LoginForm.tsx
│   │   └── LogoutButton.tsx
│   │   └── SignupForm.tsx
│   └── ui/                   ← 공통 UI 컴포넌트
│   │   └── Button.tsx
│   │   └── Input.tsx
│   │   └── Label.tsx
│   │   └── Card.tsx
│   │   └── CardContent.tsx
│   │   └── CardDescription.tsx
│   │   └── CardFooter.tsx
│   │   └── CardHeader.tsx
│   │   └── CardTitle.tsx
│   │   └── Form.tsx
│   │   └── FormControl.tsx
│   │   └── FormDescription.tsx
│   │   └── FormField.tsx
│   │   └── FormItem.tsx
│   │   └── FormLabel.tsx
│   │   └── FormMessage.tsx
├── lib/
│   └── supabase/             ← Supabase 클라이언트 설정
│       ├── client.ts
│       ├── server.ts
│       └── middleware.ts
├── types/
│   └── supabase.ts           ← DB 타입 정의
│   └── global.css
│   └── layout.tsx
│  └── page.tsx
├── proxy.ts                  ← 라우트 보호
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
  
미인증 상태에서 `/dashboard` 접근
  → `proxy`가 감지 → `/login` 리다이렉트

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

---

## 배포 (Vercel)

Next.js 프로젝트를 배포하기 위한 가장 권장되는 방법은 Vercel을 사용하는 것입니다.

### 1. Vercel 프로젝트 생성 및 환경변수
Vercel 대시보드에서 `my-app-todo` 리포지토리를 가져온 후, 환경 변수(Environment Variables)를 설정해야 합니다:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase Anon 키

### 2. 빌드 커맨드 설정
일반적으로 Vercel이 Next.js 앱을 자동으로 감지하므로 기본 설정(Build Command: `npm run build`, Output Directory: `Next.js default`)을 그대로 사용합니다.

### 3. Supabase URL Configuration 업데이트 (중요)
배포된 후에는 Supabase에서 인증 성공 후 돌아갈 주소를 프로덕션 도메인으로 알려주어야 합니다.
**Supabase 대시보드 → Authentication → URL Configuration:**
- **Site URL**: `https://당신의-배포된-vercel-주소.vercel.app`
- **Redirect URLs**: `https://당신의-배포된-vercel-주소.vercel.app/auth/callback` 추가

이렇게 하면 배포된 환경에서도 로그인, 회원가입 시 정상적으로 콜백 및 리다이렉트가 동작합니다.

# my-app-todo
