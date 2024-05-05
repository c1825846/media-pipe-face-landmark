import * as THREE from 'three'

export abstract class Game extends THREE.Group {
  abstract onUpPressed(): void
  abstract onDownPressed(): void
}
