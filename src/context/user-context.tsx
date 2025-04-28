import { createContext, useContext, useEffect, useState } from "react"
import { useAuth, User } from "./auth-context"
import { useToast } from "@/hooks/use-toast"
import { getUsers } from "@/core/api/user/getUsers"
import { saveUser } from "@/core/api/user/saveUser"
import { GenericResponse } from "@/types"

// Define types
interface UserContextType {
  users: User[]
  addUser: (user: Partial<User>) => void
  updateUser: (id: string, data: Partial<User>) => void
  deleteUser: (id: string) => void
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined)

// Mock users
// const mockUsers: User[] = [
//   {
//     id: "1",
//     nombre: "Admin User",
//     email: "admin@example.com",
//     avatar: "https://i.pravatar.cc/150?img=1",
//     role: "admin",
//     isOnline: true,
//   },
//   {
//     id: "2",
//     nombre: "Regular User",
//     email: "user@example.com",
//     avatar: "https://i.pravatar.cc/150?img=2",
//     role: "user",
//     isOnline: true,
//   },
//   {
//     id: "3",
//     nombre: "John Doe",
//     email: "john@example.com",
//     avatar: "https://i.pravatar.cc/150?img=3",
//     role: "user",
//     isOnline: false,
//   },
//   {
//     id: "4",
//     nombre: "Jane Smith",
//     email: "jane@example.com",
//     avatar: "https://i.pravatar.cc/150?img=4",
//     role: "user",
//     isOnline: true,
//   },
//   {
//     id: "5",
//     nombre: "Alex Johnson",
//     email: "alex@example.com",
//     avatar: "https://i.pravatar.cc/150?img=5",
//     role: "user",
//     isOnline: false,
//   },
// ]

// User provider
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const { user } = useAuth()
  const { toast } = useToast()

  // Load users when authenticated
  useEffect(() => {
    const fetchUserApi = async () => {
      // if (user && user.role === "admin") {
      try {
        const usuarios = await getUsers()
        setUsers(usuarios)
      } catch (error) {
        toast({
          title: "Error al buscar usuarios",
          description: `${error}`,
          variant: "destructive",
        })
      }
      // }
    }

    fetchUserApi()
  }, [user])

  // Add a new user
  const addUser = async ({
    nombre,
    email,
    password,
    rolId,
    usuario,
  }: Partial<User>) => {
    try {
      const userData = await saveUser({
        nombre: nombre as string,
        email: email as string,
        password,
        rolId,
        usuario,
      })

      if (!userData) return

      const newUser: User = {
        ...userData,
        id: `user-${Date.now()}`,
        isOnline: false,
      }

      setUsers((prev) => [...prev, newUser])

      toast({
        title: "Usuario agregado",
        description: `${newUser.nombre} ha sido agregado`,
      })
    } catch (error) {
      const typedError = error as GenericResponse

      if (typedError?.response?.data?.error?.errors) {
        const errorsList = typedError.response.data.error.errors

        toast({
          title: "Error al agregar usuario",
          description: errorsList.map((e) => e.msg).join(", "),
          variant: "destructive", // si quieres que se vea rojo
        })
      } else {
        toast({
          title: "Error inesperado",
          description: "No se pudo agregar el usuario.",
          variant: "destructive",
        })
      }
    }
  }

  // Update a user
  const updateUser = (id: string, data: Partial<User>) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, ...data } : user))
    )

    toast({
      title: "Usuario Actualizado",
      description: "La información del usuario ha sido actualizada",
    })
  }

  // Delete a user
  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== id))

    toast({
      title: "Usuario eliminado",
      description: "El usuario ha sido eliminado",
      variant: "destructive",
    })
  }

  return (
    <UserContext.Provider
      value={{
        users,
        addUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

// Custom hook for accessing user context
export function useUserManagement() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUserManagement must be used within a UserProvider")
  }
  return context
}
