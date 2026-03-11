import { Metadata } from 'next'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: '로그인 | MyApp',
}

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">로그인</h2>
        <p className="text-sm text-gray-500 mt-1">계정에 로그인하세요</p>
      </div>
      <LoginForm />
    </div>
  )
}

