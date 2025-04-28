import { ThemeProvider } from "./components/theme/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./context/auth-context";
import { ChatProvider } from "./context/chat-context";
import { SocketProvider } from "./context/socket-context";
import AppRoutes from "./routes/app-routes";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="app-theme">
      <AuthProvider>
        <SocketProvider>
          <ChatProvider>
            <AppRoutes />
            <Toaster />
          </ChatProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;