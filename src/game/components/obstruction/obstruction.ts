import * as THREE from 'three'
import * as CANNON from 'cannon-es'

import { PhysicalObject } from 'game/components/physical-object'
import { obstructionMaterial } from 'game/components/materials'
import { CollisionFilterGroup } from 'game/components/collision-filter-group'

import { syncMesh } from 'utils/cannon'

export interface ObstructionOptions {
  size: CANNON.Vec3
}

export class Obstruction extends PhysicalObject {
  body = new CANNON.Body({
    type: CANNON.BODY_TYPES.STATIC,
    mass: 0,
    material: obstructionMaterial,
    collisionFilterGroup: CollisionFilterGroup.OBSTRUCTION,
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

  private moveForward() {
    if (this.body.position.x > 4) {
      this.body.position.x = -4
    }
    this.body.position.x += 0.004
    syncMesh(this.group, this.body)
  }

  private moveBackward() {
    this.body.position.x -= 0.004
    syncMesh(this.group, this.body)
  }

  update() {
    this.moveForward()
  }
}
