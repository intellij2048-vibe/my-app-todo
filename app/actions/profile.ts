'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/supabase'

type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type ProfileUpdateState = {
  success: boolean
  message: string
}

export async function updateProfile(
  _prevState: ProfileUpdateState,
  formData: FormData
): Promise<ProfileUpdateState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: '로그인이 필요합니다.' }
  }

  const full_name = (formData.get('full_name') as string)?.trim()
  const username = (formData.get('username') as string)?.trim()

  if (!full_name) {
    return { success: false, message: '이름을 입력해주세요.' }
  }
  if (!username) {
    return { success: false, message: '사용자 이름을 입력해주세요.' }
  }
  // username: 영문, 숫자, 언더스코어만 허용
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return {
      success: false,
      message: '사용자 이름은 영문, 숫자, _ 만 사용 가능합니다.',
    }
  }

  const payload: ProfileUpdate = { full_name, username }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('profiles')
    .update(payload)
    .eq('id', user.id)

  if (error) {
    // username 중복 처리
    if (error.code === '23505') {
      return { success: false, message: '이미 사용 중인 사용자 이름입니다.' }
    }
    return { success: false, message: `저장 실패: ${error.message}` }
  }

  revalidatePath('/dashboard')
  revalidatePath('/profile')

  return { success: true, message: '프로필이 저장되었습니다.' }
}
