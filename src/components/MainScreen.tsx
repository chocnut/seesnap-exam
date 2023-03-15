import React, { useEffect, useState } from "react";
import {
  SpeechRecognition,
  SpeechRecognitionTranscription,
} from "nativescript-speech-recognition";
import { AudioRecorderOptions, TNSRecorder } from "nativescript-audio";

import {
  Application,
  Dialogs,
  isAndroid,
  knownFolders,
} from "@nativescript/core";
import AudioPlayer from "./AudioPlayer";
import styles from "./styles";
import * as utils from "../utils";

const speechRecognition = new SpeechRecognition();
const recorder = new TNSRecorder();

function MainScreen() {
  const [voiceText, setVoiceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isMicAllowed, setIsMicAllowed] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);

  const checkPermission = async () => {
    const isGranted = await speechRecognition.requestPermission();
    setIsMicAllowed(isGranted);
  };

  const startListening = async (locale = "en-US") => {
    setVoiceText("");
    setTranslatedText("");
    setIsRecording(true);
    setShowAudioPlayer(false);

    await speechRecognition.startListening({
      locale,
      returnPartialResults: true,
      onResult: (transcription: SpeechRecognitionTranscription) => {
        if (transcription.finished) return;

        setVoiceText(transcription.text);
      },
    });

    if (!TNSRecorder.CAN_RECORD()) {
      Dialogs.alert("This device cannot record audio.");
      return;
    }

    const audioFolder = knownFolders.currentApp().getFolder("audio");

    let androidFormat: number | undefined;
    let androidEncoder: number | undefined;

    if (isAndroid) {
      androidFormat = 2;
      androidEncoder = 3;
    }

    const platformExtension = () => {
      return `${Application.android ? "m4a" : "caf"}`;
    };

    const recordingPath = `${
      audioFolder.path
    }/recording.${platformExtension()}`;

    const recorderOptions: AudioRecorderOptions = {
      filename: recordingPath,
      format: androidFormat,
      encoder: androidEncoder,
      metering: false,
    };

    await recorder.start(recorderOptions);
  };

  const translate = async () => {
    setIsTranslating(true);

    const translationText = await utils.translate(voiceText);
    setTranslatedText(translationText.translated_text.es);
    setIsTranslating(false);
  };

  const stopListening = async () => {
    await speechRecognition.stopListening();
    setIsRecording(false);
    await translate();

    await recorder.stop();
    setShowAudioPlayer(true);
  };

  useEffect(() => {
    checkPermission();
  }, []);

  return (
    <>
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
            <span style={styles.textContent}>
              {isTranslating ? "Translating..." : translatedText}
            </span>
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
        {showAudioPlayer ? <AudioPlayer /> : null}
      </stackLayout>
    </>
  );
}

export default MainScreen;
