// src/types/database.ts

export type TipoPerfil = 'aprendiz' | 'criador' | 'admin'
export type StatusCurso = 'draft' | 'published'
export type TipoQuestao = 'multipla_escolha' | 'preenchimento'

export interface Perfil {
  id: string
  nome: string
  email: string
  tipo: TipoPerfil
  created_at?: string
}

export interface Curso {
  id: string
  criador_id: string
  titulo: string
  slug: string
  descricao: string
  nivel: string
  status: StatusCurso
  created_at?: string
  updated_at?: string
}

export interface Nucleo {
  id: string
  curso_id: string
  titulo: string
  posicao: number
}

export interface Licao {
  id: string
  nucleo_id: string
  titulo: string
  posicao: number
}

export interface Questao {
  id: string
  licao_id: string
  tipo: TipoQuestao
  enunciado: string
  payload: Record<string, unknown>
  resposta: string
  posicao: number
}