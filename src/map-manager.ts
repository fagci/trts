import EntityManager from './ecs/entity-manager'
import * as Components from './components/components'
import System from './ecs/system'
import MovingSystem from './systems/moving'
import RenderSystem from './systems/render'
import Chunk from './chunk'

import * as Prefabs from './prefabs'
import Entity from './ecs/entity'


export default class MapManager {
  scene: Phaser.Scene

  groundLayer: Phaser.GameObjects.Group
  bottomLayer: Phaser.GameObjects.Group
  entityLayer: Phaser.GameObjects.Group
  interfaceLayer: Phaser.GameObjects.Group

  chunks = {}
  chunkRadiusToLoad = 3


  constructor(scene: Phaser.Scene, mapName) {
    this.scene = scene

    this.groundLayer = scene.add.group()
    this.bottomLayer = scene.add.group()
    this.entityLayer = scene.add.group()
    this.interfaceLayer = scene.add.group()

    const entities = this.scene.cache.json.get('entities')
    const maps = this.scene.cache.json.get('maps')
    const testMap = maps[mapName]

    for (let mapEntity of testMap.entities) {
      const entityName = mapEntity.type
      let entityDefComponents = entities[entityName]
      let entityMapComponents = mapEntity.components
      let mergedComponents = Phaser.Utils.Objects.Merge(entityMapComponents, entityDefComponents)

      let entity = EntityManager.create(entityName)

      for (let componentName in mergedComponents) {
        if (!mergedComponents.hasOwnProperty(componentName)) continue
        let componentOptions = mergedComponents[componentName]
        let Component = Components[componentName]
        if (!Component) {
          console.warn(`Component ${componentName} not exists`)
          continue
        }
        console.log(`${componentName}`, componentOptions)
        let component = new Component(componentOptions)
        entity.addComponent(component)
      }

      this.postProcessEntityComponents(entity)

      document.documentElement.appendChild(entity)
    }

    System
      .addSystem(new MovingSystem())
      .addSystem(new RenderSystem())
  }

  onCameraUpdate() {
    let {left, top, right, bottom} = this.scene.cameras.main.worldView

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
        chunk.load()
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

  update(time: number, delta: number) {
    System.update(time, delta)
  }

  private postProcessEntityComponents(entity: Entity) {
    let {RenderObject} = entity.components
    if (RenderObject) {
      const prefabName = entity.dataset.name
      const Prefab = Prefabs[prefabName]
      if (Prefab) {
        RenderObject.gameObject = new Prefab(this.scene, entity)
      } else {
        console.warn(`Prefab ${prefabName} not found`)
      }
    }
    return entity
  }
}