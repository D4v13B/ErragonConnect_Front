import { getEmpresaParam } from "@/lib/utils"
import Page403 from "@/pages/403-page"
import { createContext, useContext, useEffect, useState } from "react"

export interface ApiURLContextType {
  apiUrl: string
  setApiUrl: (apiUrl: string) => void
}

const ApiURLContext = createContext<ApiURLContextType | undefined>(undefined)

export function ApiURLProvider({ children }: { children: React.ReactNode }) {
  const [apiUrl, setApiUrl] = useState(() => {
    return localStorage.getItem("api_url")
  })

  useEffect(() => {
    if (apiUrl) return

    const empresa = getEmpresaParam()

    if (!empresa) {
      setApiUrl("403")
      return
    }

    fetch(`${import.meta.env.VITE_API_URL}/${empresa}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener backendDomain")
        return res.json()
      })
      .then((data) => {
        setApiUrl(data.backendDomain)
        localStorage.setItem("api_url", data.backendDomain)
      })
      .catch(() => {
        setApiUrl("403")
      })
  }, [apiUrl])

  if (apiUrl === "403") return <Page403 />
  if (!apiUrl) return <div>Cargando configuración...</div>

  return (
    <ApiURLContext.Provider
      value={{
        apiUrl,

        setApiUrl,
        // Metodos
      }}
    >
      {children}
    </ApiURLContext.Provider>
  )
}

//El hook para acceder
export function useApiURL() {
  const context = useContext(ApiURLContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
