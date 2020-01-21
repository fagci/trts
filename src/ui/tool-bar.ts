import { Scene } from 'phaser'

export default class ToolBar extends Phaser.GameObjects.Container {
  constructor (scene: Scene, x, y) {
    super(scene, x, y)
    scene.add.existing(this)
  }
}