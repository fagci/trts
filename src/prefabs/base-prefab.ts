import Entity from '../ecs/entity'
import * as C from '../components/components'

export default abstract class BasePrefab extends Phaser.Physics.Arcade.Sprite {
  entity: Entity
  entityIdText: Phaser.GameObjects.Text
  position: C.Position

  protected constructor(scene: Phaser.Scene, entity: Entity) {
    let Position: C.Position, RenderObject: C.RenderObject
    ({ Position, RenderObject } = entity.components)
    Position = Position || new C.Position()
    super(scene, Position.x, Position.y, 'swss', RenderObject.texture)
    scene.add.existing(this)
    if (RenderObject.animation) {
      this.anims._startAnimation(RenderObject.animation)
    }
    this.entity = entity
    this.position = Position

    this.setDepth(2)

    // this.entityIdText = scene.add.text(this.x, this.y, `${entity.id} (${entity.dataset.name.replace(/[^A-Z0-9]/g, '')})`, {
    //   color: '#fff',
    //   font: '10px monospace'
    // })
    //   .setStroke('#000', 3)
    //   .setDepth(this.depth)

    // this.entityIdText.setDisplayOrigin(this.entityIdText.width / 2, this.height + this.entityIdText.height / 2)
  }

  update() {
    // this.entityIdText.setPosition(this.x, this.y)
    if (this.body) {
      this.setDepth(this.body.velocity.length() > 0 ? 3 : 2)
      // this.entityIdText.setDepth(this.depth)
    }
  }
}