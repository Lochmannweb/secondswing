"use client"

import { getSupabase } from "@/lib/supabaseClient"
import { Box, Typography, Card, CardContent, CardMedia, Alert, CircularProgress, Grid, Divider } from "@mui/material"
import { useState, useEffect } from "react"


interface Product {
  id: string
  title: string
  description: string | null
  price: number | null
  image_url: string | null
  created_at: string
}

export default function ProdukterPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        const supabase = getSupabase()

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          setError("Du skal være logget ind for at se dine produkter")
          return
        }

        setUser(user)

        const { data: userProducts, error: productsError } = await supabase
          .from("products")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (productsError) {
          throw new Error(`Kunne ikke hente produkter: ${productsError.message}`)
        }

        setProducts(userProducts || [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "Der opstod en fejl ved hentning af produkter")
      } finally {
        setLoading(false)
      }
    }

    fetchUserProducts()
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ padding: "1rem", mb: "6rem" }}>
      <Typography sx={{ color: "white", fontSize: "1.2rem" }}>Mine produkter</Typography>
      <Divider sx={{ mb: "3rem", backgroundColor: "white", width: "30%" }} />
      {products.length === 0 ? (
        <Alert severity="info">Du har ikke oprettet nogen produkter endnu.</Alert>
      ) : (
        <>
          <Grid container spacing={1} sx={{ justifySelf: "center" }}>
            {products.map((product) => (
              <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
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
        </>
      )}
    </Box>
  )
}
