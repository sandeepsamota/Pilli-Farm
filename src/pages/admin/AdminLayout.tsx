import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, Package, Home } from "lucide-react";

const AdminLayout = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="font-semibold">Admin</Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link to="/admin" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                <Package className="w-4 h-4" /> Products
              </Link>
              <Link to="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                <Home className="w-4 h-4" /> Store
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-muted-foreground">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-1.5" /> Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;