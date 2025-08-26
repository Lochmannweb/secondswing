"use client"

import { Stack, Button } from "@mui/material"

interface FilterButtonsProps {
  activeFilter: "all" | "male" | "female" | "unisex"
  onFilterChange: (filter: "all" | "male" | "female" | "unisex") => void
}

export default function FilterButtons({ activeFilter, onFilterChange }: FilterButtonsProps) {
  const buttonStyles = (filter: string) => ({
    backgroundColor: activeFilter === filter ? 
      filter === "male" ? "#616161" : 
      filter === "female" ? "#616161" : 
      filter === "unisex" ? "#616161" : 
      "#616161" 
      : "transparent",
    color: activeFilter === filter ? "white" : "#333",
    "&:hover": {
      backgroundColor: 
                      filter === "male" ? "#333" : 
                      filter === "female" ? "#333" : 
                      filter === "unisex" ? "#333" : "#333",
      color: "white",
    },
  })

  return (
    <Stack 
      direction="row" 
      spacing={2} 
      justifyContent="start" 
      sx={{ mb: 3, borderRadius: "3rem" }}>
      <Button style={{ borderRadius: "3rem" }} sx={buttonStyles("all")} onClick={() => onFilterChange("all")}>All</Button>
      <Button style={{ borderRadius: "3rem" }} sx={buttonStyles("female")} onClick={() => onFilterChange("female")}>Female</Button>
      <Button style={{ borderRadius: "3rem" }} sx={buttonStyles("male")} onClick={() => onFilterChange("male")}>Male</Button>
      {/* <Button sx={buttonStyles("unisex")} onClick={() => onFilterChange("unisex")}>Unisex</Button> */}
    </Stack>
  )
}
