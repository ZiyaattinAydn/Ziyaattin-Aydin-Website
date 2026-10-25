try {
  const { PGlite } = await import("@electric-sql/pglite");
  const fs = await import("node:fs");
  const path = await import("node:path");
  const root = process.cwd();
  const db = new PGlite();
  await db.exec(`
create role anon; create role authenticated; create role service_role bypassrls;
create schema auth; create schema storage;
create table auth.users(id uuid primary key,raw_user_meta_data jsonb default '{}');
create function auth.uid() returns uuid language sql stable as $$ select (current_setting('request.jwt.claims',true)::jsonb->>'sub')::uuid $$;
create function auth.jwt() returns jsonb language sql stable as $$ select current_setting('request.jwt.claims',true)::jsonb $$;
grant usage on schema auth to anon,authenticated;
grant execute on all functions in schema auth to anon,authenticated;
create function public.rls_auto_enable() returns trigger language plpgsql security definer as $$ begin return new; end $$;
set studio.test_database='isolated';
`);
  for (const f of fs
    .readdirSync(path.join(root, "supabase/migrations"))
    .filter((f) => f.endsWith(".sql") && !f.includes("storage_setup"))) {
    console.log("APPLY", f);
    await db.exec(
      fs.readFileSync(path.join(root, "supabase/migrations", f), "utf8"),
    );
  }
  await db.exec(
    fs.readFileSync(
      path.join(root, "scripts/verify-studio-database.sql"),
      "utf8",
    ),
  );
  console.log(
    "STUDIO_DATABASE_OK: isolated PostgreSQL CRUD, dates, timestamps, archive, project consistency, AAL1/AAL2, owner isolation, pending/disabled, public reads and RPC grants",
  );
  await db.exec(fs.readFileSync(path.join(root,"scripts/verify-studio-library.sql"),"utf8"));
  console.log("LIBRARY_DATABASE_OK: notes/files CRUD, archive history, private visibility, project ownership, Storage policies, anonymous/AAL1/pending/other owner denial, isolated snapshot rehearsal");
  await db.close();
} catch (e) {
  console.error(
    JSON.stringify({
      message: e.message,
      code: e.code,
      detail: e.detail,
      where: e.where,
    }),
  );
  process.exit(1);
}
