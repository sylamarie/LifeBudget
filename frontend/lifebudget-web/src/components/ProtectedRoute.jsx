import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const userId = localStorage.getItem("lifebudgetUserId");

  if (!userId) {
    // Si no hay userId, redirigir al login
    return <Navigate to="/login" replace />;
  }

  // Si hay userId, mostrar el componente hijo
  return children;
}

export default ProtectedRoute;