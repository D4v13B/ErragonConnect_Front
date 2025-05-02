import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./auth-context";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Only connect when authenticated
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Create socket connection
    // Note: In a real application, you would connect to your backend server
    // For this example, we're just creating a socket instance that won't actually connect
    const newSocket = io(localStorage.getItem("api_url") as string, {
      query: {
        userId: user.id,
      },
    });

    // Socket event handlers
    const onConnect = () => {
      setIsConnected(true);
      console.log("Socket connected");
    };

    const onDisconnect = () => {
      setIsConnected(false);
      console.log("Socket disconnected");
    };

    const onError = (error: Error) => {
      console.error("Socket error:", error);
    };

    // Add event listeners
    newSocket.on("connect", onConnect);
    newSocket.on("disconnect", onDisconnect);
    newSocket.on("connect_error", onError);

    // Store socket in state
    setSocket(newSocket);

    // For demo purposes, we'll simulate a connection without actually connecting
    // In a real app, you would use newSocket.connect() here
    setTimeout(() => {
      setIsConnected(true);
    }, 500);

    // Cleanup on unmount
    return () => {
      if (newSocket) {
        newSocket.off("connect", onConnect);
        newSocket.off("disconnect", onDisconnect);
        newSocket.off("connect_error", onError);
        newSocket.disconnect();
      }
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}