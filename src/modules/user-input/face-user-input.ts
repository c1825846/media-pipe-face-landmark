import * as THREE from 'three'
import { FaceLandmarkerResult } from '@mediapipe/tasks-vision'

import { FaceRecognizer } from 'modules/face-recognizer'
import { decomposeMatrix } from 'utils/decompose-matrix'

import { UserInput, UserInputState } from './user-input'

export class FaceUserInput extends UserInput {
  private faceObject3D = new THREE.Object3D()
  private eulerXOffset = 0

  constructor(faceRecognizer: FaceRecognizer) {
    super()

    faceRecognizer.on('update', results => {
      this.updateFacialTransforms(results)
    })
  }

  private updateFacialTransforms(results?: FaceLandmarkerResult) {
    const matrix = results?.facialTransformationMatrixes?.[0]?.data

    if (!matrix) {
      return
    }

    this.updateFaceTranslation(decomposeMatrix(matrix))
  }

  private updateFaceTranslation({
    rotation,
  }: {
    translation: THREE.Vector3
    rotation: THREE.Quaternion
    scale: THREE.Vector3
  }) {
    const euler = new THREE.Euler(rotation.x, rotation.y, rotation.z, 'ZYX')
    const quaternion = new THREE.Quaternion().setFromEuler(euler)

    this.faceObject3D.quaternion.slerp(quaternion, 1)

    const eulerX = this.faceObject3D.rotation.x - this.eulerXOffset
    const threshold = 0.16

    if (eulerX > threshold) {
      this.state = UserInputState.DOWN
    }

    if (eulerX < -threshold) {
      this.state = UserInputState.UP
    }

    if (eulerX > -threshold && eulerX < threshold) {
      this.state = UserInputState.NULL
    }
  }
}
