"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Box, TextField, Button, Typography } from "@mui/material"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
}

interface ChatProps {
  params: { receiver_id: string }
}

export default function ChatPage({ params }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [userId, setUserId] = useState<string | null>(null) // current logged in user

  const receiverId = params.receiver_id

  useEffect(() => {
    // Hent current user fra Supabase auth
    const session = supabase.auth.getSession().then(res => {
      setUserId(res.data.session?.user.id ?? null)
    })

    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${userId})`
      )
      .order("created_at", { ascending: true })

    if (!error && data) {
      setMessages(data)
    }
  }

  const sendMessage = async () => {
    if (!input || !userId) return

    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: userId,
        receiver_id: receiverId,
        content: input,
      })
      .select()

    if (!error && data) {
      setMessages(prev => [...prev, data[0]])
      setInput("")
    }
  }

  return (
    <Box sx={{ padding: 2, maxWidth: "600px", margin: "auto" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Chat med bruger {receiverId}
      </Typography>

      <Box sx={{ minHeight: "400px", border: "1px solid grey", padding: 2, mb: 2 }}>
        {messages.map(msg => (
          <Box
            key={msg.id}
            sx={{
              mb: 1,
              textAlign: msg.sender_id === userId ? "right" : "left",
            }}
          >
            <Typography
              sx={{
                display: "inline-block",
                padding: "0.5rem 1rem",
                borderRadius: "1rem",
                backgroundColor: msg.sender_id === userId ? "#1976d2" : "#e0e0e0",
                color: msg.sender_id === userId ? "white" : "black",
              }}
            >
              {msg.content}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Skriv en besked..."
        />
        <Button variant="contained" onClick={sendMessage}>
          Send
        </Button>
      </Box>
    </Box>
  )
}
