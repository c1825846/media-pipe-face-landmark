import * as CANNON from 'cannon-es'

export const obstructionMaterial = new CANNON.Material()
export const characterMaterial = new CANNON.Material()

export const characterObstructionContact = new CANNON.ContactMaterial(characterMaterial, obstructionMaterial, {})
