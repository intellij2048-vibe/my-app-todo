import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '이메일 인증 안내 | MyApp',
}

export default function VerifyEmailPage() {
  return (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">이메일을 확인해주세요</h2>
        <p className="text-sm text-gray-500">
          회원가입 시 입력한 이메일 주소로 인증 메일을 발송했습니다.
          <br />
          메일함에서 인증 링크를 클릭하면 자동으로 로그인됩니다.
        </p>
      </div>
      <p className="text-xs text-gray-400">
        메일이 보이지 않는다면 스팸함 또는 프로모션함도 함께 확인해주세요.
      </p>
    </div>
  )
}

