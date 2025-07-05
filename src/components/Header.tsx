import { Button } from "@/components/ui/button";
import { Film, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserNav } from "./UserNav";
import { Input } from "./ui/input";
import { useState } from "react";

export const Header = () => {
  const { session, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="w-full px-4 lg:px-6 h-14 flex items-center bg-background border-b gap-4">
      <Link to="/" className="flex items-center justify-center">
        <Film className="h-6 w-6" />
        <span className="ml-2 text-lg font-semibold hidden sm:inline">Laabidate Films</span>
      </Link>
      <div className="flex-1">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search films..."
            className="w-full pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
      <nav className="flex gap-2 sm:gap-4 items-center">
        {!loading && (
          <>
            {session ? (
              <UserNav />
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </>
        )}
      </nav>
    </header>
  );
};