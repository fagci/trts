import System from '../ecs/system'
import Entity from '../ecs/entity'
import * as C from '../components/components'

const distanceBetween = Phaser.Math.Distance.Between

export default class EnergySystem extends System {
  deps = [
    C.Energy.name,
  ]

  static filterSource(entity: Entity) {
    return entity.components.EnergyGenerator
      || entity.components.EnergyTransponder
  }

  static filterSink(entity: Entity) {
    return entity.components.EnergyConsumer
      || entity.components.EnergyTransponder
  }

  update(time: number, delta: number) {
    let energy1: C.Energy, energy2: C.Energy, pos1: C.Position, pos2: C.Position

    for (const entity1 of this.group) { // sources
      if (!EnergySystem.filterSource(entity1)) continue

      ({ Energy: energy1, Position: pos1 } = entity1.components)

      EnergySystem.generateEnergy(entity1, energy1, delta)

      for (const entity2 of this.group) { // sinks
        if (entity1 === entity2) continue
        if (!EnergySystem.filterSink(entity2)) continue

        // TODO: pass transponder if it already exists in links
        // also, I think, Transponder will behave as layer
        ({ Energy: energy2, Position: pos2 } = entity2.components)

        if (distanceBetween(pos1.x, pos1.y, pos2.x, pos2.y) > energy1.range) {
          energy1.removeConnection(entity2) // disconnect
        } else {
          energy1.addConnection(entity2) // connect source to sinks
        }
      }
    }

    for (const energySource of this.group) {
      if (!EnergySystem.filterSource(energySource)) {
        continue
      }

      const consumersEnergy: C.Energy = energySource.components.Energy
      let connections = consumersEnergy.connections

      let percent = 1.0 / Object.keys(connections).length

      for (const sink in connections) {
        if (connections.hasOwnProperty(sink)) {
          const connection: Entity = connections[sink]
          EnergySystem.consumeEnergy(energySource, connection, percent)
        }
      }
    }
  }

  private static generateEnergy(entity1: Entity, energy1: C.Energy, delta: number) {
    if (entity1.components.EnergyGenerator && energy1.capacity < energy1.totalCapacity) {
      energy1.capacity += entity1.components.EnergyGenerator.powerSource.current * delta
      energy1.capacity = Phaser.Math.Clamp(energy1.capacity, 0, energy1.totalCapacity)
    }
  }

  private static consumeEnergy(source: Entity, dst: Entity, percent: number) {
    let sourceEnergy: C.Energy = source.components.Energy
    let dstEnergy: C.Energy = dst.components.Energy
    let dstConsumeCurrent: number = 0
    if (dst.components.EnergyTransponder !== undefined) {
      dstConsumeCurrent = dst.components.Energy.current
    }
    if (dst.components.EnergyConsumer !== undefined) {
      dstConsumeCurrent = dst.components.EnergyConsumer.usage

      let taken = Phaser.Math.Clamp(dstConsumeCurrent * percent, 0, sourceEnergy.capacity)
      sourceEnergy.capacity -= taken
      dstEnergy.capacity += taken
      dstEnergy.capacity = Phaser.Math.Clamp(dstEnergy.capacity, 0, dstEnergy.totalCapacity)

      if (dstEnergy.capacity >= dst.components.EnergyConsumer.usage) {
        dstEnergy.capacity -= dst.components.EnergyConsumer.usage
      }
    }
  }
}