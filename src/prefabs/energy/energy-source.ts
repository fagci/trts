import * as C from '../../components/components'
import Entity from '../../ecs/entity'
import BasePrefab from '../base-prefab'
import { EnergyPrefab } from './energy'

export abstract class EnergySource extends EnergyPrefab {
  energyRange: Phaser.GameObjects.Graphics
 
  constructor(scene: Phaser.Scene, entity: Entity) {
    let Energy: C.Energy
    ({ Energy } = entity.components)
    super(scene, entity)
 
    this.energyRange = scene.add.graphics()
      .fillStyle(0x2244ff)
      .fillCircle(0, 0, Energy.range)
      .setDepth(0)
  }

  update() {
    super.update()
    this.energyRange.setPosition(this.x, this.y)
  }
}