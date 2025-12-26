import React, { useState } from "react";
import { toast } from '../utils/notification';

export default function VoiceSearch({ onSearch, onResult }) {

  const [listening, setListening] = useState(false);

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Your browser does not support Voice Recognition");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;

    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      let text = event.results[0][0].transcript;

      // Remove trailing periods and trims whitespace
      text = text.replace(/\.$/, "").trim();

      const handler = onSearch || onResult;
      if (typeof handler === 'function') handler(text);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  return (
    <button
      onClick={startListening}
      className="p-2 px-4 bg-blue-500 text-white rounded-lg"
    >
      {listening ? "Listening..." : "🎤 Voice Search"}
    </button>
  );
}
