import { useContext, createContext, useState, useEffect } from 'react';
import { axiosInstance } from "@/lib/axios";
import {useNavigate} from "react-router-dom";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  cedula: string;
  email: string;
  name: string;
  picture: string;
}

type AuthContextType = {
  user: User | null;
  roles: string[] | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
}

type AuthenticationRequest ={
  email: string;
  password: string;
}

type LoginResult = {
  success: boolean;
  message?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<string[] | null>(null);
  const [token, setToken] = useState(localStorage.getItem("site") || null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common.Authorization;
      setUser(null);
      setRoles(null);
    }
  }, [token]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token && !user) {
        try {
          const response = await axiosInstance.get("/account/current-user");
          const userData: User = {
            id: response.data.id,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            name: response.data.name,
            picture: response.data.picture,
            phoneNumber: response.data.phone,
            cedula: response.data.cedula
          };
          setUser(userData);
          setRoles(response.data.roles);
        } catch (error) {
          setToken(null);
          localStorage.removeItem("site");
        }
      }
    };

    fetchUserData();
  }, [token]);

  const login = async (email: string, password: string): Promise<LoginResult> => {
      try {
        const credentials: AuthenticationRequest = { email, password };
        const response = await axiosInstance.post("/account/authenticate", credentials);
        const userData: User = {
          id: response.data.id,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          phoneNumber: response.data.phoneNumber,
          cedula: response.data.cedula,
          email: response.data.email,
          name: response.data.name,
          picture: response.data.picture
        };
        setUser(userData);
        setRoles(response.data.roles);
        setToken(response.data.jwToken);
        localStorage.setItem("site", response.data.jwToken);
        if (roles && roles.includes("Agent")){
          navigate("/listings");
        } else {
          navigate("/");
        }
        return { success: true };
      } catch (err: any) {
        const msg = err?.response?.data?.detail ?? err?.message ?? "Login failed";
        return { success: false, message: msg };
      }
    };

    const logout = () => {
      setUser(null);
      setRoles(null);
      setToken(null);
      localStorage.removeItem("site");
      navigate("/login");
    };

  return <AuthContext.Provider value={{ user, roles, token, isLoading, login, logout} as AuthContextType}>{children}</AuthContext.Provider>
  };

export const useAuth = () => {
  return useContext(AuthContext);
}
