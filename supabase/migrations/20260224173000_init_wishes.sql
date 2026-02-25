create extension if not exists pgcrypto;

create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  wish_text text not null,
  nickname text not null,
  nickname_is_default boolean not null default false,
  color text not null check (color in ('red', 'blue', 'green', 'yellow', 'purple')),
  language text not null check (language in ('en', 'ja', 'my')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  moderation_reason text,
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  constraint wishes_text_len check (char_length(wish_text) between 1 and 120),
  constraint wishes_nickname_len check (char_length(nickname) between 1 and 40)
);

create index if not exists idx_wishes_status_created_at
  on public.wishes (status, created_at desc);

create index if not exists idx_wishes_created_at
  on public.wishes (created_at desc);

alter table public.wishes enable row level security;

-- Public can read approved wishes only.
create policy "public_select_approved_wishes"
  on public.wishes
  for select
  to anon, authenticated
  using (status = 'approved');
