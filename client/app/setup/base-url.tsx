import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { BASE_URL, updateBaseUrl } from "~/services/apiService";

export default function BaseUrlSetup() {
	const router = useRouter();
	const [baseUrlValue, setBaseUrlValue] = useState("");

	useEffect(() => {
		const baseURL = BASE_URL;
		setBaseUrlValue(baseURL);
	}, [BASE_URL]);

	function onBaseUrlTextChange(text: string) {
		setBaseUrlValue(text);
	}

	function onSet() {
		if (!baseUrlValue || baseUrlValue === "") return;
		updateBaseUrl(baseUrlValue);
		if (router.canDismiss()) {
			router.dismiss();
			return;
		}

		router.replace("/");
	}

	return (
		<View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
			<View className="flex-1 w-full gap-5 p-6">
				<Text className="text-2xl font-bold">Set Base URL</Text>
				<Input
					placeholder="http://machine-ip:2699"
					value={baseUrlValue}
					onChangeText={onBaseUrlTextChange}
				/>
				<Button onPress={onSet}>
					<Text>Set</Text>
				</Button>
			</View>
		</View>
	);
}
