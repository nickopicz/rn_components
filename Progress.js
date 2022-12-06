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
import { ProgressBar } from "react-native-paper";

export default CustomProgress = (props) => (
  <ProgressBar
    style={props.style}
    progress={props.progress}
    color={props.color}
    visible={props.visible}
  />
);
