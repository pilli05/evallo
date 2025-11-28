import { useContext } from "react";
import AuthContext from "../context/AuthContext";
interface AuthContextType {
  token: string;
  setToken: (value: string) => void;
  userData: {
    name: string;
    email: string;
    org_name?: string;
    org_id?: string;
    id?: string;
  };
  setUserData: (data: { name: string; email: string }) => void;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
