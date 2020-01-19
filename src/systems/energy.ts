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
    let source: C.Energy, sourcePos: C.Position, sinkPos: C.Position


    // build links between energy entities

    for (const sourceEntity of this.group) { // sources
      if (!EnergySystem.filterSource(sourceEntity)) continue

      ({ Energy: source, Position: sourcePos } = sourceEntity.components)
   
      for (const sinkEntity of this.group) { // sinks
        if (sourceEntity === sinkEntity) continue
        if (!EnergySystem.filterSink(sinkEntity)) continue

        // TODO: pass transponder if it already exists in links
        // also, I think, Transponder will behave as layer
        ({ Position: sinkPos } = sinkEntity.components)

        if (distanceBetween(sourcePos.x, sourcePos.y, sinkPos.x, sinkPos.y) > source.range) {
          source.removeConnection(sinkEntity) // disconnect
        } else {
          source.addConnection(sinkEntity) // connect source to sinks
        }
      }
    }

    // process energy distribution
    for (const sourceEntity of this.group) {
      if (!EnergySystem.filterSource(sourceEntity)) continue
      source = sourceEntity.components.Energy
      let connections = source.connections

      // Generate energy
      if (sourceEntity.components.EnergyGenerator !== undefined && source.capacity < source.totalCapacity) {
        source.capacity += sourceEntity.components.EnergyGenerator.powerSource.current * delta
        source.capacity = Phaser.Math.Clamp(source.capacity, 0, source.totalCapacity)
      }

      
      let percent = 1.0 / Object.keys(connections).length

      for (const sinkId in connections) {
        if (connections.hasOwnProperty(sinkId)) {
   
          let sinkEntity = connections[sinkId]
          
          // consume energy
         
          let sink: C.Energy = sinkEntity.components.Energy
          let sinkConsumeCurrent: number = 0

          sinkConsumeCurrent = sink.current

          let taken = Math.min(sinkConsumeCurrent * percent * delta, source.capacity)
          
          source.capacity -= taken
          sink.capacity += taken
          sink.capacity = Phaser.Math.Clamp(sink.capacity, 0, sink.totalCapacity)

          if (sinkEntity.components.EnergyConsumer !== undefined && sink.capacity >= sinkConsumeCurrent) {
            sink.capacity -= sinkEntity.components.EnergyConsumer.usage
          }   
        }
      }
    }
  }
}