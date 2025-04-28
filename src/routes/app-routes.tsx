import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import LoginPage from "../pages/login-page";
import MainLayout from "../components/layout/main-layout";
import ChatPage from "../pages/chat-page";
import ConfigPage from "../pages/config-page";
import UsersPage from "../pages/users-page";
import { UserProvider } from "../context/user-context";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <UserProvider>
                <MainLayout />
              </UserProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/chat" replace />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="config" element={<ConfigPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}