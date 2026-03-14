import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Profile } from '@/types/supabase'
import ProfileEditForm from '@/components/profile/ProfileEditForm'
import Link from 'next/link'

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single<Profile>()

  if (error) console.error('프로필 조회 에러:', error.message)
  if (!profile) redirect('/login')

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          aria-label="대시보드로 돌아가기"
        >
          <svg width="16" height="16" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">프로필 수정</h2>
          <p className="text-gray-500 text-sm mt-0.5">이름과 사용자 이름을 변경할 수 있습니다.</p>
        </div>
      </div>

      {/* 수정 폼 카드 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <ProfileEditForm profile={profile} />
      </div>
    </div>
  )
}
