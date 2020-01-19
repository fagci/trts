import * as C from '../../components/components'
import Entity from '../../ecs/entity'
import BasePrefab from '../base-prefab'

export abstract class EnergyPrefab extends BasePrefab {
  entity: Entity
  energyCapacityText: Phaser.GameObjects.Text
  energy: C.Energy
  connections: Phaser.GameObjects.Graphics

  protected constructor(scene: Phaser.Scene, entity: Entity) {
    let Energy: C.Energy
    ({ Energy } = entity.components)
    super(scene, entity)
    this.energy = Energy

    this.connections = scene.add.graphics()
      .setDepth(1)

    this.energyCapacityText = scene.add.text(this.x, this.y, '---', {
      color: '#fff',
      font: '12px monospace'
    })
      .setOrigin(0.5, 0)
      .setStroke('#000', 3)
      .setDepth(this.depth)
      .setLineSpacing(-4)
  }

  update() {
    super.update()
    const connections = this.energy.connections
    const connectionIds = Object.keys(connections)

    this.energyCapacityText
      .setPosition(this.x, this.y + this.height / 2)
      .setText([
        `${this.energy.capacity.toFixed(2)}/${this.energy.totalCapacity.toFixed(0)}`,
        `${connectionIds}`,
        `I: ${this.energy.current}`,
      ])

    if (this.energy.isDirty) {
      this.connections
        .setPosition(this.x, this.y)
        .clear()
      if (connectionIds.length !== 0) {
        for (let entity of Object.values(connections)) {
          let p = entity.components.Position
          this.connections
            .lineStyle(3, 0xaaddee)
            .moveTo(0, 0)
            .lineTo(p.x - this.x, p.y - this.y)
        }
        this.connections.strokePath()
      }
      this.energy.isDirty = false
    }
    if (this.entity.components.Moving !== undefined) {
      this.energyCapacityText.setDepth(this.depth)
    }
  }
}