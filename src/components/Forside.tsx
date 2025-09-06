

import React from 'react'
import { Box, Button, Typography } from '@mui/material'

export default function ForsideHero() {
    return (
        <>
            <Box
                sx={{
                    textAlign: { xs: "center",  sm: "left" },
                    padding: { sm: "0 5rem" },
                    alignContent: "center",
                    height: "100vh"
                }}
            >
                <Typography sx={{ fontSize: "3rem", mb: "-0.5rem" }}>
                    Golf med passion
                </Typography>
                <p>- brugt udstyr, nye oplevelser</p>
                <Button
                    sx={{
                        backgroundColor: "white",
                        color: "black",
                        // borderRadius: "3rem",
                        padding: "0.1rem 1.2rem",
                        top: "1rem",
                        marginTop: { sm: "1rem" }
                    }}
                    href="/auth/signup">Start nu</Button>
            </Box>
        </>
    )
};