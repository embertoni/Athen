import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Tell dotenv to read .env.local
dotenv.config({ path: '.env.local' })

// Read from process.env instead of import.meta.env
const url = process.env.SUPABASE_TEST_URL
const key = process.env.SUPABASE_TEST_SERVICE_ROLE_KEY

if (!url || !key) {
  throw new Error('Configure SUPABASE_TEST_URL e SUPABASE_TEST_SERVICE_ROLE_KEY')
}

export const testClient = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
})