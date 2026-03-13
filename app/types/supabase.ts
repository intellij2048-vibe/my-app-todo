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

export type SignUpMetadata = {
  full_name: string
  username: string
  avatar_url?: string
}

export type AuthError = {
  message: string
}

