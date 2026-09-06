import { useRef } from 'react'

function App() {
  const videoRef = useRef(null)

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
        },
      })

      videoRef.current.srcObject = stream
    } catch (error) {
      console.error('Could not access camera:', error)
    }
  }

  return (
    <div className="app">
      <h1>Immerzio</h1>

      <button className="camera-button" onClick={openCamera}>
        Open Camera
      </button>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: '100%', maxWidth: '500px' }}
      />
    </div>
  )
}

export default App