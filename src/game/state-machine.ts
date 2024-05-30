import { ThreeContext } from 'modules/three-context'
import { setup, emit } from 'xstate'

export const gameStateMachine = setup({
  types: {
    events: {} as
      | { type: 'init'; threeContext: ThreeContext }
      | { type: 'load' }
      | { type: 'start' }
      | { type: 'obstacle-collision' },
    emitted: {} as { type: 'load' },
  },
  actions: {},
}).createMachine({
  id: 'game',
  initial: 'before-init',
  states: {
    loading: {
      on: {
        load: {
          target: 'idle',
          actions: [emit({ type: 'load' })],
        },
      },
    },
    idle: {
      on: {
        start: {
          target: 'running',
        },
      },
    },
    running: {},
  },
})
