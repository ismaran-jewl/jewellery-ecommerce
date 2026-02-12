"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

export default function VoiceGiftPage() {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      chunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
      chunksRef.current = [];
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div className="min-h-screen bg-black text-[#C59D5F] flex flex-col items-center justify-center px-6">

      <h1 className="text-4xl font-bold mb-8 text-center">
        Record Your Special Message 🎤
      </h1>

      <div className="space-x-4">
        {!recording ? (
          <Button
            onClick={startRecording}
            className="bg-[#C59D5F] text-black"
          >
            Start Recording
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            className="bg-red-600 text-white"
          >
            Stop Recording
          </Button>
        )}
      </div>

      {audioURL && (
        <div className="mt-8">
          <p className="mb-4 text-center">Preview Your Message:</p>
          <audio controls src={audioURL} className="mx-auto" />
        </div>
      )}

    </div>
  );
}
