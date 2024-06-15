import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import { createActor } from 'xstate'

import { ThreeContext } from 'modules/three-context'
import { UserInput, UserInputState } from 'modules/user-input/user-input'

import { gameStateMachine } from './state-machine'

import modelUrl from 'assets/Hair_top.glb?url'

export class Game {
  actor = createActor(gameStateMachine)
  scene: THREE.Scene
  model: THREE.Group

  constructor(threeContext: ThreeContext, private readonly userInput: UserInput) {
    this.scene = threeContext.scene
    this.scene.add(new THREE.AmbientLight(4))
  }

  async load() {
    const loader = new GLTFLoader()

    const gltf = await loader.loadAsync(modelUrl)
    this.model = gltf.scene
    this.model.scale.set(2, 2, 2)
    this.scene.add(this.model)
  }

  update(delta: number) {
    this.model.rotation.y += delta
    console.log(delta)
    console.log(this.userInput.state)

    if (this.userInput.state === UserInputState.UP) {
      this.model.position.y += delta
    }

    if (this.userInput.state === UserInputState.DOWN) {
      this.model.position.y -= delta
    }
  }
}
