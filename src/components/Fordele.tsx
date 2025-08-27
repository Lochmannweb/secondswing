import { Box, Divider } from '@mui/material'
import React from 'react'

function Fordele() {
    return (
        <>
            <Box 
                sx={{ 
                    display: "grid", 
                    gap: "2rem", 
                    textAlign: "center",
                    padding: "5rem 1rem 1rem 1rem ",
                    color: "black"
                }}>
                <Box sx={{ alignSelf: "center", fontSize: "0.4rem" }}>
                    <h1>Topkvalitet til skarpe priser</h1>
                    <p style={{ fontSize: "0.6rem" }}>– spil som en pro uden at tømme pengepungen</p>
                </Box>
                <Divider sx={{ justifySelf: "center", width: "60%", backgroundColor: "gray" }} />
                <Box sx={{ alignSelf: "center", fontSize: "0.4rem" }}>
                    <h1>Nøje udvalgt brugt udstyr</h1>
                    <p style={{ fontSize: "0.6rem" }}>– klar til nye eventyr på banen</p>
                </Box>
                <Divider sx={{ justifySelf: "center", width: "60%", backgroundColor: "gray" }} />
                <Box sx={{ alignSelf: "center", fontSize: "0.4rem" }}>
                    <h1>Bæredygtigt golfvalg</h1>
                    <p style={{ fontSize: "0.6rem" }}>– spar penge og skån miljøet samtidig</p>
                </Box>
            </Box>
        </>
    )
}

export default Fordele