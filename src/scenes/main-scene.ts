import {Noise} from 'noisejs'
import {Input} from 'phaser'
import MapManager from '../map-manager'

type KeyMap = { [key: string]: Input.Keyboard.Key }


export default class MainScene extends Phaser.Scene {
  followPoint: Phaser.Math.Vector2
  cameraSpeed: number = 64
  cameraZoom: number = 1
  noise: Noise

  movementKeys: KeyMap
  zoomKeys: KeyMap

  dragPoint: Phaser.Math.Vector2
  mapManager: MapManager

  constructor() {
    super({key: 'MainScene'})
  }

  create(): void {
    this.noise = new Noise(1)
    this.mapManager = new MapManager(this, 'Test')

    this.movementKeys = this.input.keyboard.addKeys('W,S,A,D') as KeyMap
    this.zoomKeys = this.input.keyboard.addKeys('Z,X') as KeyMap

    this.cameras.main.setRoundPixels(true)

    // this.followPoint = new Phaser.Math.Vector2(
    //   this.cameras.main.worldView.x + this.cameras.main.worldView.width * 0.5,
    //   this.cameras.main.worldView.y + this.cameras.main.worldView.height * 0.5
    // )

    this.followPoint = new Phaser.Math.Vector2(4096, 4096)

    this.input.on('wheel', e => this.changeZoom(-e.deltaY / 1000))

    this.input.on('pointerup', this.onPointerUp, this)

    this.updateCamera()
    this.scene.launch('UIScene')
  }

  onPointerUp(pointer: Phaser.Input.Pointer) {
    const x = this.cameras.main.scrollX + pointer.x
    const y = this.cameras.main.scrollY + pointer.y

    // console.log(`Pointer up at ${x},${y}`)
  }

  update(time, delta) {
    this.mapManager.update(time, delta)

    if (this.game.input.activePointer.isDown) {
      if (this.dragPoint) {
        this.addPosition(
          this.dragPoint.x - this.game.input.activePointer.position.x,
          this.dragPoint.y - this.game.input.activePointer.position.y,
        )
      }
      this.dragPoint = this.game.input.activePointer.position.clone()
    } else {
      this.dragPoint = null
    }

    let speed = this.cameraSpeed / this.cameras.main.zoom * delta / 100

    if (this.movementKeys.W.isDown) this.addPosition(0, -speed)
    if (this.movementKeys.S.isDown) this.addPosition(0, speed)
    if (this.movementKeys.A.isDown) this.addPosition(-speed, 0)
    if (this.movementKeys.D.isDown) this.addPosition(speed, 0)

    if (this.zoomKeys.Z.isDown) this.changeZoom(0.01)
    if (this.zoomKeys.X.isDown) this.changeZoom(-0.01)

    this.mapManager.onCameraUpdate() // TODO: move to camera movement instead (first movement ignored =\)
  }

  addPosition(dx, dy) {
    this.followPoint.x += dx
    this.followPoint.y += dy
    this.updateCamera()
  }

  updateCamera() {
    this.cameraZoom = Phaser.Math.Clamp(this.cameraZoom, 0.5, 4)
    this.cameras.main.centerOn(this.followPoint.x, this.followPoint.y)
    this.cameras.main.zoom = this.cameraZoom
  }

  changeZoom(delta) {
    this.cameraZoom += delta
    this.updateCamera()
  }
}
