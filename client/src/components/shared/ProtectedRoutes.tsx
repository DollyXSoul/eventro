import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { ReactNode, useEffect } from "react";

export function ProtectedRoutes({ children }: { children: ReactNode }) {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();

  console.log("test", userId);

  useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in");
    }
  }, [isLoaded]);

  if (!isLoaded) return <p>Loading....</p>;

  return children;
}

export default ProtectedRoutes;
