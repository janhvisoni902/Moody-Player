import React, { useState } from "react";
import FacialExpression from "./components/facial-expression";
import MoodSongs from "./components/MoodSongs";
import "./App.css";

function App() {
  const [songs, setSongs] = useState([]);
  const [currentMood, setCurrentMood] = useState("neutral");
  const [view, setView] = useState("scanner"); // "scanner" or "playlist"

  return (
    <div className="App">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="nav-logo">
          <i className="ri-stairs-line" style={{ color: "var(--accent-cyan)", fontSize: "24px", transform: "rotate(-90deg)" }}></i>
          <h2>Mood Scanner</h2>
        </div>
      </nav>

      <div className="app-container">
        {/* Back Button */}
        <div className="back-button-container">
          <button className="back-btn" onClick={() => setView("scanner")}>
            <i className="ri-arrow-left-line"></i> Back
          </button>
        </div>

        <main className="main-content">
          {view === "scanner" ? (
            <FacialExpression 
              setSongs={setSongs} 
              setAppMood={setCurrentMood} 
              onGeneratePlaylist={() => setView("playlist")} 
            />
          ) : (
            <MoodSongs Songs={songs} currentMood={currentMood} />
          )}
        </main>
        
        {/* Footer */}
        <footer className="app-footer">
          <p>© 2024 AI Mood Scanner. Experience music like never before.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
