import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/auth/LogoutButton'
import { Profile } from '@/types/supabase'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 미인증 시 로그인 페이지로 (middleware와 이중 체크)
  if (!user) {
    redirect('/login')
  }

  // 유저 프로필 조회
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single<Profile>() // single()은 조회 결과가 하나만 있는 경우에 사용

  if (error) {
    console.error('프로필 조회 에러:', error.message, error.code)
  }

  if (!profile) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 네비게이션 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-indigo-600">MyAppTodo</h1>
          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition"
            >
              <svg width="14" height="14" className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {profile?.full_name ?? user.email}
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* 본문 */}
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}

