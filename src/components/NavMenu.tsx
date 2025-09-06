'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
// import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { supabase } from '@/lib/supabaseClient'
// import MenuIcon from '@mui/icons-material/Menu'
import { Box, Link } from '@mui/material'
import { useState, useEffect } from 'react'
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import CommentIcon from '@mui/icons-material/Comment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';

export default function BasicMenu() {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Hent session ved mount
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session)
    })

    // Lyt på login/logout events
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleClose = () => setAnchorEl(null)

  const handleProfile = () => {
    router.push('/profile')
    handleClose()
  }

  const handleChatHistory = () => {
    router.push('/chat')
    handleClose()
  }

  const handleFav = () => {
    router.push('/favoriter')
    handleClose()
  }

  const handleShop = () => {
    router.push('/shop')
    handleClose()
  }

  return (
    <>
      <Box
        sx={{ 
          display: "flex",
          alignItems: "center",
          width: { xs: "100%", sm: "50%" },
          justifyContent: { xs: "space-around", sm: "center" },
          justifySelf: { sm: "center" },
          gap: { sm: "4rem" },
          padding: { xs: "0.3rem 1rem", sm: "0" },
          position: { xs: "fixed", sm: "relative"},
          bottom: { xs: 0 },
          top: { sm: "1rem" },
          backgroundColor: { xs: "white", sm: "#0000002b" },
          borderTopLeftRadius: "2rem",
          borderTopRightRadius: "2rem",
          borderRadius: { xs: "0", sm: "3rem" },
          zIndex: 15,
          filter: "drop-shadow(2px 4px 6px black)",
          border: { sm: "1px solid #0000002b" },
        }}>
          <Link href="/"><img src="/logo.webp" alt='logo' width={30}/></Link>
          <HomeFilledIcon onClick={handleShop} sx={{ xs: "black", sm: "white", cursor: "pointer" }} />
          <CommentIcon onClick={handleChatHistory} sx={{ xs: "black", sm: "white", cursor: "pointer" }} />
          <FavoriteIcon onClick={handleFav} sx={{ xs: "black", sm: "white", cursor: "pointer" }} />
          <PersonIcon onClick={handleProfile} sx={{ xs: "black", sm: "white", cursor: "pointer" }} />
      </Box>
    </>
  )
}

