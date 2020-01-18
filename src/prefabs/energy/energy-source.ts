import * as C from '../../components/components'
import Entity from '../../ecs/entity'
import {EnergyPrefab} from './energy'

export abstract class EnergySource extends EnergyPrefab {
  energyRange: Phaser.GameObjects.Graphics

  constructor(scene: Phaser.Scene, entity: Entity) {
    let energyComponent: C.Energy = entity.components.Energy
    super(scene, entity)

    this.energyRange = scene.add.graphics()
      .fillStyle(0x222222, 0.24)
      .fillCircle(0, 0, energyComponent.range)
      // .strokeCircle(0, 0, energyComponent.range)
      .setDepth(0)
  }

  update() {
    super.update()
    this.energyRange.setPosition(this.x, this.y)
  }
}