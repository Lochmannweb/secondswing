"use client"

import React from "react"
import Link from "next/link"
import { 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Grid, 
  Box, 
  Button,
  Alert 
} from "@mui/material"

interface Product {
  id: string
  title: string
  description: string | null
  price: number | null
  image_url: string | null
  created_at: string
  user_id: string
  gender?: "male" | "female" | "unisex" | null
}

interface AllProductsProps {
  products: Product[]
}

export default function AllProducts({ products }: AllProductsProps) {
  if (!products || products.length === 0) {
    return <Alert severity="info">Der er ingen produkter tilgængelige i øjeblikket.</Alert>
  }

  return (
    <Grid container spacing={2}>
      {products.map((product) => (
        <Grid size={{ xs: 6, sm: 6, md: 4 }} key={product.id}>
          <Card sx={{ backgroundColor: "black", color: "white", height: "100%" }}>
            {product.image_url && (
              <CardMedia component="img" height="200" image={product.image_url} alt={product.title} />
            )}
            {product.price && (
              <Typography
                sx={{
                  backgroundColor: "white",
                  borderRadius: "3rem",
                  fontSize: "0.8rem",
                  width: "40%",
                  textAlign: "center",
                  alignSelf: "end",
                  color: "black",
                  position: "relative",
                  top: "-12rem",
                  right: "0.5rem",
                }}
              >
                {product.price.toFixed(2)} DKK
              </Typography>
            )}
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "-1rem" }}>
                <Typography sx={{ fontSize: "18px" }} component="h2">
                  {product.title}
                </Typography>
                <Button
                  component={Link}
                  href={`/products/${product.id}`}
                  sx={{
                    fontSize: "10px",
                    border: "1px solid grey",
                    borderRadius: "3rem",
                    width: "40%",
                    color: "white",
                    "&:hover": { backgroundColor: "white", color: "black" },
                  }}
                >
                  See More
                </Button>
              </Box>
              {product.description && (
                <Typography variant="body2" sx={{ mb: 2, fontSize: "13px" }}>
                  {product.description}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
