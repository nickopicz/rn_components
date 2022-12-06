/**
 *
 *   |\\  ||    ||\\\\
 *   ||\\ ||    ||
 *   || \\||    ||
 *   ||  \||    ||////
 *
 *   ------This file was created, authored, currently owned and all rights belong to the author NC------
 *
 *                                  Author: Nicholas Ciraulo
 */

import { SafeAreaView, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { Colors } from "../Constants";
import { Overlay } from "react-native-elements";

export const CustomSplashScreen = () => (
  <SafeAreaView style={styles.container}>
    <Overlay overlayStyle={styles.overlay} isVisible={true} fullScreen={true}>
      <LottieView
        autoPlay
        resizeMode="cover"
        style={styles.animation}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={require("../assets/lottie/load_audio.json")}
      />
    </Overlay>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.black,
    opacity: 0.8,
  },
  animation: {
    width: 500,
    height: 350,
  },
  overlay: {
    opacity: 0.8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.night,
  },
});
