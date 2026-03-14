'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { SignUpMetadata } from '@/types/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignupForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    username: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null)
  }

  const validate = () => {
    if (!form.email || !form.password || !form.full_name || !form.username) {
      return '모든 필드를 입력해주세요.'
    }
    if (form.password.length < 8) {
      return '비밀번호는 8자 이상이어야 합니다.'
    }
    if (form.password !== form.confirmPassword) {
      return '비밀번호가 일치하지 않습니다.'
    }
    if (form.username.length < 3) {
      return '사용자 이름은 3자 이상이어야 합니다.'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) return setError(validationError)

    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    const metadata: SignUpMetadata = {
      full_name: form.full_name,
      username: form.username,
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: metadata,
      },
    })

    setIsLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    // 이메일 인증 안내 화면으로 이동
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="text-center space-y-3">
        <div className="text-4xl">📬</div>
        <h2 className="text-xl font-semibold text-gray-900">
          인증 메일을 확인해주세요
        </h2>
        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">{form.email}</span>로
          인증 링크를 발송했습니다.
          <br />
          메일의 링크를 클릭하면 로그인됩니다.
        </p>
        <p className="text-xs text-gray-400">
          메일이 오지 않으면 스팸함을 확인해주세요.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="full_name">이름</Label>
        <Input
          id="full_name"
          name="full_name"
          type="text"
          placeholder="홍길동"
          value={form.full_name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="username">사용자 이름</Label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="gildong (3자 이상)"
          value={form.username}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="8자 이상"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">비밀번호 확인</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="비밀번호 재입력"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading ? '가입 중...' : '회원가입'}
      </Button>

      <p className="text-center text-sm text-gray-500">
        이미 계정이 있으신가요?{' '}
        <Link href="/login" className="text-indigo-600 hover:underline font-medium">
          로그인
        </Link>
      </p>
    </form>
  )
}