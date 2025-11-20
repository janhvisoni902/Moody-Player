import React, { useState } from "react";
import FacialExpression from "./components/facial-expression";
import MoodSongs from "./components/MoodSongs"; // import the external one
import "./App.css";

function App() {
  // Shared songs state
  const [songs, setSongs] = useState([

  ]);

  return (
    <div className="App">
      <FacialExpression setSongs={setSongs} />

      <MoodSongs Songs={songs} />
    </div>
  );
}

export default App;
