import Sprite = Phaser.GameObjects.Sprite

export default class MenuBar extends Phaser.GameObjects.Container {
  buttons: Sprite[]
  tooltip: Phaser.GameObjects.Text
  bg: Phaser.GameObjects.Graphics

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    scene.add.existing(this)

    this.scene = scene
    this.buttons = []
    this.tooltip = scene.add.text(0, 0, '', {
      font: '14px monospace',
      color: '#fff'
    }).setOrigin(0, 0).setStroke('#268', 3)

    this.bg = new Phaser.GameObjects.Graphics(scene, { fillStyle: { color: 0x226688 } })
      .fillRect(0, 0, 1, 44)
    this.add(this.bg)
  }

  addButton(tileKey: number, title: string, onClick: (e: any) => void) {
    let sprite = new Phaser.GameObjects.Sprite(this.scene, this.buttons.length * 44 + 21, 22, 'icons', tileKey)
    this.add(sprite)
    const tooltip = this.tooltip
    sprite
      .setTintFill(0xe0e0e0)
      .setData('title', title)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', function (pointer: PointerEvent) {
        this.setTintFill(0xffffaa)
        tooltip.setText(this.getData('title'))
        tooltip.setPosition(this.x - 16, this.y + this.height)
      })
      .on('pointerout', function (pointer: PointerEvent) {
        this.setTintFill(0xe0e0e0)
        tooltip.setText(null)
      })
      .on('pointerup', function (e: PointerEvent) {
        this.setTintFill(0xe0e0e0)
        tooltip.setText(null)
        onClick(e)
      })

    sprite.input.hitArea = new Phaser.Geom.Rectangle(-10, -10, 44, 44)

    this.buttons.push(sprite)
    this.bg.setScale(this.buttons.length * 44, 1)
    return this
  }
}