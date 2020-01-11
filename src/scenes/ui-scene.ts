export default class UIScene extends Phaser.Scene {
  constructor () {
    super({key: 'UIScene'})
  }

  create() {
    this.add.image(0, 0, 'swss', 'plane')
    this.debugText = this.add.text(10, 10, `Hello`, { font: '18px monospace', fill: '#000' })
    this.debugText.setScrollFactor(0)
  }

  update() {
    const mainCamera = this.scene.get('MainScene').cameras.main
    this.debugText.setText(`Camera pos:
X: ${mainCamera.centerX} Y: ${mainCamera.centerY}
Camera zoom: ${mainCamera.zoom.toFixed(2)}`)
  }
}