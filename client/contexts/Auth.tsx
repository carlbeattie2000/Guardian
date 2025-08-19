import { routeToScreen } from "expo-router/build/useScreens";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
} from "react";
import { useStorageState } from "~/hooks/useStorageState";
import { apiService } from "~/services/apiService";

interface IAuthContext {
  session: string | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  session: null,
  login: () => {},
  logout: () => {},
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

  const loading = isLoadingAccess || isLoadingRefresh;

  useEffect(() => {
    accessTokenIsValid(accessTokenSession).then((valid) => {
      if (!valid) setAccessTokenSession(null);
    });
  }, [loading, accessTokenSession, refreshTokenSession]);

  const login = useCallback(
    (accessToken: string, refreshToken: string) => {
      setAccessTokenSession(accessToken);
      setRefreshTokenSession(refreshToken);
    },
    [setAccessTokenSession, setRefreshTokenSession],
  );

  const logout = () => {};

  return (
    <AuthContext value={{ session: accessTokenSession, login, logout }}>
      {children}
    </AuthContext>
  );
}
