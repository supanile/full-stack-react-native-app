import { useState } from "react";
import { router } from "expo-router";
import { ResizeMode, Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { icons } from "../../constants";
import { createVideoPost } from "../../lib/appwrite";
import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });

  const openPicker = async (selectType) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({
          ...form,
          thumbnail: result.assets[0],
        });
      }

      if (selectType === "video") {
        setForm({
          ...form,
          video: result.assets[0],
        });
      }
    } else {
      Alert.alert("Document picked", JSON.stringify(result, null, 2));
    }
  };

  const submit = async () => {
    if (
      (form.prompt === "") |
      (form.title === "") |
      !form.thumbnail |
      !form.video
    ) {
      return Alert.alert("Please provide all fields");
    }

    setUploading(true);
    try {
      await createVideoPost({
        ...form,
        userId: user.$id,
      });

      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });

      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-primary">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View className="px-4 py-6 flex-1 justify-between">
          <View>
            <Text className="text-2xl text-white font-psemibold mb-6">
              Upload Video
            </Text>

            <FormField
              title="Video Title"
              value={form.title}
              placeholder="Give your video a catchy title..."
              handleChangeText={(e) => setForm({ ...form, title: e })}
              otherStyles="mb-4"
            />

            <View className="mb-4">
              <Text className="text-base text-gray-100 font-pmedium mb-2">
                Upload Video
              </Text>

              <TouchableOpacity onPress={() => openPicker("video")}>
                {form.video ? (
                  <Video
                    source={{ uri: form.video.uri }}
                    className="w-full h-32 rounded-2xl"
                    useNativeControls
                    resizeMode={ResizeMode.COVER}
                    isLooping
                  />
                ) : (
                  <View className="w-full h-32 px-4 bg-black-100 rounded-2xl border border-black-200 flex justify-center items-center">
                    <View className="w-10 h-10 border border-dashed border-secondary-100 flex justify-center items-center">
                      <Image
                        source={icons.upload}
                        resizeMode="contain"
                        alt="upload"
                        className="w-1/2 h-1/2"
                      />
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-base text-gray-100 font-pmedium mb-2">
                Thumbnail Image
              </Text>

              <TouchableOpacity onPress={() => openPicker("image")}>
                {form.thumbnail ? (
                  <Image
                    source={{ uri: form.thumbnail.uri }}
                    resizeMode="cover"
                    className="w-full h-32 rounded-2xl"
                  />
                ) : (
                  <View className="w-full h-12 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                    <Image
                      source={icons.upload}
                      resizeMode="contain"
                      alt="upload"
                      className="w-5 h-5"
                    />
                    <Text className="text-sm text-gray-100 font-pmedium">
                      Choose a file
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <FormField
              title="AI Prompt"
              value={form.prompt}
              placeholder="The AI prompt of your video...."
              handleChangeText={(e) => setForm({ ...form, prompt: e })}
              otherStyles="mb-4"
            />
          </View>

          <CustomButton
            title="Submit & Publish"
            handlePress={submit}
            containerStyles="mt-4"
            isLoading={uploading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Create;
