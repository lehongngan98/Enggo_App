import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ApiChannel } from "../../../api/ApiVideo";
import { appInfo } from "../../../constants/appInfos";

const ChannelScreen = ({ navigation }) => {
  // const API_KEY = "AIzaSyBbI6fO7DrTmpRYh3NwXGaXLWSr04ysY2g"; //api key cua anh da` :))
  const API_KEY = "AIzaSyD6InaX9MSCEigdalQJRw5g8qmMRllOhBE"; //api key cua vchanh406
  // const API_KEY = "AIzaSyAV0MOQtzTpPHwQqXf4E4YbTJrLV8lT0kg"; //api key cua vanchanh0730

  const [videosByChannel, setVideosByChannel] = useState({});
  const [channelInfo, setChannelInfo] = useState({});
  const [listChannelId, setListChannelId] = useState([]);

  const videoCache = {}; // Cache dữ liệu của từng kênh


  useEffect(() => {
    fetchChannelId();
  }, []);


  const fetchChannelId = async () => {
    try {
      const response = await fetch(
        `${appInfo.Host_URL}/api/channels`
      );
      const data = await response.json();      
      data.data.map((item) => {          
        fetchVideos(item.channelId) // 
      });
      
    } catch (error) {
      console.error("Error fetching YouTube data:", error);
    }
  };



  const fetchVideos = async (channelId) => {
    const cachedData = videoCache[channelId];
    const now = Date.now();

    // Kiểm tra cache
    if (cachedData && now - cachedData.timestamp < 6000000) {
      console.log(`Using cached data for channelId: ${channelId}`);
      setVideosByChannel((prevState) => ({
        ...prevState,
        [channelId]: cachedData.data,
      }));
      return;
    }

    try {
      // Fetch videos from YouTube API
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=5`
      );
      const data = await response.json();

      setVideosByChannel((prevState) => ({
        ...prevState,
        [channelId]: data.items,
      }));

      videoCache[channelId] = {
        data: data.items,
        timestamp: now,
      };

      // Fetch channel info
      const channelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${API_KEY}`
      );
      const channelData = await channelResponse.json();

      if (channelData.items && channelData.items.length > 0) {
        setChannelInfo((prevState) => ({
          ...prevState,
          [channelId]: {
            title: channelData.items[0].snippet.title,
            avatar: channelData.items[0].snippet.thumbnails.default.url,
          },
        }));
      }
    } catch (error) {
      console.error("Error fetching YouTube data:", error);
    }
  };



  const renderChannel = ({ item }) => {
    const { title, thumbnails, channelId } = item.snippet;
    const channel = channelInfo && channelInfo[channelId];

    // Ensure that both `channel` and `videosByChannel[channelId]` are defined
    if (!channel || !videosByChannel[channelId]) {
      return null;
    }

    return (
      <View>
        <View
          style={{
            width: 250,
            height: 200,
            borderBottomWidth: 1,
            borderColor: "#d0d0d0",
          }}
        >
          <TouchableOpacity
            style={{
              height: "100%",
              width: 250,
            }}
            onPress={() =>
              navigation.navigate("VideoSettingChannel", {
                data: item,
              })
            }
          >
            <View
              style={{
                flex: 6.5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: thumbnails.medium.url }} // Thumbnail
                style={{
                  width: "95%",
                  height: "95%",
                  resizeMode: "contain",
                }}
              />
            </View>
            <View style={{ flex: 3.5 }}>
              <Text
                style={{
                  fontWeight: 500,
                  fontSize: 15,
                  marginHorizontal: 12,
                  paddingTop: 5,
                }}
              >
                {title}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      {ApiChannel.map((channel, index) => {
        const info = channelInfo[channel.channelId]; // Get channel info
        if (!info) {
          return null; // Ensure that the channel info is available
        }

        return (
          <View
            key={index}
            style={{
              width: "100%",
              height: 275,
            }}
          >
            {/* Show avatar and channel name */}
            <View style={{ flex: 2, flexDirection: "row" }}>
              <View
                style={{
                  flex: 7.5,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: info.avatar }} // Channel avatar
                  style={{
                    width: 40,
                    height: 40,
                    resizeMode: "contain",
                    marginLeft: 15,
                    marginTop: 5,
                    borderRadius: 20,
                  }}
                />
                <Text
                  style={{
                    fontWeight: 600,
                    fontSize: 17,
                    marginLeft: 10,
                    marginTop: 5,
                  }}
                >
                  {info.title} {/* Channel name */}
                </Text>
              </View>
              <View style={{ flex: 2.5, justifyContent: "center" }}>
                <TouchableOpacity
                  style={{
                    flex: 2.7,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 5,
                  }}
                  onPress={() =>
                    navigation.navigate("ListVideoOfChannel", {
                      data: videosByChannel[channel.channelId],
                    })
                  }
                >
                  <Text style={{ fontSize: 16, color: "gray" }}>Xem thêm</Text>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Show video list */}
            <View style={{ flex: 8 }}>
              <FlatList
                data={videosByChannel[channel.channelId]} // Ensure data exists
                renderItem={({ item }) => renderChannel({ item })} // Pass item to renderChannel
                keyExtractor={(item) => item.id.videoId}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default ChannelScreen;

const styles = StyleSheet.create({
  videoItem: {
    marginBottom: 20,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  thumbnail: {
    width: "100%",
    height: 180,
  },
  videoDescription: {
    fontSize: 14,
    color: "gray",
    marginVertical: 5,
  },
});
