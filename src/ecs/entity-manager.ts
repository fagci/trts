import Entity from './entity'

export default class EntityManager {
  private static _eid = 0
  private static readonly entityTag: string = 'ecs-entity'

  static create(name: string) {
    let entity = document.createElement(this.entityTag) as Entity
    entity.components = {}
    entity.id = (EntityManager._eid++).toString()

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
    let name = component.constructor.name
    component.entity = entity
    entity.setAttribute(name, '')
    entity.components[name] = component
    return entity
  }
}
