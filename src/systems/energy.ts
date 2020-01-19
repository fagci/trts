import System from '../ecs/system'
import Entity from '../ecs/entity'
import * as C from '../components/components'

export default class EnergySystem extends System {
  deps = [
    C.Energy.name,
  ]

  update(time: number, delta: number) {
    let sourceEntity: Entity, sinkEntity: Entity
    let source: C.Energy, sink: C.Energy
    let sourcePos: C.Position, sinkPos: C.Position

    // BUILD GRAPH

    for (sourceEntity of this.group) { // sources
      if (!EnergySystem.filterSource(sourceEntity)) continue

      source = sourceEntity.components.Energy
      sourcePos = sourceEntity.components.Position

      for (sinkEntity of this.group) { // sinks
        if (sourceEntity === sinkEntity) continue
        if (!EnergySystem.filterSink(sinkEntity)) continue

        // TODO: pass transponder if it already exists in links
        // also, I think, Transponder will behave as layer
        sinkPos = sinkEntity.components.Position

        if (Phaser.Math.Distance.BetweenPoints(sourcePos, sinkPos) > source.range) {
          source.removeConnection(sinkEntity) // disconnect
        } else {
          source.addConnection(sinkEntity) // connect source to sinks
        }
      }
    }

    // DISTRIBUTE ENERGY
    let connections: object

    for (sourceEntity of this.group) {
      if (!EnergySystem.filterSource(sourceEntity)) continue
      source = sourceEntity.components.Energy
      connections = source.connections

      // Generate energy
      if (sourceEntity.components.EnergyGenerator !== undefined && source.capacity < source.totalCapacity) {
        source.capacity += sourceEntity.components.EnergyGenerator.powerSource.current * delta
        source.capacity = Math.min(source.capacity, source.totalCapacity)
      }

      // Consume energy

      if(source.capacity < source.connectionsTotalCurrent) continue

      for (const sinkId in connections) {
        if (connections.hasOwnProperty(sinkId)) {

          sinkEntity = connections[sinkId]

          sink = sinkEntity.components.Energy
          let sinkConsumeCurrent: number = 0

          sinkConsumeCurrent = sink.current

          let taken = Math.min(sinkConsumeCurrent * delta, source.capacity)

          source.capacity -= taken
          sink.capacity += taken
          sink.capacity = Math.min(sink.capacity, sink.totalCapacity)

          if (sinkEntity.components.EnergyConsumer !== undefined) { // TODO: use energy for something
            let usage = sinkEntity.components.EnergyConsumer.usage
            if (sink.capacity >= usage) sink.capacity -= usage
          }
        }
      }
    }
  }

  static filterSource(entity: Entity) {
    return entity.components.EnergyGenerator
      || entity.components.EnergyTransponder
  }

  static filterSink(entity: Entity) {
    return entity.components.EnergyConsumer
      || entity.components.EnergyTransponder
  }
}