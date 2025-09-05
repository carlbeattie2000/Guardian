import { View } from "react-native";
import SettingsToggle from "./SettingsToggle";
import { ThemeToggle } from "./ThemeToggle";

export default function RightHeader() {
	return (
		<View className="flex flex-row gap-5">
			<SettingsToggle />
			<ThemeToggle />
		</View>
	);
}
