import { FaceRecognizer } from 'modules/face-recognizer'
import { ThreeContextFabric } from 'modules/three-context'
import { Ticker } from 'modules/ticker'
import { Game } from 'game'
import { FaceUserInput, KeyboardUserInput, UserInput } from 'modules/user-input'
import { getVideoStream } from 'utils/get-video-stream'

const video = document.querySelector('#video') as HTMLVideoElement
export class App {
  private threeContext = ThreeContextFabric.getContext()
  private faceRecognizer: FaceRecognizer | null = null
  private game: Game
  private ticker: Ticker
  private userInput: UserInput
  private isLoaded = false

  constructor(container: Element) {
    container.appendChild(this.threeContext.canvas)
    this.threeContext.camera.position.set(0, 0, 2)
    this.ticker = new Ticker(this.threeContext.renderer)
    this.ticker.addListener('tick', ({ delta }) => this.onTick(delta))
  }

  private onTick(delta: number) {
    if (!this.isLoaded) {
      return
    }

    this.faceRecognizer?.update()
    this.game.update(delta)
    this.threeContext.render()
  }

  async run() {
    const videoStream = await getVideoStream()

    if (videoStream) {
      this.faceRecognizer = new FaceRecognizer(video, videoStream)
      this.faceRecognizer.init()
      this.userInput = new FaceUserInput(this.faceRecognizer)
    } else {
      this.userInput = new KeyboardUserInput()
    }

    this.game = new Game(this.threeContext, this.userInput)

    await this.game.load()

    this.isLoaded = true
  }
}
