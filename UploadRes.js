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

import React from "react";
import { Image, View, StyleSheet } from "react-native";
import Text from "./common/text";

export const UploadGif = (props) => {
  return (
    <View style={styles.container}>
      <Image
        style={props.style}
        source={require("../assets/sound_upload.gif")}
      />
      <Text p4 aegean>
        {props.filename}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
});
