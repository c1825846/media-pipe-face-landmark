import * as THREE from 'three'
import CannonDebugger from 'cannon-es-debugger'

import { UserInputState } from 'modules/user-input/user-input'

import { Game, FlyGame } from './games'

export class MainScene extends THREE.Scene {
  userInputState: UserInputState
  private cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.2, 0.2),
    new THREE.MeshStandardMaterial({
      color: 'white',
      transparent: true,
      opacity: 0.2,
    })
  )

  private game: Game = new FlyGame()
  private cannonDebugger: ReturnType<typeof CannonDebugger>

  constructor() {
    super()

    this.add(new THREE.AmbientLight())
    const directionalLight = new THREE.DirectionalLight(0xffffff)
    directionalLight.position.set(0, 0, 2)
    this.add(directionalLight)

    this.cube.add(new THREE.AxesHelper())
    this.add(this.cube)

    this.add(this.game)

    if (true) {
      this.cannonDebugger = CannonDebugger(this, this.game.world)
    }
  }

  async load() {}

  setUserInputState(userInputState: UserInputState) {
    this.userInputState = userInputState
  }

  update(delta: number) {
    this.game.update(delta)
    this.cannonDebugger?.update()
  }
}
