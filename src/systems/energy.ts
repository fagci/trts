import System from '../ecs/system'
import { Energy, Position, EnergyGenerator } from '../components/components'

export default class EnergySystem extends System {
  deps = [
    Energy.name
  ]

  update(time: number, delta: number) {
    let energy1: Energy, energy2: Energy, pos1: Position, pos2: Position
    let distance: number

    for (const entity1 of this.group) { // TODO: only sources
      energy1 = entity1.components.Energy
      pos1 = entity1.components.Position
      if (entity1.hasAttribute(EnergyGenerator.name) && energy1.capacity < energy1.totalCapacity) {
        energy1.capacity += entity1.components.EnergyGenerator.powerSource.current
        energy1.capacity = Phaser.Math.Clamp(energy1.capacity, 0, energy1.totalCapacity)
      }

      for (const entity2 of this.group) {
        if (entity1 === entity2) continue
        energy2 = entity2.components.Energy
        pos2 = entity2.components.Position

        distance = Phaser.Math.Distance.Between(pos1.x, pos1.y, pos2.x, pos2.y)

        if(distance > energy2.range) { // TODO: && energy1.capacity > 0
          // disconnect
          delete energy2.connections[entity1.id]
        } else {
          // connect
          energy2.connections[entity1.id] = entity1
        }

      }
    }
  }
}