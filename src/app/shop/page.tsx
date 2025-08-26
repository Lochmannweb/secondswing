"use client"

import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabaseClient"
import SearchBar from "@/components/SearchBar"
import AllProducts from "@/components/AllProducts"
import { Alert, Box, CircularProgress } from "@mui/material"
import FilterButtons from "@/components/FilterButtons"
import { useSearchParams } from "next/navigation"

interface Product {
  id: string
  title: string
  description: string | null
  price: number | null
  image_url: string | null
  created_at: string
  gender: "male" | "female" | "unisex" | null
}

export default function ShopPageClientWrapper() {
  // Wrapper sikrer, at ShopPage kun renderes på klienten
  return <ShopPage />
}

function ShopPage() {
  const searchParams = useSearchParams()
  const [hasMounted, setHasMounted] = useState(false) // sikre client mount

  const initialFilter = (searchParams?.get("filter") as "all" | "female" | "male" | "unisex") || "all"

  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<"all" | "male" | "female" | "unisex">(initialFilter)

  // sikre, at useSearchParams kun bruges efter mount
  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const supabase = getSupabase()
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) throw error
        setProducts(data || [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    if (!hasMounted) return // vent til client mount
    let results = [...products]
    if (activeFilter !== "all") results = results.filter((p) => p.gender === activeFilter)
    setFilteredProducts(results)
  }, [products, activeFilter, hasMounted])

  const handleSearch = (query: string) => {
    let results = [...products]
    if (activeFilter !== "all") results = results.filter((p) => p.gender === activeFilter)
    if (query) results = results.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
    setFilteredProducts(results)
  }

  const handleFilter = (filter: "all" | "male" | "female" | "unisex") => {
    setActiveFilter(filter)
  }

  if (!hasMounted) return null // vent til client mount
  if (loading) return <CircularProgress />
  if (error) return <Alert severity="error">{error}</Alert>

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 2, mb: "6rem" }}>
      <SearchBar onSearch={handleSearch} />
      <FilterButtons activeFilter={activeFilter} onFilterChange={handleFilter} />
      <AllProducts products={filteredProducts} />
    </Box>
  )
}
