import React, { useEffect, useRef, useState } from "react";
import "./MoodSongs.css";

const MoodSongs = ({ Songs, currentMood }) => {
  const audioRef = useRef(null);
  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    if (Songs.length > 0 && audioRef.current) {
      audioRef.current.src = Songs[0].audio;
      audioRef.current.play().then(() => {
        setPlayingId(Songs[0]._id || 0);
      }).catch(() =>
        console.log("Autoplay blocked - user gesture required")
      );
    } else {
      setPlayingId(null);
    }
  }, [Songs]);

  const handlePlay = (song, index) => {
    const id = song._id || index;
    if (playingId === id) {
      audioRef.current.pause();
      setPlayingId(null);
    } else {
      audioRef.current.src = song.audio;
      audioRef.current.play();
      setPlayingId(id);
    }
  };

  const getMoodTitle = () => {
    switch(currentMood) {
      case 'happy': return 'Upbeat Tracks for You';
      case 'sad': return 'Comforting Melodies';
      default: return 'Recommended Songs';
    }
  };

  return (
    <div className="mood-songs-wrapper">
      <div className="playlist-header">
        <h2>{getMoodTitle()}</h2>
        <span className="track-count">{Songs.length} Tracks</span>
      </div>

      <audio ref={audioRef} onEnded={() => setPlayingId(null)} />

      <div className="songs-list">
        {Songs.length === 0 ? (
          <div className="empty-state">
            <i className="ri-music-2-line"></i>
            <p>Scan your mood to discover music</p>
          </div>
        ) : (
          Songs.map((song, index) => {
            const id = song._id || index;
            const isPlaying = playingId === id;
            
            return (
              <div key={id} className={`song-card ${isPlaying ? 'playing' : ''}`}>
                <div className="song-info">
                  <div className="song-icon">
                    {isPlaying ? (
                      <div className="equalizer">
                        <span></span><span></span><span></span>
                      </div>
                    ) : (
                      <i className="ri-music-fill"></i>
                    )}
                  </div>
                  <div className="title">
                    <h3>{song.title}</h3>
                    <p>{song.artist}</p>
                  </div>
                </div>

                <button 
                  className={`play-pause-btn ${isPlaying ? 'active' : ''}`}
                  onClick={() => handlePlay(song, index)}
                >
                  <i className={isPlaying ? "ri-pause-fill" : "ri-play-fill"}></i>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MoodSongs;