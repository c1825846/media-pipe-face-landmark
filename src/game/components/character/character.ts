import * as THREE from 'three'
import * as CANNON from 'cannon-es'

import { PhysicalObject } from 'game/components/physical-object'
import { characterMaterial } from 'game/components/materials'
import { CollisionFilterGroup } from 'game/components/collision-filter-group'

import { syncMesh, resetBody } from 'utils/cannon'

export interface CharacterOptions {
  size: CANNON.Vec3
}

export class Character extends PhysicalObject {
  body = new CANNON.Body({
    mass: 0.01,
    material: characterMaterial,
    collisionFilterMask: CollisionFilterGroup.BORDER,
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
      // this.body.collisionFilterGroup = 0

      // setTimeout(() => {
      //   this.body.collisionFilterGroup = 1
      // }, 1000)

      console.log('asdf')

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
    // this.body.quaternion = new CANNON.Quaternion()
    this.body.position.z = 0
    syncMesh(this.group, this.body)
  }
}
