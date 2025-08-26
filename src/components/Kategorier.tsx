"use client"

import { Box, Typography, Button, Stack } from "@mui/material"
import { useRouter } from "next/navigation"
import React from "react"

function Kategorier() {
    const router = useRouter()

    const goToShop = (filter: "all" | "female" | "male") => {
        router.push(`/shop?filter=${filter}`)
    }

    return (
        <Box sx={{ textAlign: "center", padding: "5rem 3rem 3rem 3rem", paddingBottom: "8rem" }}>
            <Box sx={{ marginBottom: "2rem" }}>
                <Typography variant="h5" style={{ marginBottom: "0px" }} gutterBottom>Golfudstyr til enhver spiller</Typography>
                <p style={{ fontSize: "0.8rem" }}>Find din stil og dit spil</p>
            </Box>

            <Stack sx={{ display: "grid", gap: "3rem", }}>
                <Box sx={{ position: "relative",  }}>
                    <img
                        src="/golfsætold.jpg"
                        alt="golf"
                        style={{
                            width: "80%",
                            borderRadius: "2rem",
                            display: "block",
                            filter: "brightness(0.5)",
                            margin: "auto"
                        }}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            textAlign: "center",
                            color: "white",
                            display: "grid",
                            gap: "1rem"
                        }}
                    >
                        <Typography sx={{ fontWeight: "bold", fontSize: "1.5rem", marginBottom: "-1rem" }}>Alle på banen</Typography>
                        <p style={{ fontSize: "12px" }}>- Golfudstyr til ALLE spillere</p>
                        <Button
                            variant="contained"
                            sx={{ 
                                borderRadius: "2rem", 
                                backgroundColor: "grey",
                                padding: "0.1rem", 
                                width: "70%", 
                                margin: "auto",
                                fontSize: "0.7rem", 
                                "&:hover": {
                                    backgroundColor: "white",
                                    color: "black"
                                }
                            }}
                            onClick={() => goToShop("all")}
                        >
                            See more
                        </Button>
                    </Box>
                </Box>


                <Box sx={{ position: "relative",  }}>
                    <img
                        src="/golfforfemale.jpg"
                        alt="golf"
                        style={{
                            width: "80%",
                            borderRadius: "2rem",
                            display: "block",
                            filter: "brightness(0.5)",
                            margin: "auto"
                        }}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            textAlign: "center",
                            color: "white",
                            display: "grid",
                            gap: "1rem"
                        }}
                    >
                        <Typography sx={{ fontWeight: "bold", fontSize: "1.5rem", marginBottom: "-1rem" }}>For hende</Typography>
                        <p style={{ fontSize: "12px" }}>- Stilfuldt & effektivt til kvindelige golfere</p>
                        <Button
                            variant="contained"
                            sx={{ 
                                borderRadius: "2rem", 
                                backgroundColor: "grey",
                                padding: "0.1rem", 
                                width: "70%", 
                                margin: "auto",
                                fontSize: "0.7rem", 
                                "&:hover": {
                                    backgroundColor: "white",
                                    color: "black"
                                }
                            }}
                            onClick={() => goToShop("female")}
                        >
                            See more
                        </Button>
                    </Box>
                </Box>


                <Box sx={{ position: "relative",  }}>
                    <img
                        src="/golfformale2.jpg"
                        alt="golf"
                        style={{
                            width: "80%",
                            borderRadius: "2rem",
                            display: "block",
                            filter: "brightness(0.5)",
                            margin: "auto"
                        }}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            textAlign: "center",
                            color: "white",
                            display: "grid",
                            gap: "1rem"
                        }}
                    >
                        <Typography variant="h4" sx={{ fontWeight: "bold" }}>For ham</Typography>
                        <Typography variant="subtitle1">- Performance gear til den dedikerede mand</Typography>
                        <Button
                            variant="contained"
                            sx={{ 
                                borderRadius: "2rem", 
                                backgroundColor: "grey",
                                padding: "0.1rem", 
                                width: "70%", 
                                margin: "auto",
                                fontSize: "0.7rem", 
                                "&:hover": {
                                    backgroundColor: "white",
                                    color: "black"
                                }
                            }}
                            onClick={() => goToShop("male")}
                        >
                            See more
                        </Button>
                    </Box>
                </Box>
            </Stack>
        </Box>
    )
}

export default Kategorier
