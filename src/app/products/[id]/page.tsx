import { supabase } from "@/lib/supabaseClient"
import { Box, Button, Divider, MenuItem } from "@mui/material"
// import createClient from "@supabase/supabase-js"

interface ProductPageProps {
  params: { id: string }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params

  // hent produktet
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !product) {
    return <p>Produkt ikke fundet.</p>
  }

  // hent ejerens navn fra profiles table
  let ownerName = "Ukendt ejer"
  if (product.created_by) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", product.created_by)
      .single()
    
    if (profile?.display_name) {
      ownerName = profile.display_name
    }
  }

  return (
    <Box sx={{ paddingBottom: "6rem" }}>
      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.title}
          style={{ width: "100%"
           }}
        />
      )}

      <Box sx={{ padding: "1rem" }}>
        <Box 
          sx={{ 
            color: "black", 
            display: "flex", 
            justifyContent: "space-between",  
            alignItems: "center"
          }}>
          <p>{ownerName}</p>
          <Button style={{
            // border: "1px solid black",
            // borderRadius: "3rem",
            // padding: "0.1rem 1rem",
            cursor: "pointer",
            color: "black"
          }} 
          href={`/chat/${product.id}`}
          >
            Start chat
          </Button>
        </Box>

        <Divider sx={{ backgroundColor: "black", width: "100%", justifySelf: "center", mb: 3 }} />

        <Box 
          sx={{ 
            color: "black", 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
          }}
        >
          <h1 style={{ fontSize: "1rem" }}>{product.title}</h1>
          <p><strong>{product.price?.toFixed(2)} DKK</strong></p>
        </Box>

        <Box sx={{ color: "black", marginTop: "1rem", display: "grid", gap: "0.5rem" }}>
          <p>Produkt beskrivelse: <br />{product.description}</p>
          <p>Farve: {product.color}</p>
          <p>Brand: {product.brand}</p>
          <p>Tilstand: {product.stand}</p>
        </Box>

        <Button 
          sx={{ 
            width: "100%", 
            backgroundColor: "gray", 
            color: "white", 
            top: "1.5rem",
            position: "relative",
            "&:hover": {
              backgroundColor: "black",
              color: "white"
            }
            }}>
              Køb
        </Button>
      </Box>
    </Box>
  )
}
