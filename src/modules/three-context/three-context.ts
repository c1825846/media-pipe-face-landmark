import * as THREE from 'three'

export type ThreeContext = {
  renderer: THREE.WebGLRenderer
  camera: THREE.PerspectiveCamera
  scene: THREE.Scene
  canvas: HTMLCanvasElement
  render: VoidFunction
}

export class ThreeContextFabric {
  private static instance: ThreeContextFabric
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

  static getContext(): ThreeContext {
    if (!ThreeContextFabric.instance) {
      ThreeContextFabric.instance = new ThreeContextFabric()
    }

    return {
      renderer: ThreeContextFabric.instance.renderer,
      camera: ThreeContextFabric.instance.camera,
      scene: ThreeContextFabric.instance.scene,
      canvas: ThreeContextFabric.instance.renderer.domElement,
      render: () => ThreeContextFabric.instance.render(),
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
