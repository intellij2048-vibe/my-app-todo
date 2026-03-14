# PWA 변환 구현 계획
Next.js + Supabase Todo 앱에 PWA 기능을 추가합니다. 사용자가 모바일/PC에서 홈 화면에 앱 아이콘을 추가하고, 앱스토어 없이 설치할 수 있게 됩니다.

## 사용 패키지
@ducanh2912/next-pwa — Next.js 13+ App Router 공식 지원, Workbox 기반 Service Worker 자동 생성
참고: 기존의 next-pwa (by shadowwalker)는 Next.js 14+ 에서 지원이 끊겼습니다. @ducanh2912/next-pwa가 현재 표준입니다.

## Proposed Changes
### 패키지 설치
bash
npm install @ducanh2912/next-pwa
### Public Assets
[NEW] manifest.json (file:///Users/mugki/my-project/my-app-todo/public/manifest.json)
웹 앱 설치 정보를 담는 핵심 파일. 앱 이름, 아이콘, 테마 컬러, 시작 URL 등을 정의.

[NEW] icons/icon-192x192.png, icon-512x512.png (file:///Users/mugki/my-project/my-app-todo/public/icons/)
AI로 생성한 Todo 앱 아이콘. PWA 설치 시 홈 화면에 표시됩니다.

### Next.js Config
[MODIFY] next.config.ts (file:///Users/mugki/my-project/my-app-todo/next.config.ts)
withPWA 래퍼로 감싸 Service Worker 자동 생성을 활성화합니다.

```ts
import withPWA from '@ducanh2912/next-pwa'
const nextConfig = withPWA({
  dest: 'public',        // SW 파일 출력 위치
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  disable: process.env.NODE_ENV === 'development', // 개발 시 비활성화
})({ reactStrictMode: true })
```

### App Layout
[MODIFY] layout.tsx (file:///Users/mugki/my-project/my-app-todo/app/layout.tsx)
metadata에 PWA 관련 정보 추가:

manifest 링크
themeColor
appleWebApp (iOS 홈 화면 추가 지원)
viewport 설정

## Verification Plan
### Automated Tests
```bash
# 프로젝트 루트에서 빌드 성공 확인
npm run build
빌드 성공 시 public/sw.js, public/workbox-*.js 파일이 자동 생성됩니다.
```

### Manual Verification
git push 후 Vercel 자동 배포 대기

배포된 URL을 모바일 Chrome 에서 열기
주소창 오른쪽 또는 브라우저 메뉴에서 "홈 화면에 추가" 또는 "앱 설치" 옵션 확인
설치 후 홈 화면에서 아이콘 탭하여 앱처럼 실행되는지 확인
(선택) Chrome DevTools → Lighthouse → PWA 카테고리 점수 확인