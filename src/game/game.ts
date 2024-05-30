import { createActor } from 'xstate'

import { ThreeContext } from 'modules/three-context'
import { UserInput } from 'modules/user-input/user-input'

import { gameStateMachine } from './state-machine'

export class Game {
  actor = createActor(gameStateMachine)

  constructor(threeContext: ThreeContext, userInput: UserInput) {}

  async load() {}

  update(delta: number) {}
}
