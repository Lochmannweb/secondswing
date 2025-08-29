import { Box, Divider, Typography } from '@mui/material'
import React from 'react'

function indstillinger() {
  return (
    <Box sx={{ padding: "1rem", color: "black" }}>
        <Typography><strong>Indstillinger</strong></Typography>
        {/* <Divider sx={{ backgroundColor: "black", width: "50%" }} /> */}

        <Box sx={{ marginTop: "1rem", display: "grid", gap: "1rem" }}>
            <Divider sx={{ backgroundColor: "black", width: "100%" }} />
            <Typography>Profiloplysninger</Typography>
            <Divider sx={{ backgroundColor: "black", width: "100%" }} />
            <Typography>Kontooplysninger</Typography>
            <Divider sx={{ backgroundColor: "black", width: "100%" }} />
            <Typography>Betalinger</Typography>
            <Divider sx={{ backgroundColor: "black", width: "100%" }} />
            <Typography>Sikkerhed</Typography>
            <Divider sx={{ backgroundColor: "black", width: "100%" }} />
        </Box>

        <Box sx={{ marginTop: "5rem" }}>
            <Divider sx={{ backgroundColor: "black", width: "100%" }} />
            <Typography sx={{ padding: "1rem 0" }}>Log ud</Typography>
            <Divider sx={{ backgroundColor: "black", width: "100%" }} />
        </Box>
    </Box>
  )
}

export default indstillinger