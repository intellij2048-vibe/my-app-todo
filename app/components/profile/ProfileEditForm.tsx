'use client'

import { useActionState, useEffect, useRef } from 'react'
import { updateProfile, ProfileUpdateState } from '@/actions/profile'
import { Profile } from '@/types/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/label'

const initialState: ProfileUpdateState = {
  success: false,
  message: '',
}

export default function ProfileEditForm({ profile }: { profile: Profile }) {
  const [state, formAction, isPending] = useActionState(updateProfile, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    // 성공 시 추가 동작이 필요하면 여기에 작성
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      {/* 상태 메시지 */}
      {state.message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm font-medium ${
            state.success
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {state.success ? '✅ ' : '⚠️ '}
          {state.message}
        </div>
      )}

      {/* 이름 */}
      <div className="space-y-2">
        <Label htmlFor="full_name">이름</Label>
        <Input
          id="full_name"
          name="full_name"
          type="text"
          defaultValue={profile.full_name ?? ''}
          placeholder="홍길동"
          required
        />
      </div>

      {/* 사용자 이름 */}
      <div className="space-y-2">
        <Label htmlFor="username">사용자 이름</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground select-none">
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
            className="pl-7"
          />
        </div>
        <p className="text-[0.8rem] text-muted-foreground">영문, 숫자, _ 만 사용 가능합니다.</p>
      </div>

      {/* 이메일 (읽기 전용) */}
      <div className="space-y-2">
        <Label htmlFor="email">
          이메일 <span className="text-muted-foreground font-normal">(변경 불가)</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={profile.email ?? ''}
          readOnly
          disabled
          className="bg-muted text-muted-foreground cursor-not-allowed"
        />
      </div>

      {/* 저장 버튼 */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full"
      >
        {isPending ? '저장 중...' : '변경사항 저장'}
      </Button>
    </form>
  )
}
