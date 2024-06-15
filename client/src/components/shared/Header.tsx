import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "../ui/button";
import NavItems from "./NavItems";
import MobileNav from ".//MobileNav";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <header className="w-full border-b bg-slate-100">
      <div className="wrapper flex items-center justify-between">
        <Link to="/">
          <img src="/assets/images/logo.svg" alt="Evently logo" width={148} />
        </Link>

        <SignedIn>
          <nav className="hidden md:flex md:justify-between md:items-center w-full max-w-xs">
            <NavItems />
          </nav>
        </SignedIn>

        <div className="flex justify-end w-32 gap-3">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
            <MobileNav />
          </SignedIn>
          <SignedOut>
            <Button asChild className="rounded-full" size="lg">
              <SignInButton afterSignInUrl="/" />
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Header;
