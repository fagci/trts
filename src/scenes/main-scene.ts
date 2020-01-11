import { Noise } from "noisejs"
import Chunk from "../chunk"
import { Input } from 'phaser'

type KeyMap = {[key:string]:Input.Keyboard.Key}


export default class MainScene extends Phaser.Scene {
  tileSet: Phaser.Tilemaps.Tileset
  tileSetWater: Phaser.Tilemaps.Tileset
  followPoint: Phaser.Math.Vector2
  cameraSpeed: number = 10;
  chunkSize = 16;
  tileSize = 16;
  chunks = [];
  noise = new Noise(1)

  movementKeys: KeyMap
  zoomKeys: KeyMap

  chunkRadiusToLoad = 3 // TODO: replace with chunks count in view

  constructor() {
    super({ key: "MainScene" })
  }

  create(): void {
    this.movementKeys = this.input.keyboard.addKeys('W,S,A,D') as KeyMap
    this.zoomKeys = this.input.keyboard.addKeys('Z,X') as KeyMap

    this.followPoint = new Phaser.Math.Vector2(
      this.cameras.main.worldView.x + this.cameras.main.worldView.width * 0.5,
      this.cameras.main.worldView.y + this.cameras.main.worldView.height * 0.5
    )
  }

  getChunk(x, y) {
    for (let chunk of this.chunks) {
      if (chunk.x === x && chunk.y === y) return chunk
    }
    return null
  }

  update() {
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

    let speed = this.cameraSpeed
    let zoom = this.cameras.main.zoom

    if (this.movementKeys.W.isDown) this.followPoint.y -= speed / zoom
    if (this.movementKeys.S.isDown) this.followPoint.y += speed / zoom
    if (this.movementKeys.A.isDown) this.followPoint.x -= speed / zoom
    if (this.movementKeys.D.isDown) this.followPoint.x += speed / zoom

    if (this.zoomKeys.Z.isDown) this.changeZoom(0.01)
    if (this.zoomKeys.X.isDown) this.changeZoom(-0.01)

    this.cameras.main.centerOn(this.followPoint.x, this.followPoint.y)
  }

  changeZoom(delta) {
    this.cameras.main.zoom += delta
    this.cameras.main.zoom = Phaser.Math.Clamp(this.cameras.main.zoom, 0.5, 4)
    this.chunkRadiusToLoad = 3 / (this.cameras.main.zoom+1)
  }
}
