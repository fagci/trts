import EntityManager from './entity-manager'

export default class System {
  static systems: { [name: string]: any } = {}

  deps: string[] = []
  group: []

  static update(d: number) {
    for (let name in this.systems) {
      let system = this.systems[name]
      if (EntityManager.hasNewMember || system.group.length == 0) {
        system.group = EntityManager.getEntities(system.deps)
      }
      system.update(d)
    }
    EntityManager.hasNewMember = false
  }

  static addSystem(system: System) {
    this.systems[system.deps.toString()] = system
  }

  static removeSystem(system: System) {
    this.systems[system.deps.toString()] = null
  }

  update(d: number) {

  }
}