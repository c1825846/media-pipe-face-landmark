import * as THREE from 'three'

import { Game } from './game'

export class FlyGame extends Game {
  character = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), new THREE.MeshBasicMaterial())

  constructor() {
    super()

    this.add(this.character)
  }

  onUpPressed() {
    this.character.position.y += 0.01
  }

  onDownPressed() {
    this.character.position.y -= 0.01
  }
}
