"use client"

import { useEffect, useState } from "react"
import { Box, Typography, List, ListItem, ListItemButton } from "@mui/material"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
}

interface ChatPartner {
  user_id: string
  last_message: string
  last_time: string
}

export default function ChatHistory() {
  const [userId, setUserId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<ChatPartner[]>([])

  // hent userId fra session
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession()
      setUserId(data.session?.user.id ?? null)
    }
    getUser()
  }, [])

  // hent alle samtaler hvor brugeren er involveret
  useEffect(() => {
    if (!userId) return

    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("fetchConversations error", error)
        return
      }

      if (!data) return

      // find unikke samtaler (seneste besked per partner)
      const map = new Map<string, ChatPartner>()

      data.forEach((msg) => {
        const partnerId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id
        if (!map.has(partnerId)) {
          map.set(partnerId, {
            user_id: partnerId,
            last_message: msg.content,
            last_time: msg.created_at,
          })
        }
      })

      setConversations(Array.from(map.values()))
    }

    fetchConversations()
  }, [userId])

  return (
    <Box sx={{ maxWidth: "600px", margin: "auto", mt: 4, color: "black" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Dine samtaler
      </Typography>

      {conversations.length === 0 ? (
        <Typography variant="body1">Ingen samtaler endnu.</Typography>
      ) : (
        <List>
          {conversations.map((conv) => (
            <ListItem key={conv.user_id} disablePadding>
              <ListItemButton component={Link} href={`/chat/${conv.user_id}`}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="subtitle1">Bruger: {conv.user_id}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {conv.last_message}
                  </Typography>
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}
