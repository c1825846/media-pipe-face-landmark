import * as THREE from 'three'
import * as CANNON from 'cannon-es'

export class PhysicalObject {
  body: CANNON.Body
  group: THREE.Group

  setPosition(position: CANNON.Vec3) {
    this.group.position.set(position.x, position.y, position.z)
    this.body.position = position
  }
}
