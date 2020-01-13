import MainScene from './main-scene'

export default class UIScene extends Phaser.Scene {
  debugText: Phaser.GameObjects.Text

  constructor() {
    super({key: 'UIScene'})
  }

  create() {
    const paneRect = new Phaser.Geom.Rectangle(0, 0, 240, 128)

    this.add.graphics()
      .fillStyle(0x224466, 0.55)
      .lineStyle(1, 0x224466, 0.75)
      .fillRectShape(paneRect)
      .strokeRectShape(paneRect)

    this.debugText = this.add.text(10, 10, `Hello`, {
      font: '14px monospace',
      fill: '#fff',
    })
  }

  update() {
    const mainScene: MainScene = this.scene.get('MainScene')
    const mainCamera = mainScene.cameras.main
    const camWorldVieww = mainCamera.worldView
    const CX = camWorldVieww.centerX
    const CY = camWorldVieww.centerY

    const CTX = CX >> 4
    const CTY = CY >> 4

    this.debugText.setText([
      `Loaded chunks: ${Object.keys(mainScene.mapManager.chunks).length}`,
      `Cam tile pos: X ${CTX.toFixed(0)}, Y ${CTY.toFixed(0)}`,
      `Cam zoom: ${mainCamera.zoom.toFixed(2)}`,
      `Cam bounds: ${camWorldVieww.top | 0},${camWorldVieww.right | 0},${camWorldVieww.bottom | 0},${camWorldVieww.left | 0}`,
    ])
  }
}