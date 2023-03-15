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
        setIsPlaying(false);
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
        <button style={styles.audioButtons} text="▶️" onTap={play} />
      )}
      {isPlaying && (
        <button style={styles.audioButtons} text="⏸" onTap={pause} />
      )}
    </>
  );
};

export default AudioPlayerComponent;
