"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Box, Typography } from "@mui/material"
import { supabase } from "@/lib/supabaseClient"

type Chat = {
  id: string
  buyer_id: string
  seller_id: string
  product_id: string
  product?: { title: string }
  messages?: { content: string; created_at: string }[]
}

export default function ChatHistory() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [chats, setChats] = useState<Chat[]>([])

  // 1. Load current user
  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    loadUser()
  }, [])

  // 2. Load all chats where user is buyer or seller
  useEffect(() => {
    if (!userId) return

    async function loadChats() {
      const { data, error } = await supabase
        .from("chats")
        .select(`
          id,
          buyer_id,
          seller_id,
          product_id,
          products (title),
          messages (
            content,
            created_at
          )
        `)
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
        .order("id", { ascending: false })

      if (error) {
        console.error("Error loading chats:", error)
        return
      }

      // sort messages so we can show last message preview
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const normalized = data.map((chat: any) => ({
        id: chat.id,
        buyer_id: chat.buyer_id,
        seller_id: chat.seller_id,
        product_id: chat.product_id,
        product: chat.products,
        messages: chat.messages?.sort(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ),
      }))

      setChats(normalized)
    }

    loadChats()
  }, [userId])

  return (
    <Box sx={{ p: 2, color: "black" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Your Chats
      </Typography>
      {chats.length === 0 && (
        <Typography>No chats yet.</Typography>
      )}
      {chats.map((chat) => {
        const lastMsg = chat.messages?.[0]?.content ?? "No messages yet"
        return (
          <Box
            key={chat.id}
            sx={{
              p: 2,
              borderRadius: "1rem",
              border: "1px solid #ddd",
              mb: 2,
              cursor: "pointer",
              "&:hover": { backgroundColor: "#f7f7f7" },
            }}
            onClick={() => router.push(`/chat/${chat.id}`)} // reuse ChatPage
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {chat.product?.title ?? "Unknown product"}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
            >
              {lastMsg}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}
