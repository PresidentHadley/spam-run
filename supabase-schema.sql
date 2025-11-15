-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  company_name text,
  plan_tier text default 'free' check (plan_tier in ('free', 'pro', 'team', 'enterprise')),
  stripe_customer_id text unique,
  stripe_subscription_id text,
  subscription_status text,
  monthly_check_limit integer default 5,
  checks_used_this_month integer default 0,
  api_enabled boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- API Keys table
create table public.api_keys (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  key_hash text not null unique,
  key_prefix text not null,
  name text not null,
  last_used_at timestamp with time zone,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Email Checks table
create table public.email_checks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  check_source text default 'web' check (check_source in ('web', 'api')),
  api_key_id uuid references public.api_keys,
  subject_line text,
  email_body text not null,
  spam_score integer,
  deliverability_score integer,
  estimated_inbox_rate integer,
  verdict text,
  analysis_results jsonb not null,
  processing_time_ms integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Saved Templates table
create table public.saved_templates (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  template_name text not null,
  subject_line text,
  email_body text not null,
  tags text[],
  last_checked_at timestamp with time zone,
  last_spam_score integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Teams table (for collaboration)
create table public.teams (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  owner_id uuid references public.profiles not null,
  plan_tier text default 'team',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Team Members table
create table public.team_members (
  id uuid default gen_random_uuid() primary key,
  team_id uuid references public.teams on delete cascade not null,
  user_id uuid references public.profiles on delete cascade not null,
  role text default 'member' check (role in ('owner', 'admin', 'member')),
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(team_id, user_id)
);

-- Usage Analytics table
create table public.usage_analytics (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles not null,
  date date not null,
  checks_web integer default 0,
  checks_api integer default 0,
  total_checks integer default 0,
  unique(user_id, date)
);

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.api_keys enable row level security;
alter table public.email_checks enable row level security;
alter table public.saved_templates enable row level security;
alter table public.usage_analytics enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users can view own API keys" on public.api_keys for select using (auth.uid() = user_id);
create policy "Users can create API keys" on public.api_keys for insert with check (auth.uid() = user_id);
create policy "Users can delete own API keys" on public.api_keys for delete using (auth.uid() = user_id);
create policy "Users can update own API keys" on public.api_keys for update using (auth.uid() = user_id);

create policy "Users can view own checks" on public.email_checks for select using (auth.uid() = user_id);
create policy "Users can create checks" on public.email_checks for insert with check (auth.uid() = user_id);

create policy "Users can manage own templates" on public.saved_templates for all using (auth.uid() = user_id);

create policy "Users can view own analytics" on public.usage_analytics for select using (auth.uid() = user_id);
create policy "System can insert analytics" on public.usage_analytics for insert with check (true);
create policy "System can update analytics" on public.usage_analytics for update using (true);

-- Indexes for performance
create index email_checks_user_id_idx on public.email_checks(user_id);
create index email_checks_created_at_idx on public.email_checks(created_at desc);
create index api_keys_user_id_idx on public.api_keys(user_id);
create index api_keys_key_hash_idx on public.api_keys(key_hash);
create index usage_analytics_user_date_idx on public.usage_analytics(user_id, date);

