// src/components/CrudConsole.tsx

import { useState, useEffect } from 'react'
import * as repo from '../data/repositories'
import type { Perfil, Curso, Nucleo, Licao, Questao, TipoPerfil, StatusCurso, TipoQuestao } from '../types/database'

type Tab = 'perfis' | 'cursos' | 'nucleos' | 'licoes' | 'questoes'

export function CrudConsole() {
  const [activeTab, setActiveTab] = useState<Tab>('perfis')
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError: boolean } | null>(null)
  const [lastCreatedId, setLastCreatedId] = useState<string | null>(null)

  // Listas
  const [perfis, setPerfis] = useState<Perfil[]>([])
  const [cursos, setCursos] = useState<Curso[]>([])
  const [nucleos, setNucleos] = useState<Nucleo[]>([])
  const [licoes, setLicoes] = useState<Licao[]>([])
  const [questoes, setQuestoes] = useState<Questao[]>([])

  // Formulários de Edição / Criação
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form states
  const [fPerfil, setFPerfil] = useState({ nome: '', email: '', tipo: 'aprendiz' as TipoPerfil })
  const [fCurso, setFCurso] = useState({ criador_id: '', titulo: '', slug: '', descricao: '', nivel: 'iniciante', status: 'draft' as StatusCurso })
  const [fNucleo, setFNucleo] = useState({ curso_id: '', titulo: '', posicao: 1 })
  const [fLicao, setFLicao] = useState({ nucleo_id: '', titulo: '', posicao: 1 })
  const [fQuestao, setFQuestao] = useState({ licao_id: '', tipo: 'multipla_escolha' as TipoQuestao, enunciado: '', payload: '{"opcoes": ["A", "B"]}', resposta: 'A', posicao: 1 })

  const notify = (text: string, isError = false) => {
    setStatusMsg({ text, isError })
  }

  const loadCurrentTabData = async () => {
    try {
      if (activeTab === 'perfis') setPerfis(await repo.listarPerfis())
      if (activeTab === 'cursos') setCursos(await repo.listarCursos())
      if (activeTab === 'nucleos') setNucleos(await repo.listarNucleos())
      if (activeTab === 'licoes') setLicoes(await repo.listarLicoes())
      if (activeTab === 'questoes') setQuestoes(await repo.listarQuestoes())
    } catch (err: any) {
      notify(`Erro ao carregar ${activeTab}: ${err.message}`, true)
    }
  }

  useEffect(() => {
    setEditingId(null)
    loadCurrentTabData()
  }, [activeTab])

  // --- HANDLERS ---
  const handleSavePerfil = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await repo.atualizarPerfil(editingId, fPerfil)
        notify('Perfil atualizado com sucesso!')
      } else {
        const res = await repo.criarPerfil(fPerfil)
        setLastCreatedId(res.id)
        setFCurso((prev) => ({ ...prev, criador_id: res.id }))
        notify(`Perfil criado com ID: ${res.id}`)
      }
      setEditingId(null)
      loadCurrentTabData()
    } catch (err: any) { notify(err.message, true) }
  }

  const handleSaveCurso = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await repo.atualizarCurso(editingId, fCurso)
        notify('Curso atualizado com sucesso!')
      } else {
        const res = await repo.criarCurso(fCurso)
        setLastCreatedId(res.id)
        setFNucleo((prev) => ({ ...prev, curso_id: res.id }))
        notify(`Curso criado com ID: ${res.id}`)
      }
      setEditingId(null)
      loadCurrentTabData()
    } catch (err: any) { notify(err.message, true) }
  }

  const handleSaveNucleo = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await repo.atualizarNucleo(editingId, fNucleo)
        notify('Núcleo atualizado com sucesso!')
      } else {
        const res = await repo.criarNucleo(fNucleo)
        setLastCreatedId(res.id)
        setFLicao((prev) => ({ ...prev, nucleo_id: res.id }))
        notify(`Núcleo criado com ID: ${res.id}`)
      }
      setEditingId(null)
      loadCurrentTabData()
    } catch (err: any) { notify(err.message, true) }
  }

  const handleSaveLicao = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await repo.atualizarLicao(editingId, fLicao)
        notify('Lição atualizada com sucesso!')
      } else {
        const res = await repo.criarLicao(fLicao)
        setLastCreatedId(res.id)
        setFQuestao((prev) => ({ ...prev, licao_id: res.id }))
        notify(`Lição criada com ID: ${res.id}`)
      }
      setEditingId(null)
      loadCurrentTabData()
    } catch (err: any) { notify(err.message, true) }
  }

  const handleSaveQuestao = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let parsedPayload = {}
      try { parsedPayload = JSON.parse(fQuestao.payload) } catch { throw new Error('Payload deve ser um JSON válido') }

      const dados = { ...fQuestao, payload: parsedPayload }

      if (editingId) {
        await repo.atualizarQuestao(editingId, dados)
        notify('Questão atualizada com sucesso!')
      } else {
        const res = await repo.criarQuestao(dados)
        setLastCreatedId(res.id)
        notify(`Questão criada com ID: ${res.id}`)
      }
      setEditingId(null)
      loadCurrentTabData()
    } catch (err: any) { notify(err.message, true) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir?')) return
    try {
      if (activeTab === 'perfis') await repo.deletarPerfil(id)
      if (activeTab === 'cursos') await repo.deletarCurso(id)
      if (activeTab === 'nucleos') await repo.deletarNucleo(id)
      if (activeTab === 'licoes') await repo.deletarLicao(id)
      if (activeTab === 'questoes') await repo.deletarQuestao(id)
      notify('Registro excluído com sucesso!')
      loadCurrentTabData()
    } catch (err: any) {
      notify(`Erro ao excluir: ${err.message}`, true)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h2>Console Manual CRUD — Sprint 1</h2>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {(['perfis', 'cursos', 'nucleos', 'licoes', 'questoes'] as Tab[]).map((tab, idx) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              borderBottom: activeTab === tab ? '3px solid #0070f3' : '1px solid #ccc',
            }}
          >
            {idx + 1}. {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* FEEDBACK STATUS */}
      {statusMsg && (
        <div style={{ padding: '10px', marginBottom: '15px', backgroundColor: statusMsg.isError ? '#ffe6e6' : '#e6ffe6', border: `1px solid ${statusMsg.isError ? 'red' : 'green'}` }}>
          {statusMsg.text}
        </div>
      )}

      {/* LAST CREATED ID INFO */}
      {lastCreatedId && (
        <div style={{ padding: '8px', marginBottom: '15px', backgroundColor: '#f0f4f8', border: '1px dashed #0070f3' }}>
          Último ID gerado: <code>{lastCreatedId}</code>
          <button onClick={() => navigator.clipboard.writeText(lastCreatedId)} style={{ marginLeft: '10px' }}>Copiar ID</button>
        </div>
      )}

      {/* FORMULÁRIOS */}
      <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '20px' }}>
        <h3>{editingId ? `Editar ${activeTab}` : `Criar Novo em ${activeTab}`}</h3>

        {activeTab === 'perfis' && (
          <form onSubmit={handleSavePerfil} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input placeholder="Nome" value={fPerfil.nome} onChange={(e) => setFPerfil({ ...fPerfil, nome: e.target.value })} required />
            <input placeholder="E-mail" type="email" value={fPerfil.email} onChange={(e) => setFPerfil({ ...fPerfil, email: e.target.value })} required />
            <select value={fPerfil.tipo} onChange={(e) => setFPerfil({ ...fPerfil, tipo: e.target.value as TipoPerfil })}>
              <option value="aprendiz">aprendiz</option>
              <option value="criador">criador</option>
              <option value="admin">admin</option>
            </select>
            <button type="submit">{editingId ? 'Atualizar' : 'Criar Perfil'}</button>
          </form>
        )}

        {activeTab === 'cursos' && (
          <form onSubmit={handleSaveCurso} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input placeholder="ID do Criador (UUID do Perfil)" value={fCurso.criador_id} onChange={(e) => setFCurso({ ...fCurso, criador_id: e.target.value })} required />
            <input placeholder="Título" value={fCurso.titulo} onChange={(e) => setFCurso({ ...fCurso, titulo: e.target.value })} required />
            <input placeholder="Slug" value={fCurso.slug} onChange={(e) => setFCurso({ ...fCurso, slug: e.target.value })} required />
            <input placeholder="Descrição" value={fCurso.descricao} onChange={(e) => setFCurso({ ...fCurso, descricao: e.target.value })} />
            <select value={fCurso.status} onChange={(e) => setFCurso({ ...fCurso, status: e.target.value as StatusCurso })}>
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>
            <button type="submit">{editingId ? 'Atualizar' : 'Criar Curso'}</button>
          </form>
        )}

        {activeTab === 'nucleos' && (
          <form onSubmit={handleSaveNucleo} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input placeholder="ID do Curso (UUID)" value={fNucleo.curso_id} onChange={(e) => setFNucleo({ ...fNucleo, curso_id: e.target.value })} required />
            <input placeholder="Título do Núcleo" value={fNucleo.titulo} onChange={(e) => setFNucleo({ ...fNucleo, titulo: e.target.value })} required />
            <input placeholder="Posição" type="number" value={fNucleo.posicao} onChange={(e) => setFNucleo({ ...fNucleo, posicao: Number(e.target.value) })} required />
            <button type="submit">{editingId ? 'Atualizar' : 'Criar Núcleo'}</button>
          </form>
        )}

        {activeTab === 'licoes' && (
          <form onSubmit={handleSaveLicao} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input placeholder="ID do Núcleo (UUID)" value={fLicao.nucleo_id} onChange={(e) => setFLicao({ ...fLicao, nucleo_id: e.target.value })} required />
            <input placeholder="Título da Lição" value={fLicao.titulo} onChange={(e) => setFLicao({ ...fLicao, titulo: e.target.value })} required />
            <input placeholder="Posição" type="number" value={fLicao.posicao} onChange={(e) => setFLicao({ ...fLicao, posicao: Number(e.target.value) })} required />
            <button type="submit">{editingId ? 'Atualizar' : 'Criar Lição'}</button>
          </form>
        )}

        {activeTab === 'questoes' && (
          <form onSubmit={handleSaveQuestao} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input placeholder="ID da Lição (UUID)" value={fQuestao.licao_id} onChange={(e) => setFQuestao({ ...fQuestao, licao_id: e.target.value })} required />
            <select value={fQuestao.tipo} onChange={(e) => setFQuestao({ ...fQuestao, tipo: e.target.value as TipoQuestao })}>
              <option value="multipla_escolha">multipla_escolha</option>
              <option value="preenchimento">preenchimento</option>
            </select>
            <input placeholder="Enunciado" value={fQuestao.enunciado} onChange={(e) => setFQuestao({ ...fQuestao, enunciado: e.target.value })} required />
            <textarea placeholder="Payload (JSON)" value={fQuestao.payload} onChange={(e) => setFQuestao({ ...fQuestao, payload: e.target.value })} rows={3} />
            <input placeholder="Resposta Correta" value={fQuestao.resposta} onChange={(e) => setFQuestao({ ...fQuestao, resposta: e.target.value })} required />
            <input placeholder="Posição" type="number" value={fQuestao.posicao} onChange={(e) => setFQuestao({ ...fQuestao, posicao: Number(e.target.value) })} required />
            <button type="submit">{editingId ? 'Atualizar' : 'Criar Questão'}</button>
          </form>
        )}

        {editingId && <button onClick={() => setEditingId(null)} style={{ marginTop: '8px' }}>Cancelar Edição</button>}
      </div>

      {/* TABELA DE REGISTROS */}
      <h3>Listagem de {activeTab}</h3>
      <button onClick={loadCurrentTabData} style={{ marginBottom: '10px' }}>Atualizar Lista</button>

      <table border={1} cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Detalhes</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {activeTab === 'perfis' && perfis.map((p) => (
            <tr key={p.id}>
              <td><code>{p.id}</code></td>
              <td>{p.nome} ({p.email}) - <b>{p.tipo}</b></td>
              <td>
                <button onClick={() => { setEditingId(p.id); setFPerfil({ nome: p.nome, email: p.email, tipo: p.tipo }) }}>Editar</button>
                <button onClick={() => handleDelete(p.id)} style={{ marginLeft: '5px', color: 'red' }}>Excluir</button>
              </td>
            </tr>
          ))}

          {activeTab === 'cursos' && cursos.map((c) => (
            <tr key={c.id}>
              <td><code>{c.id}</code></td>
              <td>{c.titulo} (Criador: <code>{c.criador_id.slice(0, 8)}...</code>) - <b>{c.status}</b></td>
              <td>
                <button onClick={() => { setEditingId(c.id); setFCurso({ criador_id: c.criador_id, titulo: c.titulo, slug: c.slug, descricao: c.descricao, nivel: c.nivel, status: c.status }) }}>Editar</button>
                <button onClick={() => handleDelete(c.id)} style={{ marginLeft: '5px', color: 'red' }}>Excluir</button>
              </td>
            </tr>
          ))}

          {activeTab === 'nucleos' && nucleos.map((n) => (
            <tr key={n.id}>
              <td><code>{n.id}</code></td>
              <td>#{n.posicao} - {n.titulo} (Curso: <code>{n.curso_id.slice(0, 8)}...</code>)</td>
              <td>
                <button onClick={() => { setEditingId(n.id); setFNucleo({ curso_id: n.curso_id, titulo: n.titulo, posicao: n.posicao }) }}>Editar</button>
                <button onClick={() => handleDelete(n.id)} style={{ marginLeft: '5px', color: 'red' }}>Excluir</button>
              </td>
            </tr>
          ))}

          {activeTab === 'licoes' && licoes.map((l) => (
            <tr key={l.id}>
              <td><code>{l.id}</code></td>
              <td>#{l.posicao} - {l.titulo} (Núcleo: <code>{l.nucleo_id.slice(0, 8)}...</code>)</td>
              <td>
                <button onClick={() => { setEditingId(l.id); setFLicao({ nucleo_id: l.nucleo_id, titulo: l.titulo, posicao: l.posicao }) }}>Editar</button>
                <button onClick={() => handleDelete(l.id)} style={{ marginLeft: '5px', color: 'red' }}>Excluir</button>
              </td>
            </tr>
          ))}

          {activeTab === 'questoes' && questoes.map((q) => (
            <tr key={q.id}>
              <td><code>{q.id}</code></td>
              <td>#{q.posicao} - [{q.tipo}] {q.enunciado} (Resp: {q.resposta})</td>
              <td>
                <button onClick={() => { setEditingId(q.id); setFQuestao({ licao_id: q.licao_id, tipo: q.tipo, enunciado: q.enunciado, payload: JSON.stringify(q.payload), resposta: q.resposta, posicao: q.posicao }) }}>Editar</button>
                <button onClick={() => handleDelete(q.id)} style={{ marginLeft: '5px', color: 'red' }}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}