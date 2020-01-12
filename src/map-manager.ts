import EntityManager from './ecs/entity-manager'
import * as Components from './components/components'

export default class MapManager {
  scene: Phaser.Scene
  constructor(scene: Phaser.Scene, mapName) {
    this.scene = scene
    const entities = this.scene.cache.json.get('entities')
    const maps = this.scene.cache.json.get('maps')
    const testMap = maps[mapName]

    for(let mapEntity of testMap.entities) {
      const entityName = mapEntity.type
      let entityDefComponents = entities[entityName]
      let entityMapComponents = mapEntity.components
      let mergedComponents = Phaser.Utils.Objects.Merge(entityMapComponents, entityDefComponents)

      let entity = EntityManager.create(entityName)

      for(let componentName in mergedComponents) {
        let componentOptions = mergedComponents[componentName]
        let Component = Components[componentName]
        if(!Component) {
          console.warn(`Component ${componentName} not exists`)
          continue
        }
        let component = new Component(componentOptions)
        entity.addComponent(component)
      }

      this.postProcessEntityComponents(entity)

      document.documentElement.appendChild(entity)
    }
  }

  private postProcessEntityComponents(entity: import("/home/fagci/IdeaProjects/trts/src/ecs/entity").default) {
    let { RenderObject, Position, EnergyGenerator, EnergyTransponder } = entity.components
    let energySource = EnergyGenerator || EnergyTransponder
    if (RenderObject) {
      let texture = RenderObject.texture

      if (energySource) {
        this.scene.add.graphics()
          .fillStyle(0x0000ff, 0.24)
          .fillCircle(Position.x, Position.y, energySource.range)
          .setDepth(1)
      }
      
      if (texture instanceof Array) {
        let animationKey = this.createAnimation(texture)
        this.scene.add.sprite(Position.x, Position.y, 'swss').play(animationKey).setDepth(10)
      } else {
        this.scene.add.image(Position.x, Position.y, 'swss', texture).setDepth(10)
      }
    }
    return entity
  }

  private createAnimation(frames: string[]) {
    let animationKey = frames.toString()
    if(this.scene.anims.get(animationKey)) return animationKey
    this.scene.anims.create({
      key: animationKey,
      frameRate: 12,
      repeat: -1,
      frames: this.scene.anims.generateFrameNames('swss', { frames })
    })
    return animationKey
  }
}