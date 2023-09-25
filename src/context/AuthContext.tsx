import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
export interface AuthContextType {
  incomes: Income[];
  auth: AuthObject;
  setAuth: Dispatch<SetStateAction<AuthObject>>;
  persist: boolean;
  setPersist: Dispatch<SetStateAction<boolean>>;
  setIncomes: any;
}

type UserData = {
  _id: string | undefined;
  image?: string | undefined;
  isAdmin: boolean | undefined;
};

export type Income = {
  _id: string;
  incomes: number;
  date: string;
  specialIncomes: number;
  name?: string;
};

interface AuthObject {
  user: UserData | null;
  token?: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

const defaultAuthObject: AuthObject = {
  user: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthObject>(defaultAuthObject);

  const persistedValue = localStorage.getItem("persist");
  const initialPersist = persistedValue ? persistedValue === "true" : false;

  const [persist, setPersist] = useState<boolean>(initialPersist);
  const [incomes, setIncomes] = useState<Income[]>([]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        persist,
        setPersist,
        incomes,
        setIncomes,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
