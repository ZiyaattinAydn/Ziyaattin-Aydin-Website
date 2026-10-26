-- Applied to the hosted Supabase project as migration 20261026133452.
-- Optional short project subtitle for Studio card previews and public portfolio cards.
-- Existing project content and publication/privacy flags are preserved.
alter table public.projects
  add column if not exists subtitle text not null default '';

alter table public.projects
  add constraint projects_subtitle_max_length
  check (char_length(subtitle) <= 160);

comment on column public.projects.subtitle
  is 'Optional brief technology or project-type line displayed under project titles.';
