import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import "./facial-expression.css";
import axios from "axios";

// Correct backend URL
const API_URL = "https://moody-player-backend.onrender.com";

export default function FacialExpression({ setSongs }) {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [cameraOn, setCameraOn] = useState(false);
  const [mood, setMood] = useState("");

  // Load face detection models
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
      console.log("✔ Face Models Loaded");
    };
    loadModels();
  }, []);

  // Camera toggle
  const toggleCamera = async () => {
    if (cameraOn) {
      const stream = videoRef.current.srcObject;
      if (stream) stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setCameraOn(false);
      console.log("📷 Camera Off");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setCameraOn(true);
      console.log("📷 Camera On");
    } catch (err) {
      console.error("Camera Error:", err);
    }
  };

  // Mood detection + backend fetch
  const detectMood = async () => {
    if (!cameraOn) return alert("Please turn on the camera!");

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (detections.length === 0) {
      setMood("neutral");
      return;
    }

    const expressions = detections[0].expressions;

    // Pick the highest-confidence expression
    const detectedMood = Object.keys(expressions).reduce((a, b) =>
      expressions[a] > expressions[b] ? a : b
    );

    const finalMood = ["happy", "sad", "neutral"].includes(detectedMood)
      ? detectedMood
      : "neutral";

    setMood(finalMood);
    console.log("🎭 Mood:", finalMood);

    // Fetch song list from backend
    try {
      const res = await axios.get(`${API_URL}/songs?mood=${finalMood}`);
      console.log("🎶 Songs:", res.data.songs);
      setSongs(res.data.songs || []);
    } catch (err) {
      console.error("❌ API Song Fetch Error:", err.message);
    }
  };

  return (
    <div className="mood-element">
      <video
        ref={videoRef}
        autoPlay
        muted
        className="user-video-feed"
        style={{ width: "720px", height: "560px", borderRadius: "10px" }}
      />

      <canvas
        ref={canvasRef}
        width={720}
        height={560}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          background: "transparent",
        }}
      />

      <div className="controls">
        <button onClick={toggleCamera} className="btn">
          {cameraOn ? "Turn Off Camera" : "Turn On Camera"}
        </button>

        <button onClick={detectMood} className="btn detect">
          Detect Mood
        </button>

        {mood && (
          <p className="mood-text">
            🎧 Current Mood: <strong>{mood}</strong>
          </p>
        )}
      </div>
    </div>
  );
}// force netlify rebuild

