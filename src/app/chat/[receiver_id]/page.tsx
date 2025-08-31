import { supabase } from "@/lib/supabaseClient"

interface ChatPageProps {
  params: { receiver_id: string }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { receiver_id } = params

  // Hent den logged-in bruger
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <p>Du skal være logget ind for at chatte.</p>
  }

  // Her kan du hente beskeder mellem de to brugere
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .or(`sender_id.eq.${receiver_id},receiver_id.eq.${receiver_id}`)
    .order("created_at", { ascending: true })

  return (
    <div>
      <h1>Chat med {receiver_id}</h1>
      <div>
        {messages?.map((msg) => (
          <p key={msg.id}>
            <strong>{msg.sender === user.id ? "Dig" : "Dem"}:</strong> {msg.text}
          </p>
        ))}
      </div>
    </div>
  )
}
