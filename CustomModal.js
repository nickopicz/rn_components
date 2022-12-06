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

import React, { forwardRef, useState } from "react";
import { Modal, View, StyleSheet, TouchableOpacity } from "react-native";
import Text from "./common/Text";
import { Colors } from "../Constants";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import Progress from "./Progress";
import { auth } from "../firebase/firebase";
import firebase from "firebase";
import { Audio } from "expo-av";
import { AndroidOutputFormat, IOSAudioQuality } from "expo-av/build/Audio";

const RecordingOptions = {
  android: {
    audioEncoder: 0,
    extension: ".wav",
    outputFormat: AndroidOutputFormat.MPEG_4,
  },
  ios: {
    audioQuality: IOSAudioQuality.HIGH,
    bitRate: 48000,
    extension: ".wav",
    numberOfChannels: 2,
    sampleRate: 48000,
  },
};

export const CustomModal = forwardRef(
  ({ footerData, visibility, onDismiss, onExitPress }, ref) => {
    const [pressed, setPressed] = useState(false);
    const [recording, setRecording] = useState(null);
    const [strgUri, setStrgUri] = useState("");
    const [progress, setProgress] = useState(0);
    const [sending, setSending] = useState(false);

    const sendToStorage = async (ref, len) => {
      console.log("reference and length: ", ref, len);

      const email = auth.currentUser.email;
      const userName = auth.currentUser.displayName;

      setProgress(0);
      setSending(true);

      console.log("location : ", strgUri);

      const response = await fetch(strgUri);
      const blob = await response.blob();
      firebase
        .storage()
        .ref("audio")
        .child(email + "/replies/" + ref + len)
        .put(blob)
        .on(
          firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          function (snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (
              snapshot.bytesTransferred / snapshot.totalBytes
            ).toString();
            setProgress(progress);
            console.log("Upload is " + progress * 100 + "% done");
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log("Upload is paused");
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log("Upload is running");
                break;
            }
            console.log(progress);
          },
          function (error) {
            console.log(error);
          },
          async function () {
            let urlTemp = "";
            // Upload completed successfully, now we can get the download URL
            await firebase
              .storage()
              .ref("audio")
              .child(email + "/replies/" + ref + len)
              .getDownloadURL()
              .then((res) => {
                urlTemp = res;
              });
            console.log("result: ", urlTemp);

            // Upload completed successfully, now we can get the download URL
            let date = firebase.firestore.Timestamp.fromDate(new Date());
            console.log("time: ", date);
            const reference = firebase
              .firestore()
              .collection("posts")
              .doc(String(ref));
            reference.update({
              responds: firebase.firestore.FieldValue.arrayUnion({
                date: firebase.firestore.Timestamp.fromDate(new Date()),
                reply: urlTemp,
                user: userName,
                email: email,
              }),
            });
            setSending(false);
          },
          setStrgUri("")
        );
    };

    const startRecording = async () => {
      setPressed(true);
      try {
        console.log("Requesting permissions..");
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        console.log("Starting recording..");
        const { recording } = await Audio.Recording.createAsync(
          RecordingOptions
        );
        setRecording(recording);
        console.log("Recording started");
      } catch (err) {
        console.error("Failed to start recording", err);
      }
    };
    //finishes recording and saves it to local storage
    const stopRecording = async () => {
      setPressed(false);
      console.log("Stopping recording..");
      setRecording(undefined);
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      const uriTo = await recording.getURI();

      setStrgUri(uriTo);
    };

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visibility}
        onDismiss={onDismiss}
        ref={ref}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.exit} onPress={onExitPress}>
              <MaterialIcons
                name="transit-enterexit"
                size={45}
                color={Colors.dusk}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modal,
                pressed
                  ? { backgroundColor: Colors.clay }
                  : { backgroundColor: Colors.aegean },
              ]}
              onPressIn={() => startRecording()}
              onPressOut={() => stopRecording()}
            >
              <Text p2 u night style={styles.label}>
                Hold record
              </Text>

              <MaterialIcons
                style={styles.icon}
                name="record-voice-over"
                size={60}
                color={Colors.powder}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => sendToStorage(footerData[0], footerData[1])}
              style={styles.confirm}
              disabled={!strgUri}
            >
              <AntDesign name="pluscircle" size={30} color={Colors.dusk} />
            </TouchableOpacity>
          </View>
        </View>
        <Progress
          progress={progress}
          style={styles.progress}
          color={Colors.aegean}
          visible={sending}
        />
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    flex: 0.1,
    // margin: 20,
    backgroundColor: Colors.powder,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row",
    color: Colors.white,
    width: "80%",
  },
  exit: {
    alignSelf: "flex-start",
    marginLeft: 3,
    position: "absolute",
    marginTop: -1,
  },
  confirm: {
    alignSelf: "flex-start",
    marginLeft: 275,
    position: "absolute",
    marginTop: 100,
  },
  label: {
    alignSelf: "flex-start",
    marginTop: 20,
    paddingRight: 10,
  },
  icon: { alignSelf: "flex-end" },
  progress: {
    height: 8,
    alignSelf: "flex-start",
    marginBottom: 69,
    // marginTop: 10,
  },
  modal: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
});
