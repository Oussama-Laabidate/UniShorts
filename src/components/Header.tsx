import { Button } from "@/components/ui/button";
import { Film } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="w-full px-4 lg:px-6 h-14 flex items-center bg-background border-b">
      <Link to="/" className="flex items-center justify-center">
        <Film className="h-6 w-6" />
        <span className="ml-2 text-lg font-semibold">Laabidate Films</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Button variant="ghost" asChild>
          <Link to="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link to="/signup">Sign Up</Link>
        </Button>
      </nav>
    </header>
  );
};