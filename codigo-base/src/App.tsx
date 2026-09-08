// src/App.tsx

import { ConnectionCheck } from './components/ConnectionCheck'
import { CrudConsole } from './components/CrudConsole'

export function App() {
  return (
    <main style={{ padding: '20px' }}>
      <h1>Athen — Testes de Infraestrutura (Sprint 1)</h1>
      <ConnectionCheck />
      <hr style={{ margin: '20px 0' }} />
      <CrudConsole />
    </main>
  )
}

export default App