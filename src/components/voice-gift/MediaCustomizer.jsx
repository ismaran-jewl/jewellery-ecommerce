"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, 
  Video, 
  Image as ImageIcon, 
  Trash2, 
  Play, 
  Square, 
  Pause, 
  Upload, 
  Camera, 
  CheckCircle2, 
  X,
  Volume2,
  Film
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MediaCustomizer({ onUpdate, value }) {
  const [activeTab, setActiveTab] = useState("audio");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioURL, setAudioURL] = useState(value?.audio || null);
  const [videoURL, setVideoURL] = useState(value?.video || null);
  const [imageURL, setImageURL] = useState(value?.picture || null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const videoPreviewRef = useRef(null);

  // Audio Recording Logic
  const startAudioRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      onUpdate({ ...value, audio: url });
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
    startTimer();
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    setIsRecording(false);
    stopTimer();
  };

  const startTimer = () => {
    setRecordingDuration(0);
    timerRef.current = setInterval(() => {
      setRecordingDuration(d => d + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Video Recording Logic
  const startVideoRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (videoPreviewRef.current) videoPreviewRef.current.srcObject = stream;
    
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const videoBlob = new Blob(audioChunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(videoBlob);
      setVideoURL(url);
      onUpdate({ ...value, video: url });
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
    startTimer();
  };

  // Image Upload Logic
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageURL(url);
      onUpdate({ ...value, picture: url });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-8">
        <h2 className="text-2xl font-serif font-bold text-[#1B4D3E] mb-2">Personalize with Media</h2>
        <p className="text-[#1B4D3E]/60">Capture a special moment. You can add one of each or combine them for a truly unique gift.</p>
      </div>

      <Tabs defaultValue="audio" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-max mx-auto bg-[#F5E6D3]/30 p-1 rounded-full mb-10">
          <TabsTrigger value="audio" className="rounded-full px-8 py-2 data-[state=active]:bg-[#1B4D3E] data-[state=active]:text-white">
            <Mic className="w-4 h-4 mr-2" /> Audio
          </TabsTrigger>
          <TabsTrigger value="video" className="rounded-full px-8 py-2 data-[state=active]:bg-[#1B4D3E] data-[state=active]:text-white">
            <Video className="w-4 h-4 mr-2" /> Video
          </TabsTrigger>
          <TabsTrigger value="picture" className="rounded-full px-8 py-2 data-[state=active]:bg-[#1B4D3E] data-[state=active]:text-white">
            <ImageIcon className="w-4 h-4 mr-2" /> Picture
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          {/* Audio Section */}
          <TabsContent key="audio-tab" value="audio" className="mt-0">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center p-8 bg-[#F0FDF4]/30 rounded-3xl border-2 border-dashed border-[#1B4D3E]/10">
              {audioURL ? (
                <div className="flex flex-col items-center gap-4 w-full">
                  <div className="w-16 h-16 bg-[#1B4D3E] text-white rounded-full flex items-center justify-center shadow-lg">
                    <Volume2 className="w-8 h-8" />
                  </div>
                  <audio src={audioURL} controls className="w-full max-w-md h-12" />
                  <Button variant="ghost" className="text-red-500" onClick={() => { setAudioURL(null); onUpdate({...value, audio: null}); }}>
                    <Trash2 className="w-4 h-4 mr-2" /> Remove & Re-record
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${isRecording ? "bg-red-500 animate-pulse scale-110 shadow-xl shadow-red-200" : "bg-[#1B4D3E] shadow-lg shadow-[#1B4D3E]/20"}`}>
                    <Mic className="w-10 h-10 text-white" />
                  </div>
                  {isRecording && <div className="text-2xl font-mono font-bold text-red-500">{formatTime(recordingDuration)}</div>}
                  <div className="flex gap-4">
                    {!isRecording ? (
                      <>
                        <Button onClick={startAudioRecording} className="bg-[#1B4D3E] hover:bg-[#143a2f] rounded-full px-8 py-6 h-auto">Record Voice Note</Button>
                        <div className="relative">
                          <input type="file" accept="audio/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                            const file = e.target.files[0];
                            if(file) {
                              const url = URL.createObjectURL(file);
                              setAudioURL(url);
                              onUpdate({...value, audio: url});
                            }
                          }} />
                          <Button variant="outline" className="border-[#1B4D3E] text-[#1B4D3E] rounded-full px-8 py-6 h-auto hover:bg-[#1B4D3E]/5">Upload Audio</Button>
                        </div>
                      </>
                    ) : (
                      <Button onClick={stopRecording} variant="destructive" className="rounded-full px-12 py-6 h-auto">Stop Recording</Button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Video Section */}
          <TabsContent key="video-tab" value="video" className="mt-0">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center p-8 bg-[#EFF6FF]/30 rounded-3xl border-2 border-dashed border-[#1B4D3E]/10">
              {videoURL ? (
                <div className="flex flex-col items-center gap-4 w-full">
                  <video src={videoURL} controls className="w-full max-w-md aspect-video rounded-xl shadow-xl" />
                  <Button variant="ghost" className="text-red-500" onClick={() => { setVideoURL(null); onUpdate({...value, video: null}); }}>
                    <Trash2 className="w-4 h-4 mr-2" /> Remove & Re-record
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6 w-full">
                  <div className="relative w-full max-w-md aspect-video bg-[#1B4D3E]/5 rounded-2xl flex items-center justify-center overflow-hidden border border-[#1B4D3E]/10">
                    {isRecording ? (
                      <video ref={videoPreviewRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
                    ) : (
                      <Film className="w-16 h-16 text-[#1B4D3E]/20" />
                    )}
                    {isRecording && <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-mono"><div className="w-2 h-2 bg-red-500 rounded-full animate-ping" /> {formatTime(recordingDuration)}</div>}
                  </div>
                  <div className="flex gap-4">
                    {!isRecording ? (
                      <>
                        <Button onClick={startVideoRecording} className="bg-[#1B4D3E] hover:bg-[#143a2f] rounded-full px-8 py-6 h-auto"><Camera className="w-4 h-4 mr-2" /> Start Recording</Button>
                        <div className="relative">
                          <input type="file" accept="video/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                             const file = e.target.files[0];
                             if(file) {
                               const url = URL.createObjectURL(file);
                               setVideoURL(url);
                               onUpdate({...value, video: url});
                             }
                          }} />
                          <Button variant="outline" className="border-[#1B4D3E] text-[#1B4D3E] rounded-full px-8 py-6 h-auto hover:bg-[#1B4D3E]/5"><Upload className="w-4 h-4 mr-2" /> Upload Video</Button>
                        </div>
                      </>
                    ) : (
                      <Button onClick={stopRecording} variant="destructive" className="rounded-full px-12 py-6 h-auto">Stop & Save</Button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Picture Section */}
          <TabsContent key="picture-tab" value="picture" className="mt-0">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center p-8 bg-[#FFF7ED]/30 rounded-3xl border-2 border-dashed border-[#1B4D3E]/10">
              {imageURL ? (
                <div className="flex flex-col items-center gap-4 w-full">
                  <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
                    <img src={imageURL} className="w-full h-full object-cover" />
                  </div>
                  <Button variant="ghost" className="text-red-500" onClick={() => { setImageURL(null); onUpdate({...value, picture: null}); }}>
                    <Trash2 className="w-4 h-4 mr-2" /> Remove & Choose Another
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6 py-12">
                  <div className="w-24 h-24 bg-[#FAF5F2] rounded-3xl flex items-center justify-center border-2 border-[#1B4D3E]/5">
                    <ImageIcon className="w-12 h-12 text-[#1B4D3E]/20" />
                  </div>
                  <div className="relative">
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                    <Button className="bg-[#1B4D3E] hover:bg-[#143a2f] rounded-full px-12 py-8 h-auto flex flex-col gap-1 items-center">
                      <span className="text-lg">Upload Picture</span>
                      <span className="text-xs opacity-60 font-normal">JPG, PNG or WEBP (Max 5MB)</span>
                    </Button>
                  </div>
                  <p className="text-[#1B4D3E]/40 text-sm">This picture will be featured on the card cover</p>
                </div>
              )}
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
