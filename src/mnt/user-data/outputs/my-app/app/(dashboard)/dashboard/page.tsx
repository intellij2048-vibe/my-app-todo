import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          안녕하세요, {profile?.full_name ?? '사용자'}님 👋
        </h2>
        <p className="text-gray-500 mt-1">대시보드에 오신 것을 환영합니다.</p>
      </div>

      {/* 프로필 카드 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">내 계정 정보</h3>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-400">이름</dt>
            <dd className="font-medium text-gray-800">{profile?.full_name ?? '-'}</dd>
          </div>
          <div>
            <dt className="text-gray-400">사용자 이름</dt>
            <dd className="font-medium text-gray-800">@{profile?.username ?? '-'}</dd>
          </div>
          <div>
            <dt className="text-gray-400">이메일</dt>
            <dd className="font-medium text-gray-800">{user.email}</dd>
          </div>
          <div>
            <dt className="text-gray-400">권한</dt>
            <dd className="font-medium text-gray-800">{profile?.role ?? 'user'}</dd>
          </div>
          <div>
            <dt className="text-gray-400">이메일 인증</dt>
            <dd className="font-medium text-green-600">
              {user.email_confirmed_at ? '✅ 인증 완료' : '❌ 미인증'}
            </dd>
          </div>
          <div>
            <dt className="text-gray-400">가입일</dt>
            <dd className="font-medium text-gray-800">
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString('ko-KR')
                : '-'}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
