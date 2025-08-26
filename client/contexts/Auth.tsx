import { routeToScreen } from "expo-router/build/useScreens";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useStorageState } from "~/hooks/useStorageState";
import { apiService } from "~/services/apiService";

interface RefreshResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

interface ProfileResponse {
  data: {
    is_officer: boolean;
  };
}

interface IAuthContext {
  session: string | null;
  isOfficer: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  checkAuthed: () => void;
  refreshToken: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  session: null,
  isOfficer: false,
  login: () => {},
  logout: () => {},
  checkAuthed: () => {},
  refreshToken: () => {},
});

async function accessTokenIsValid(token: string | null): Promise<boolean> {
  const request = await apiService.get("/api/v1/auth/is-authed");
  if (request.status != 204) {
    return false;
  }
  return true;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [[isLoadingAccess, accessTokenSession], setAccessTokenSession] =
    useStorageState("accessToken");
  const [[isLoadingRefresh, refreshTokenSession], setRefreshTokenSession] =
    useStorageState("refreshToken");
  const [lastRefreshCheck, setLastRefreshCheck] = useState<number>(Date.now());
  const [isOfficer, setIsOfficer] = useState<boolean>(false);

  const loading = isLoadingAccess || isLoadingRefresh;

  useEffect(() => {
    accessTokenIsValid(accessTokenSession).then((valid) => {
      if (!valid) setAccessTokenSession(null);
    });
  }, [loading, accessTokenSession, refreshTokenSession]);

  const login = useCallback(
    async (accessToken: string, refreshToken: string) => {
      setAccessTokenSession(accessToken);
      setRefreshTokenSession(refreshToken);

      const response = await apiService.get<ProfileResponse>(
        "/api/v1/auth/profile",
      );

      if (response.status === 200) {
        setIsOfficer(response.data.data.is_officer);
      }
    },
    [setAccessTokenSession, setRefreshTokenSession],
  );

  const logout = () => {};

  const checkAuthed = async () => {
    const request = await apiService.get("/api/v1/auth/is-authed");
    if (request.status != 204) {
      setAccessTokenSession(null);
      if (await refreshToken(true)) {
        await checkAuthed();
      }
    }
    return;
  };

  const refreshToken = async (ignoreTimeCheck: boolean = false) => {
    const checkTokenEveryMs = 1000 * 5;
    const dateNow = Date.now();

    if (ignoreTimeCheck || dateNow > lastRefreshCheck + checkTokenEveryMs) {
      setLastRefreshCheck(dateNow);
      const response = await apiService.post<RefreshResponse>(
        "/api/v1/auth/refresh",
      );

      if (response.status === 200) {
        setAccessTokenSession(response.data.data.accessToken);
        setRefreshTokenSession(response.data.data.refreshToken);
        return true;
      }
      setRefreshTokenSession(null);
    }

    return false;
  };

  return (
    <AuthContext
      value={{
        session: accessTokenSession,
        isOfficer,
        login,
        logout,
        checkAuthed,
        refreshToken,
      }}
    >
      {children}
    </AuthContext>
  );
}
