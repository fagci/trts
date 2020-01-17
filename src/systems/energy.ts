import System from '../ecs/system'
import * as C from '../components/components'
import Entity from '../ecs/entity'

export default class EnergySystem extends System {
  deps = [
    C.Energy.name,
  ]

  update(time: number, delta: number) {
    let energy1: C.Energy, energy2: C.Energy, pos1: C.Position, pos2: C.Position
    let distance: number

    for (const entity1 of this.group) { // TODO: only sources
      ({Energy: energy1, Position: pos1} = entity1.components)

      EnergySystem.generateEnergy(entity1, energy1, delta)

      if (!entity1.hasAttribute(C.EnergyGenerator.name) && !entity1.hasAttribute(C.EnergyTransponder.name)) {
        continue
      }


      for (const entity2 of this.group) {
        if (entity1 === entity2) continue
        ({Energy: energy2, Position: pos2} = entity2.components)

        distance = Phaser.Math.Distance.Between(pos1.x, pos1.y, pos2.x, pos2.y)

        if (distance > energy2.range) {
          delete energy1.connections[entity2.id] // disconnect
        } else {
          energy1.connections[entity2.id] = entity2 // connect source to sinks
        }
      }
    }

    for (const energySource of this.group) {
      if (!energySource.hasAttribute(C.EnergyGenerator.name) && !energySource.hasAttribute(C.EnergyTransponder.name)) {
        continue
      }

      const consumersEnergy: C.Energy = energySource.components.Energy
      let connections = consumersEnergy.connections

      for (const sink in connections) {
        if (connections.hasOwnProperty(sink)) {
          const connection: Entity = connections[sink]
          EnergySystem.consumeEnergy(energySource, connection)
        }
      }
    }
  }

  private static generateEnergy(entity1: Entity, energy1: C.Energy, delta: number) {
    if (entity1.hasAttribute(C.EnergyGenerator.name) && energy1.capacity < energy1.totalCapacity) {
      energy1.capacity += entity1.components.EnergyGenerator.powerSource.current * delta
      energy1.capacity = Phaser.Math.Clamp(energy1.capacity, 0, energy1.totalCapacity)
    }
  }

  private static consumeEnergy(source: Entity, dst: Entity) {
    let sourceEnergy: C.Energy = source.components.Energy
    let dstEnergy: C.Energy = dst.components.Energy
    let dstConsumeCurrent: number = 0
    if (dst.hasAttribute(C.EnergyTransponder.name)) {
      dstConsumeCurrent = dst.components.Energy.current
    }
    if (dst.hasAttribute(C.EnergyConsumer.name)) {
      dstConsumeCurrent = dst.components.EnergyConsumer.usage
    }

    let taken = Phaser.Math.Clamp(dstConsumeCurrent, 0, sourceEnergy.capacity)
    sourceEnergy.capacity -= taken
    dstEnergy.capacity += taken
    dstEnergy.capacity = Phaser.Math.Clamp(dstEnergy.capacity, 0, dstEnergy.totalCapacity)


    if (dst.hasAttribute(C.EnergyConsumer.name)) {
      if (dstEnergy.capacity >= dst.components.EnergyConsumer.usage) {
        dstEnergy.capacity -= dst.components.EnergyConsumer.usage
      }
    }
  }
}