export default class UIScene extends Phaser.Scene {
  constructor () {
    super({key: 'UIScene'})
  }

  create() {
    const paneRect = new Phaser.Geom.Rectangle(0,0, 240, 128)
    this.add.graphics()
      .fillStyle(0x224466, 0.55)
      .lineStyle(1, 0x224466,0.75)
      .fillRectShape(paneRect)
      .strokeRectShape(paneRect)
    this.debugText = this.add.text(10, 10, `Hello`, { font: '14px monospace', fill: '#fff' })
  }

  update() {
    const mainCamera = this.scene.get('MainScene').cameras.main
    
    const CX = mainCamera.scrollX + mainCamera.centerX
    const CY = mainCamera.scrollY + mainCamera.centerY

    const CTX = CX >> 4
    const CTY = CY >> 4

    this.debugText.setText(`Camera pos: X ${CTX.toFixed(0)}, Y ${CTY.toFixed(0)}
Camera zoom: ${mainCamera.zoom.toFixed(2)}`)
  }
}