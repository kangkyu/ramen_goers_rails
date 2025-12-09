import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChefHat, Home, Trophy, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataService } from "@/lib/data";

export function Navigation() {
  const location = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/my-visits", label: "My Visits", icon: MapPin },
    { href: "/rankings", label: "Top Rankings", icon: Trophy },
  ];

  const navigate = useNavigate();
  const [user, setUser] = useState<{ id: string; email?: string; name?: string } | null>(null);
  useEffect(() => {
    DataService.getCurrentUser().then(setUser);
  }, []);

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center space-x-2 font-bold text-xl text-primary"
          >
            <ChefHat className="h-8 w-8" />
            <span>Ramen Goers</span>
          </Link>

          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
            <div className="ml-2">
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline text-sm text-muted-foreground">{user.email || user.name}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      await DataService.logout();
                      setUser(null);
                      navigate("/");
                    }}
                  >
                    Sign out
                  </Button>
                </div>
              ) : (
                <Button size="sm" asChild>
                  <Link to="/login">Sign in</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
