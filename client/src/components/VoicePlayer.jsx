import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

const VoicePlayer = ({ audioUrl, duration }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration || 0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setAudioDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audioDuration;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="voice-player">
      <audio ref={audioRef} src={audioUrl} />
      <button className="play-button" onClick={togglePlay}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
      <div className="progress-container" onClick={handleSeek}>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${(currentTime / audioDuration) * 100 || 0}%`,
            }}
          />
        </div>
        <div className="time-display">
          {formatTime(currentTime)} / {formatTime(audioDuration)}
        </div>
      </div>
      <style jsx>{`
        .voice-player {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          background: #f5f5f5;
          border-radius: 8px;
          min-width: 250px;
        }

        .play-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 50%;
          background: #2196f3;
          color: white;
          cursor: pointer;
          transition: background 0.2s;
        }

        .play-button:hover {
          background: #1976d2;
        }

        .progress-container {
          flex: 1;
          cursor: pointer;
        }

        .progress-bar {
          width: 100%;
          height: 4px;
          background: #ddd;
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 4px;
        }

        .progress-fill {
          height: 100%;
          background: #2196f3;
          transition: width 0.1s;
        }

        .time-display {
          font-size: 12px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default VoicePlayer;
