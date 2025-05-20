import { useRouter } from "expo-router";
import { useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Image,
  Dimensions,
} from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import { PanGestureHandler, State } from "react-native-gesture-handler";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SWIPE_THRESHOLD = SCREEN_HEIGHT * 0.15; // Reduced threshold for easier swipe

export default function Index() {
  const router = useRouter();
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [blinkAnim]);

  const navigateToHome = () => {
    router.replace("/(tabs)");
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationY: gesture } = event.nativeEvent;

      if (gesture < -SWIPE_THRESHOLD) {
        // Swiped up enough - animate out and navigate
        Animated.timing(translateY, {
          toValue: -SCREEN_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }).start(navigateToHome);
      } else {
        // Not swiped enough - spring back
        Animated.spring(translateY, {
          toValue: 0,
          tension: 40,
          friction: 7,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  return (
    <ScreenWrapper backgroundColor="#000" statusBarStyle="light-content">
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.animated,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <View style={styles.overlay} />
          <View style={styles.content}>
            <Image
              source={require("../assets/images/adaptive-icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>
              Fall in Love with{"\n"}Coffee in Blissful Delight!
            </Text>
            <Text style={styles.subtitle}>
              Welcome to our cozy coffee corner, where every cup is a delightful
              for you.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={navigateToHome}
              activeOpacity={0.8}
            >
              <Animated.Text
                style={[styles.buttonText, { opacity: blinkAnim }]}
              >
                Swipe up to continue
              </Animated.Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  animated: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  content: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    alignItems: "center",
    paddingHorizontal: 24,
    height: "100%",
    display: "flex",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 48,
    alignItems: "center",
    width: "100%",
    maxWidth: 320,
  },
  buttonText: {
    color: "#000",
    fontSize: 17,
    fontWeight: "600",
  },
});
