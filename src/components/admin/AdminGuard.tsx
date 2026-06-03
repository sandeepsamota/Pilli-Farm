import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export const AdminGuard = ({ children }: { children: ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-2xl font-semibold">Access denied</h1>
          <p className="text-sm text-muted-foreground">
            Your account doesn't have admin access. Ask an existing admin to grant you the
            <code className="mx-1 px-1.5 py-0.5 bg-muted rounded text-xs">admin</code>
            role in the user_roles table.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};