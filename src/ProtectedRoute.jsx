import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "./firebase"
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth)

  if (loading) return <p>Carregando...</p>
  if (!user) return <Navigate to="/login" />

  return children
}
