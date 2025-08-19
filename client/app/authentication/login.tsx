import { useRouter } from "expo-router";
import { use, useState } from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/contexts/Auth";
import { apiService } from "~/services/apiService";
import { LoginPayload, LoginResponse } from "~/types/responses";

export default function Screen() {
  const router = useRouter();
  const { login } = use(AuthContext);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function submitLogin() {
    if (!username || !password) {
      return;
    }

    const request = await apiService.post<LoginResponse>("/api/v1/auth/login", {
      username,
      password,
    });

    const requestData = request.data;

    if (request.status === 200 && requestData.status === "success") {
      const payload = requestData.data as LoginPayload;

      login(payload.accessToken, payload.refreshToken);
    }
  }

  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
      <Card className="w-full max-w-sm p-6 rounded-2xl h-1/2">
        <CardHeader className="items-center">
          <View className="p-3" />
          <CardTitle className="pb-2 text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="flex-row justify-around gap-3">
            <View className="flex-col gap-3 items-center w-full">
              <Input
                placeholder="username"
                className="w-full"
                value={username}
                onChangeText={(newUsername) => setUsername(newUsername)}
              />
              <Input
                placeholder="password"
                className="w-full"
                value={password}
                onChangeText={(newPassword) => setPassword(newPassword)}
              />
            </View>
          </View>
        </CardContent>
        <CardFooter className="flex-col gap-3 pb-0">
          <Button
            variant="outline"
            className="shadow shadow-foreground/5"
            onPress={submitLogin}
          >
            <Text>Login</Text>
          </Button>
          <Button
            variant="secondary"
            className="shadow shadow-foreground/5"
            onPress={() => router.navigate("/authentication/register")}
          >
            <Text>Register</Text>
          </Button>
        </CardFooter>
      </Card>
    </View>
  );
}
