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
import { View, StyleSheet, ImageProps } from "react-native";
import Text from "./common/Text";
import { Card } from "react-native-elements";
import { Colors } from "../Constants";

export type Props = {
  title: string;
  imageSource: (params: any)=>any;
  textContent: string;

};

export const CardHolder: React.FC<Props> = ({ title, imageSource, textContent }) => {
  return (
    <Card containerStyle={styles.border}>
      <Card.Title>
        <Text h4 u white>
          {title}
        </Text>
      </Card.Title>
      <Card.Divider />
      <Card.Image source={imageSource} />
      <Text p1 white style={{ marginBottom: 10 }}>
        {textContent}
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  border: {
    backgroundColor: Colors.night,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.night,
    alignItems: "center",
    opacity: 0.8,
  },
});
