import * as THREE from 'three'
import { FaceLandmarkerResult } from '@mediapipe/tasks-vision'

import { MainScene } from 'components/main-scene'

import { decomposeMatrix } from 'utils/decompose-matrix'

export class App {
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

    this.scene.add(new THREE.AmbientLight())
    const directionalLight = new THREE.DirectionalLight(0xffffff)
    directionalLight.position.set(0, 0, 2)
    this.scene.add(directionalLight)

    window.addEventListener('resize', () => {
      this.onResize()
    })

    this.onResize()
  }

  updateFacialTransforms(results: FaceLandmarkerResult) {
    if (!results || !this.isLoaded) return

    this.updateTranslation(results)
    this.renderer.render(this.scene, this.camera)
  }

  private updateTranslation(results: FaceLandmarkerResult) {
    if (!results.facialTransformationMatrixes) return

    const matrixes = results.facialTransformationMatrixes[0]?.data
    if (!matrixes) return

    this.scene.updateFaceTranslation(decomposeMatrix(matrixes))
  }

  private onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  async run() {
    await this.scene.load()

    this.isLoaded = true
    this.renderer.setAnimationLoop(() => {
      const clockDelta = this.clock.getDelta()
      this.scene.update(clockDelta)
      // this.renderer.render(this.scene, this.camera)
    })
  }
}
