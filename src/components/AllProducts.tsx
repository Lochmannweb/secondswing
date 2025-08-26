"use client"

import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Alert,
  Grid,
} from "@mui/material"

interface Product {
  id: string
  title: string
  description: string | null
  price: number | null
  image_url: string | null
  created_at: string
}

export default function AllProducts({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <Alert severity="info">Der er ingen produkter tilgængelige i øjeblikket.</Alert>
  }

  return (
    <Grid container spacing={1} sx={{ justifySelf: "center" }}>
      {products.map((product) => (
        <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: "100%", minWidth: "35vh", display: "flex", flexDirection: "column" }}>
            {product.image_url && (
              <CardMedia
                component="img"
                height="200"
                image={product.image_url}
                alt={product.title}
                sx={{ objectFit: "cover" }}
              />
            )}
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="h2" gutterBottom>
                {product.title}
              </Typography>
              {product.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {product.description}
                </Typography>
              )}
              {product.price && (
                <Typography variant="h6" color="primary">
                  {product.price.toFixed(2)} DKK
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                Oprettet: {new Date(product.created_at).toLocaleDateString("da-DK")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
