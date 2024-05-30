import * as THREE from 'three'

import { FaceRecognizer } from 'modules/face-recognizer'
import { UserInput, UserInputState } from 'user-input/user-input'
import { FaceUserInput } from 'user-input/face-user-input'
import { KeyboardUserInput } from 'user-input/keyboard-user-input'

import { MainScene } from 'components/main-scene'

const video = document.querySelector('#video') as HTMLVideoElement
export class App {
  private userInput: UserInput
  private faceRecognizer = new FaceRecognizer(video)
  private renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  })
  private camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
  private clock = new THREE.Clock()
  private scene = new MainScene()
  private isLoaded = false

  constructor(container: Element) {
    this.renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(this.renderer.domElement)
    this.scene.add(this.camera)
    this.camera.position.set(0, 0, 2)

    this.userInput = new FaceUserInput(this.faceRecognizer)

    window.addEventListener('resize', () => {
      this.onResize()
    })

    this.onResize()
  }

  private onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  private update(delta: number) {
    this.faceRecognizer.update()
    this.scene.setUserInputState(this.userInput.state)
    this.scene.update(delta)
  }

  async run() {
    await Promise.all([
      this.scene.load(), //
      this.faceRecognizer.init(),
    ])

    this.isLoaded = true
    this.renderer.setAnimationLoop(() => {
      const clockDelta = this.clock.getDelta()
      this.update(clockDelta)
      this.renderer.render(this.scene, this.camera)
    })
  }
}
