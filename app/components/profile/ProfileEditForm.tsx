'use client'

import { useActionState, useEffect, useRef } from 'react'
import { updateProfile, ProfileUpdateState } from '@/actions/profile'
import { Profile } from '@/types/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { toast } from 'sonner'

const initialState: ProfileUpdateState = {
  success: false,
  message: '',
}

export default function ProfileEditForm({ profile }: { profile: Profile }) {
  const [state, formAction, isPending] = useActionState(updateProfile, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message)
      } else {
        toast.error(state.message)
      }
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      {/* 이름 */}
      <div className="space-y-2.5">
        <Label htmlFor="full_name" className="text-gray-700 font-semibold px-0.5">이름</Label>
        <Input
          id="full_name"
          name="full_name"
          type="text"
          defaultValue={profile.full_name ?? ''}
          placeholder="홍길동"
          required
          className="rounded-xl bg-white/70 border-gray-200/60 focus:bg-white focus:ring-indigo-100 transition-all duration-200"
        />
      </div>

      {/* 사용자 이름 */}
      <div className="space-y-2.5">
        <Label htmlFor="username" className="text-gray-700 font-semibold px-0.5">사용자 이름</Label>
        <div className="relative group">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 group-focus-within:text-indigo-500 transition-colors select-none font-medium">
            @
          </span>
          <Input
            id="username"
            name="username"
            type="text"
            defaultValue={profile.username ?? ''}
            placeholder="hong_gildong"
            required
            pattern="^[a-zA-Z0-9_]+$"
            title="영문, 숫자, _ 만 사용 가능합니다"
            className="pl-8 rounded-xl bg-white/70 border-gray-200/60 focus:bg-white focus:ring-indigo-100 transition-all duration-200"
          />
        </div>
        <p className="text-[0.75rem] text-muted-foreground px-1">영문, 숫자, _ 기호만 포함할 수 있습니다.</p>
      </div>

      {/* 이메일 (읽기 전용) */}
      <div className="space-y-2.5">
        <Label htmlFor="email" className="text-gray-700 font-semibold px-0.5">
          이메일 <span className="text-muted-foreground font-normal text-xs ml-1">(이 계정의 공식 이메일입니다)</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={profile.email ?? ''}
          readOnly
          disabled
          className="rounded-xl bg-gray-100/50 border-gray-100 text-gray-500 cursor-not-allowed opacity-80"
        />
      </div>

      {/* 저장 버튼 */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all active:scale-[0.98] shadow-lg shadow-indigo-100"
        >
          {isPending ? '정보 동기화 중...' : '프로필 정보 업데이트'}
        </Button>
      </div>
    </form>
  )
}
