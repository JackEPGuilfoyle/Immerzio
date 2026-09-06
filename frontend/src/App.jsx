import { useEffect, useRef, useState } from 'react'

function App() {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
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

  return (
    <div className="app">
      <h1>Immerzio</h1>

      {!cameraOpen && (
        <button className="camera-button" onClick={openCamera}>
          Open Camera
        </button>
      )}

      {cameraOpen && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
        />
      )}
    </div>
  )
}

export default App