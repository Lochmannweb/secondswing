"use client"
import { useEffect, useState } from "react"
import { Box, TextField, Typography } from "@mui/material"
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import ImageIcon from "@mui/icons-material/Image"
import SendIcon from "@mui/icons-material/Send"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

type Message = {
  id: string
  chat_id: string
  sender_id: string
  content: string
  created_at: string
}

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>()
  const router = useRouter()

  const [userId, setUserId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")

  // 1. Load current user
  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    loadUser()
  }, [])

  // 2. Load messages for this chat
  useEffect(() => {
    if (!chatId) return
    loadMessages(chatId as string)
  }, [chatId])

    async function loadMessages(chatId: string) {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true })

      if (error) {
        console.error("Load messages error:", error)
        return
      }

      console.log("Messages for chatId", chatId, data) // 👈 debug

      if (data) setMessages(data as Message[])
    }



  // 3. Realtime subscription
  useEffect(() => {
    if (!chatId) return

    const channel = supabase
      .channel("chat-" + chatId)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => setMessages((msgs) => [...msgs, payload.new as Message])
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [chatId])

  // 4. Send a message
  async function sendMessage() {
    if (!newMessage.trim() || !chatId || !userId) return

    const { data, error } = await supabase
      .from("messages")
      .insert([{ chat_id: chatId, sender_id: userId, content: newMessage }])
      .select()

    if (error) {
      console.error("Insert error:", error)
    } else {
      setMessages((prev) => [...prev, ...(data as Message[])])
      setNewMessage("")
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "black",
          height: "5vh",
          alignItems: "center",
          padding: "2rem 2rem 4rem 2rem",
        }}
      >
        <ArrowBackIosIcon
          sx={{ cursor: "pointer", color: "white" }}
          onClick={() => router.push("/chat")}
        />
        <Typography color="white">Chat</Typography>
        <MoreVertIcon sx={{ color: "white" }} />
      </Box>

      {/* Chat container */}
      <Box
        sx={{
          borderTopLeftRadius: "1rem",
          borderTopRightRadius: "1rem",
          marginTop: "-2rem",
          backgroundColor: "white",
          zIndex: 10,
          height: "90vh",
          overflowY: "auto",
          padding: "1rem",
        }}
      >
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: "flex",
              justifyContent:
                msg.sender_id === userId ? "flex-end" : "flex-start",
              marginBottom: "0.5rem",
            }}
          >
            <Typography
              sx={{
                border:
                  msg.sender_id === userId ? "1px solid gray" : "1px solid gray",
                borderRadius: "1rem",
                padding: "0.5rem 1rem",
                maxWidth: "60%",
                color: "black"
              }}
            >
              {msg.content}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Input */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          position: "absolute",
          bottom: "5rem",
          width: "100%",
          borderTop: "1px solid gray",
          paddingTop: "1rem",
        }}
      >
        <AddCircleOutlineIcon sx={{ color: "black" }} />
        <TextField
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          sx={{
            "& .MuiInputBase-root": {
              backgroundColor: "lightgray",
              borderRadius: "3rem",
              padding: "0 1rem",
            },
            width: "60%",
          }}
          placeholder="Type a message..."
        />
        <ImageIcon sx={{ color: "black" }} />
        <SendIcon
          sx={{ color: "black", cursor: "pointer" }}
          onClick={sendMessage}
        />
      </Box>
    </Box>
  )
}
