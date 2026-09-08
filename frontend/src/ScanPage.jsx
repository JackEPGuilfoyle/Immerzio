import { useEffect, useRef, useState } from 'react';
import { useParams } from "react-router-dom";
import { auth } from "./firebase";

function ScanPage(){

  const { bookId } = useParams();
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const canvasRef = useRef(null)

  const [cameraOpen, setCameraOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [scannedPages, setScannedPages] = useState([])

  useEffect(() => {
    console.log("Scanned pages:", scannedPages)
  }, [scannedPages])

  const testBackend = async () => {
    try {
      const response = await fetch(
        'https://immerzio-backend--immerzio-2.europe-west4.hosted.app/api/test'
      )

      const data = await response.json()

      setMessage(data.message)
    } catch (error) {
      console.error('Backend request failed:', error)
      setMessage('Backend request failed')
    }
  }


  useEffect(() => {
    if (cameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play()
    }
  }, [cameraOpen])

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
        },
      })

      streamRef.current = stream
      setCameraOpen(true)
    } catch (error) {
      console.error('Could not access camera:', error)
    }
  }

  const scanPage = () => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const context = canvas.getContext('2d')
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob(async (blob) => {
      if (!blob) return

      const formData = new FormData()
      formData.append('image', blob, 'page.jpg')

      try {
        const response = await fetch(`https://immerzio-backend--immerzio-2.europe-west4.hosted.app/api/scan/${bookId}`, {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()

       // console.log('Backend response:', data)
        //console.log('more details:', data.text)     // HERE'S WHERE THE OCR OUTPUT LIVES // HERE'S WHERE THE OCR OUTPUT LIVES // HERE'S WHERE THE OCR OUTPUT LIVES
        setScannedPages(prev => [...prev, data.text])
      } catch (error) {
        console.error('Could not send image:', error)
      }
    }, 'image/jpeg')
  }

  const finishScanning = async () => {
    try {
      const user = auth.currentUser;

      console.log("Current user:", user);

    if (!user) {
      console.error("No user is signed in");
      return;
    }

    const token = await user.getIdToken();

    console.log("UID:", user.uid);
    console.log("Token obtained:", !!token);

    const response = await fetch(
      `https://immerzio-backend--immerzio-2.europe-west4.hosted.app/api/process/${bookId}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify({
          pages: scannedPages
        })
        }
      );

      const data = await response.json();

      console.log("Processing result:", data);

    } catch (error) {
      console.error("Could not process scanned pages:", error);
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  const testKnownWord = async () => {
try {
  const user = auth.currentUser;

  if (!user) {
    console.error("No user signed in");
    return;
  }

  const token = await user.getIdToken();

  const response = await fetch(
    "https://immerzio-backend--immerzio-2.europe-west4.hosted.app/api/knownWords",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        word: {
          original: "möglich",
          translated: "possible"
        }
      })
    }
  );

  const data = await response.json();

  console.log("Known word result:", data);

} catch (error) {
  console.error("Known word request failed:", error);
}
  };

  const testStudySet = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        console.error("No user signed in");
        return;
      }

      const token = await user.getIdToken();

      const response = await fetch(
        `https://immerzio-backend--immerzio-2.europe-west4.hosted.app/api/study/${bookId}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      console.log("Study set:", data);
      console.log(
        "Haus in study set:",
        data.words.some(
          word => word.original.toLowerCase() === "möglich"
        )
      );

    } catch (error) {
      console.error("Study set request failed:", error);
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return(
     <div className="app">
        <h1>Immerzio</h1>

        <button onClick={testKnownWord}>
          Test Known Word
        </button>

        <button onClick={testStudySet}>
          Test Study Set
        </button>

        <button className="camera-button" onClick={scanPage}>
            Scan Page
        </button>

        <p>{message}</p>

        {!cameraOpen && (
            <button className="camera-button" onClick={openCamera}>
            Open Camera
            </button>
        )}

        {cameraOpen && (
            <>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
            />

            <button className="camera-button" onClick={finishScanning}>
                Finish Scanning
            </button>

            <canvas
                ref={canvasRef}
                style={{ display: 'none' }}
            />
            </>
        )}
    </div>
    )
}

export default ScanPage;