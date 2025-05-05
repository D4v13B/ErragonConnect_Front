import { getEmpresaParam } from "@/lib/utils"
import Page403 from "@/pages/403-page"
import { createContext, useContext, useEffect, useState } from "react"

export interface ApiURLContextType {
  nombre: string
  backendUrl: string
  logoImage: string
  setBackendUrl: (apiUrl: string) => void
}

const ApiURLContext = createContext<ApiURLContextType | undefined>(undefined)

export function ApiURLProvider({ children }: { children: React.ReactNode }) {
  const empresaParam = getEmpresaParam()

  const [backendUrl, setBackendUrl] = useState(() => {
    const apiUrl = localStorage.getItem("api_url")
    return apiUrl && !empresaParam ? apiUrl : ""
  })

  const [nombre, setNombre] = useState(() => {
    const storedNombre = localStorage.getItem("nombre")
    return storedNombre && !empresaParam ? storedNombre : ""
  })

  const [logoImage, setLogoImage] = useState(() => {
    const storedLogo = localStorage.getItem("logoImage")
    return storedLogo && !empresaParam ? storedLogo : ""
  })

  useEffect(() => {    

    if (backendUrl) return

    if (!empresaParam) {
      setBackendUrl("403")
      return
    }

    fetch(`${import.meta.env.VITE_API_URL}?empresa=${empresaParam}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener backendDomain")
        return res.json()
      })
      .then((data) => {
        const rutaAPI = data.datos[2].backend_url        

        setBackendUrl(rutaAPI)        
        setNombre(data.datos[0].nombre ?? "")
        setLogoImage(data.datos[1].logo_image ?? "")

        localStorage.setItem("api_url", data.datos[2].backend_url)
        localStorage.setItem("nombre", data.datos[0].nombre ?? "")
        localStorage.setItem("logoImage", data.datos[1].logo_image ?? "")
      })
      .catch(() => {
        setBackendUrl("403")
      })
  }, [backendUrl, nombre, logoImage, empresaParam])

  if (backendUrl === "403") return <Page403 />
  if (!setBackendUrl) return <div>Cargando configuración...</div>

  return (
    <ApiURLContext.Provider
      value={{
        backendUrl,
        nombre,
        logoImage,
        setBackendUrl,
      }}
    >
      {children}
    </ApiURLContext.Provider>
  )
}

// Hook para acceder
export function useApiURL() {
  const context = useContext(ApiURLContext)
  if (context === undefined) {
    throw new Error("useApiURL must be used within an ApiURLProvider")
  }
  return context
}
