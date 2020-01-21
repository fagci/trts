import Sprite = Phaser.GameObjects.Sprite
import { Physics } from 'phaser'

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
      background: '#fff',
      color: '#000'
    }).setOrigin(0, 0)

    this.bg = new Phaser.GameObjects.Graphics(scene, {fillStyle: {color: 0x4466ee}})
      .fillRect(0,0,1,48)
    this.add(this.bg)
  }

  addButton(tileKey: number, title: string, onClick: (e: any) => void) {
    let sprite = new Phaser.GameObjects.Sprite(this.scene, this.buttons.length * 24, 0, 'icons', tileKey)
    this.add(sprite)
    const tooltip = this.tooltip
    sprite
      .setOrigin(0, 0)
      .setData('title', title)
      .setInteractive({ useHandCursor: true  } )
      .on('pointerover', function (pointer: PointerEvent) {
        tooltip.setText(this.getData('title'))
        tooltip.setPosition(this.x + 4, this.y + this.height)
      })
      .on('pointerout', function(pointer: PointerEvent) {
        tooltip.setText(null)
      })
      .on('pointerup', onClick)
    this.buttons.push(sprite)
    this.bg.setScale(this.buttons.length * 24, 1)
    return this
  }
}