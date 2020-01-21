import Sprite = Phaser.GameObjects.Sprite

export default class MenuBar extends Phaser.GameObjects.Container {
  buttons: Sprite[]

  constructor(scene, x, y) {
    super(scene, x, y)
    this.scene = scene
    this.buttons = []
  }

  addButton(tileKey, onClick, onHover) {
    let sprite = this.scene.add.sprite(this.buttons.length * 16, 0, 'icons', tileKey)
    sprite.setOrigin(0, 0)
    this.buttons.push(sprite)
  }
}