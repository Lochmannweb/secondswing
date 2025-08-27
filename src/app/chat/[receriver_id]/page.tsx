"use client"

import { useEffect, useRef, useState } from "react"
import { Box, TextField, Button, Typography } from "@mui/material"
import { supabase } from "@/lib/supabaseClient"

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
  const [userId, setUserId] = useState<string | null>(null)
  const receiverId = params.receiver_id
  const endRef = useRef<HTMLDivElement | null>(null)

  // --- hent session / user id
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        setUserId(data.session?.user.id ?? null)
      } catch (err) {
        console.error("getSession error", err)
      }
    }
    getUser()
  }, [])

  // --- hent beskeder når vi kender userId og receiverId
  useEffect(() => {
    if (!userId || !receiverId) return

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .or(
            `and(sender_id.eq.${userId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${userId})`
          )
          .order("created_at", { ascending: true })

        if (error) {
          console.error("fetchMessages error", error)
          return
        }
        setMessages(data ?? [])
      } catch (err) {
        console.error("fetchMessages exception", err)
      }
    }

    fetchMessages()
  }, [userId, receiverId])

  // --- realtime subscription for INSERTs
  useEffect(() => {
    if (!userId || !receiverId) return

    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMsg = payload.new as Message
          // kun til denne chat (sender <-> receiver)
          if (
            (newMsg.sender_id === userId && newMsg.receiver_id === receiverId) ||
            (newMsg.sender_id === receiverId && newMsg.receiver_id === userId)
          ) {
            setMessages((prev) => {
              // undgå dubletter
              if (prev.some((m) => m.id === newMsg.id)) return prev
              return [...prev, newMsg]
            })
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [userId, receiverId])

  // --- scroll til bunden ved beskeder
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // --- sendMessage med optimistic update + error logging + replace
  const sendMessage = async () => {
    const text = input.trim()
    if (!text || !userId) return

    const tempId = "temp-" + Date.now()
    const optimistic: Message = {
      id: tempId,
      sender_id: userId,
      receiver_id: receiverId,
      content: text,
      created_at: new Date().toISOString(),
    }

    // show immediately
    setMessages((prev) => [...prev, optimistic])
    setInput("")

    try {
      const { data } = await supabase
        .from("messages")
        .insert({
          sender_id: userId,
          receiver_id: receiverId,
          content: text,
        })
        .select()

      // success: replace optimistic med DB-row (data[0])
      if (data && data[0]) {
        const real = data[0] as Message
        setMessages((prev) => prev.map((m) => (m.id === tempId ? real : m)))
      } else {
        // fallback: hvis ingen data retur, behold optimistic men log
        console.warn("Insert returned no data, keeping optimistic message")
      }
    } catch (err) {
      console.error("sendMessage exception:", err)
      setMessages((prev) => prev.filter((m) => m.id !== tempId))
    }
  }

  return (
    <Box sx={{ padding: 2, maxWidth: "600px", margin: "auto" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Chat med bruger {receiverId}
      </Typography>

      <Box
        sx={{
          minHeight: "400px",
          border: "1px solid grey",
          padding: 2,
          mb: 2,
          overflowY: "auto",
        }}
      >
        {messages.map((msg) => (
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
        <div ref={endRef} />
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Skriv en besked..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
        />
        <Button variant="contained" onClick={sendMessage}>
          Send
        </Button>
      </Box>
    </Box>
  )
}
