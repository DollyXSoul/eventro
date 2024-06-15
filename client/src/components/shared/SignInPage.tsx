import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => (
  <div className="wrapper h-full flex-center">
    <SignIn path="/sign-in" />
  </div>
);

export default SignInPage;
