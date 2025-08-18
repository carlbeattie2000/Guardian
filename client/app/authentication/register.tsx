import { useState } from "react";
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

export default function Screen() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
      <Card className="w-full max-w-sm p-6 rounded-2xl h-1/2">
        <CardHeader className="items-center">
          <View className="p-3" />
          <CardTitle className="pb-2 text-center">Register</CardTitle>
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
                inputMode="email"
                placeholder="email (optional)"
                className="w-full"
                value={email}
                onChangeText={(newEmail) => setEmail(newEmail)}
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
            onPress={() => {}}
          >
            <Text>Register</Text>
          </Button>
        </CardFooter>
      </Card>
    </View>
  );
}
