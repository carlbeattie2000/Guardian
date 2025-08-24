import { View, Image } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Text } from "~/components/ui/text";
import { AlertTriangle } from "~/lib/icons/AlertTriangle";
import { useRouter } from "expo-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export default function Screen() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: "",
      photos: "",
    },
  });

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });

    console.log(result);

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setImages(uris);
    }
  };

  return (
    <View className="flex-1 items-center gap-5 p-6 bg-secondary/30">
      <Alert icon={AlertTriangle} variant="destructive" className="max-w-xl">
        <AlertTitle>Is it a emergency?</AlertTitle>
        <AlertDescription>Call 000 in emergency situations</AlertDescription>
      </Alert>

      <View className="flex-1 w-full items-center gap-5 p-6">
        <Text className="text-2xl font-bold">Create a report</Text>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="description"
              onChangeText={onChange}
              value={value}
              className="w-full"
            />
          )}
          name="description"
        />
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Input
              className="w-full"
              placeholder="photos"
              inputMode="url"
              onChangeText={onChange}
              value={value}
            />
          )}
          name="photos"
        />

        <Button variant="outline" className="w-full" onPress={pickImage}>
          <Text className="border-x-white">Add Images</Text>
        </Button>
        <View className="flex flex-row gap-5 flex-wrap">
          {images.length > 0 &&
            images.map((image, i) => (
              <Image
                source={{ uri: image }}
                style={{ width: 60, height: 60 }}
                resizeMode="cover"
                key={i}
              />
            ))}
        </View>

        <Button variant="destructive" className="bg-green-600 w-full mt-5">
          <Text className="border-x-white">Submit Report</Text>
        </Button>
      </View>
    </View>
  );
}
