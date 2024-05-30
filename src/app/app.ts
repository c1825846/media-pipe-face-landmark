import { FaceRecognizer } from 'modules/face-recognizer'
import { ThreeContext } from 'modules/three-context'
import { Ticker } from 'modules/ticker'
import { UserInput, UserInputState } from 'user-input/user-input'
import { FaceUserInput } from 'user-input/face-user-input'
import { KeyboardUserInput } from 'user-input/keyboard-user-input'

import { MainScene } from 'components/main-scene'

const video = document.querySelector('#video') as HTMLVideoElement
export class App {
  private threeContext = ThreeContext.getContext()
  private faceRecognizer = new FaceRecognizer(video)
  private ticker: Ticker
  private userInput: UserInput
  private mainScene = new MainScene()
  private isLoaded = false

  constructor(container: Element) {
    container.appendChild(this.threeContext.canvas)

    this.threeContext.camera.position.set(0, 0, 2)
    this.threeContext.scene.add(this.mainScene)

    this.ticker = new Ticker(this.threeContext.renderer)
    this.ticker.addListener('tick', ({ delta }) => this.onTick(delta))

    this.userInput = new FaceUserInput(this.faceRecognizer)
  }

  private onTick(delta: number) {
    this.faceRecognizer.update()
    this.mainScene.setUserInputState(this.userInput.state)
    this.mainScene.update(delta)
    this.threeContext.render()
  }

  async run() {
    await Promise.all([
      this.mainScene.load(), //
      this.faceRecognizer.init(),
    ])

    this.isLoaded = true
  }
}
