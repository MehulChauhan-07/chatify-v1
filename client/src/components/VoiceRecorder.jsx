import React from "react";
import { AudioRecorder } from "react-audio-voice-recorder";

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
      <style jsx>{`
        .voice-recorder {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default VoiceRecorder;
