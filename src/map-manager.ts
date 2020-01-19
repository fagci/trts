import EntityManager from './ecs/entity-manager'
import * as Components from './components/components'
import { RenderObject, Slots } from './components/components'
import System from './ecs/system'
import MovingSystem from './systems/moving'
import RenderSystem from './systems/render'
import Chunk from './chunk'

import * as Prefabs from './prefabs'
import Entity from './ecs/entity'
import EnergySystem from './systems/energy'
import UIScene from './scenes/ui-scene'


export default class MapManager {
  scene: Phaser.Scene

  groundLayer: Phaser.GameObjects.Group
  bottomLayer: Phaser.GameObjects.Group
  entityLayer: Phaser.GameObjects.Group
  interfaceLayer: Phaser.GameObjects.Group

  chunks = {}

  entities: any
  maps: any

  constructor(scene: Phaser.Scene, mapName) {
    this.scene = scene

    this.groundLayer = scene.add.group()
    this.bottomLayer = scene.add.group()
    this.entityLayer = scene.add.group()
    this.interfaceLayer = scene.add.group()

    this.entities = this.scene.cache.json.get('entities')
    this.maps = this.scene.cache.json.get('maps')
    const testMap = this.maps[mapName]

    for (let mapEntity of testMap.entities) {
      this.createEntityWithComponents(mapEntity.type, document.documentElement as Entity, mapEntity.components)
    }

    System
      // .addSystem(new MovingSystem())
      .addSystem(new EnergySystem())
      .addSystem(new RenderSystem())
  }

  private createEntityWithComponents(entityName, parent: Entity = document.documentElement as Entity, entityMapComponents?: object) {
    let entityDefComponents = this.entities[entityName]
    let mergedComponents = Phaser.Utils.Objects.Merge(entityMapComponents || {}, entityDefComponents)
    let entity = EntityManager.create(entityName)

    if (!entityDefComponents) {
      console.warn(`Entity ${entityName} not defined`)
      return null
    }

    parent.appendChild(entity)

    for (let componentName in mergedComponents) {
      if (!mergedComponents.hasOwnProperty(componentName)) continue
      let componentOptions = mergedComponents[componentName]
      let Component = Components[componentName]
      if (!Component) {
        console.warn(`Component ${componentName} not exists`)
        continue
      }
      let component = new Component()
      Object.assign(component, componentOptions)
      component.init && component.init(componentOptions)
      entity.addComponent(component)
    }

    this.postProcessEntityComponents(entity)
    return entity
  }

  onCameraUpdate() {
    let { left, top, right, bottom } = this.scene.cameras.main.worldView

    let SX = (left >> 8) - 2
    let SY = (top >> 8) - 2

    let EX = (right >> 8) + 2
    let EY = (bottom >> 8) + 2

    let x: number, y: number, chunk: Chunk, chunkKey: string

    for (x = SX; x < EX; x++) {
      for (y = SY; y < EY; y++) {
        chunkKey = `${x}:${y}`
        chunk = this.chunks[chunkKey]
        if (chunk) continue

        chunk = new Chunk(this.scene, x, y)
        chunk.load(this.groundLayer)
        this.chunks[chunkKey] = chunk
      }
    }

    for (chunkKey in this.chunks) {
      chunk = this.chunks[chunkKey]
      if (!chunk) continue
      if (SX > chunk.x || SY > chunk.y || EX < chunk.x || EY < chunk.y) {
        chunk.unload()
        delete this.chunks[chunkKey]
      }
    }
  }

  static update(time: number, delta: number) {
    System.update(time, delta / 1000.0)
  }

  private postProcessEntityComponents(entity: Entity) {
    let RenderObject: RenderObject, Slots: Slots
    ({ RenderObject, Slots } = entity.components)


    if (RenderObject) {
      let gameObject = MapManager.makePrefabForEntity(this.scene, entity, entity.parentElement as Entity)
      gameObject && this.entityLayer.add(gameObject)
      let ui: UIScene = this.scene.scene.get('UIScene') as UIScene
      ui.addEntity(entity)
    }
    if (Slots) {
      for (let slotEntityName of Slots.places) {
        let slotEntity = this.createEntityWithComponents(slotEntityName, entity)
        Slots.items.push(slotEntity)
      }
    }

    return entity
  }

  static makePrefabForEntity(scene, entity: Entity, parent?: Entity) {
    const prefabName = entity.dataset.name
    const Prefab = Prefabs[prefabName]
    const RenderObject: RenderObject = entity.components.RenderObject
    if (Prefab) {
      return RenderObject.gameObject = new Prefab(scene, entity, parent)
    }
    console.warn(`Prefab ${prefabName} not found`)
    return null
  }
}