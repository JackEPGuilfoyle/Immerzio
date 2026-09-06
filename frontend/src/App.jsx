import { useEffect, useRef, useState } from 'react'

function App() {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const canvasRef = useRef(null)

  const [cameraOpen, setCameraOpen] = useState(false)

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
        const response = await fetch('http://localhost:8080/api/scan', {
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

  return (
    <div className="app">
      <h1>Immerzio</h1>

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

export default App