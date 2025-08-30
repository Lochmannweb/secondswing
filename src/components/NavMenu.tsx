'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
// import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { supabase } from '@/lib/supabaseClient'
// import MenuIcon from '@mui/icons-material/Menu'
import { Box, Link } from '@mui/material'
import { useState, useEffect } from 'react'

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

  // const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
  //   setAnchorEl(event.currentTarget)
  // }

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

  // const handleLogin = () => {
  //   router.push('/auth/login')
  //   handleClose()
  // }

  // const handleSignup = () => {
  //   router.push('/auth/signup')
  //   handleClose()
  // }

  // const handleLogout = async () => {
  //   await supabase.auth.signOut()
  //   setIsLoggedIn(false)
  //   handleClose()
  //   router.push('/shop')   // redirect efter logout
  // }

  return (
    <>
      <Box
        sx={{ 
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-around",
          padding: "0.3rem 1rem",
          position: "fixed",
          bottom: 0,
          backgroundColor: "white",
          borderTopLeftRadius: "2rem",
          borderTopRightRadius: "2rem",
          zIndex: 15,
          filter: "drop-shadow(2px 4px 6px black)"
        }}>
          <Link href="/"><img src="/logo.webp" alt='logo' width={30}/></Link>
          <MenuItem onClick={handleShop}><img src="/home.png" alt='logo' width={20}/></MenuItem>
          <MenuItem onClick={handleChatHistory}><img src="/comment.png" alt='logo' width={20}/></MenuItem>
          <MenuItem onClick={handleFav}><img src="/heart.png" alt='logo' width={20}/></MenuItem>
          <MenuItem onClick={handleProfile}><img src="/user.png" alt='logo' width={19}/></MenuItem>
      </Box>
    </>
  )
}



      // <Menu
      //   id="basic-menu"
      //   anchorEl={anchorEl}
      //   open={Boolean(anchorEl)}
      //   onClose={handleClose}
      //   slotProps={{ list: { 'aria-labelledby': 'basic-button' } }}
      //   anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      //   sx={{ zIndex: 10, top: "-2rem", filter: "none", marginLeft: "1rem" }}
      //   PaperProps={{ sx: { width: "100vw", maxWidth: "100vw", paddingBottom: "2rem" } }}
      // >
      //   <Box>
      //     {isLoggedIn ? (
      //       <>
      //         <MenuItem onClick={handleProfile}>Profile</MenuItem>
      //         <MenuItem onClick={handleShop}>Shop</MenuItem>
      //         <MenuItem onClick={handleLogout}>Logout</MenuItem>
      //       </>
      //     ) : (
      //       <>
      //         <MenuItem onClick={handleShop}>Shop</MenuItem>
      //         <MenuItem onClick={handleLogin}>Login</MenuItem>
      //         <MenuItem onClick={handleSignup}>Signup</MenuItem>
      //       </>
      //     )}
      //   </Box>
      // </Menu>