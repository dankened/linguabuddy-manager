
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";

type ProtectedRouteProps = {
  requireTeacher?: boolean;
};

export default function ProtectedRoute({ requireTeacher = false }: ProtectedRouteProps) {
  const { user, isLoading, isTeacher } = useAuth();

  // While checking authentication status, show loading
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If route requires teacher role and user is not a teacher
  if (requireTeacher && !isTeacher) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated (and has required role if specified)
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
