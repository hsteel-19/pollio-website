-- Pollio Database Schema
-- Run this in Supabase SQL Editor (SQL Editor → New Query → Paste → Run)

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  subscription_status text default 'free' check (subscription_status in ('free', 'pro', 'cancelled')),
  subscription_ends_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Auto-create profile when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- PRESENTATIONS
-- ============================================
create table public.presentations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null default 'Untitled Presentation',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index presentations_user_id_idx on public.presentations(user_id);

-- ============================================
-- SLIDES (questions within presentations)
-- ============================================
create type slide_type as enum ('welcome', 'multiple_choice', 'scale', 'word_cloud', 'open_ended');

create table public.slides (
  id uuid default gen_random_uuid() primary key,
  presentation_id uuid references public.presentations(id) on delete cascade not null,
  type slide_type not null,
  title text not null,
  description text,
  position integer not null default 0,
  settings jsonb default '{}' not null,
  -- settings examples:
  -- multiple_choice: { "options": ["Yes", "No", "Maybe"], "allow_multiple": false }
  -- scale: { "min": 1, "max": 5, "min_label": "Poor", "max_label": "Excellent" }
  -- word_cloud: { "max_words": 3 }
  -- open_ended: { "max_length": 500 }
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index slides_presentation_id_idx on public.slides(presentation_id);
create index slides_position_idx on public.slides(presentation_id, position);

-- ============================================
-- SESSIONS (live presentation sessions)
-- ============================================
create table public.sessions (
  id uuid default gen_random_uuid() primary key,
  presentation_id uuid references public.presentations(id) on delete cascade not null,
  code text unique not null, -- 6-character join code
  status text default 'active' check (status in ('active', 'ended')) not null,
  active_slide_id uuid references public.slides(id) on delete set null,
  participant_count integer default 0 not null,
  started_at timestamptz default now() not null,
  ended_at timestamptz
);

create index sessions_code_idx on public.sessions(code);
create index sessions_presentation_id_idx on public.sessions(presentation_id);
create index sessions_status_idx on public.sessions(status) where status = 'active';

-- Function to generate unique 6-character code
create or replace function generate_session_code()
returns text as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Excluded I, O, 0, 1 to avoid confusion
  result text := '';
  i integer;
begin
  for i in 1..6 loop
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  end loop;
  return result;
end;
$$ language plpgsql;

-- Auto-generate code on session creation
create or replace function set_session_code()
returns trigger as $$
declare
  new_code text;
  code_exists boolean;
begin
  loop
    new_code := generate_session_code();
    select exists(select 1 from public.sessions where code = new_code) into code_exists;
    exit when not code_exists;
  end loop;
  new.code := new_code;
  return new;
end;
$$ language plpgsql;

create trigger before_session_insert
  before insert on public.sessions
  for each row
  when (new.code is null)
  execute procedure set_session_code();

-- ============================================
-- RESPONSES (audience answers)
-- ============================================
create table public.responses (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.sessions(id) on delete cascade not null,
  slide_id uuid references public.slides(id) on delete cascade not null,
  participant_id text not null, -- Anonymous identifier (stored in localStorage)
  answer jsonb not null,
  -- answer examples:
  -- multiple_choice: { "selected": [0] } or { "selected": [0, 2] } for multi-select
  -- scale: { "value": 4 }
  -- word_cloud: { "words": ["innovation", "teamwork"] }
  -- open_ended: { "text": "I think we should..." }
  created_at timestamptz default now() not null
);

create index responses_session_id_idx on public.responses(session_id);
create index responses_slide_id_idx on public.responses(slide_id);
create index responses_participant_idx on public.responses(session_id, participant_id);

-- Unique constraint: one response per participant per slide
create unique index responses_unique_participant_slide
  on public.responses(session_id, slide_id, participant_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.presentations enable row level security;
alter table public.slides enable row level security;
alter table public.sessions enable row level security;
alter table public.responses enable row level security;

-- PROFILES: Users can only read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- PRESENTATIONS: Users can CRUD their own presentations
create policy "Users can view own presentations"
  on public.presentations for select
  using (auth.uid() = user_id);

create policy "Users can create presentations"
  on public.presentations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own presentations"
  on public.presentations for update
  using (auth.uid() = user_id);

create policy "Users can delete own presentations"
  on public.presentations for delete
  using (auth.uid() = user_id);

-- SLIDES: Users can CRUD slides in their presentations
create policy "Users can view slides in own presentations"
  on public.slides for select
  using (
    exists (
      select 1 from public.presentations
      where presentations.id = slides.presentation_id
      and presentations.user_id = auth.uid()
    )
  );

create policy "Users can create slides in own presentations"
  on public.slides for insert
  with check (
    exists (
      select 1 from public.presentations
      where presentations.id = slides.presentation_id
      and presentations.user_id = auth.uid()
    )
  );

create policy "Users can update slides in own presentations"
  on public.slides for update
  using (
    exists (
      select 1 from public.presentations
      where presentations.id = slides.presentation_id
      and presentations.user_id = auth.uid()
    )
  );

create policy "Users can delete slides in own presentations"
  on public.slides for delete
  using (
    exists (
      select 1 from public.presentations
      where presentations.id = slides.presentation_id
      and presentations.user_id = auth.uid()
    )
  );

-- SESSIONS: Owners can manage, anyone can view active sessions by code
create policy "Users can view own sessions"
  on public.sessions for select
  using (
    exists (
      select 1 from public.presentations
      where presentations.id = sessions.presentation_id
      and presentations.user_id = auth.uid()
    )
  );

create policy "Anyone can view active session by code"
  on public.sessions for select
  using (status = 'active');

create policy "Users can create sessions for own presentations"
  on public.sessions for insert
  with check (
    exists (
      select 1 from public.presentations
      where presentations.id = sessions.presentation_id
      and presentations.user_id = auth.uid()
    )
  );

create policy "Users can update own sessions"
  on public.sessions for update
  using (
    exists (
      select 1 from public.presentations
      where presentations.id = sessions.presentation_id
      and presentations.user_id = auth.uid()
    )
  );

-- SLIDES: Audience can view slides for active sessions
create policy "Anyone can view slides for active sessions"
  on public.slides for select
  using (
    exists (
      select 1 from public.sessions
      where sessions.presentation_id = slides.presentation_id
      and sessions.status = 'active'
    )
  );

-- RESPONSES: Anyone can insert (for audience), owners can view
create policy "Anyone can submit responses to active sessions"
  on public.responses for insert
  with check (
    exists (
      select 1 from public.sessions
      where sessions.id = responses.session_id
      and sessions.status = 'active'
    )
  );

create policy "Session owners can view responses"
  on public.responses for select
  using (
    exists (
      select 1 from public.sessions
      join public.presentations on presentations.id = sessions.presentation_id
      where sessions.id = responses.session_id
      and presentations.user_id = auth.uid()
    )
  );

-- ============================================
-- REALTIME SUBSCRIPTIONS
-- ============================================
-- Enable realtime for tables that need live updates
alter publication supabase_realtime add table public.sessions;
alter publication supabase_realtime add table public.responses;

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure update_updated_at();

create trigger presentations_updated_at
  before update on public.presentations
  for each row execute procedure update_updated_at();

create trigger slides_updated_at
  before update on public.slides
  for each row execute procedure update_updated_at();
