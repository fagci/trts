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
      energy1 = entity1.components.Energy
      pos1 = entity1.components.Position

      EnergySystem.generateEnergy(entity1, energy1, delta)

      if(!entity1.hasAttribute(C.EnergyGenerator.name) && !entity1.hasAttribute(C.EnergyTransponder.name)) {
        continue
      }
      

      for (const entity2 of this.group) {
        if (entity1 === entity2) continue
        energy2 = entity2.components.Energy
        pos2 = entity2.components.Position

        distance = Phaser.Math.Distance.Between(pos1.x, pos1.y, pos2.x, pos2.y)

        if (distance > energy2.range) {
          // disconnect
          delete energy2.connections[entity1.id]
        } else {
          // connect
          energy2.connections[entity1.id] = entity1
        }
      }
    }

    for(const energyConsumer of this.group) {
      if(!energyConsumer.hasAttribute(C.EnergyConsumer.name) && !energyConsumer.hasAttribute(C.EnergyTransponder.name)) {
        continue
      }

      const consumersEnergy: C.Energy = energyConsumer.components.Energy
      let connections = consumersEnergy.connections

      for (const source in connections) {
        if (connections.hasOwnProperty(source)) {
          const connection: Entity = connections[source]
          EnergySystem.consumeEnergy(connection, energyConsumer)
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
    if(dst.hasAttribute(C.EnergyTransponder.name)) {
      dstConsumeCurrent = dst.components.Energy.current
    }
    if(dst.hasAttribute(C.EnergyConsumer.name)) {
      dstConsumeCurrent = dst.components.EnergyConsumer.usage
    }

    let taken = Phaser.Math.Clamp(dstConsumeCurrent, 0, sourceEnergy.capacity)
    sourceEnergy.capacity -= taken
    dstEnergy.capacity += taken
    dstEnergy.capacity = Phaser.Math.Clamp(dstEnergy.capacity, 0, dstEnergy.totalCapacity)


    if(dst.hasAttribute(C.EnergyConsumer.name)) {
      if(dstEnergy.capacity>= dst.components.EnergyConsumer.usage) {
        dstEnergy.capacity -= dst.components.EnergyConsumer.usage
      }
    }
  }
}