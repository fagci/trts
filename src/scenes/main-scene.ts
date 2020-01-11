import { Noise } from "noisejs"
import Chunk from "../chunk"
import { Input } from 'phaser'
import EntityManager from '../ecs/entity-manager'
import * as Components from '../components/components'

type KeyMap = { [key: string]: Input.Keyboard.Key }


export default class MainScene extends Phaser.Scene {
  tileSet: Phaser.Tilemaps.Tileset
  tileSetWater: Phaser.Tilemaps.Tileset
  followPoint: Phaser.Math.Vector2
  cameraSpeed: number = 64
  chunks = []
  noise: Noise

  movementKeys: KeyMap
  zoomKeys: KeyMap

  chunkRadiusToLoad = 3
  dragPoint: Phaser.Math.Vector2

  constructor() {
    super({ key: "MainScene" })
  }

  create(): void {

    this.scene.launch('UIScene')
    this.noise = new Noise(1)
    this.movementKeys = this.input.keyboard.addKeys('W,S,A,D') as KeyMap
    this.zoomKeys = this.input.keyboard.addKeys('Z,X') as KeyMap

    // this.followPoint = new Phaser.Math.Vector2(
    //   this.cameras.main.worldView.x + this.cameras.main.worldView.width * 0.5,
    //   this.cameras.main.worldView.y + this.cameras.main.worldView.height * 0.5
    // )

    this.followPoint = new Phaser.Math.Vector2(4096, 4096)

    this.input.on('wheel', e => {
      this.changeZoom(-e.deltaY / 1000)
    })

    this.updateCamera()

    // TODO: move to map creator

    const entities = this.cache.json.get('entities')
    const maps = this.cache.json.get('maps')
    const testMap = maps.Test
    console.log(testMap)

    const entityLayer = this.add.group({classType: Phaser.GameObjects.Sprite})

    entityLayer.setDepth(5000)

    for(let mapEntity of testMap.entities) {
      const entityName = mapEntity.type
      let entityDefComponents = entities[entityName]
      let entityMapComponents = mapEntity.components
      let mergedComponents = Phaser.Utils.Objects.Merge(entityMapComponents, entityDefComponents)

      console.log(mergedComponents)

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

      let {RenderObject, Position, EnergyGenerator, EnergyTransponder} = entity.components

      if(RenderObject) {
        if(EnergyGenerator || EnergyTransponder) {
          this.add.graphics()
            .fillStyle(0x0000ff, 0.24)
            .fillCircle(Position.x, Position.y, (EnergyGenerator || EnergyTransponder).range)
        }
        let texture = RenderObject.texture
        if(texture instanceof Array) {
          let animationKey = texture.toString()
          this.anims.create({
            key: animationKey,
            frameRate: 2,
            duration: -1,
            frames: this.anims.generateFrameNames('swss', {frames: texture})
          })
          entityLayer.create(Position.x, Position.y, 'swss', texture[0]).play(animationKey)
        } else {
          entityLayer.create(Position.x, Position.y, 'swss', texture)
        }
      }

      document.body.appendChild(entity)
    }
  }

  getChunk(x, y) {
    for (let chunk of this.chunks) {
      if (chunk.x === x && chunk.y === y) return chunk
    }
    return null
  }

  update(time, delta) {
    let chunkX = Math.round(this.followPoint.x >> 8)
    let chunkY = Math.round(this.followPoint.y >> 8)

    let SX = chunkX - this.chunkRadiusToLoad
    let SY = chunkY - this.chunkRadiusToLoad
    let EX = chunkX + this.chunkRadiusToLoad
    let EY = chunkY + this.chunkRadiusToLoad

    for (let x = SX; x < EX; x++) {
      for (let y = SY; y < EY; y++) {
        if (this.getChunk(x, y)) continue
        this.chunks.push(new Chunk(this, x, y))
      }
    }

    for (let chunk of this.chunks) {
      if (!chunk) continue

      if (Phaser.Math.Distance.Between(chunkX, chunkY, chunk.x, chunk.y) <= this.chunkRadiusToLoad) {
        chunk.load()
      } else {
        chunk.unload()
      }
    }



    if (this.game.input.activePointer.isDown) {
      if (this.dragPoint) {
        this.addPosition(
          this.dragPoint.x - this.game.input.activePointer.position.x,
          this.dragPoint.y - this.game.input.activePointer.position.y
        )
      }
      this.dragPoint = this.game.input.activePointer.position.clone()
    } else {
      this.dragPoint = null
    }



    let speed = this.cameraSpeed / this.cameras.main.zoom * delta / 100

    if (this.movementKeys.W.isDown) this.addPosition(0, -speed)
    if (this.movementKeys.S.isDown) this.addPosition(0, speed)
    if (this.movementKeys.A.isDown) this.addPosition(-speed, 0)
    if (this.movementKeys.D.isDown) this.addPosition(speed, 0)

    if (this.zoomKeys.Z.isDown) this.changeZoom(0.01)
    if (this.zoomKeys.X.isDown) this.changeZoom(-0.01)
  }

  addPosition(dx, dy) {
    this.followPoint.x += dx
    this.followPoint.y += dy
    this.updateCamera()
  }

  updateCamera() {
    this.cameras.main.centerOn(this.followPoint.x, this.followPoint.y)
  }

  changeZoom(delta) {
    this.cameras.main.zoom += delta
    this.cameras.main.zoom = Phaser.Math.Clamp(this.cameras.main.zoom, 0.5, 4)
    this.chunkRadiusToLoad = this.cameras.main.width >> 7
    this.updateCamera()
  }
}
