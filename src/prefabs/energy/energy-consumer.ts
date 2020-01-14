import * as C from '../../components/components'
import Entity from '../../ecs/entity'

export abstract class EnergyConsumer extends Phaser.Physics.Arcade.Sprite {
  entity: Entity
  energyRange: Phaser.GameObjects.Graphics

  constructor(scene: Phaser.Scene, entity: Entity) {
    let Position: C.Position, RenderObject: C.RenderObject, EnergyGenerator: C.EnergyGenerator,
      EnergyConsumer: C.EnergyConsumer
    ({Position, RenderObject, EnergyConsumer} = entity.components)
    super(scene, Position.x, Position.y, 'swss', RenderObject.texture)
    this.entity = entity
    scene.add.existing(this)
    this.setDepth(2)
  }

  update() {
    this.setPosition(this.entity.components.Position.x, this.entity.components.Position.y)
  }
}