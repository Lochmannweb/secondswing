"use client"

import React from 'react'
import { Box, Button, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/navigation'
import "@/app/font.module.css";


export default function ForsideHero() {
    const theme = useTheme()
    const isDesktop = useMediaQuery(theme.breakpoints.up("sm"))

    const router = useRouter()

    const goToShop = (filter: "all" | "female") => {
        router.push(`/shop?filter=${filter}`)
    }
    
    return (
        <>
        {/* Mobil version */}
        {!isDesktop && (
            <Box
                sx={{
                    textAlign: "center",
                    alignContent: "center",
                    height: "100vh",
                    fontFamily: "JacquesFrancois",
                    background: { xs: "linear-gradient(0deg, black, transparent)" }
                }}
            >
                <Typography 
                  sx={{ 
                    fontSize: { xs: "3rem", sm : "5rem" }, 
                    mb: "0rem", 
                    lineHeight: "3rem",
                    fontFamily: "JacquesFrancois"
                    }}
                  >
                    Golf med passion
                </Typography>
                <p style={{ fontSize: "1rem", color: "grey" }}>- brugt udstyr, nye oplevelser</p>
                <Button
                    sx={{
                        backgroundColor: "transparent",
                        border: "1px solid white",
                        color: "white",
                        padding: "0.1rem 1.2rem",
                        top: "2rem",
                        fontFamily: "JacquesFrancois",
                        "&:hover": {
                          backgroundColor: "white",
                          color: "black",
                        }
                    }}
                    href="/auth/signup">Start nu</Button>
            </Box>
        )} 

        {/* tablet / desktop version */}
            {isDesktop && (
              <Box sx={{ display: "flex", alignItems: "center", height: "100vh", px: "6rem" }}>
                {/* Left side text */}
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: "3rem", mb: "-0.5rem" }}>
                    Golf med passion
                  </Typography>
                  <p>- brugt udstyr, nye oplevelser</p>
                  <Button
                    sx={{
                      backgroundColor: "white",
                      color: "black",
                      padding: "0.1rem 1.2rem",
                      mt: "1rem",
                    }}
                    href="/auth/signup"
                  >
                    Start nu
                  </Button>
                </Box>
                
                {/* Right side overlapping cards */}
                <Box sx={{ flex: 1, position: "relative" }}>
                  {/* Big card */}
                  <Box sx={{ position: "relative", width: "60%", margin: "0 auto" }}>
                    <img
                      src="/golfsætold.jpg"
                      alt="golf"
                      style={{
                        width: "70%",
                        borderRadius: "1rem",
                        display: "block",
                        // filter: "brightness(0.6)",
                        filter: "drop-shadow(2px 4px 6px black)"
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "35%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      <Typography sx={{ fontWeight: "bold", fontSize: "1.5rem", mb: 1 }}>
                        Alle på banen
                      </Typography>
                      <p style={{ fontSize: "12px" }}>- Golfudstyr til ALLE spillere</p>
                      <Button
                        variant="contained"
                        sx={{
                          borderRadius: "2rem",
                          backgroundColor: "transparent",
                          border: "1px solid grey",
                          padding: "0.1rem",
                          width: "70%",
                          fontSize: "0.7rem",
                          "&:hover": {
                            backgroundColor: "white",
                            color: "black",
                          },
                        }}
                        onClick={() => goToShop("all")}
                      >
                        See more
                      </Button>
                    </Box>
                  </Box>
                    
                  {/* Small card (overlapping bottom-right) */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: "-7rem",
                      right: "8rem",
                      width: "40%",
                    }}
                  >
                    <img
                      src="/golfforfemale.jpg"
                      alt="golf"
                      style={{
                        width: "80%",
                        borderRadius: "1rem",
                        display: "block",
                        // filter: "brightness(0.6)",
                        filter: "drop-shadow(2px 4px 6px black)"
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "40%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem", mb: 1 }}>
                        For hende
                      </Typography>
                      <p style={{ fontSize: "12px" }}>- Stilfuldt & effektivt til kvindelige golfere</p>
                      <Button
                        variant="contained"
                        sx={{
                          borderRadius: "2rem",
                          backgroundColor: "transparent",
                          border: "1px solid grey",
                          padding: "0.1rem",
                          width: "70%",
                          fontSize: "0.7rem",
                          "&:hover": {
                            backgroundColor: "white",
                            color: "black",
                          },
                        }}
                        onClick={() => goToShop("female")}
                      >
                        See more
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
        </>
    )
};