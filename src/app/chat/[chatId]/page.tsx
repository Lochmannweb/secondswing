"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import { Box, TextField, Typography } from "@mui/material"
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import ImageIcon from "@mui/icons-material/Image"
import SendIcon from "@mui/icons-material/Send"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import type { RealtimeChannel } from "@supabase/supabase-js"

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
  const [otherUserId, setOtherUserId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [presenceState, setPresenceState] = useState<Record<string, Array<{ online: boolean; typing?: boolean }>>>({})

  // channel refs (avoid stale closures)
  const presenceChannelRef = useRef<RealtimeChannel | null>(null)
  const dbChannelRef = useRef<RealtimeChannel | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  // 0) Me
  useEffect(() => {
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    })()
  }, [])

  // 1) Load chat participants so we know the "other" user
  useEffect(() => {
    if (!chatId || !userId) return
    ;(async () => {
      const { data, error } = await supabase
        .from("chats")
        .select("buyer_id, seller_id")
        .eq("id", chatId)
        .single()

      if (error) {
        console.error("Failed to load chat participants:", error)
        return
      }
      const other =
        data?.buyer_id === userId ? data?.seller_id :
        data?.seller_id === userId ? data?.buyer_id : null
      setOtherUserId(other)
    })()
  }, [chatId, userId])

  // 2) Load existing messages
  useEffect(() => {
    if (!chatId) return
    ;(async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true })

      if (error) {
        console.error("Load messages error:", error)
        return
      }
      setMessages((data || []) as Message[])
    })()
  }, [chatId])

  // 3) Realtime: DB changes (new messages from the other user)
  useEffect(() => {
    if (!chatId) return
    const dbChannel = supabase.channel(`db:chat-${chatId}`)

    dbChannel.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages", filter: `chat_id=eq.${chatId}` },
      (payload) => {
        const msg = payload.new as Message
        // Avoid duplicate append for our own message (we add ours after .insert().select())
        if (msg.sender_id === userId) return
        setMessages((prev) => [...prev, msg])
        scrollToBottomSoon()
      }
    )

    dbChannel.subscribe()
    dbChannelRef.current = dbChannel
    return () => {
      supabase.removeChannel(dbChannel)
      dbChannelRef.current = null
    }
  }, [chatId, userId])

  // 4) Presence: online + typing
  useEffect(() => {
    if (!chatId || !userId) return

    const presenceChannel = supabase.channel(`presence:chat-${chatId}`, {
      config: { presence: { key: userId } },
    })

    presenceChannel
      .on("presence", { event: "sync" }, () => {
        const state = presenceChannel.presenceState()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setPresenceState(state as any)
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await presenceChannel.track({ online: true, typing: false })
        }
      })

    presenceChannelRef.current = presenceChannel

    // when leaving page/tab
    const handleBeforeUnload = () => {
      presenceChannelRef.current?.track({ online: false, typing: false })
    }
    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      supabase.removeChannel(presenceChannel)
      presenceChannelRef.current = null
    }
  }, [chatId, userId])

  // 5) Send a message (append from insert .select(); realtime will cover the peer)
  async function sendMessage() {
    if (!newMessage.trim() || !chatId || !userId) return

    const text = newMessage
    setNewMessage("")
    // stop typing
    presenceChannelRef.current?.track({ online: true, typing: false })

    const { data, error } = await supabase
      .from("messages")
      .insert([{ chat_id: chatId, sender_id: userId, content: text }])
      .select()

    if (error) {
      console.error("Insert error:", error)
      return
    }
    if (data && data.length) {
      setMessages((prev) => [...prev, ...(data as Message[])])
      scrollToBottomSoon()
    }
  }

  // 6) Typing indicator handler (debounced "typing: false")
  const typingTimeoutRef = useRef<number | null>(null)
  function handleTypingChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setNewMessage(value)

    if (!presenceChannelRef.current) return
    presenceChannelRef.current.track({ online: true, typing: value.length > 0 })

    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = window.setTimeout(() => {
      presenceChannelRef.current?.track({ online: true, typing: false })
    }, 1500)
  }

  // 7) Derived presence for the other user
  const otherUserPresence = useMemo(() => {
    if (!otherUserId) return []
    return presenceState[otherUserId] || []
  }, [presenceState, otherUserId])

  const otherOnline = otherUserPresence.length > 0
  const otherTyping = otherUserPresence.some((p) => p.typing)

  function scrollToBottomSoon() {
    // next tick to ensure DOM painted
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 0)
  }

  useEffect(() => {
    scrollToBottomSoon()
  }, [messages.length])

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
          <Typography variant="caption" color={otherOnline ? "lightgreen" : "lightgray"}>
            {otherOnline ? "Online" : "Offline"}
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
              justifyContent: msg.sender_id === userId ? "flex-end" : "flex-start",
              marginBottom: "0.5rem",
            }}
          >
            <Typography
              sx={{
                border: "1px solid gray",
                borderRadius: "1rem",
                padding: "0.5rem 1rem",
                maxWidth: "70%",
                color: "black",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {msg.content}
            </Typography>
          </Box>
        ))}

        {/* Typing indicator */}
        {otherTyping && (
          <Typography variant="body2" color="gray" sx={{ fontStyle: "italic", px: 1, pb: 1 }}>
            The other user is typing…
          </Typography>
        )}
        <div ref={bottomRef} />
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
          onChange={handleTypingChange}
          onBlur={() => presenceChannelRef.current?.track({ online: true, typing: false })}
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
