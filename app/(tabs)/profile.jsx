import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../context/GlobalProvider";

import InfoBox from "../../components/InfoBox";
import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";
import useAppwrite from "../../lib/useAppwrite";
import { getUserPosts } from "../../lib/appwrite";
import { icons } from "../../constants";

const Profile = () => {
  const { user, setUser, setIsLoggerIn } = useGlobalContext();
  const { data: posts } = useAppwrite(() => getUserPosts(user.$id));

  const logout = () => {
    // Implement logout functionality here
  };

  const renderVideoCard = ({ item }) => (
    <VideoCard
      title={item.title}
      creator={item.creator.username}
      avatar={item.creator.avatar}
      thumbnail={item.thumbnail}
      video={item.video}
    />
  );

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={renderVideoCard}
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              onPress={logout}
              className="flex w-full items-end mb-10"
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <View className="mt-5 flex flex-row">
              <InfoBox
                title={posts?.length || 0}
                subtitle="Posts"
                titleStyles="text-xl"
                containerStyles="mr-10"
              />
              <InfoBox
                title="150k"
                subtitle="Followers"
                titleStyles="text-xl"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="You haven't uploaded any videos yet"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
