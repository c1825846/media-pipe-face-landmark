import * as THREE from 'three'

export class ThreeContext {
  private static instance: ThreeContext
  private renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  })
  private camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
  private scene = new THREE.Scene()

  private constructor() {
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.scene.add(this.camera)

    window.addEventListener('resize', () => {
      this.onResize()
    })

    this.onResize()
  }

  static getContext() {
    if (!ThreeContext.instance) {
      ThreeContext.instance = new ThreeContext()
    }

    return {
      renderer: ThreeContext.instance.renderer,
      camera: ThreeContext.instance.camera,
      scene: ThreeContext.instance.scene,
      canvas: ThreeContext.instance.renderer.domElement,
      render: () => ThreeContext.instance.render(),
    }
  }

  private render() {
    this.renderer.render(this.scene, this.camera)
  }

  private onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}
