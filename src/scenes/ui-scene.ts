import MenuBar from '../ui/menu-bar'

export default class UIScene extends Phaser.Scene {
  crosshair: Phaser.GameObjects.Graphics
  topMenuBar: MenuBar
  fpsText: Phaser.GameObjects.Text

  constructor() {
    super({key: 'UIScene'})
  }

  create() {
    this.crosshair = this.add.graphics()
      .lineStyle(1, 0xffff00)
      .moveTo(-8, 0)
      .lineTo(8, 0)
      .moveTo(0, -8)
      .lineTo(0, 8)
      .strokePath()
      .strokeCircle(0, 0, 16)

    this.fpsText = this.add.text(this.game.renderer.width - 16, 16, '', {font: '14px'})
      .setOrigin(1, 0).setStroke('#000', 3)

    this.topMenuBar = new MenuBar(this, 0, 0)
    this.topMenuBar
      .addButton(119, 'Menu', () => {this.scene.launch('MenuScene')})
  }

  update() {
    this.crosshair.setPosition(this.cameras.main.centerX, this.cameras.main.centerY)
    this.fpsText.setText(`FPS ${this.game.loop.actualFps | 0}`);
  }
}