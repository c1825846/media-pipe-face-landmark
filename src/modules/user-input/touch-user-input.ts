import { UserInput, UserInputState } from './user-input'

export class TouchUserInput extends UserInput {
  constructor() {
    super()

    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp') {
        this.state = UserInputState.UP
      }

      if (e.key === 'ArrowDown') {
        this.state = UserInputState.DOWN
      }
    })

    window.addEventListener('keyup', e => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        this.state = UserInputState.NULL
      }
    })
  }
}
