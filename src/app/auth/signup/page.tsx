'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      console.error(error)
    } else {
      if (data.user) {
        router.push('/login') // redirect når logget ind
      } 
      else {
        alert('Tjek din e-mail for at bekræfte din konto')
        router.push('/auth/login') // redirect til login
      }
    }
  }

  return (
    <form onSubmit={handleSignup}>
      <input type="email" placeholder='email' value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder='password' value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Sign up</button>
    </form>
  )
}
