import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "../ui/button";
import NavItems from "./NavItems";
import MobileNav from ".//MobileNav";
const Header = () => {
  return (
    <header className="header flex p-4 justify-between items-center bg-slate-100">
      <div> EventoLogo </div>

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
    </header>
  );
};

export default Header;
