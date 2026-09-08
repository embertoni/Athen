create extension if not exists pgcrypto;

create table if not exists perfis (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null unique,
  tipo text not null default 'aprendiz'
    check (tipo in ('aprendiz', 'criador', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists cursos (
  id uuid primary key default gen_random_uuid(),
  criador_id uuid not null references perfis(id) on delete restrict,
  titulo text not null,
  slug text not null unique,
  descricao text not null default '',
  nivel text not null default 'iniciante',
  status text not null default 'draft'
    check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists nucleos (
  id uuid primary key default gen_random_uuid(),
  curso_id uuid not null references cursos(id) on delete cascade,
  titulo text not null,
  posicao integer not null check (posicao > 0),
  unique (curso_id, posicao)
);

create table if not exists licoes (
  id uuid primary key default gen_random_uuid(),
  nucleo_id uuid not null references nucleos(id) on delete cascade,
  titulo text not null,
  posicao integer not null check (posicao > 0),
  unique (nucleo_id, posicao)
);

create table if not exists questoes (
  id uuid primary key default gen_random_uuid(),
  licao_id uuid not null references licoes(id) on delete cascade,
  tipo text not null check (tipo in ('multipla_escolha', 'preenchimento')),
  enunciado text not null,
  payload jsonb not null default '{}'::jsonb,
  resposta text not null,
  posicao integer not null check (posicao > 0),
  unique (licao_id, posicao)
);

create index if not exists cursos_criador_idx on cursos(criador_id);
create index if not exists nucleos_curso_idx on nucleos(curso_id);
create index if not exists licoes_nucleo_idx on licoes(nucleo_id);
create index if not exists questoes_licao_idx on questoes(licao_id);