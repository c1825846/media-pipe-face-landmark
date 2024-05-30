import { setup } from 'xstate'

const appMachine = setup({
  types: {
    events: { type: 'start' },
  },
})
