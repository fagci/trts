import { Scene } from 'phaser'
import Entity from '../ecs/entity'
import { RenderObject } from '../components/components'

export default class UIScene extends Phaser.Scene {
  debugText: Phaser.GameObjects.Text
  crosshair: Phaser.GameObjects.Graphics

  entityList: Map<string, Entity> = new Map()
  entityListView: Phaser.GameObjects.Container

  constructor() {
    super({ key: 'UIScene' })
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

    this.entityListView = this.add.container(0, 0)
  }

  update() {
    this.crosshair.setPosition(this.cameras.main.centerX, this.cameras.main.centerY)
  }

  addEntity(entity: Entity) {
    this.entityList.set(entity.id, entity)

    this.entityListView.removeAll()
    this.entityList.forEach(entity => {
      let r: RenderObject = entity.components.RenderObject
      let sprite = this.make.sprite({
        key: r.gameObject.frame.texture.key,
        frame: r.gameObject.frame.name,
      })
      sprite.setOrigin(0, 0).setInteractive()
      sprite.on('pointerup', (e) => {
        console.log(`Click`, e)
        const mainCamera = this.scene.get('MainScene').cameras.main
        mainCamera.stopFollow()
      })
      this.entityListView.add(sprite)
    })
  }
}