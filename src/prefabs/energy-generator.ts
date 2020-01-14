import * as C from '../components/components'
import Entity from '../ecs/entity'

export class EnergyGenerator extends Phaser.Physics.Arcade.Sprite {
  entity: Entity
  energyRange: Phaser.GameObjects.Graphics

  constructor(scene: Phaser.Scene, entity: Entity) {
    let Position: C.Position, RenderObject: C.RenderObject, EnergyGenerator: C.EnergyGenerator
    ({Position, RenderObject, EnergyGenerator} = entity.components)
    super(scene, Position.x, Position.y, RenderObject.texture)
    this.entity = entity
    console.log(RenderObject.texture)
    scene.add.existing(this)
    this.anims._startAnimation(RenderObject.animation)
    this.setDepth(2)

    this.energyRange = scene.add.graphics()
      .fillStyle(0x0066ff,0.45)
      .fillCircle(0, 0, EnergyGenerator.range)
      .setDepth(0)
  }

  update() {
    this.setPosition(this.entity.components.Position.x, this.entity.components.Position.y)
    this.energyRange.setPosition(this.x, this.y)
  }
}