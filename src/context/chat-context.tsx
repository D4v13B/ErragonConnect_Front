import { createContext, useContext, useEffect, useState } from "react"
import { useSocket } from "./socket-context"
import { useAuth } from "./auth-context"
import { useToast } from "@/hooks/use-toast"

// Define types
export interface Message {
  id?: number
  body: string
  numeroCliente: string
  usuaId: number
  fromMe: boolean
  createdAt: string
  updatedAt: string
}

export interface MessageSend {
  to: string
  message: string
  usuaId: number | string | undefined
}

export interface UserChat {
  id: number
  nombre: string
  numero: string
  botActivo: boolean
  tag: number
  createdAt: string
  updatedAt: string
  mensajes: Message[]
  avatar?: string
}

interface ChatContextType {
  users: UserChat[]
  setUsers: (users: UserChat[]) => void
  activeUserId: string | null | number
  activeMessages: Message[]
  isTyping: boolean
  setActiveUserId: (id: number | null) => void
  setActiveUserNumber: (id: string | null) => void
  sendMessage: (content: string) => void
  startTyping: () => void
  stopTyping: () => void
}

// Create context
const ChatContext = createContext<ChatContextType | undefined>(undefined)

// Chat provider
export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UserChat[]>([])
  const [activeUserId, setActiveUserId] = useState<number | null>(null)
  const [activeUserNumber, setActiveUserNumber] = useState<string | null>(null)
  const [activeMessages, setActiveMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const { socket } = useSocket()
  const { user } = useAuth()
  const { toast } = useToast()

  // Load initial users (you'll replace this with your real API call)
  // useEffect(() => {
  //   async function fetchChats() {
  //     try {
  //       // Aquí deberías hacer un fetch real
  //       const data: UserChat[] = await fakeFetchUsers()
  //       setUsers(data)
  //     } catch (error) {
  //       console.error("Error fetching chats:", error)
  //     }
  //   }

  //   if (user) {
  //     fetchChats()
  //   }
  // }, [user])

  useEffect(() => {
    // Define the function that fetches the chats using socket
    function fetchChats() {
      if (!socket || !user) return

      // Emite la solicitud para obtener los clientes
      socket.emit("get-clients")

      // Define the event listener to handle the "clients-list" response from the server
      const handleClientsList = (clientes: UserChat[]) => {
        // console.log(clientes)
        setUsers(clientes) // Actualiza el estado de usuarios con la respuesta del servidor
      }

      // Escucha la respuesta del servidor
      socket.on("get-clients", handleClientsList)

      // Limpia el evento al desmontarse o cambiar el usuario
      return () => {
        socket.off("get-clients", handleClientsList)
      }
    }

    if (user) {
      fetchChats() // Llama a la función cuando el usuario esté disponible
    }
  }, [user, socket]) // Dependencias: el usuario y el socket

  // Load messages when active user changes
  useEffect(() => {
    if (activeUserId !== null) {
      const userChat = users.find((u) => u.id === activeUserId)
      if (userChat) {
        setActiveMessages(userChat.mensajes)
      }
    } else {
      setActiveMessages([])
    }
  }, [activeUserId, users])

  // Socket.io handlers
  useEffect(() => {
    if (!socket || !user) return

    const handleNewMessage = (newMessage: Message) => {
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.numero === newMessage.numeroCliente
            ? { ...u, mensajes: [...u.mensajes, newMessage] }
            : u
        )
      )

      // If the message is not from us and not from active user
      if (
        !newMessage.fromMe &&
        (activeUserId === null ||
          users.find((u) => u.id === activeUserId)?.numero !==
            newMessage.numeroCliente)
      ) {
        toast({
          title: "Nuevo mensaje",
          description: newMessage.body,
        })
      }

      // If active conversation matches, update activeMessages
      const activeUser = users.find((u) => u.id === activeUserId)
      if (activeUser && activeUser.numero === newMessage.numeroCliente) {
        setActiveMessages((prev) => [...prev, newMessage])
      }
    }

    const handleTypingStart = (numeroCliente: string) => {
      const activeUser = users.find((u) => u.id === activeUserId)
      if (activeUser && activeUser.numero === numeroCliente) {
        setIsTyping(true)
      }
    }

    const handleTypingStop = (numeroCliente: string) => {
      const activeUser = users.find((u) => u.id === activeUserId)
      if (activeUser && activeUser.numero === numeroCliente) {
        setIsTyping(false)
      }
    }

    socket.on("new_message", handleNewMessage)
    socket.on("typing_start", handleTypingStart)
    socket.on("typing_stop", handleTypingStop)

    return () => {
      socket.off("new_message", handleNewMessage)
      socket.off("typing_start", handleTypingStart)
      socket.off("typing_stop", handleTypingStop)
    }
  }, [socket, user, activeUserId, users, toast])

  // Send a message
  const sendMessage = (content: string) => {
    if (!user || activeUserId === null || !content.trim()) return

    const activeUser = users.find((u) => u.id === activeUserId)
    if (!activeUser) return

    const newMessage: Message = {
      id: Date.now(),
      body: content,
      numeroCliente: activeUser.numero,
      usuaId: user.id as number,
      fromMe: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const sendMessage: MessageSend = {
      to: activeUserNumber as string,
      message: content,
      usuaId: user.id
    }

    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.id === activeUserId
          ? { ...u, mensajes: [...u.mensajes, newMessage] }
          : u
      )
    )

    setActiveMessages((prev) => [...prev, newMessage])

    socket?.emit("send-message", sendMessage)
  }

  const startTyping = () => {
    if (!user || activeUserId === null) return
    const activeUser = users.find((u) => u.id === activeUserId)
    if (activeUser) {
      socket?.emit("typing_start", { numeroCliente: activeUser.numero })
    }
  }

  const stopTyping = () => {
    if (!user || activeUserId === null) return
    const activeUser = users.find((u) => u.id === activeUserId)
    if (activeUser) {
      socket?.emit("typing_stop", { numeroCliente: activeUser.numero })
    }
  }

  return (
    <ChatContext.Provider
      value={{
        users,
        setUsers,
        activeUserId,
        activeMessages,
        setActiveUserNumber,
        isTyping,
        setActiveUserId,
        sendMessage,
        startTyping,
        stopTyping,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

// Custom hook
export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}

// Simulated fetch (bórralo después)
// async function fakeFetchUsers(): Promise<UserChat[]> {
//   return []
// }
