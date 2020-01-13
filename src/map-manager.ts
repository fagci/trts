import EntityManager from './ecs/entity-manager'
import * as Components from './components/components'
import System from './ecs/system'
import MovingSystem from './systems/moving'
import RenderSystem from './systems/render'
import HealthBar from './ui/health-bar'
import Chunk from './chunk'


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
        let componentOptions = mergedComponents[componentName]
        let Component = Components[componentName]
        if (!Component) {
          console.warn(`Component ${componentName} not exists`)
          continue
        }
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

  private postProcessEntityComponents(entity: import('/home/fagci/IdeaProjects/trts/src/ecs/entity').default) {
    let {RenderObject, Health, Position, EnergyGenerator, EnergyTransponder} = entity.components
    let energySource = EnergyGenerator || EnergyTransponder

    if (RenderObject) {
      let texture = RenderObject.texture
      let scene = this.scene
      let {x, y} = Position

      if (energySource) {
        const energyField = scene.add.graphics()
          .fillStyle(0x0000ff, 0.24)
          .fillCircle(x, y, energySource.range)
          .setDepth(1)

        this.bottomLayer.add(energyField)
      }

      let sprite: Phaser.GameObjects.Sprite | Phaser.GameObjects.Image
      if (texture instanceof Array) {
        let animationKey = this.createAnimation(texture)
        sprite = scene.add.sprite(x, y, 'swss').play(animationKey)
      } else {
        sprite = scene.add.image(x, y, 'swss', texture)
      }

      if (Health) {
        let healthBar = new HealthBar(scene, entity)
        healthBar.setPosition(x - healthBar.width / 2, y - sprite.height / 2 - healthBar.height - 4)
        healthBar.setDepth(10)
        scene.add.existing(healthBar)
        this.interfaceLayer.add(healthBar)
      }

      sprite.setDepth(5)

      this.entityLayer.add(sprite)
    }
    return entity
  }

  private createAnimation(frames: string[]) {
    let animationKey = frames.toString()
    if (this.scene.anims.get(animationKey)) return animationKey
    this.scene.anims.create({
      key: animationKey,
      frameRate: 12,
      repeat: -1,
      frames: this.scene.anims.generateFrameNames('swss', {frames}),
    })
    return animationKey
  }
}