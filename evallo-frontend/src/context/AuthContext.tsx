import { createContext, useState, type ReactNode } from "react";

interface AuthContextType {
  token: string;
  setToken: (value: string) => void;
  userData: { name: string; email: string; org_name?: string };
  setUserData: (data: { name: string; email: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string>("");
  const [userData, setUserData] = useState<{ name: string; email: string }>({
    name: "",
    email: "",
  });

  return (
    <AuthContext.Provider value={{ token, setToken, userData, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
