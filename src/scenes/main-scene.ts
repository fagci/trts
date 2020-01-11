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



  constructor() {
    super({
      key: "MainScene"
    })
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
    let snappedChunkX = Math.round(this.followPoint.x >> 8)
    let snappedChunkY = Math.round(this.followPoint.y >> 8)
    let SX = snappedChunkX - 2
    let SY = snappedChunkY - 2
    let EX = snappedChunkX + 2
    let EY = snappedChunkY + 2

    for (let x = SX; x < EX; x++) {
      for (let y = SY; y < EY; y++) {
        if (this.getChunk(x, y)) continue
        this.chunks.push(new Chunk(this, x, y))
      }
    }

    for (let chunk of this.chunks) {
      if (!chunk) continue

      if (Phaser.Math.Distance.Between(snappedChunkX, snappedChunkY, chunk.x, chunk.y) < 3) {
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

    if (this.zoomKeys.Z.isDown) this.cameras.main.zoom += 0.01
    if (this.zoomKeys.Z.isDown) this.cameras.main.zoom -= 0.01

    this.cameras.main.centerOn(this.followPoint.x, this.followPoint.y)
  }
}
