import * as THREE from 'three'
import * as CANNON from 'cannon-es'

import { PhysicalObject } from 'components/physical-object'
import { characterMaterial } from 'components/materials'

import { syncMesh, resetBody } from 'utils/cannon'

export interface CharacterOptions {
  size: CANNON.Vec3
}

export class Character extends PhysicalObject {
  body = new CANNON.Body({
    mass: 0.01,
    material: characterMaterial,
  })
  group = new THREE.Group()

  constructor({ size }: CharacterOptions) {
    super()

    this.body.addShape(new CANNON.Box(size.scale(0.5)))
    this.group.add(
      new THREE.Mesh(
        new THREE.BoxGeometry(size.x, size.y, size.z),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
        })
      )
    )

    this.body.addEventListener(CANNON.Body.COLLIDE_EVENT_NAME, (e: any) => {
      this._onCollide(e)
    })
  }

  onUpPressed() {
    this.body.velocity = new CANNON.Vec3(0, 0.3, 0)
  }

  onDownPressed() {
    this.body.velocity = new CANNON.Vec3(0, -0.3, 0)
  }

  reset() {
    resetBody(this.body)
    this.body.position = new CANNON.Vec3()
  }

  onCollide(cb: (e: any) => void) {
    this._onCollide = cb
    return this
  }
  private _onCollide(e: any) {}

  update() {
    syncMesh(this.group, this.body)
  }
}
