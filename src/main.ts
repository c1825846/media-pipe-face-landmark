import { App } from 'app'

import './styles.css'

const appElement = document.querySelector('#app') as HTMLElement
const app = new App(appElement)
app.run()
