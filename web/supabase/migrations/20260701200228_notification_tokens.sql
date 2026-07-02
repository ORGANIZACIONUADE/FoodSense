-- Notification tokens stored in Supabase so the Edge Function can read them
-- without needing Firebase Admin SDK access to Firestore.

create table if not exists notification_tokens (
  id         uuid        primary key default gen_random_uuid(),
  user_id    text        not null,
  token      text        not null,
  enabled    boolean     not null default true,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, token)
);

create index if not exists notification_tokens_user_id_idx on notification_tokens (user_id);
create index if not exists notification_tokens_enabled_idx  on notification_tokens (enabled);

create trigger notification_tokens_set_updated_at
  before update on notification_tokens
  for each row execute function set_updated_at();

alter table notification_tokens enable row level security;

grant select, insert, update, delete on notification_tokens to anon, authenticated;

-- Restrictive: only accept Firebase JWTs from our project.
create policy "tokens_firebase_issuer"
  on notification_tokens as restrictive to anon, authenticated
  using (
    auth.jwt()->>'iss' = 'https://securetoken.google.com/foodsense-c426d'
    and auth.jwt()->>'aud' = 'foodsense-c426d'
  );

create policy "tokens_select"
  on notification_tokens for select to anon, authenticated
  using ((auth.jwt()->>'sub') = user_id);

create policy "tokens_insert"
  on notification_tokens for insert to anon, authenticated
  with check ((auth.jwt()->>'sub') = user_id);

create policy "tokens_update"
  on notification_tokens for update to anon, authenticated
  using      ((auth.jwt()->>'sub') = user_id)
  with check ((auth.jwt()->>'sub') = user_id);

create policy "tokens_delete"
  on notification_tokens for delete to anon, authenticated
  using ((auth.jwt()->>'sub') = user_id);

-- pg_cron job configured manually via SQL Editor (see git history for the command).
