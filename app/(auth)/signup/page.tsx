import { Metadata } from 'next'
import SignupForm from '@/components/auth/SignupForm'

export const metadata: Metadata = {
  title: '회원가입 | MyAppTodo',
}

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">회원가입</h2>
        <p className="text-sm text-gray-500 mt-1">새 계정을 만드세요</p>
      </div>
      <SignupForm />
    </div>
  )
}

