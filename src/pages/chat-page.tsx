import { useEffect, useState, useRef } from "react"
import { useChat } from "../context/chat-context"
import { useAuth } from "../context/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Phone, Video, Send, MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface MessageItemProps {
  content: string
  timestamp: string
  isOwn: boolean
}

function MessageItem({ content, timestamp, isOwn }: MessageItemProps) {
  const time = format(new Date(timestamp), "HH:mm")
  return (
    <div className={cn("flex mb-5", isOwn ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[100%] rounded-lg px-4 py-2",
          isOwn
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
        )}
      >
        <p style={{whiteSpace: "preserve-breaks"}}>{content}</p>
        <p className="mt-1 text-right text-xs">{time}</p>
      </div>
    </div>
  )
}

interface ContactItemProps {
  contact: { name: string; avatar: string; isOnline: boolean }
  onSelect: () => void
}

function ContactItem({ contact, onSelect }: ContactItemProps) {
  return (
    <button
      className="flex w-full items-center rounded-lg p-2 text-left hover:bg-accent"
      onClick={onSelect}
    >
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarImage src={contact.avatar} alt={contact.name} />
          <AvatarFallback>{contact.name[0]}</AvatarFallback>
        </Avatar>
        <span
          className={cn(
            "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2",
            contact.isOnline ? "bg-green-500" : "bg-gray-400"
          )}
        />
      </div>
      <div className="ml-3">
        <p className="font-medium">{contact.name}</p>
        <p className="text-xs text-muted-foreground">
          {contact.isOnline ? "Online" : "Offline"}
        </p>
      </div>
    </button>
  )
}

export default function ChatPage() {
  const [message, setMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const messageEndRef = useRef<HTMLDivElement>(null) // Este ref para el scroll
  const textAreaRef = useRef<HTMLTextAreaElement>(null) // Este ref para el textarea
  const { user } = useAuth()
  const {
    users,
    activeUserId,
    activeMessages,
    setActiveUserId,
    setActiveUserNumber,
    sendMessage,
    startTyping,
    stopTyping,
  } = useChat()

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    if (e.target.value) {
      startTyping()
    } else {
      stopTyping()
    }
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message)
      setMessage("")
    }
  }

  // Desplazarse automáticamente al último mensaje cuando activeMessages cambie
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [activeMessages])  // Se asegura que el efecto solo se ejecute cuando activeMessages cambie

  return (
    <div className="flex flex-row h-full">
      <div className="w-72 p-4 border-r border-muted">
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} alt={user?.nombre} />
              <AvatarFallback>{user?.nombre?.[0]}</AvatarFallback>
            </Avatar>
            <p>{user?.nombre}</p>
          </div>
          <Button variant="outline" size="icon">
            <MoreVertical size={18} />
          </Button>
        </div>

        <Separator />
        <input
          type="text"
          placeholder="Buscar conversación"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-2 py-1 rounded-md border-2 border-muted mb-2"
        />

        <ScrollArea className="max-h-[calc(100vh-150px)] bg-transparent p-2 rounded-lg shadow-md overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-500 scrollbar-track-transparent">
          {users
            .filter((conv) =>
              conv.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((userChat) => (
              <ContactItem
                key={userChat.id}
                contact={{
                  name: userChat.nombre,
                  avatar: "",
                  isOnline: userChat.botActivo,
                }}
                onSelect={() => {
                  setActiveUserId(userChat.id)
                  setActiveUserNumber(userChat.numero)
                }}
              />
            ))}
        </ScrollArea>
      </div>

      <div className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={activeUserId ? activeMessages[0]?.numeroCliente : ""}
                alt=""
              />
              <AvatarFallback>
                {activeUserId ? activeMessages[0]?.numeroCliente[0] : ""}
              </AvatarFallback>
            </Avatar>
            <p>
              {activeUserId
                ? users.find((u) => u.id === activeUserId)?.nombre
                : "Seleccionar contacto"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Phone size={18} />
            </Button>
            <Button variant="outline" size="icon">
              <Video size={18} />
            </Button>
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-300px)]">
          {activeMessages.map((msg) => (
            <MessageItem
              key={msg.id}
              content={msg.body}
              timestamp={msg.createdAt}
              isOwn={msg.fromMe}
            />
          ))}
          {/* Este es el div al que queremos que se haga scroll */}
          <div ref={messageEndRef} />
        </div>

        <Separator className="my-4" />

        <div className="flex gap-2">
          <Textarea
            ref={textAreaRef}  // Usamos un ref diferente para el Textarea
            placeholder="Escribe un mensaje..."
            value={message}
            onChange={handleTyping}
            className="flex-1"
          />
          <Button variant="default" onClick={handleSendMessage}>
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}
