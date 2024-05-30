// import * as THREE from 'three'
import * as CANNON from 'cannon-es'

import { Game } from './game'

import { PhysicalObject } from 'game/components/physical-object'
import { Obstruction } from 'game/components/obstruction'
import { Character } from 'game/components/character/character'
import { characterObstructionContact } from 'game/components/materials'

const enum ObstructionPosition {
  Top = 'top',
  Bottom = 'bottom',
}

const obstructionsConfig = {
  speed: 0.004,
  obstructions: [
    {
      position: ObstructionPosition.Top,
      height: 1,
      distance: 1,
    },
    {
      position: ObstructionPosition.Bottom,
      height: 1,
      distance: 2,
    },
    {
      position: ObstructionPosition.Top,
      height: 0.8,
      distance: 3,
    },
    {
      position: ObstructionPosition.Bottom,
      height: 0.9,
      distance: 4,
    },
    {
      position: ObstructionPosition.Top,
      height: 0.7,
      distance: 5,
    },
    {
      position: ObstructionPosition.Bottom,
      height: 0.9,
      distance: 6,
    },
    {
      position: ObstructionPosition.Top,
      height: 0.8,
      distance: 7,
    },
    {
      position: ObstructionPosition.Bottom,
      height: 1.1,
      distance: 8,
    },
  ],
}

export class FlyGame extends Game {
  world = new CANNON.World()
  character = new Character({ size: new CANNON.Vec3(0.1, 0.1, 0.1) })
  ceil = new Obstruction({ size: new CANNON.Vec3(5, 0.1, 0.1) })
  floor = new Obstruction({ size: new CANNON.Vec3(5, 0.1, 0.1) })
  obstructions: Obstruction[] = []

  constructor() {
    super()

    this.world.addContactMaterial(characterObstructionContact)

    this.addPhysicalObject(this.ceil)
    this.ceil.setPosition(new CANNON.Vec3(0, 1, 0))

    this.addPhysicalObject(this.floor)
    this.floor.setPosition(new CANNON.Vec3(0, -1, 0))

    obstructionsConfig.obstructions.forEach(config => {
      const obstruction = new Obstruction({ size: new CANNON.Vec3(0.3, config.height, 0.1) })
      const obstructionPositionY =
        (1 - config.height / 2 - 0.05) * (config.position === ObstructionPosition.Top ? 1 : -1)
      obstruction.setPosition(new CANNON.Vec3(-config.distance, obstructionPositionY, 0))
      this.obstructions.push(obstruction)
      this.addPhysicalObject(obstruction)
    })

    this.character.onCollide(e => {
      let isCollideObstruction = false
      this.obstructions.forEach(obstruction => {
        if (e.body === obstruction.body) {
          isCollideObstruction = true
        }
      })

      if (isCollideObstruction) {
        this.character.reset()
      }
    })

    this.addPhysicalObject(this.character)
  }

  addPhysicalObject(object: PhysicalObject) {
    this.world.addBody(object.body)
    this.add(object.group)
  }

  onUpPressed() {
    this.character.onUpPressed()
  }

  onDownPressed() {
    this.character.onDownPressed()
  }

  async load() {}

  update(delta: number) {
    this.world.fixedStep()
    this.character.update()

    this.obstructions.forEach(obstruction => {
      obstruction.update()
    })
  }
}
