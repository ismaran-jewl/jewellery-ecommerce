"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function PublicMessagePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    const url = searchParams.get("url");
    const type = searchParams.get("type");

    if (url && (type === "video" || type === "audio")) {
      // Basic transformation for Google Drive URL to make it embeddable
      // e.g., https://drive.google.com/file/d/FILE_ID/view -> https://drive.google.com/file/d/FILE_ID/preview
      const embeddableUrl = url.replace("/view", "/preview");
      setMediaUrl(embeddableUrl);
      setMediaType(type);
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const Modal = ({ children }) => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={closeModal}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
          maxWidth: "90vw",
          maxHeight: "90vh",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <button
          onClick={closeModal}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            background: "transparent",
            border: "none",
            fontSize: "1.8rem",
            cursor: "pointer",
            color: "#333",
          }}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );

  return (
    <div>
      {isModalOpen && (
        <Modal>
          {mediaType === "video" && (
            <iframe
              src={mediaUrl}
              width="800"
              height="600"
              allow="autoplay"
              style={{ border: 0, maxWidth: "85vw", maxHeight: "80vh", borderRadius: '8px' }}
              title="Google Drive Video"
            ></iframe>
          )}
          {mediaType === "audio" && (
             <iframe
              src={mediaUrl}
              width="800"
              height="200"
              allow="autoplay"
              style={{ border: 0, maxWidth: "85vw", borderRadius: '8px' }}
              title="Google Drive Audio"
            ></iframe>
          )}
        </Modal>
      )}
    </div>
  );
}