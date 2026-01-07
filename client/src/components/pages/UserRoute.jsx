import { Navigate } from "react-router";
import { useSelector } from "react-redux";

const UserRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default UserRoute;
