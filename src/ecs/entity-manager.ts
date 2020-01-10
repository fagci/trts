import Entity from './entity'

export default class EntityManager {
  private static _eid = 0
  static hasNewMember: boolean = false
  private static readonly entityTag: string = 'ecs-entity'

  static create(name?: string) {
    this.hasNewMember = true
    let entity = document.createElement(this.entityTag) as Entity
    entity.components = {}
    if (name) entity.dataset.name = name
    entity.id = `e${EntityManager._eid++}`

    entity.addComponent = (component) => this.addComponent(entity, component)

    return entity
  }

  static find(selector: string, root: any = document) {
    return Array.from(root.querySelectorAll(selector)) as Entity[]
  }

  static getComponents<T>(componentName: string, root: any = document) {
    return this.find(`${this.entityTag}[${componentName.toLowerCase()}]`, root).map(({components}) => components[componentName]) as T[]
  }

  static getEntities(deps: string[], root: any = document) {
    return this.find(`${this.entityTag}[${deps.join('][')}]`, root)
  }

  static addComponent(entity, component) {
    this.hasNewMember = true
    let name = component.constructor.name
    component.entity = entity
    entity.setAttribute(name, '')
    entity.components[name] = component
    return entity
  }
}
