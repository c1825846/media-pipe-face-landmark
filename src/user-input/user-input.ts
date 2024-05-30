export const enum UserInputState {
  UP = 'up',
  DOWN = 'down',
  NULL = 'null',
}

export class UserInput {
  state: UserInputState = UserInputState.NULL
}
