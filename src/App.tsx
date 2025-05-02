import { ThemeProvider } from "./components/theme/theme-provider"
import { Toaster } from "./components/ui/toaster"
import { AuthProvider } from "./context/auth-context"
import { ChatProvider } from "./context/chat-context"
import { SocketProvider } from "./context/socket-context"
import AppRoutes from "./routes/app-routes"
import { ApiURLProvider } from "./context/apiurl-context"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="app-theme">
      <ApiURLProvider>
        <AuthProvider>
          <SocketProvider>
            <ChatProvider>
              <AppRoutes />
              <Toaster />
            </ChatProvider>
          </SocketProvider>
        </AuthProvider>
      </ApiURLProvider>
    </ThemeProvider>
  )
}

export default App
