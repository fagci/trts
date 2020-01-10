import { Noise } from "noisejs"
import MainScene from "./scenes/main-scene"

export default class Chunk {
  static size: number = 16;

  static sizeExp: number = Math.log2(Chunk.size);

  scene: MainScene
  x: number
  y: number
  tiles: Phaser.GameObjects.Group
  isLoaded: boolean
  static noise: Noise
  tileMap: Phaser.Tilemaps.Tilemap
  tileSet: Phaser.Tilemaps.Tileset

  constructor(scene, x, y) {
    this.scene = scene
    if (!Chunk.noise) Chunk.noise = scene.noise
    this.x = x
    this.y = y
    // this.tiles = this.scene.add.group()
    this.isLoaded = false
  }

  unload() {
    if (!this.isLoaded) return
    this.tileMap.destroy()
    this.isLoaded = false
  }

  static getHeight(i: number, j: number) {
    return (
      1.0 * this.noise.perlin2(i / 100, j / 100) +
      0.75 * this.noise.perlin2(i / 50, j / 50) +
      0.5 * this.noise.perlin2(i / 25, j / 25) +
      0.25 * this.noise.perlin2(i / 12, j / 12)
    )
  }

  static getBiome(h: number) {
    if (h < 0.12) return 26
    if (h < 0.18) return 2
    if (h < 0.5) return 0
    if (h < 0.85) return 1
    return 98
  }

  static getBiomeName(h: number) {
    if (h < 0.12) return "sand"
    if (h < 0.18) return "ground"
    if (h < 0.5) return "grass"
    if (h < 0.85) return "stone"
    return "snow"
  }

  load() {
    if (this.isLoaded) return

    const x1 = this.x << Chunk.sizeExp
    const y1 = this.y << Chunk.sizeExp

    const x2 = (this.x + 1) << Chunk.sizeExp
    const y2 = (this.y + 1) << Chunk.sizeExp

    const data = []

    for (let y = y1; y < y2; y++) {
      let row = []
      for (let x = x1; x < x2; x++) {
        let v = Chunk.getHeight(x, y)
        let b = Chunk.getBiome(v)
        row.push(b)
      }
      data.push(row)
    }

    this.tileMap = this.scene.make.tilemap({
      data,
      tileWidth: 16,
      tileHeight: 16
    })

    this.tileSet = this.tileMap.addTilesetImage("ss")

    this.tileMap.createStaticLayer(0, this.tileSet, x1 << 4, y1 << 4)

    this.isLoaded = true
  }
}

class Tile extends Phaser.Tilemaps.Tile {
  static size: number = 16;
  static sizeExp: number = Math.log2(Tile.size);
}
