import * as THREE from 'three'
import CannonDebugger from 'cannon-es-debugger'

import { Game, FlyGame } from './games'

export class MainScene extends THREE.Scene {
  private faceObject3D = new THREE.Object3D()
  private cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.2, 0.2),
    new THREE.MeshStandardMaterial({
      color: 'white',
      transparent: true,
      opacity: 0.2,
    })
  )
  private eulerXOffset = 0
  private logDirectionBlock = document.querySelector('#direction') as HTMLDivElement

  private game: Game = new FlyGame()
  private cannonDebugger: ReturnType<typeof CannonDebugger>

  constructor() {
    super()

    this.cube.add(new THREE.AxesHelper())
    this.add(this.cube)

    this.add(this.game)

    if (true) {
      this.cannonDebugger = CannonDebugger(this, this.game.world)
    }

    document.querySelector('#recalibrate')?.addEventListener('click', () => {
      this.eulerXOffset = this.faceObject3D.rotation.x
    })
  }

  updateFaceTranslation({
    rotation,
  }: {
    translation: THREE.Vector3
    rotation: THREE.Quaternion
    scale: THREE.Vector3
  }) {
    const euler = new THREE.Euler(rotation.x, rotation.y, rotation.z, 'ZYX')
    const quaternion = new THREE.Quaternion().setFromEuler(euler)

    this.faceObject3D.quaternion.slerp(quaternion, 1)

    const eulerX = this.faceObject3D.rotation.x - this.eulerXOffset
    this.cube.rotation.set(eulerX, 0, 0)
    const threshold = 0.16
    if (eulerX > threshold) {
      this.logDirectionBlock.innerText = 'down'
      this.game.onDownPressed()
    }

    if (eulerX < -threshold) {
      this.logDirectionBlock.innerText = 'up'
      this.game.onUpPressed()
    }

    if (eulerX > -threshold && eulerX < threshold) {
      this.logDirectionBlock.innerText = 'straight'
    }
  }

  async load() {}

  update(delta: number) {
    this.game.update(delta)
    this.cannonDebugger?.update()
  }
}
