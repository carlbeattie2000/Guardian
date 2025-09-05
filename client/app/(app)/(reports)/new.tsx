import { View, Image, Alert, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import {
	Alert as UIAlert,
	AlertDescription,
	AlertTitle,
} from "~/components/ui/alert";
import { Text } from "~/components/ui/text";
import { AlertTriangle } from "~/lib/icons/AlertTriangle";
import { useRouter } from "expo-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import Map from "~/components/Map";
import { Textarea } from "~/components/ui/textarea";
import { apiService } from "~/services/apiService";

interface FormData {
	description: string;
	images: {
		uri: string;
		fileName: string;
		mimeType: string;
	};
}

interface UserLocation {
	latitude: number;
	longitude: number;
}

interface ReportAddedResponse {
	data: {
		id: number;
	};
}

export default function Screen() {
	const router = useRouter();
	const [imageData, setImageData] = useState<ImagePicker.ImagePickerAsset[]>(
		[],
	);
	const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		defaultValues: {
			description: "",
		},
	});

	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: "images",
			aspect: [4, 3],
			quality: 1,
			allowsMultipleSelection: true,
		});

		if (!result.canceled) {
			setImageData([...imageData, ...result.assets]);
		}
	};

	const onSubmit = async (data: FormData) => {
		const formData = new FormData();

		formData.append("description", data.description);

		imageData.forEach((image) => {
			const fileData = {
				uri: image.uri,
				type: image.mimeType,
				name: image.fileName,
			};

			formData.append("photos", fileData as any);
		});

		formData.append("latitude", userLocation?.latitude.toString() || "0");
		formData.append("longitude", userLocation?.longitude.toString() || "0");
		try {
			const response = await apiService.post<ReportAddedResponse>(
				"/api/v1/reports/",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				},
			);

			if (response.status === 200) {
				router.dismissTo(`/(reports)/${response.data.data.id}`);
			}
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<View className="flex-1 items-center gap-5 p-6 bg-secondary/30">
			<UIAlert icon={AlertTriangle} variant="destructive" className="max-w-xl">
				<AlertTitle>Is it a emergency?</AlertTitle>
				<AlertDescription>Call 000 in emergency situations</AlertDescription>
			</UIAlert>
			<View className="flex-1 w-full gap-5 p-6">
				<Text className="text-2xl font-bold">Create a report</Text>

				<Controller
					control={control}
					rules={{ required: true }}
					render={({ field: { onChange, value } }) => (
						<Textarea
							placeholder="description"
							onChangeText={onChange}
							value={value}
							className="w-full max-h-28 h-28"
							maxLength={200}
							numberOfLines={4}
						/>
					)}
					name="description"
				/>

				<Button variant="outline" className="w-full" onPress={pickImage}>
					<Text className="border-x-white">Add Images</Text>
				</Button>

				<Map setLocation={setUserLocation} />

				<Button
					variant="destructive"
					className="bg-green-600 w-full mt-5"
					onPress={handleSubmit(onSubmit)}
				>
					<Text className="border-x-white">Submit Report</Text>
				</Button>
			</View>
		</View>
	);
}
