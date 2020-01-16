import Entity from '../ecs/entity'
import * as C from '../components/components'

export default abstract class BasePrefab extends Phaser.Physics.Arcade.Sprite {
  entity: Entity
  entityIdText: Phaser.GameObjects.Text
  position: C.Position

  protected constructor(scene: Phaser.Scene, entity: Entity) {
    let Position: C.Position, RenderObject: C.RenderObject
    ({ Position, RenderObject } = entity.components)
    Position = Position || new Phaser.Geom.Point()
    super(scene, Position.x, Position.y, 'swss', RenderObject.texture)
    scene.add.existing(this)
    if(RenderObject.animation) {
      this.anims._startAnimation(RenderObject.animation)
    }
    this.entity = entity
    this.position = Position

    this.setDepth(2)

    this.entityIdText = scene.add.text(this.x, this.y, `${entity.id} (${entity.dataset.name})`, {
      color: '#fff',
      font: '12px monospace'
    })
      .setOrigin(0.5, 1)
      .setStroke('#000', 3)
      .setDepth(this.depth)
  }

  update() {
    this.setPosition(this.position.x, this.position.y)
    this.entityIdText.setPosition(this.x, this.y - this.height / 2)
  }
}