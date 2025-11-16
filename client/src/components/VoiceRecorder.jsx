import React from "react";
import { AudioRecorder } from "react-audio-voice-recorder";
import "./VoiceRecorder.css";

const VoiceRecorder = ({ onRecordingComplete, onRecordingError }) => {
  const handleRecordingComplete = (blob) => {
    if (onRecordingComplete) {
      onRecordingComplete(blob);
    }
  };

  const handleRecordingError = (error) => {
    console.error("Recording error:", error);
    if (onRecordingError) {
      onRecordingError(error);
    }
  };

  return (
    <div className="voice-recorder">
      <AudioRecorder
        onRecordingComplete={handleRecordingComplete}
        onNotAllowedOrFound={handleRecordingError}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }}
        downloadOnSavePress={false}
        downloadFileExtension="webm"
      />
    </div>
  );
};

export default VoiceRecorder;
