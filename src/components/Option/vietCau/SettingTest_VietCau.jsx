import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useState } from "react";
import { Appbar, PaperProvider } from "react-native-paper";
import { CheckBox } from "@rneui/themed";
import themeContext from "../../../context/themeContext";

const SettingTest_VietCau = ({ navigation, route }) => {
  const { dataVocab } = route.params;
  const { screenNavigation } = route.params;
  const theme = useContext(themeContext);

  const [isDocNgheSelected, setIsDocNgheSelected] = useState(0);
  const [isNghiaTuSelected, setIsNghiaTuSelected] = useState(0);

  const handleStart = () => {
    const settings = {
      type: isDocNgheSelected ? "nghe" : "doc",
      mode: isNghiaTuSelected ? "tu-nghia" : "nghia-tu", //cau - nghia
    };
    if (settings.type === "doc") {
      navigation.navigate("VietCau_Doc", {
        settings: settings,
        data: dataVocab,
        screenNavigation: screenNavigation,
      });
    } else {
      navigation.navigate("VietCau_Nghe", {
        settings: settings,
        data: dataVocab,
        screenNavigation: screenNavigation,
      });
    }
  };

  return (
    <PaperProvider>
      <Appbar.Header style={{ backgroundColor: "#2A7BD3" }}>
        <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
      </Appbar.Header>

      <View
        style={{
          flex: 1,
          backgroundColor: theme.background,
        }}
      >
        {/* setting test */}
        <View style={{ flex: 8 }}>
          <Text
            style={{
              fontSize: 18,
              marginTop: 25,
              marginLeft: 12,
              color: theme.color,
            }}
          >
            Cài đặt kiểm tra:
          </Text>

          {/* option read/listen */}
          <View
            style={{
              width: "100%",
              height: 70,
              borderWidth: 1,
              borderColor: "#D0D0D0",
              flexDirection: "row",
              marginTop: 15,
            }}
          >
            <View
              style={{
                flex: 1,
                borderRightWidth: 1,
                borderColor: "#D0D0D0",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* doc */}
              <CheckBox
                checked={isDocNgheSelected === 0}
                onPress={() => setIsDocNgheSelected(0)}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
              />
              <Text style={{ fontSize: 18, color: theme.color }}>Đọc</Text>
            </View>
            <View
              style={{
                flex: 1,
                borderColor: "gray",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* nghe */}
              <CheckBox
                checked={isDocNgheSelected === 1}
                onPress={() => setIsDocNgheSelected(1)}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
              />
              <Text style={{ fontSize: 18, color: theme.color }}>Nghe</Text>
            </View>
          </View>

          <View
            style={{
              marginTop: 15,
              width: "100%",
              height: 120,
            }}
          >
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flex: 1,
                  borderColor: "gray",
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 10,
                }}
              >
                {/* nghia - tu */}
                <CheckBox
                  checked={isNghiaTuSelected === 0}
                  onPress={() => setIsNghiaTuSelected(0)}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                />
                {isDocNgheSelected === 0 ? (
                  <Text style={{ fontSize: 18, color: theme.color }}>
                    Nghĩa - Từ
                  </Text>
                ) : (
                  <Text style={{ fontSize: 18, color: theme.color }}>
                    Chọn câu
                  </Text>
                )}
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flex: 1,
                  borderColor: "gray",
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 10,
                }}
              >
                {/* tu - nghia */}
                <CheckBox
                  checked={isNghiaTuSelected === 1}
                  onPress={() => setIsNghiaTuSelected(1)}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                />

                {isDocNgheSelected === 0 ? (
                  <Text style={{ fontSize: 18, color: theme.color }}>
                    Từ - Nghĩa
                  </Text>
                ) : (
                  <Text style={{ fontSize: 18, color: theme.color }}>
                    Chọn nghĩa
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* button */}
        <View style={{ flex: 2, alignItems: "center" }}>
          <TouchableOpacity
            style={{
              width: "80%",
              height: 60,
              borderRadius: 12,
              backgroundColor: "#F4C33A",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={handleStart}
          >
            <Text style={{ fontWeight: "bold", fontSize: 22 }}>Bắt đầu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </PaperProvider>
  );
};

export default SettingTest_VietCau;

const styles = StyleSheet.create({});
