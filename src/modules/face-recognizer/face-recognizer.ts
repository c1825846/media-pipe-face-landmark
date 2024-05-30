import { FaceLandmarker, FilesetResolver, FaceLandmarkerResult } from '@mediapipe/tasks-vision'
import { EventEmitter } from 'eventemitter3'

import modelAssetPath from './face-landmarker.task?url'

type FaceRecognizerEvents = {
  update: (faceLandmarkerResult: FaceLandmarkerResult) => void
}

export class FaceRecognizer extends EventEmitter<FaceRecognizerEvents> {
  private faceLandmarker: FaceLandmarker
  private lastVideoTime = -1
  private faceLandmarkerResult: FaceLandmarkerResult
  private isVideoLoaded = false
  private isFaceLandmarkerLoaded = false

  constructor(private readonly video: HTMLVideoElement, private readonly videoStream: MediaStream) {
    super()

    window.addEventListener('resize', () => this.onResize())

    this.onResize()
  }

  async init() {
    await Promise.all([
      this.initFaceLandmarker(), //
      this.initVideoStream(),
    ])
  }

  update() {
    if (!this.isVideoLoaded || !this.isFaceLandmarkerLoaded) {
      return
    }

    if (this.video.currentTime !== this.lastVideoTime) {
      const startTime = performance.now()
      this.faceLandmarkerResult = this.faceLandmarker.detectForVideo(this.video, startTime)
      this.lastVideoTime = this.video.currentTime
    }

    this.emit('update', this.faceLandmarkerResult)

    return this.faceLandmarkerResult
  }

  private async initFaceLandmarker() {
    const filesetResolver = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
    )

    this.faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
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

    this.isFaceLandmarkerLoaded = true
  }

  private async initVideoStream() {
    this.video.srcObject = this.videoStream
    this.video.addEventListener('playing', () => this.onResize())
    this.video.play()
    this.video.addEventListener('loadeddata', () => {
      this.isVideoLoaded = true
    })
  }

  private onResize() {
    if (!this.video?.videoWidth || !this.video.videoHeight) {
      return
    }

    let scalar = 1

    const videoRatio = this.video.videoWidth / this.video.videoHeight
    const windowRatio = window.innerWidth / window.innerHeight

    if (windowRatio < videoRatio && window.innerHeight > this.video.videoHeight) {
      scalar = window.innerHeight / this.video.videoHeight
    }

    if (windowRatio > videoRatio && window.innerWidth > this.video.videoWidth) {
      scalar = window.innerWidth / this.video.videoWidth
    }

    this.video.style.width = this.video.videoWidth * scalar + 'px'
    this.video.style.left = window.innerWidth / 2 - (this.video.videoWidth * scalar) / 2 + 'px'
    this.video.style.height = this.video.videoHeight * scalar + 'px'
    this.video.style.top = window.innerHeight / 2 - (this.video.videoHeight * scalar) / 2 + 'px'
  }
}
