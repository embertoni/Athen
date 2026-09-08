import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { testClient } from './helpers/testClient'

const suffix = Date.now().toString()
const email = `crud-${suffix}@athen.local`
let perfilId: string
let cursoId: string
let nucleoId: string
let licaoId: string
let questaoId: string

describe('CRUD das entidades iniciais', () => {
  beforeAll(async () => {
    const { data, error } = await testClient
      .from('perfis')
      .insert({ nome: 'Perfil CRUD', email, tipo: 'criador' })
      .select()
      .single()

    expect(error).toBeNull()
    expect(data).toBeTruthy()
    perfilId = data.id
  })

  it('cria e consulta um curso', async () => {
    const created = await testClient
      .from('cursos')
      .insert({
        criador_id: perfilId,
        titulo: 'Curso CRUD',
        slug: `curso-crud-${suffix}`,
        descricao: 'Registro temporário de teste',
        nivel: 'iniciante',
        status: 'draft',
      })
      .select()
      .single()

    expect(created.error).toBeNull()
    cursoId = created.data.id

    const read = await testClient
      .from('cursos')
      .select('*')
      .eq('id', cursoId)
      .single()

    expect(read.error).toBeNull()
    expect(read.data.titulo).toBe('Curso CRUD')
  })

  it('atualiza o curso', async () => {
    const result = await testClient
      .from('cursos')
      .update({ titulo: 'Curso CRUD atualizado' })
      .eq('id', cursoId)
      .select()
      .single()

    expect(result.error).toBeNull()
    expect(result.data.titulo).toBe('Curso CRUD atualizado')
  })

  it('cria a hierarquia curso → núcleo → lição → questão', async () => {
    const nucleo = await testClient
      .from('nucleos')
      .insert({ curso_id: cursoId, titulo: 'Núcleo 1', posicao: 1 })
      .select()
      .single()
    expect(nucleo.error).toBeNull()
    nucleoId = nucleo.data.id

    const licao = await testClient
      .from('licoes')
      .insert({ nucleo_id: nucleoId, titulo: 'Lição 1', posicao: 1 })
      .select()
      .single()
    expect(licao.error).toBeNull()
    licaoId = licao.data.id

    const questao = await testClient
      .from('questoes')
      .insert({
        licao_id: licaoId,
        tipo: 'multipla_escolha',
        enunciado: 'Qual é a resposta?',
        payload: { opcoes: ['A', 'B'] },
        resposta: 'A',
        posicao: 1,
      })
      .select()
      .single()
    expect(questao.error).toBeNull()
    questaoId = questao.data.id
  })

  it('rejeita relação com ID pai inexistente', async () => {
    const result = await testClient.from('nucleos').insert({
      curso_id: '00000000-0000-0000-0000-000000000000',
      titulo: 'Inválido',
      posicao: 99,
    })

    expect(result.error).toBeTruthy()
  })

  afterAll(async () => {
    await testClient.from('questoes').delete().eq('id', questaoId)
    await testClient.from('licoes').delete().eq('id', licaoId)
    await testClient.from('nucleos').delete().eq('id', nucleoId)
    await testClient.from('cursos').delete().eq('id', cursoId)
    await testClient.from('perfis').delete().eq('id', perfilId)
  })
})