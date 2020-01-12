import EntityManager from './entity-manager'
import Entity from './entity'

export default class System {
  static systems: { [name: string]: any } = {}

  deps: string[] = []
  group: Entity[]

  static update(time: number, delta: number) {
    for (let name in this.systems) {
      let system = this.systems[name]
      if (EntityManager.hasNewMember || system.group.length == 0) {
        system.group = EntityManager.getEntities(system.deps)
      }
      system.update(time, delta)
    }
    EntityManager.hasNewMember = false
  }

  static addSystem(system: System) {
    this.systems[system.deps.toString()] = system
    return this
  }

  static removeSystem(system: System) {
    this.systems[system.deps.toString()] = null
  }

  update(time: number, delta: number) {

  }
}