import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * 이메일 인증 링크 클릭 시 도달하는 콜백 라우트
 * Supabase가 ?code=xxx 파라미터를 붙여서 이 URL로 리다이렉트함
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // 인증 실패 시 에러 페이지로
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}

