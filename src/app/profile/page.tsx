'use client'

import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box } from '@mui/material'

type UserProfile = {
  id: string
  email: string
  name: string | null
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push('/auth/login')
        return
      }

      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single()

      setProfile(userProfile ?? null)
      setLoading(false)
    }

    fetchProfile()
  }, [router])

  if (loading) return <p>Loading...</p>

  return (
    <>
      <Box>
        {profile ? (
          <div>
            <h1>Min profil</h1>
            <p>Email: {profile.email}</p>
            <p>Navn: {profile.name}</p>
          </div>
        ) : (
          <p>Ingen profil fundet</p>
        )}
      </Box>
    </>
  )
}
