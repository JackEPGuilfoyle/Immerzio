import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "./firebase";

function ScanPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [scannedPages, setScannedPages] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (cameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraOpen]);

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
        },
      });

      streamRef.current = stream;
      setCameraOpen(true);
      setMessage("");
    } catch (error) {
      console.error("Could not access camera:", error);
      setMessage("Could not access the camera.");
    }
  };

  const scanPage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob(
      async (blob) => {
        if (!blob) return;

        const formData = new FormData();
        formData.append("image", blob, "page.jpg");

        try {
          setMessage("Scanning page...");

          const response = await fetch(
            `https://immerzio-backend--immerzio-2.europe-west4.hosted.app/api/scan/${bookId}`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error("Failed to scan page");
          }

          const data = await response.json();

          setScannedPages((prev) => [...prev, data.text]);
          setMessage("");
        } catch (error) {
          console.error("Could not send image:", error);
          setMessage("Could not scan the page.");
        }
      },
      "image/jpeg"
    );
  };

  const finishScanning = async () => {
    if (scannedPages.length === 0) {
      setMessage("Scan at least one page first.");
      return;
    }

    try {
      setProcessing(true);
      setMessage("Processing your pages...");

      const user = auth.currentUser;

      if (!user) {
        console.error("No user is signed in");
        setMessage("You must be signed in.");
        return;
      }

      const token = await user.getIdToken();

      const response = await fetch(
        `https://immerzio-backend--immerzio-2.europe-west4.hosted.app/api/process/${bookId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            pages: scannedPages,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to process scanned pages");
      }

      const data = await response.json();

      console.log("Processing result:", data);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      navigate(`/book/${bookId}`);
    } catch (error) {
      console.error("Could not process scanned pages:", error);
      setMessage("Could not process the scanned pages.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="scan-page">

      <div className="page-header">
        <button
          className="back-button"
          onClick={() => navigate(`/book/${bookId}`)}
        >
          ← Back
        </button>

        <h1>Scan Pages</h1>

        <p>
          Capture the pages you want to learn from.
        </p>
      </div>

      {message && (
        <p className="scan-message">
          {message}
        </p>
      )}

      {!cameraOpen && (
        <button
          className="primary-button"
          onClick={openCamera}
        >
          Open Camera
        </button>
      )}

      {cameraOpen && (
        <div className="scan-interface">

          <div className="camera-container">
            <video
              ref={videoRef}
              className="scan-video"
              autoPlay
              playsInline
              muted
            />
          </div>

          <button
            className="primary-button"
            onClick={scanPage}
            disabled={processing}
          >
            Scan Page
          </button>

          <p className="scan-count">
            {scannedPages.length}{" "}
            {scannedPages.length === 1 ? "page" : "pages"} scanned
          </p>

          <button
            className="secondary-button"
            onClick={finishScanning}
            disabled={processing}
          >
            {processing ? "Processing..." : "Finish Scanning"}
          </button>

          <canvas
            ref={canvasRef}
            style={{ display: "none" }}
          />

        </div>
      )}

    </div>
  );
}

export default ScanPage;