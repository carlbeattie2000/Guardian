import { SafeAreaView, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Register() {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Text style={{ color: "#fdfdfd" }}>Login</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
