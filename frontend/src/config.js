// frontend/src/config.js

const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://moody-player-lh7w.onrender.com"; // your Render backend

export default API_BASE_URL;
