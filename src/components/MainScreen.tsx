import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-nativescript";
import {
  SpeechRecognition,
  SpeechRecognitionTranscription,
} from "nativescript-speech-recognition";

const speechRecognition = new SpeechRecognition();

function MainScreen() {
  const [voiceText, setVoiceText] = useState("");
  const [isMicAllowed, setIsMicAllowed] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const checkPermission = async () => {
    const isGranted = await speechRecognition.requestPermission();
    setIsMicAllowed(isGranted);
  };

  const startListening = async (locale = "en-US") => {
    setVoiceText("");
    setIsRecording(true);
    await speechRecognition.startListening({
      locale,
      returnPartialResults: true,
      onResult: (transcription: SpeechRecognitionTranscription) => {
        if (transcription.finished) return;

        setVoiceText(transcription.text);
      },
    });
  };

  const stopListening = async () => {
    await speechRecognition.stopListening();
    setIsRecording(false);
  };

  useEffect(() => {
    checkPermission();
  }, []);

  return (
    <stackLayout>
      <flexboxLayout flexDirection="column" style={styles.textContainer}>
        <label style={styles.label}>Recorded Text</label>
        <textView editable={false} style={styles.textInput}>
          <span style={styles.textContent}>{voiceText}</span>
        </textView>
      </flexboxLayout>
      <flexboxLayout flexDirection="column" style={styles.textContainer}>
        <label style={styles.label}>Translated Text</label>
        <textView editable={false} style={styles.textInput}>
          <span style={styles.textContent}></span>
        </textView>
      </flexboxLayout>

      <flexboxLayout justifyContent="center" style={styles.actionContainer}>
        {isMicAllowed ? (
          <button
            text={!isRecording ? "Record" : "Stop"}
            style={styles.button}
            onTap={() => (!isRecording ? startListening() : stopListening())}
          />
        ) : null}
      </flexboxLayout>
    </stackLayout>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: "16px 32px",
    background: "#DD3A16",
    borderRadius: "100px",
    width: 119,
    height: 51,
    color: "#FFFFFF",
    fontWeight: 600,
    fontSize: 16,
  },
  textContainer: {
    padding: "21px 27px 20px 24px",
  },
  textInput: {
    background: "#F6F6F6",
    border: "1px solid #E8E8E8",
    borderRadius: "8px",
    height: 157.8,
  },
  textContent: {
    fontWeight: 500,
    fontSize: 16,
    lineHeight: 19,
    color: "#000000",
  },
  label: {
    fontWeight: 400,
    fontSize: 14,
    color: "#666666",
    marginBottom: 10,
  },
  actionContainer: {
    paddingTop: 72,
  },
});

export default MainScreen;
