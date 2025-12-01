import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import "./facial-expression.css";
import axios from "axios";

// Auto-switch backend URL (Local ↔ Render)
const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://moody-player-lh7w.onrender.com";

export default function FacialExpression({ setSongs }) {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [cameraOn, setCameraOn] = useState(false);
  const [mood, setMood] = useState("");

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      console.log("✔ Face Models Loaded");
    };
    loadModels();
  }, []);

  
  const toggleCamera = async () => {
    if (cameraOn) {
      const stream = videoRef.current.srcObject;
      if (stream) stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraOn(false);
      console.log("📷 Camera Off");
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        setCameraOn(true);
        console.log("📷 Camera On");
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    }
  };

  const detectMood = async () => {
    if (!cameraOn) return alert("Please turn on the camera first!");
  
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();
  
    if (detections.length === 0) {
      setMood("neutral");
      return;
    }
  
    let highest = 0;
    let expression = "neutral";
  
    for (const [key, value] of Object.entries(detections[0].expressions)) {
      if (value > highest) {
        highest = value;
        expression = key;
      }
    }
  
    const finalMood = ["happy", "sad", "neutral"].includes(expression)
      ? expression
      : "neutral";
  
    setMood(finalMood);
    console.log("🎭 Mood detected:", finalMood);
  
    axios
      .get(`${API_BASE_URL}/songs?mood=${finalMood}`)
      .then((res) => {
        console.log("🎶 Songs fetched:", res.data.songs);
        setSongs(res.data.songs || []);
      })
      .catch((err) => console.error("Song fetch error:", err.message));
  };
  

    const finalMood = ["happy", "sad", "neutral"].includes(expression)
      ? expression
      : "neutral";

    setMood(finalMood);
    console.log("🎭 Mood detected:", finalMood);

    axios
      .get(`${API_BASE_URL}/songs?mood=${finalMood}`)
      .then((res) => {
        console.log("🎶 Songs fetched:", res.data.songs);
        setSongs(res.data.songs || []);
      })
      .catch(err => console.error("Song fetch error:", err.message));
  };


  return (
    <div className='mood-element'>
      <video
        ref={videoRef}
        autoPlay
        muted
        crossOrigin="anonymous"
        className='user-video-feed'
        style={{ width: '720px', height: '560px', borderRadius: '10px' }}
      />

      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '720px',
          height: '560px',
          background: "transparent"
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

