import { View } from "react-native";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { AlertTriangle } from "~/lib/icons/AlertTriangle";
import { useRouter } from "expo-router";

export default function Screen() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center gap-5 p-6 bg-secondary/30">
      <Alert icon={AlertTriangle} variant="destructive" className="max-w-xl">
        <AlertTitle>Is it a emergency?</AlertTitle>
        <AlertDescription>Call 000 in emergency situations</AlertDescription>
      </Alert>
      <View className="w-full flex-1 items-center justify-evenly gap-5 p-6">
        <Button
          variant="destructive"
          className="w-full"
          onPress={() => router.navigate("/(app)/(reports)")}
        >
          <Text className="font-bold">Create a report</Text>
        </Button>
        <Button variant="outline" className="bg-yellow-500 w-full">
          <Text className="text-black font-bold">Report a lost item</Text>
        </Button>

        <View className="bg-slate-300 h-0.5 w-full"></View>
        <Button variant="outline" className="bg-primary w-full">
          <Text className="font-bold color-primary-foreground">
            View Notifications
          </Text>
        </Button>
        <Button variant="outline" className="bg-primary w-full">
          <Text className="font-bold color-primary-foreground">
            View Reports
          </Text>
        </Button>
        <Button variant="outline" className="bg-primary w-full">
          <Text className="font-bold color-primary-foreground">
            View Lost Item Reports
          </Text>
        </Button>
      </View>
    </View>
  );
}
