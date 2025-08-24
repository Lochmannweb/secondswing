'use client'

import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, Divider } from '@mui/material'
import Image from 'next/image'

type UserProfile = {
  id: string
  email: string
  display_name: string | null
  phone: string | null
  avatar_url?: string | null
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const findAvatarUrl = async (userId: string) => {
    const extensions = ['png', 'jpg', 'jpeg', 'webp']
    for (const ext of extensions) {
      const path = `avatars/${userId}.${ext}`
      try {
        // Forsøg at hente filen
        await supabase.storage.from('avatars').download(path)
        const { data } = supabase.storage.from('avatars').getPublicUrl(path)
        return data.publicUrl
      } catch {
        continue
      }
    }
    return null
  }

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push('/auth/login')
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const avatar_url = await findAvatarUrl(user.id)
        setProfile({
          id: user.id,
          email: user.email!,
          display_name: user.user_metadata?.display_name ?? null,
          phone: user.user_metadata?.phone ?? null,
          avatar_url,
        })
      }
      setLoading(false)
    }

    fetchProfile()
  }, [router])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return
    const file = e.target.files?.[0]
    if (!file) return

    const fileExt = file.name.split('.').pop()
    // const fileName = `${profile.id}.${fileExt}`
    // const filePath = `avatars/${profile.id}/${file.name}`
    const filePath = `${profile.id}.${fileExt}`

    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    if (error) {
      console.error('Upload fejl:', error)
      alert(`Upload fejlede: ${error.message}`)
      return
    }

    const { data: publicData } = supabase.storage.from('avatars').getPublicUrl(filePath)
    setProfile({ ...profile, avatar_url: publicData.publicUrl ?? null })
  }

  if (loading) return <p>Loading...</p>

  return (
    <Box sx={{ padding: 0 }}>
      {profile ? (
        <>
          <Box>
              <img
                src="/test.jpg"
                alt="Profilbillede"
                width={80}
                height={100}
                style={{
                  width: "100%",
                  height: "100%"
                }} 
              />
            {/* {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="Profilbillede"
                width={120}
                height={120}
                style={{ borderRadius: '50%' }}
                unoptimized
              />
            ) : (
              <Image
                src="/placeholderprofile.jpg"
                alt="placeholder"
                width={120}
                height={120}
                style={{ borderRadius: '50%' }}
              />
            )} */}

            <Button
              component="label"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
              }}
            >
              Upload
              <input type="file" hidden accept="image/*" onChange={handleUpload} />
            </Button>
          </Box>

          <Box
            sx={{
              backgroundColor: "white",
              padding: "1rem",
              color: "black",
              borderTopLeftRadius: "2rem",
              borderTopRightRadius: "2rem",
              marginTop: "-2rem",
              filter: "drop-shadow(2px 4px 6px black)"
            }}
          >
            <Box sx={{ display: "grid", gap: "0.5rem", marginTop: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p>{profile.display_name ?? 'Ikke udfyldt'}</p>
                <p>Send en besked</p>
              </div>
            </Box>
            <Box sx={{ padding: "2rem 0", display: "grid", gap: "0.5rem" }}>
              <Divider />
              <a href="/opretProdukt">Opret produkt</a>
              <Divider />
            </Box>
          </Box>
        </>
      ) : (
        <p>Ingen profil fundet</p>
      )}
    </Box>
  )
}
