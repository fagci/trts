import { EnergyPrefab } from './energy'
import Entity from '../../ecs/entity'

export class EnergyConsumer extends EnergyPrefab {
  lightBulb: Phaser.GameObjects.Graphics

  constructor(scene: Phaser.Scene, entity: Entity) {
    super(scene, entity)

    this.lightBulb = scene.add.graphics()
      .fillStyle(0x00ff00, 1)
      .fillCircle(0, 0, 8)
      .setDepth(this.depth)
  }

  update() {
    super.update()
    this.lightBulb.alpha = this.energy.capacity
    this.lightBulb.setPosition(this.x, this.y)
  }
}