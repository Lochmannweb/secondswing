'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { supabase } from '@/lib/supabaseClient'
import MenuIcon from '@mui/icons-material/Menu'
import { Box } from '@mui/material'
import { useState, useEffect } from 'react'

export default function BasicMenu() {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // start med logget ud

  // Tjek login-status ved mount
  useEffect(() => {
    const session = supabase.auth.getSession()
    session.then(({ data }) => {
      setIsLoggedIn(!!data.session)
    })
  }, [])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleProfile = () => {
    router.push('/profile')
    handleClose()
  }

  const handleShop = () => {
    router.push('/shop')
    handleClose()
  }

  const handleLogin = () => {
    router.push('/auth/login')
    handleClose()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsLoggedIn(false)
    // router.push('/auth/login')
    handleClose()
  }

  return (
    <>
      <Box 
        onClick={handleClick}
        sx={{ 
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between",
          padding: "1rem",
          position: "absolute",
          bottom: 0,
          backgroundColor: "white",
          borderTopLeftRadius: "2rem",
          borderTopRightRadius: "2rem",
          zIndex: 10,
          filter: "drop-shadow(2px 4px 6px black)"
        }}>
        <img src="/logo.webp" alt='logo' width={50}/>
        <MenuIcon sx={{ color: "black", cursor: "pointer", marginRight: "0.5rem" }} />
      </Box>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{
          list: { 'aria-labelledby': 'basic-button' },
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right', 
        }}
        sx={{
          zIndex: 1,
          top: "-2rem",
          filter: "none",
          marginLeft: "1rem"
        }}
        PaperProps={{
          sx: {
            width: "100vw",
            maxWidth: "100vw",
            paddingBottom: "2rem",
          }
        }}
      >
        {isLoggedIn ? (
          <>
            <MenuItem onClick={handleProfile}>Profile</MenuItem>
            {/* <MenuItem onClick={handleShop}>shop</MenuItem> */}
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </>
        ) : (
          <>
            {/* <MenuItem onClick={handleShop}>Shop</MenuItem> */}
            <MenuItem onClick={handleLogin}>Login</MenuItem>
            <MenuItem onClick={handleClose}>Signup</MenuItem>
          </>
        )}
      </Menu>
    </>
  )
}
