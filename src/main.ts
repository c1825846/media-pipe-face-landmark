import { FaceLandmarker, FilesetResolver, FaceLandmarkerResult } from '@mediapipe/tasks-vision'

import modelAssetPath from './assets/face_landmarker.task?url'
import { App } from 'app'

import './styles.css'

const appElement = document.querySelector('#app') as HTMLElement
const video = document.querySelector('#video') as HTMLVideoElement
const app = new App(appElement)
app.run()

const hasGetUserMedia = () => Boolean(navigator?.mediaDevices?.getUserMedia)

if (!hasGetUserMedia()) {
  throw new Error('getUserMedia() is not supported by your browser')
}

const createFaceLandmarker = async () => {
  const filesetResolver = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
  )

  const faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath,
      delegate: 'GPU',
    },
    outputFaceBlendshapes: true,
    runningMode: 'VIDEO',
    minTrackingConfidence: 0.1,
    minFacePresenceConfidence: 0.1,
    outputFacialTransformationMatrixes: true,
    numFaces: 1,
  })

  return faceLandmarker
}

const onResize = () => {
  if (!video?.videoWidth || !video.videoHeight) {
    return
  }

  let scalar = 1

  const videoRatio = video.videoWidth / video.videoHeight
  const windowRatio = window.innerWidth / window.innerHeight

  if (windowRatio < videoRatio && window.innerHeight > video.videoHeight) {
    scalar = window.innerHeight / video.videoHeight
  }

  if (windowRatio > videoRatio && window.innerWidth > video.videoWidth) {
    scalar = window.innerWidth / video.videoWidth
  }

  video.style.width = video.videoWidth * scalar + 'px'
  video.style.left = window.innerWidth / 2 - (video.videoWidth * scalar) / 2 + 'px'
  video.style.height = video.videoHeight * scalar + 'px'
  video.style.top = window.innerHeight / 2 - (video.videoHeight * scalar) / 2 + 'px'
}

const main = async () => {
  const faceLandmarker = await createFaceLandmarker()
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  })
  video.srcObject = stream
  video.addEventListener('playing', onResize)
  video.play()

  let lastVideoTime = -1
  let faceLandmarkerResult: FaceLandmarkerResult

  const predictWebcam = () => {
    if (video.currentTime !== lastVideoTime) {
      const startTime = performance.now()
      faceLandmarkerResult = faceLandmarker.detectForVideo(video, startTime)
      lastVideoTime = video.currentTime
    }

    app.updateFacialTransforms(faceLandmarkerResult)

    requestAnimationFrame(predictWebcam)
  }

  video.addEventListener('loadeddata', predictWebcam)

  window.addEventListener('resize', onResize)

  onResize()
}

main()
