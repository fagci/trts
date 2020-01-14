import * as C from '../components/components'
import Entity from '../ecs/entity'

export class EnergySource extends Phaser.Physics.Arcade.Sprite {
  entity: Entity
  energyRange: Phaser.GameObjects.Graphics

  constructor(scene: Phaser.Scene, entity: Entity) {
    let Position: C.Position, RenderObject: C.RenderObject, EnergyGenerator: C.EnergyGenerator,
      EnergyTransponder: C.EnergyTransponder
    ({Position, RenderObject, EnergyGenerator, EnergyTransponder} = entity.components)
    super(scene, Position.x, Position.y, 'swss', RenderObject.texture)
    this.entity = entity
    scene.add.existing(this)
    this.anims._startAnimation(RenderObject.animation)
    this.setDepth(2)

    const energySourceComponent = EnergyTransponder || EnergyGenerator
    this.energyRange = scene.add.graphics()
      .fillStyle(0x0066ff, 0.45)
      .fillCircle(0, 0, energySourceComponent.range)
      .setDepth(0)
  }

  update() {
    this.setPosition(this.entity.components.Position.x, this.entity.components.Position.y)
    this.energyRange.setPosition(this.x, this.y)
  }
}