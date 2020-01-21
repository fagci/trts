import MenuBar from '../ui/menu-bar'

export default class UIScene extends Phaser.Scene {
  crosshair: Phaser.GameObjects.Graphics
  topMenuBar: MenuBar

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

    this.topMenuBar = new MenuBar(this, 0, 0)
    this.topMenuBar.addButton(1, e => {
    }, e => {
    })

  }

  update() {
    this.crosshair.setPosition(this.cameras.main.centerX, this.cameras.main.centerY)
  }
}