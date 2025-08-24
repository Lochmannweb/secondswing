'use client'
import { supabase } from '@/lib/supabaseClient'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      if (error.message === 'Email not confirmed') {
        alert('Tjek din e-mail for at bekræfte din konto, før du kan logge ind.')
      } else {
        console.error(error)
        alert('Fejl ved login: ' + error.message)
      }
    } else if (data.user) {
      console.log('Logged in:', data)
      router.push('/') // redirect efter login
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  )
}
