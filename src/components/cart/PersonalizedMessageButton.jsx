import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Video, Upload, X, Square, Save, Trash2, MessageSquarePlus, FileAudio, Check, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PersonalizedMessageButton = ({ onMessageSaved, initialMessage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState('initial'); // initial, record-select, recording, uploading, preview
  const [mediaType, setMediaType] = useState(null); // 'audio' or 'video'
  const [isRecording, setIsRecording] = useState(false);
  const [mediaBlob, setMediaBlob] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [savedMedia, setSavedMedia] = useState(initialMessage || null);
  
  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      cleanupStream();
    };
  }, []);

  useEffect(() => {
    setSavedMedia(initialMessage || null);
  }, [initialMessage]);

  const cleanupStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleStartRecording = async (type) => {
    try {
      cleanupStream();
      const constraints = type === 'video' ? { video: true, audio: true } : { audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (type === 'video' && videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: type === 'video' ? 'video/webm' : 'audio/webm' });
        setMediaBlob(blob);
        setMediaUrl(URL.createObjectURL(blob));
        setStep('preview');
        cleanupStream();
      };

      mediaRecorder.start();
      setIsRecording(true);
      setMediaType(type);
      setStep('recording');
    } catch (err) {
      console.error("Error accessing media devices:", err);
      alert("Could not access microphone/camera. Please check permissions.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMediaBlob(file);
      setMediaUrl(URL.createObjectURL(file));
      setMediaType(file.type.startsWith('video') ? 'video' : 'audio');
      setStep('preview');
    }
  };

  const handleSave = () => {
    if (onMessageSaved && mediaBlob) {
      onMessageSaved(mediaBlob, mediaType);
      setSavedMedia({ url: mediaUrl, type: mediaType });
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setStep('initial');
    setMediaBlob(null);
    setMediaUrl(null);
    setIsRecording(false);
    cleanupStream();
  };

  const handleViewSaved = () => {
    if (savedMedia) {
      setMediaUrl(savedMedia.url);
      setMediaType(savedMedia.type);
      setStep('view-saved');
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {savedMedia ? (
        <div className="flex gap-2">
          <Button 
            className="h-8 bg-[#C59D5F] hover:bg-[#a88550] text-white px-3 text-xs"
            onClick={() => setIsModalOpen(true)}
            title="Edit Message"
          >
            <Check className="w-3 h-3 mr-1" /> Message Added
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 border-[#C59D5F] text-[#C59D5F] hover:bg-[#C59D5F] hover:text-white"
            onClick={handleViewSaved}
            title="View Recorded Message"
          >
            <Play className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <Button 
          variant="outline" 
          size="icon"
          className="h-8 w-8 text-[#C59D5F] border-[#C59D5F] hover:bg-[#C59D5F] hover:text-white transition-colors"
          onClick={() => setIsModalOpen(true)}
          title="Add Personalized Message"
        >
          <motion.div
              animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
              }}
          >
              <MessageSquarePlus className="w-4 h-4" />
          </motion.div>
        </Button>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#fffaf6]">
                    <h3 className="font-serif font-bold text-[#2d1a10] text-lg">Personalize Your Gift</h3>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100" onClick={closeModal}>
                        <X className="w-4 h-4 text-gray-500" />
                    </Button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {step === 'initial' && (
                        <div className="grid gap-4">
                            <p className="text-center text-[#7c6a58] mb-2">Choose how you want to add your message:</p>
                            <Button variant="outline" className="h-14 justify-start gap-3 text-lg font-medium hover:border-[#C59D5F] hover:text-[#C59D5F]" onClick={() => setStep('record-select')}>
                                <Mic className="w-5 h-5" /> Record Message
                            </Button>
                            <Button variant="outline" className="h-14 justify-start gap-3 text-lg font-medium hover:border-[#C59D5F] hover:text-[#C59D5F]" onClick={() => setStep('uploading')}>
                                <Upload className="w-5 h-5" /> Upload File
                            </Button>
                        </div>
                    )}

                    {step === 'record-select' && (
                        <div className="grid gap-4">
                            <p className="text-center text-[#7c6a58] mb-2">Select recording type:</p>
                            <Button variant="outline" className="h-14 justify-start gap-3 text-lg font-medium hover:border-[#C59D5F] hover:text-[#C59D5F]" onClick={() => handleStartRecording('audio')}>
                                <Mic className="w-5 h-5" /> Record Voice
                            </Button>
                            <Button variant="outline" className="h-14 justify-start gap-3 text-lg font-medium hover:border-[#C59D5F] hover:text-[#C59D5F]" onClick={() => handleStartRecording('video')}>
                                <Video className="w-5 h-5" /> Record Video
                            </Button>
                            <Button variant="ghost" onClick={() => setStep('initial')}>Back</Button>
                        </div>
                    )}

                    {step === 'recording' && (
                        <div className="flex flex-col items-center gap-6">
                            {mediaType === 'video' ? (
                                <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                                    <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2 flex items-center gap-2 bg-red-500/80 text-white px-2 py-1 rounded-full text-xs animate-pulse">
                                        <div className="w-2 h-2 bg-white rounded-full" /> Recording
                                    </div>
                                </div>
                            ) : (
                                <div className="w-32 h-32 bg-red-50 rounded-full flex items-center justify-center animate-pulse">
                                    <Mic className="w-12 h-12 text-red-500" />
                                </div>
                            )}
                            
                            <div className="text-center space-y-4">
                                <p className="text-[#2d1a10] font-medium animate-pulse">Recording in progress...</p>
                                <Button variant="destructive" size="lg" className="rounded-full px-8" onClick={handleStopRecording}>
                                    <Square className="w-4 h-4 mr-2 fill-current" /> Stop Recording
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 'uploading' && (
                        <div className="flex flex-col items-center gap-6 py-8">
                            <div 
                                className="w-full border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#C59D5F] hover:bg-[#fffaf6] transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="w-10 h-10 text-gray-400 mb-4" />
                                <p className="text-sm text-gray-600 font-medium">Click to upload audio or video</p>
                                <p className="text-xs text-gray-400 mt-1">MP4, WebM, MP3, WAV</p>
                            </div>
                            <input 
                                type="file" 
                                accept="audio/*,video/*" 
                                onChange={handleFileUpload} 
                                className="hidden" 
                                ref={fileInputRef}
                            />
                            <Button variant="ghost" onClick={() => setStep('initial')}>Back</Button>
                        </div>
                    )}

                    {(step === 'preview' || step === 'view-saved') && (
                        <div className="flex flex-col gap-6">
                            <div className="w-full bg-black rounded-lg overflow-hidden shadow-inner">
                                {mediaType === 'video' ? (
                                    <video src={mediaUrl} controls className="w-full max-h-[300px]" />
                                ) : (
                                    <div className="p-8 flex flex-col items-center justify-center bg-gray-50">
                                        <FileAudio className="w-12 h-12 text-[#C59D5F] mb-4" />
                                        <audio src={mediaUrl} controls className="w-full" />
                                    </div>
                                )}
                            </div>
                            
                            {step === 'preview' ? (
                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="outline" onClick={() => setStep('initial')} className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                                        <Trash2 className="w-4 h-4 mr-2" /> Discard
                                    </Button>
                                    <Button className="bg-[#2d1a10] hover:bg-[#4a2c1d] text-white" onClick={handleSave}>
                                        <Save className="w-4 h-4 mr-2" /> Save Message
                                    </Button>
                                </div>
                            ) : (
                                <Button className="w-full bg-[#2d1a10] hover:bg-[#4a2c1d] text-white" onClick={closeModal}>
                                    Close Preview
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PersonalizedMessageButton;
