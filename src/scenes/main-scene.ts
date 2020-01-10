import { Noise } from "noisejs"
import Chunk from "../chunk"

export default class MainScene extends Phaser.Scene {
  tileSet: Phaser.Tilemaps.Tileset
  tileSetWater: Phaser.Tilemaps.Tileset
  keyW: Phaser.Input.Keyboard.Key
  keyS: Phaser.Input.Keyboard.Key
  keyA: Phaser.Input.Keyboard.Key
  keyD: Phaser.Input.Keyboard.Key
  keyZ: Phaser.Input.Keyboard.Key
  followPoint: Phaser.Math.Vector2
  cameraSpeed: number = 10;
  chunkSize = 16;
  tileSize = 16;
  chunks = [];
  noise = new Noise(1)

  constructor() {
    super({
      key: "MainScene"
    })
  }

  create(): void {
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)

    this.followPoint = new Phaser.Math.Vector2(
      this.cameras.main.worldView.x + this.cameras.main.worldView.width * 0.5,
      this.cameras.main.worldView.y + this.cameras.main.worldView.height * 0.5
    )

  }

  getChunk(x, y) {
    let chunk = null
    for (let i = 0; i < this.chunks.length; i++) {
      if (this.chunks[i].x == x && this.chunks[i].y == y) {
        chunk = this.chunks[i]
      }
    }
    return chunk
  }

  update() {
    let snappedChunkX =
      Chunk.size * this.tileSize * Math.round(this.followPoint.x / (Chunk.size * this.tileSize))
    let snappedChunkY =
      Chunk.size * this.tileSize * Math.round(this.followPoint.y / (Chunk.size * this.tileSize))

    snappedChunkX = snappedChunkX / Chunk.size / this.tileSize
    snappedChunkY = snappedChunkY / Chunk.size / this.tileSize

    for (let x = snappedChunkX - 2; x < snappedChunkX + 2; x++) {
      for (let y = snappedChunkY - 2; y < snappedChunkY + 2; y++) {
        let existingChunk = this.getChunk(x, y)
        if (existingChunk) continue
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

    if (this.keyW.isDown) {
      this.followPoint.y -= this.cameraSpeed
    }
    if (this.keyS.isDown) {
      this.followPoint.y += this.cameraSpeed
    }
    if (this.keyA.isDown) {
      this.followPoint.x -= this.cameraSpeed
    }
    if (this.keyD.isDown) {
      this.followPoint.x += this.cameraSpeed
    }

    if (this.keyZ.isDown) {
      this.cameras.main.zoom += 0.1
    }

    this.cameras.main.centerOn(this.followPoint.x, this.followPoint.y)
  }
}
