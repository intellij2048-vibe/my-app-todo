// ============================================================
// 이 파일은 수동으로 작성한 초기 타입 정의입니다.
// 테이블이 확정되면 아래 CLI 명령어로 자동 생성하세요:
//
//   npx supabase gen types typescript \
//     --project-id your-project-id > types/supabase.ts
// ============================================================

export type Role = 'user' | 'admin'

export type Profile = {
  id: string
  email: string | null
  full_name: string | null
  username: string | null
  avatar_url: string | null
  role: Role
  created_at: string
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          username?: string | null
          avatar_url?: string | null
          role?: Role
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?: string | null
          full_name?: string | null
          username?: string | null
          avatar_url?: string | null
          role?: Role
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// 회원가입 시 signUp options.data에 넘길 메타데이터 타입
export type SignUpMetadata = {
  full_name: string
  username: string
  avatar_url?: string
}

// Auth 관련 공통 타입
export type AuthError = {
  message: string
}

