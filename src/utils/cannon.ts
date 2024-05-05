import * as THREE from 'three'
import * as CANNON from 'cannon-es'

export function syncMesh(mesh: THREE.Object3D, body: CANNON.Body) {
  mesh.position.set(body.position.x, body.position.y, body.position.z)
  mesh.quaternion.set(body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w)
}

export function resetBody(body: CANNON.Body) {
  body.position.setZero()
  body.previousPosition.setZero()
  body.interpolatedPosition.setZero()
  body.initPosition.setZero()

  // orientation
  body.quaternion.set(0, 0, 0, 1)
  body.initQuaternion.set(0, 0, 0, 1)
  body.previousQuaternion.set(0, 0, 0, 1)
  body.interpolatedQuaternion.set(0, 0, 0, 1)

  // Velocity
  body.velocity.setZero()
  body.initVelocity.setZero()
  body.angularVelocity.setZero()
  body.initAngularVelocity.setZero()

  // Force
  body.force.setZero()
  body.torque.setZero()

  // Sleep state reset
  body.sleepState = 0
  body.timeLastSleepy = 0
  body.wakeUpAfterNarrowphase = false
}
