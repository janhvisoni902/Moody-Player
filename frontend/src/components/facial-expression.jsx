import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import "./facial-expression.css";
import axios from "axios";

const API_URL = "https://moody-player-lh7w.onrender.com";

export default function FacialExpression({ setSongs, setAppMood, onGeneratePlaylist }) {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [cameraOn, setCameraOn] = useState(false);
  const [mood, setMood] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
      console.log("✔ Face Models Loaded");
    };
    loadModels();
  }, []);

  const toggleCamera = async () => {
    if (cameraOn) {
      const stream = videoRef.current.srcObject;
      if (stream) stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
      setCameraOn(false);
      setMood("");
      setConfidence(0);
      if (setAppMood) setAppMood("neutral");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setCameraOn(true);
    } catch (err) {
      console.error("Camera Error:", err);
    }
  };

  const scanMood = async () => {
    if (!cameraOn) return alert("Please turn on the camera first by clicking Retake Scan or turning on camera!");
    setIsScanning(true);

    try {
      const video = videoRef.current;
      // Simulate scanning delay for the animation effect
      await new Promise(r => setTimeout(r, 1500));

      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections.length === 0) {
        setMood("neutral");
        setConfidence(0);
        if (setAppMood) setAppMood("neutral");
        setIsScanning(false);
        return;
      }

      const expressions = detections[0].expressions;
      
      let highestAccuracy = 0;
      let detectedMood = '';

      Object.entries(expressions).forEach(([emotion, value]) => {
         if(value > highestAccuracy) {
             highestAccuracy = value;
             detectedMood = emotion;
         }
      });

      const finalMood = ["happy", "sad", "neutral"].includes(detectedMood)
        ? detectedMood
        : "neutral";

      setMood(finalMood);
      setConfidence(Math.round(highestAccuracy * 100));
      if (setAppMood) setAppMood(finalMood);
      
      const res = await axios.get(`${API_URL}/songs?mood=${finalMood}`);
      setSongs(res.data.songs || []);
      
    } catch (err) {
      console.error("SCAN ERROR:", err.message);
    } finally {
      setIsScanning(false);
    }
  };

  // Helper dictionary for the UI
  const moodDisplay = {
      'happy': { text: 'Joyful & Upbeat', icon: 'ri-emotion-laugh-line', vibes: 'Pop, Dance, Upbeat' },
      'sad': { text: 'Calm & Melancholy', icon: 'ri-emotion-sad-line', vibes: 'Acoustic, Lo-fi, Jazz' },
      'neutral': { text: 'Calm & Content', icon: 'ri-emotion-normal-line', vibes: 'Lo-fi, Ambient, Chill' },
      '': { text: 'Waiting...', icon: 'ri-emotion-normal-line', vibes: '...' }
  };

  const currentDisplay = moodDisplay[mood || ''];

  return (
    <div className="scanner-container">
      {/* Header section */}
      <div className="scanner-header">
        <h1>Face Mood Scanner</h1>
        <p>Align your face within the circle to start the analysis</p>
      </div>

      {/* Circular Camera View */}
      <div className="camera-circle-wrapper">
        <div className={`camera-circle ${isScanning ? 'scanning' : ''}`}>
          {!cameraOn && (
            <div className="camera-placeholder-image" onClick={toggleCamera}>
               <i className="ri-camera-3-line"></i>
               <p>Click to Enable Camera</p>
            </div>
          )}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={`video-feed ${cameraOn ? 'active' : ''}`}
          />
          {isScanning && <div className="scan-line"></div>}
        </div>
        
        {/* Status Pill Overlapping the Circle */}
        <div className="status-pill">
          <span className={`status-dot ${isScanning ? 'pulse' : ''}`}></span>
          {isScanning ? "Scanning Face..." : cameraOn ? "Ready to Scan" : "Camera Off"}
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="stats-row">
        <div className="stat-card">
          <i className={`${currentDisplay.icon} stat-icon`}></i>
          <h4>Mood Detected</h4>
          <p className="highlight-text">{currentDisplay.text}</p>
        </div>
        
        <div className="stat-card">
          <i className="ri-music-2-line stat-icon"></i>
          <h4>Matching Vibes</h4>
          <p>{currentDisplay.vibes}</p>
        </div>
        
        <div className="stat-card">
          <i className="ri-sparkling-fill stat-icon"></i>
          <h4>AI Confidence</h4>
          <p>{confidence}% Accuracy</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button 
          className="btn-primary-cyan" 
          onClick={onGeneratePlaylist}
          disabled={!mood || isScanning}
        >
          Generate Playlist <i className="ri-play-circle-line"></i>
        </button>
        <button 
          className="btn-secondary-outline" 
          onClick={cameraOn ? scanMood : toggleCamera}
          disabled={isScanning}
        >
          {cameraOn ? (mood ? "Retake Scan" : "Start Scan") : "Turn On Camera"}
        </button>
      </div>
    </div>
  );
}
