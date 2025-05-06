import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSocket } from "@/context/socket-context"
import { useEffect, useState } from "react"
import logo from "@/assets/logo.jpg"

const SyncPage = () => {
  const [qr, setQr] = useState<string>()
  const [isReady, setIsReady] = useState<boolean>(false)
  const { socket } = useSocket()

  useEffect(() => {
    if (!socket) return
  
    const handleQR = (data: string) => {
      console.log("QR recibido:", data)
      setQr(data)
    }

    const readyWhatsapp = () => {
      setIsReady(true)
    }

    socket.on("ready", readyWhatsapp)
  
    socket.on("qr", handleQR)
  
    return () => {
      socket.off("qr", handleQR)
    }
  }, [socket])
  

  return (
    <div className="h-full flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <img
            src={logo}
            alt="Logo"
            className="mx-auto h-16 w-16 rounded-full object-cover"
          />
          <CardTitle className="mt-4 text-xl font-semibold">
            Escanea el código QR
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Para conectar WhatsApp, escanea este código con tu teléfono
          </p>
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-4">
          <div className="border rounded-lg p-4 bg-background">
            <img
              src={
                qr
                  ? qr
                  : isReady ? "https://cdn.pixabay.com/photo/2022/07/04/01/58/hook-7300191_1280.png": "https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif"
              }
              alt="QR para escanear"
              id="qr-image"
              className="w-48 h-48 object-contain"
            />
          </div>
          <div
            className="text-sm font-medium text-muted-foreground"
            id="status-message"
          >
            {!isReady ?'Esperando el código QR...' : "🟢 Conectado a WhatsApp"}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
export default SyncPage
