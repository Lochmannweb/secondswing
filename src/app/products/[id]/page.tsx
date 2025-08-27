import { supabase } from "@/lib/supabaseClient"
import { Box, Button } from "@mui/material"
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
    <Box>
      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.title}
          style={{ width: "100%" }}
        />
      )}

      <Box sx={{ padding: 1, color: "black" }}>
        <Box>
          {/* Ejerens navn */}
          <p><strong>Ejer:</strong>{ownerName}</p>

          {/* Start chat med ejeren */}
            <a href={`/chat/${product.owner_id}`}>
              <Button variant="outlined">Send besked til ejer</Button>
            </a>
        </Box>

        <Box>
          <Box>
            <h1>{product.title}</h1>
            <p><strong>{product.price?.toFixed(2)} DKK</strong></p>
          </Box>
          <p>{product.description}</p>
        </Box>

        {/* buy button */}
      </Box>
    </Box>
  )
}
