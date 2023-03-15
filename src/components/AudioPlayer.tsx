import React, { useState } from "react";
import { TNSPlayer } from "nativescript-audio";
import { Application } from "@nativescript/core";
import styles from "./styles";

const AudioPlayerComponent: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [player, setPlayer] = useState<TNSPlayer | null>(null);

  const platformExtension = () => {
    return `${Application.android ? "m4a" : "caf"}`;
  };

  const play = () => {
    const newPlayer = new TNSPlayer();

    newPlayer.playFromFile({
      audioFile: `~/audio/recording.${platformExtension()}`,
      loop: false,
      completeCallback: function () {
        console.log("Playback completed!");
        setIsPlaying(false);
      },
      errorCallback: function (errorObject) {
        console.log(JSON.stringify(errorObject));
      },
      infoCallback: function (args) {
        console.log(JSON.stringify(args));
      },
    });
    setIsPlaying(true);
    setPlayer(newPlayer);
  };

  const pause = () => {
    player?.pause();
    setIsPlaying(false);
  };

  return (
    <>
      {!isPlaying && (
        <button style={styles.audioButtons} text="Play" onTap={play} />
      )}
      {isPlaying && (
        <button style={styles.audioButtons} text="Pause" onTap={pause} />
      )}
    </>
  );
};

export default AudioPlayerComponent;
