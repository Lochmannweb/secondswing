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
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [typingUsers, setTypingUsers] = useState<string[]>([])

  // channel reference
  const [channel, setChannel] = useState<ReturnType<typeof supabase.channel> | null>(null)

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

    if (data) setMessages(data as Message[])
  }

  // 3. Setup realtime channel with presence
  useEffect(() => {
    if (!chatId || !userId) return

    const c = supabase.channel(`chat-room-${chatId}`, {
      config: { presence: { key: userId } },
    })

    // Presence join
    c.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await c.track({ online: true, typing: false })
      }
    })

    // Presence sync
    c.on("presence", { event: "sync" }, () => {
      const state = c.presenceState()
      const online = Object.keys(state)
      const typing = online.filter((uid) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        state[uid].some((s: any) => s.typing)
      )
      setOnlineUsers(online)
      setTypingUsers(typing)
    })

    // Realtime messages
    c.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `chat_id=eq.${chatId}`,
      },
      (payload) => setMessages((msgs) => [...msgs, payload.new as Message])
    )

    setChannel(c)

    return () => {
      supabase.removeChannel(c)
    }
  }, [chatId, userId])

  // 4. Send a message (optimistic UI)
  async function sendMessage() {
    if (!newMessage.trim() || !chatId || !userId) return

    const optimisticMessage: Message = {
      id: crypto.randomUUID(),
      chat_id: chatId,
      sender_id: userId,
      content: newMessage,
      created_at: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, optimisticMessage])
    setNewMessage("")

    const { error } = await supabase
      .from("messages")
      .insert([{ chat_id: chatId, sender_id: userId, content: optimisticMessage.content }])

    if (error) {
      console.error("Insert error:", error)
    }
  }

  // 5. Handle typing indicator
  function handleTyping(e: React.ChangeEvent<HTMLInputElement>) {
    setNewMessage(e.target.value)
    if (channel) {
      channel.track({ online: true, typing: e.target.value.length > 0 })
    }
  }

  // Find the "other" user (assuming only 2 users per chat)
  const otherUserTyping = typingUsers.find((id) => id !== userId)
  const otherUserOnline = onlineUsers.find((id) => id !== userId)

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
        <Box>
          <Typography color="white">Chat</Typography>
          <Typography variant="caption" color="lightgreen">
            {otherUserOnline ? "Online" : "Offline"}
          </Typography>
        </Box>
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
          height: "80vh",
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
                border: "1px solid gray",
                borderRadius: "1rem",
                padding: "0.5rem 1rem",
                maxWidth: "60%",
                color: "black",
              }}
            >
              {msg.content}
            </Typography>
          </Box>
        ))}

        {/* Typing indicator */}
        {otherUserTyping && (
          <Typography variant="body2" color="gray" sx={{ fontStyle: "italic" }}>
            The other user is typing...
          </Typography>
        )}
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
          backgroundColor: "white",
        }}
      >
        <AddCircleOutlineIcon sx={{ color: "black" }} />
        <TextField
          value={newMessage}
          onChange={handleTyping}
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
