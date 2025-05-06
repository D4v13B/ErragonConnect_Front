import { useState } from "react"
import { Search, CheckSquare, MessageSquare } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChat } from "@/context/chat-context"
import { ContactItem } from "./contact-item"
import { updateClient } from "@/core/api/cliente/updateClient.action"

// interface Props {
//   users: UserChat[]
//   setActiveUserId: ()
//   setActiveUserNumber: string
// }

export default function ChatNavigation() {
  const { users, setActiveUserId, setActiveUserNumber, setUsers } = useChat()

  const [activeTab, setActiveTab] = useState("abierto")
  const [searchTerm, setSearchTerm] = useState("")

  async function onClickDropdown(numero:string, state:number){
    state = state == 1 ? 0 : 1

    const updatedUsers = users.map(u => u.numero == numero ? {...u, tag:  state}: u)
    const userToUpdate = users.find(u => u.numero === numero);
    if (userToUpdate) {
      
      await updateClient({id: userToUpdate.id, numero: userToUpdate.numero, tag: state});
    }

    setUsers(updatedUsers)
  } 

  // Filtrar usuarios según la pestaña activa
  const filteredUsers = users.filter((user) => {
    // Filtrar por términos de búsqueda primero (aplicado a todas las pestañas)
    const matchesSearch = user.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    // const matchesSearch = user.n

    if (!matchesSearch) return false

    // Luego aplicar filtro según la pestaña
    switch (activeTab) {
      case "abierto":
        return user.tag === 0 // Asumo que tag 1 significa abierto
      case "resueltos":
        return user.tag === 1 // Asumo que tag 0 significa resuelto
      case "buscar":
        return true // En la pestaña de búsqueda se muestran todos
      default:
        return true
    }
  })

  return (
    <div className="w-full">
      <Tabs
        defaultValue="abierto"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 w-full bg-transparent">
          <TabsTrigger
            value="abierto"
            className="flex flex-col items-center py-3 space-y-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs font-medium">ABIERTO</span>
          </TabsTrigger>

          <TabsTrigger
            value="resueltos"
            className="flex flex-col items-center py-3 space-y-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none"
          >
            <CheckSquare className="h-5 w-5" />
            <span className="text-xs font-medium">RESUELTOS</span>
          </TabsTrigger>

          <TabsTrigger
            value="buscar"
            className="flex flex-col items-center py-3 space-y-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none"
          >
            <Search className="h-5 w-5" />
            <span className="text-xs font-medium">BUSCAR</span>
          </TabsTrigger>
        </TabsList>

        {/* Contenido común para todas las pestañas */}
        <div className="p-4 my-5">
          <div className="flex items-center rounded-md  px-3 py-2 mb-2">
            <Search className="h-4 w-4 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder={
                activeTab === "abierto"
                  ? "Buscar en abiertos"
                  : activeTab === "resueltos"
                  ? "Buscar en resueltos"
                  : "Buscar conversación"
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-sm flex-1"
            />
          </div>

          <ScrollArea className="max-h-[calc(100vh-150px)] bg-transparent p-2 rounded-lg shadow-md overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-500 scrollbar-track-transparent">
            {filteredUsers.map((userChat) => (
              <ContactItem
                key={userChat.id}
                contact={{
                  nombre: userChat.nombre,
                  avatar: "",
                  botActivo: userChat.botActivo,
                  tag: userChat.tag
                }}
                onClickDropdown={() => {
                  onClickDropdown(userChat.numero, userChat.tag)
                }}
                onSelect={() => {
                  setActiveUserId(userChat.id)
                  setActiveUserNumber(userChat.numero)
                }}
              />
            ))}
            {filteredUsers.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No se encontraron conversaciones
              </div>
            )}
          </ScrollArea>
        </div>
      </Tabs>
    </div>
  )
}
