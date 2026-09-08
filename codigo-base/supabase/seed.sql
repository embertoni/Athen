insert into perfis (nome, email, tipo)
values ('Criador de Teste', 'criador.teste@athen.local', 'criador')
on conflict (email) do nothing;

insert into cursos (criador_id, titulo, slug, descricao, nivel, status)
select
  id,
  'Introdução ao Athen',
  'introducao-ao-athen',
  'Curso usado para validar o banco na Sprint 1.',
  'iniciante',
  'published'
from perfis
where email = 'criador.teste@athen.local'
on conflict (slug) do nothing;