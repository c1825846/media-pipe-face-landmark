import * as THREE from 'three'
import * as CANNON from 'cannon-es'

export abstract class Game extends THREE.Group {
  abstract world: CANNON.World
  abstract onUpPressed(): void
  abstract onDownPressed(): void
  abstract load(): Promise<void>
  abstract update(delta: number): void
}
