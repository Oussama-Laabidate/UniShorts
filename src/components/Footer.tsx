import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      <p className="text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Laabidate Films. All rights reserved.
      </p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6 flex-wrap justify-center">
        <Link to="/about" className="text-xs hover:underline underline-offset-4">
          About Us
        </Link>
        <Link to="/terms" className="text-xs hover:underline underline-offset-4">
          Terms of Service
        </Link>
        <Link to="/privacy" className="text-xs hover:underline underline-offset-4">
          Privacy
        </Link>
        <Link to="/contact" className="text-xs hover:underline underline-offset-4">
          Contact Us
        </Link>
        <Link to="/report-problem" className="text-xs hover:underline underline-offset-4">
          Report a Problem
        </Link>
        <Link to="/faq" className="text-xs hover:underline underline-offset-4">
          FAQ
        </Link>
        <Link to="/donate" className="text-xs hover:underline underline-offset-4 font-semibold text-primary">
          Support Us
        </Link>
      </nav>
      <div className="sm:ml-4 mt-4 sm:mt-0">
        <MadeWithDyad />
      </div>
    </footer>
  );
};