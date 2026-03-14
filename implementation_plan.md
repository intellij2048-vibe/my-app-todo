# Next.js + Supabase Todo Starter 완성 계획

현재 프로젝트는 기본적인 인증과 프로필 수정 기능은 갖추었으나, 실질적인 "Todo 앱 스타터"로서의 핵심 기능과 마무리가 부족한 상태입니다. 이를 보완하여 완벽한 스타터 킷으로 완성하겠습니다.

## Proposed Changes

### 1. 보안 및 인프라
- **`middleware.ts` 이동**: 현재 `app/lib/supabase/middleware.ts`에 숨겨져 작동하지 않는 미들웨어를 프로젝트 루트(`/middleware.ts`)로 가져와 전체 라우트 보호 및 세션 갱신을 활성화합니다.
- **데이터베이스 스키마 강화**: `supabase_schema.sql`에 `todos` 테이블을 추가하고, 유저별 RLS(Row Level Security) 정책을 설정하여 보안을 완성합니다.

### 2. UI/UX 개선
- **알림 라이브러리(Sonner) 도입**: 정적 텍스트 대신 세련된 토스트 알림을 연동하여 작업 성공/실패 시 사용자 피드백을 강화합니다.
- **다크 모드 지원**: shadcn UI의 다크 테마를 완벽하게 지원하도록 `next-themes`를 설정합니다.

### 3. 핵심 기능 (Todo CRUD)
- **Server Actions**: 할 일 추가, 토글, 삭제 기능을 수행하는 액션을 구현합니다.
- **할 일 목록 UI**: 대시보드 화면에 할 일을 입력하고 리스트를 볼 수 있는 UI 컴포넌트를 추가합니다.

## Verification Plan

### Automated Tests
- `npm run build`: 전체 빌드 성공 여부 확인
- `npm run lint`: 코드 컨벤션 체크

### Manual Verification
- **로그인/로그아웃 리다이렉션**: 미들웨어가 비로그인 사용자를 `/login`으로 잘 보내는지 확인.
- **Todo CRUD 테스트**: 할 일 추가, 완료 체크, 삭제가 실시간으로 반영되는지 확인.
- **PWA 설치**: 모바일 환경 또는 Chrome에서 PWA 설치 버튼이 활성화되는지 확인.
