import * as THREE from 'three'
import * as CANNON from 'cannon-es'

import { PhysicalObject } from 'components/physical-object'
import { obstructionMaterial } from 'components/materials'

import { syncMesh } from 'utils/cannon'

export interface ObstructionOptions {
  size: CANNON.Vec3
}

export class Obstruction extends PhysicalObject {
  body = new CANNON.Body({
    type: CANNON.BODY_TYPES.STATIC,
    mass: 0,
    material: obstructionMaterial,
  })
  group = new THREE.Group()
  isObstruction = true

  constructor({ size }: ObstructionOptions) {
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
  }

  update() {
    if(this.body.position.x  > 2) {
      this.body.position.x = -2
    }
    this.body.position.x += 0.004
    syncMesh(this.group, this.body)
  }
}
