import * as THREE from 'three'
import { EventEmitter } from 'eventemitter3'

type TickerEvents = {
  tick: (detail: { delta: number }) => void
}

export class Ticker extends EventEmitter<TickerEvents> {
  clock = new THREE.Clock()

  constructor(renderer: THREE.WebGLRenderer) {
    super()

    renderer.setAnimationLoop(() => {
      const delta = this.clock.getDelta()

      this.emit('tick', { delta })
    })
  }
}
