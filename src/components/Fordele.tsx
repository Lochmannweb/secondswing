import { Box, Divider } from '@mui/material'
import React from 'react'

function Fordele() {
    return (
        <>
            <Box 
                sx={{ 
                    display: "grid", 
                    gap: "1rem", 
                    textAlign: "center",
                    padding: "2rem 1rem 1rem 1rem "
                }}>
                <Box sx={{ alignSelf: "center", fontSize: "0.5rem" }}>
                    <h1>Topkvalitet til skarpe priser</h1>
                    <p>– spil som en pro uden at tømme pengepungen</p>
                </Box>
                <Divider sx={{ justifySelf: "center", width: "60%", backgroundColor: "gray" }} />
                <Box sx={{ alignSelf: "center", fontSize: "0.5rem" }}>
                    <h1>Nøje udvalgt brugt udstyr</h1>
                    <p>– klar til nye eventyr på banen</p>
                </Box>
                <Divider sx={{ justifySelf: "center", width: "60%", backgroundColor: "gray" }} />
                <Box sx={{ alignSelf: "center", fontSize: "0.5rem" }}>
                    <h1>Bæredygtigt golfvalg</h1>
                    <p>– spar penge og skån miljøet samtidig</p>
                </Box>
            </Box>
        </>
    )
}

export default Fordele