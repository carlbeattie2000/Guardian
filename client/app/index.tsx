import { useRouter } from "expo-router";
import { Button, SafeAreaView, ScrollView } from "react-native";
import { Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView>
          <Text style={{ color: "#fdfdfd" }}>Hello</Text>
          <Button
            title="goto login"
            onPress={() => router.navigate("/authentication/login")}
          />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
