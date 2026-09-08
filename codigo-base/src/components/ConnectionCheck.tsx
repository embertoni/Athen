import { useEffect, useState } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase'

export function ConnectionCheck() {
  const [message, setMessage] = useState('Verificando conexão...')

  useEffect(() => {
    async function check() {
      if (!supabaseConfigured || !supabase) {
        setMessage('Supabase não configurado')
        return
      }

      const { error } = await supabase.from('cursos').select('id').limit(1)
      setMessage(error ? `Erro: ${error.message}` : 'Conexão funcionando')
    }

    void check()
  }, [])

  return <p>{message}</p>
}