import { supabase } from "@/lib/supabaseClient"
import { Box, Button, Divider } from "@mui/material"

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params 

  // hent produkt + ejerens profil i ét query
  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      profiles (
        display_name
      )
    `)
    .eq("id", id)
    .single()

  if (error || !product) {
    return <p>Produkt ikke fundet.</p>
  }

  const profileDisplayName = product.profiles?.display_name ?? "Ukendt bruger"
  
  return (
    <Box sx={{ paddingBottom: "6rem" }}>
      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.title}
          style={{ width: "100%" }}
        />
      )}

      <Box sx={{ padding: "1rem" }}>
        <Box
          sx={{
            color: "black",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p>{profileDisplayName}</p>
          <Button
            style={{ cursor: "pointer", color: "black" }}
            href={`/chat/${product.user_id}`}
          >
            Start chat
          </Button>
        </Box>

        <Divider sx={{ backgroundColor: "black", width: "100%", mb: 3 }} />

        <Box
          sx={{
            color: "black",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ fontSize: "1rem" }}>{product.title}</h1>
          <p>
            <strong>{product.price?.toFixed(2)} DKK</strong>
          </p>
        </Box>

        <Box
          sx={{
            color: "black",
            marginTop: "1rem",
            display: "grid",
            gap: "0.5rem",
          }}
        >
          <p>
            Produkt beskrivelse: <br />
            {product.desc} {/* rettet fra product.description */}
          </p>
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
            "&:hover": { backgroundColor: "black", color: "white" },
          }}
        >
          Køb
        </Button>
      </Box>
    </Box>
  )
}
