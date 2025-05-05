import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { loginApi } from "@/core/api/auth/login.api"
import { LocalStorageService } from "@/core/utils/localStorage"

// Define types
export interface User {
  id?: number | string
  avatar?: string
  nombre: string
  email: string
  rolId?: number
  role?: string
  usuario?: string
  token?: string
  isOnline?: boolean
  password?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data (simulate backend)
// const mockUsers: User[] = [
//   {
//     id: "1",
//     name: "Admin User",
//     email: "admin@example.com",
//     avatar: "https://i.pravatar.cc/150?img=1",
//     role: "admin",
//     isOnline: true,
//   },
//   {
//     id: "2",
//     name: "Regular User",
//     email: "user@example.com",
//     avatar: "https://i.pravatar.cc/150?img=2",
//     role: "user",
//     isOnline: true,
//   },
// ];

// Authentication provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  // const {setApiUrl} = useApiURL()

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const foundUser = await loginApi(email, password)

      if (!foundUser) {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        })
        setIsLoading(false)
        return false
      }

      setUser(foundUser) //Ya guardamos dentro del contexto
      LocalStorageService.setItem("user", foundUser)

      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser?.nombre}!`,
      })
      setIsLoading(false)

      return true
    } catch (error) {
      console.error(error)
    }

    setIsLoading(false)

    return false
    // Simulate API call delay
    // await new Promise(resolve => setTimeout(resolve, 1000));

    // // Find user (in a real app, this would be an API call)
    // const foundUser = mockUsers.find(u => u.email === email);

    // if (foundUser && password === "password") { // Simple mock authentication
    //   setUser(foundUser);
    //   localStorage.setItem("user", JSON.stringify(foundUser));
    //   toast({
    //     title: "Login successful",
    //     description: `Welcome back, ${foundUser.name}!`,
    //   });
    //   setIsLoading(false);
    //   return true;
    // } else {
    //   toast({
    //     title: "Login failed",
    //     description: "Invalid email or password",
    //     variant: "destructive",
    //   });
    //   setIsLoading(false);
    //   return false;
    // }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    // setApiUrl("")
    localStorage.removeItem("user")
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })

  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook for accessing auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
