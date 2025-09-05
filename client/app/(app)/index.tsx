import { useRouter } from "expo-router";
import { apiService } from "~/services/apiService";
import { use, useContext } from "react";

import { View } from "react-native";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { AlertTriangle } from "~/lib/icons/AlertTriangle";
import { Separator } from "~/components/ui/separator";
import { AuthContext } from "~/contexts/Auth";

export default function Screen() {
	const router = useRouter();
	const { checkAuthed, isOfficer } = useContext(AuthContext);

	return (
		<View className="flex-1 items-center gap-5 p-6 bg-secondary/30">
			<Alert icon={AlertTriangle} variant="destructive" className="max-w-xl">
				<AlertTitle>Is it a emergency?</AlertTitle>
				<AlertDescription>Call 000 in emergency situations</AlertDescription>
			</Alert>
			<View className="w-full flex-1 items-center justify-evenly gap-5 p-6">
				{isOfficer && (
					<Text className="font-bold text-3xl">Welcome Officer</Text>
				)}
				{!isOfficer && (
					<>
						<Button
							variant="destructive"
							className="w-full"
							onPress={() => router.navigate("/(app)/(reports)/new")}
						>
							<Text className="font-bold">Create a report</Text>
						</Button>
						<Button variant="outline" className="bg-yellow-500 w-full">
							<Text className="text-black font-bold">Report a lost item</Text>
						</Button>

						<Separator />
					</>
				)}

				<Button variant="outline" className="bg-primary w-full">
					<Text className="font-bold color-primary-foreground">
						Notifications
					</Text>
				</Button>
				<Button
					variant="outline"
					className="bg-primary w-full"
					onPress={() => router.navigate("/(app)/(reports)/")}
				>
					<Text className="font-bold color-primary-foreground">
						{isOfficer ? "Reports" : "My Reports"}
					</Text>
				</Button>
				<Button variant="outline" className="bg-primary w-full">
					<Text className="font-bold color-primary-foreground">
						{isOfficer ? "Lost Item Reports" : "My Lost Item Reports"}
					</Text>
				</Button>

				<Separator />

				<Button
					variant="destructive"
					className="w-full"
					onPress={async () => {
						await apiService.post("/api/v1/auth/logout");
						await checkAuthed();
					}}
				>
					<Text className="font-bold">Logout</Text>
				</Button>
			</View>
		</View>
	);
}
