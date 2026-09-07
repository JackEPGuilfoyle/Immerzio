import { useEffect, useRef, useState } from 'react';
import { useParams } from "react-router-dom";

function ScanPage(){

  const { bookId } = useParams();
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const canvasRef = useRef(null)

  const [cameraOpen, setCameraOpen] = useState(false)
  const [message, setMessage] = useState('')

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

        console.log('Backend response:', data)
      } catch (error) {
        console.error('Could not send image:', error)
      }
    }, 'image/jpeg')
  }
    return(
     <div className="app">
        <h1>Immerzio</h1>

        <button className="camera-button" onClick={testBackend}>
            Test Backend
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

            <button className="camera-button" onClick={scanPage}>
                Scan Page
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