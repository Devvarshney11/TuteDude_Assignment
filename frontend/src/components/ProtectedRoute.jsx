import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 animate-pulse">
        <div className="w-16 h-16 mb-4 rounded-full bg-indigo-200"></div>
        <div className="h-4 w-32 bg-indigo-200 rounded"></div>
        <div className="mt-4 text-sm text-gray-500">
          Loading your content...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
