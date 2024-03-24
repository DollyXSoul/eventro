import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "./ui/button";
const Header = () => {
  return (
    <header className="header flex p-4 justify-between">
      <div> EventoLogo </div>
      <div>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
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
