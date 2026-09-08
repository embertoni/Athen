// src/data/repositories.ts

import { supabase } from '../lib/supabase'
import type { Perfil, Curso, Nucleo, Licao, Questao } from '../types/database'

function checkSupabase() {
  if (!supabase) throw new Error('Supabase não está configurado em .env.local')
}

// ================= PERFIS =================
export async function listarPerfis(): Promise<Perfil[]> {
  checkSupabase()
  const { data, error } = await supabase!.from('perfis').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function criarPerfil(dados: Omit<Perfil, 'id' | 'created_at'>): Promise<Perfil> {
  checkSupabase()
  const { data, error } = await supabase!.from('perfis').insert(dados).select().single()
  if (error) throw error
  return data
}

export async function atualizarPerfil(id: string, dados: Partial<Perfil>): Promise<Perfil> {
  checkSupabase()
  const { data, error } = await supabase!.from('perfis').update(dados).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deletarPerfil(id: string): Promise<void> {
  checkSupabase()
  const { error } = await supabase!.from('perfis').delete().eq('id', id)
  if (error) throw error
}

// ================= CURSOS =================
export async function listarCursos(): Promise<Curso[]> {
  checkSupabase()
  const { data, error } = await supabase!.from('cursos').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function criarCurso(dados: Omit<Curso, 'id' | 'created_at' | 'updated_at'>): Promise<Curso> {
  checkSupabase()
  const { data, error } = await supabase!.from('cursos').insert(dados).select().single()
  if (error) throw error
  return data
}

export async function atualizarCurso(id: string, dados: Partial<Curso>): Promise<Curso> {
  checkSupabase()
  const { data, error } = await supabase!.from('cursos').update({ ...dados, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deletarCurso(id: string): Promise<void> {
  checkSupabase()
  const { error } = await supabase!.from('cursos').delete().eq('id', id)
  if (error) throw error
}

// ================= NÚCLEOS =================
export async function listarNucleos(cursoId?: string): Promise<Nucleo[]> {
  checkSupabase()
  let query = supabase!.from('nucleos').select('*').order('posicao', { ascending: true })
  if (cursoId) query = query.eq('curso_id', cursoId)
  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function criarNucleo(dados: Omit<Nucleo, 'id'>): Promise<Nucleo> {
  checkSupabase()
  const { data, error } = await supabase!.from('nucleos').insert(dados).select().single()
  if (error) throw error
  return data
}

export async function atualizarNucleo(id: string, dados: Partial<Nucleo>): Promise<Nucleo> {
  checkSupabase()
  const { data, error } = await supabase!.from('nucleos').update(dados).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deletarNucleo(id: string): Promise<void> {
  checkSupabase()
  const { error } = await supabase!.from('nucleos').delete().eq('id', id)
  if (error) throw error
}

// ================= LIÇÕES =================
export async function listarLicoes(nucleoId?: string): Promise<Licao[]> {
  checkSupabase()
  let query = supabase!.from('licoes').select('*').order('posicao', { ascending: true })
  if (nucleoId) query = query.eq('nucleo_id', nucleoId)
  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function criarLicao(dados: Omit<Licao, 'id'>): Promise<Licao> {
  checkSupabase()
  const { data, error } = await supabase!.from('licoes').insert(dados).select().single()
  if (error) throw error
  return data
}

export async function atualizarLicao(id: string, dados: Partial<Licao>): Promise<Licao> {
  checkSupabase()
  const { data, error } = await supabase!.from('licoes').update(dados).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deletarLicao(id: string): Promise<void> {
  checkSupabase()
  const { error } = await supabase!.from('licoes').delete().eq('id', id)
  if (error) throw error
}

// ================= QUESTÕES =================
export async function listarQuestoes(licaoId?: string): Promise<Questao[]> {
  checkSupabase()
  let query = supabase!.from('questoes').select('*').order('posicao', { ascending: true })
  if (licaoId) query = query.eq('licao_id', licaoId)
  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function criarQuestao(dados: Omit<Questao, 'id'>): Promise<Questao> {
  checkSupabase()
  const { data, error } = await supabase!.from('questoes').insert(dados).select().single()
  if (error) throw error
  return data
}

export async function atualizarQuestao(id: string, dados: Partial<Questao>): Promise<Questao> {
  checkSupabase()
  const { data, error } = await supabase!.from('questoes').update(dados).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deletarQuestao(id: string): Promise<void> {
  checkSupabase()
  const { error } = await supabase!.from('questoes').delete().eq('id', id)
  if (error) throw error
}