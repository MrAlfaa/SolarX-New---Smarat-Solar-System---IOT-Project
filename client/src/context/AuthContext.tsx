import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  solarId: string | null;
  login: (id: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The valid Solar ID
const VALID_SOLAR_ID = 'SX-2342';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Check if we have a stored SolarID in localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [solarId, setSolarId] = useState<string | null>(null);
  
  // Check for existing auth on component mount
  useEffect(() => {
    const storedSolarId = localStorage.getItem('solarId');
    if (storedSolarId && storedSolarId === VALID_SOLAR_ID) {
      setIsAuthenticated(true);
      setSolarId(storedSolarId);
    }
  }, []);

  const login = (id: string): boolean => {
    if (id === VALID_SOLAR_ID) {
      setIsAuthenticated(true);
      setSolarId(id);
      localStorage.setItem('solarId', id);
      return true;
    }
    return false;
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    setSolarId(null);
    localStorage.removeItem('solarId');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, solarId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};