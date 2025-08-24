'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Box, Button, Typography } from '@mui/material'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const router = useRouter()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert('Passwords matcher ikke')
      return
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })

    if (authError) {
      console.error(authError)
      alert(authError.message)
      return
    }

    if (authData.user) {
      // Gem ekstra info i "profiles" tabellen
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { id: authData.user.id, name, mobile }
        ])

      if (profileError) {
        console.error(profileError)
        alert('Fejl ved oprettelse af profil')
        return
      }

      alert('Tjek din e-mail for at bekræfte din konto')
      router.push('/auth/login')
    }
  }

  return (
    <Box sx={{ padding: "1rem", height: "100vh", alignContent: "center" }}>
      <Typography sx={{ fontSize: "2.5rem", textAlign: "center" }}>Signup</Typography>
      <form style={{ display: "grid", gap: "1rem" }} onSubmit={handleSignup}>
        <input 
          type="text" 
          placeholder="Name" 
          style={{ 
            background: "transparent", 
            padding: "1rem", 
            border: "none", 
            borderBottom: "1px solid white" 
          }}
          value={name} onChange={e => setName(e.target.value)} 
        />

        <input 
          type="tel" 
          placeholder="Mobil nr." 
          style={{ 
            background: "transparent", 
            padding: "1rem", 
            border: "none", 
            borderBottom: "1px solid white" 
          }}
          value={mobile} onChange={e => setMobile(e.target.value)} 
        />

        <input 
          type="email" 
          placeholder="Email" 
          style={{ 
            background: "transparent", 
            padding: "1rem", 
            border: "none", 
            borderBottom: "1px solid white" 
          }}
          value={email} onChange={e => setEmail(e.target.value)} 
        />

        <input 
          type="password" 
          placeholder="Password" 
          style={{ 
            background: "transparent", 
            padding: "1rem", 
            border: "none", 
            borderBottom: "1px solid white" 
          }}
          value={password} onChange={e => setPassword(e.target.value)} 
        />

        <input 
          type="password" 
          placeholder="Confirm Password" 
          style={{ 
            background: "transparent", 
            padding: "1rem", 
            border: "none", 
            borderBottom: "1px solid white" 
          }}
          value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} 
        />

        <Button 
          sx={{ 
            padding: "1rem",
            border: "none",
            color: "white",
            backgroundColor: "grey",
            "&:hover": {
              backgroundColor: "white",
              color: "black"
            },
          }} 
          type="submit">
            Sign up
          </Button>
      </form>
    </Box>
  )
}
