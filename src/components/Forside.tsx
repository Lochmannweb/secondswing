

import React from 'react'
import { Box, Button, Typography } from '@mui/material'

export default function ForsideHero() {
    return (
        <>
            <Box
                sx={{
                    textAlign: "center",
                    alignContent: "center",
                    height: "100vh"
                }}
            >
                <Typography sx={{ fontSize: "3rem" }}>
                    Golf med passion
                </Typography>
                <p>- brugt udstyr, nye oplevelser</p>
                <Button
                    sx={{
                        backgroundColor: "white",
                        color: "black",
                        borderRadius: "3rem",
                        padding: "0.5rem 2rem",
                        top: "1rem"
                    }}
                    href="/auth/signup">Start nu</Button>
            </Box>
        </>
    )
};