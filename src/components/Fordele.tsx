import { Box, Divider, Typography } from '@mui/material'
import React from 'react'

function Fordele() {
    return (
        <>
            <Box 
                sx={{ 
                    display: { xs: "grid", sm: "none" }, 
                    gap: "2rem", 
                    textAlign: "center",
                    padding: "5rem 1rem 1rem 1rem ",
                    fontFamily: "JacquesFrancois",
                    marginTop: { xs: "-8rem" },
                    marginBottom: { xs: "5rem" },
                }}>
                <Box 
                    sx={{ 
                        alignSelf: "center", 
                        fontSize: "0.4rem" 
                    }}>
                    <Typography 
                        fontSize={18} 
                        fontWeight={900}
                        fontFamily={"JacquesFrancois"}>
                            Topkvalitet til skarpe priser
                    </Typography>

                    <p style={{ fontSize: "0.8rem" }}>– spil som en pro uden at tømme pengepungen</p>
                </Box>

                <Divider sx={{ justifySelf: "center", width: "60%", backgroundColor: "gray" }} />

                <Box 
                    sx={{ 
                        alignSelf: "center", 
                        fontSize: "0.4rem" 
                    }}>
                    <Typography 
                        fontSize={18} 
                        fontWeight={900}
                        fontFamily={"JacquesFrancois"}>
                            Nøje udvalgt brugt udstyr
                    </Typography>
                    <p style={{ fontSize: "0.8rem" }}>– klar til nye eventyr på banen</p>
                </Box>

                <Divider sx={{ justifySelf: "center", width: "60%", backgroundColor: "gray" }} />
                
                <Box 
                    sx={{ 
                        alignSelf: "center", 
                        fontSize: "0.4rem" 
                    }}>
                    <Typography 
                        fontSize={18} 
                        fontWeight={900} 
                        fontFamily={"JacquesFrancois"}>
                            Bæredygtigt golfvalg
                        </Typography>
                    <p style={{ fontSize: "0.8rem" }}>– spar penge og skån miljøet samtidig</p>
                </Box>
            </Box>
        </>
    )
}

export default Fordele