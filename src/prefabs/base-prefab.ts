import Entity from '../ecs/entity'
import * as C from '../components/components'

export default abstract class BasePrefab extends Phaser.Physics.Arcade.Sprite {
  entity: Entity
  entityIdText: Phaser.GameObjects.Text
  position: C.Position
  selectionGraphics: Phaser.GameObjects.Graphics

  protected constructor(scene: Phaser.Scene, entity: Entity) {
    let Position: C.Position, RenderObject: C.RenderObject, Selectable: C.Selectable
    ({Position, RenderObject, Selectable} = entity.components)
    Position = Position || new C.Position()
    super(scene, Position.x, Position.y, 'swss', RenderObject.texture)
    scene.add.existing(this)
    if (RenderObject.animation) {
      this.anims._startAnimation(RenderObject.animation)
    }
    this.entity = entity
    this.position = Position

    this.setDepth(2)

    if (Selectable) {
      this.selectionGraphics = scene.add.graphics().setDepth(this.depth - 1)
      this.setInteractive()

      this.on('pointerup', e => {
        const bounds = this.getBounds()
        this.selectionGraphics.clear()
        Selectable.selected = !Selectable.selected
        if (Selectable.selected) {
          this.selectionGraphics
            .fillStyle(0x00ff00, 0.24)
            .lineStyle(1, 0x00ff00, 0.75)
            .fillRectShape(bounds)
            .strokeRectShape(bounds)
        }
      })
    }

    // this.entityIdText = scene.add.text(this.x, this.y, `${entity.id} (${entity.dataset.name.replace(/[^A-Z0-9]/g, '')})`, {
    //   color: '#fff',
    //   font: '10px monospace'
    // })
    //   .setStroke('#000', 3)
    //   .setDepth(this.depth)

    // this.entityIdText.setDisplayOrigin(this.entityIdText.width / 2, this.height + this.entityIdText.height / 2)
  }

  update(delta) {
    // this.entityIdText.setPosition(this.x, this.y)
    if (this.body) {
      this.setDepth(this.body.velocity.length() > 0 ? 3 : 2)
      // this.entityIdText.setDepth(this.depth)
    }
    if (this.selectionGraphics) {
      this.selectionGraphics.setPosition(this.x, this.y)
    }
  }
}