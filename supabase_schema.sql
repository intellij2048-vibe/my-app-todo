-- ============================================================
-- Supabase SQL Editor에 순서대로 실행하세요
-- ============================================================

-- 1. profiles 테이블 생성
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text,
  full_name   text,
  username    text unique,
  avatar_url  text,
  role        text not null default 'user',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2. RLS (Row Level Security) 활성화
alter table public.profiles enable row level security;

-- 3. RLS 정책 설정
-- 본인 프로필만 조회 가능
drop policy if exists "본인 프로필 조회" on public.profiles;
create policy "본인 프로필 조회"
  on public.profiles for select
  using (auth.uid() = id);

-- 프로필 생성 허용 정책 (INSERT)
drop policy if exists "프로필 자동 생성" on public.profiles;
create policy "프로필 자동 생성"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- 본인 프로필만 수정 가능
drop policy if exists "본인 프로필 수정" on public.profiles;
create policy "본인 프로필 수정"
  on public.profiles for update
  using (auth.uid() = id);

-- 4. updated_at 자동 갱신 함수
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profiles_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- 5. 신규 유저 가입 시 profiles 자동 생성 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN

  RAISE NOTICE 'username value: %', NEW.raw_user_meta_data ->> 'username';

  INSERT INTO public.profiles (id, email, full_name, username, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'username',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. auth.users INSERT 시 트리거 실행
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
