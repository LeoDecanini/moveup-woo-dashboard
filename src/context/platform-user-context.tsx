import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import axios from 'axios';

import { HomeUrl, ServerUrl } from '@/lib/utils';

interface AuthContextProps {
  authenticated: boolean;
  userEmail: string | null;
  completeUser: any | null;
  getTokenFromCookie: () => string | null;
  logout: () => void;
  loading: boolean;
  userPermissions: Permissions | null;
  openModalInvited: boolean;
  setOpenModalInvited: React.Dispatch<React.SetStateAction<boolean>>;
  tokenFromCookie: string | null;
  setErrorToken: React.Dispatch<React.SetStateAction<string>>;
  errorToken: string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [openModalInvited, setOpenModalInvited] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [completeUser, setCompleteUser] = useState<any | null>(null);
  const [userPermissions, setUserPermissions] = useState<Permissions | null>(
    null
  );

  const [tokenFromCookie, setTokenFromCookie] = useState<string | null>(null);

  const [errorToken, setErrorToken] = useState<string>('');

  const [platformUser, setPlatformUser] = useState(null);

  const getTokenFromCookie = (): string | null => {
    return (
      document.cookie
        .split('; ')
        .find((row) => row.startsWith('authToken='))
        ?.split('=')[1] || null
    );
  };

  const setCookie = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    const setTokenCookie = (token: string) => {
      document.cookie = `authToken=${token}; path=/; max-age=3600`;
    };

    if (token) {
      setTokenCookie(token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const test = getTokenFromCookie();

    if (!token && !test) {
      console.log('no hay token');
      window.location.href = `${HomeUrl}/login`;
    }

    if (test) {
      console.log('hay token en la cookie');
      setTokenFromCookie(test);
    }
  };

  const fetchSession = async () => {
    setLoading(true);
    const url = `${ServerUrl}/platform-users/email/maxi@moveup.digital`;
    console.log(url)
    try {
      const response = await axios.get(url);
      setTimeout(() => {
        console.log(response.data);
        setCompleteUser(response.data);
      }, 1500);
    } catch (error) {
      console.log("can't fetch session", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  useEffect(() => {
    fetchSession();
    /* setCookie(); */
  }, []);

  /* const [UTC, setUTC] = useState<any | null>(null);

  const getUTChours = async () => {
    try {
      const response = await axios.get(`${ServerUrl}/timezones`);
      setUTC(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (completeUser) {
      getUTChours();
    }
  }, [completeUser]); */

  const logout = async () => {
    try {
      await axios.post(
        `${ServerUrl}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${tokenFromCookie}`,
          },
        }
      );
      document.cookie = `authToken=; path=/; max-age=0`;
      window.location.replace(`${HomeUrl}/login`);
      setAuthenticated(false);
    } catch (error) {
      setAuthenticated(false);
    }
  };

  useEffect(() => {
    if (
      errorToken ===
      'El token no fué enviado o la Ip y el user-agent desde donde se genero son distintos al que se está enviando ' ||
      errorToken ===
      'El token enviado no está registrado en la cache del server'
    ) {
      document.cookie = `authToken=; path=/; max-age=0`;
      window.location.replace(`${HomeUrl}/login`);
      setAuthenticated(false);
    }
  }, [errorToken]);

  return (
    <AuthContext.Provider
      value={{
        authenticated,

        userEmail,
        completeUser,
        loading,
        userPermissions,
        openModalInvited,
        setErrorToken,
        errorToken,
        setOpenModalInvited,
        getTokenFromCookie,
        logout,
        tokenFromCookie,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
