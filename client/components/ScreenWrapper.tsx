import React from "react";
import {
  View,
  StyleSheet,
  ViewStyle,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
  statusBarColor?: string;
  statusBarStyle?: "light-content" | "dark-content";
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  backgroundColor = "#FFFFFF",
  statusBarColor,
  statusBarStyle = "dark-content",
}) => {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar
        backgroundColor={statusBarColor || backgroundColor}
        barStyle={statusBarStyle}
      />
      <View style={[styles.content, style]}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
  },
});

export default ScreenWrapper;
