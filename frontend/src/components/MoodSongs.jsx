import React, { useEffect, useRef } from "react";
import "./MoodSongs.css";

const MoodSongs = ({ Songs }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (Songs.length > 0 && audioRef.current) {
      audioRef.current.src = Songs[0].audio;
      audioRef.current.play().catch(() =>
        console.log("Autoplay blocked - user gesture required")
      );
    }
  }, [Songs]);


  return (
    <div className="mood-songs">
      <h2>Recommended Songs</h2>

      {/* Main audio player */}
      <audio ref={audioRef}  />

      {/* Songs list */}
      {Songs.map((song, index) => (
        <div key={index} className="song-card">

          <div className="title">
            <h3>{song.title}</h3>
            <p>{song.artist}</p>
          </div>

          <div className="play-pause-button">
            <i
              className="ri-play-fill"
              style={{ cursor: "pointer", fontSize: "24px" }}
              onClick={() => {
                audioRef.current.src = song.audio;
                audioRef.current.play();
              }}
            ></i>

            <i
              className="ri-pause-line"
              style={{ cursor: "pointer", fontSize: "24px" }}
              onClick={() => audioRef.current.pause()}
            ></i>
          </div>

        </div>
      ))}
    </div>
  );
};

export default MoodSongs;