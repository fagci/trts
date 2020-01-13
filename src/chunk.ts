import {Noise} from 'noisejs'
import MainScene from './scenes/main-scene'

export default class Chunk {
  static size: number = 16

  static sizeExp: number = Math.log2(Chunk.size)
  static noise: Noise
  scene: MainScene
  x: number
  y: number
  isLoaded: boolean
  tileMap: Phaser.Tilemaps.Tilemap
  mapLayer: Phaser.Tilemaps.DynamicTilemapLayer
  mapLayerWater: Phaser.Tilemaps.DynamicTilemapLayer

  constructor(scene, x, y) {
    this.scene = scene
    if (!Chunk.noise) Chunk.noise = scene.noise
    this.x = x
    this.y = y

    this.tileMap = this.scene.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: 16,
      height: 16,
    })

    const tileSet = this.tileMap.addTilesetImage('mc', null, 16, 16, 1, 2)

    this.mapLayer = this.tileMap.createBlankDynamicLayer('mapLayer', tileSet, this.x << 8, this.y << 8).setDepth(-1)
    this.mapLayerWater = this.tileMap.createBlankDynamicLayer('mapLayerWater', tileSet, this.x << 8, this.y << 8).setDepth(-1)
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
    if (h < 0.12) return 26 // sand
    if (h < 0.18) return 2 // ground
    if (h < 0.5) return 0 // grass
    if (h < 0.85) return 1 // stone
    return 98 // snow
  }

  unload() {
    if (!this.isLoaded) return
    this.tileMap.removeAllLayers()
  }

  load() {
    if (this.isLoaded) return
    const x1 = this.x << Chunk.sizeExp
    const y1 = this.y << Chunk.sizeExp

    const x2 = (this.x + 1) << Chunk.sizeExp
    const y2 = (this.y + 1) << Chunk.sizeExp

    for (let y = y1; y < y2; y++) {
      for (let x = x1; x < x2; x++) {
        let v = Chunk.getHeight(x, y)
        let b = Chunk.getBiome(v)
        this.mapLayer.putTileAt(b, x - x1, y - y1)
        if (v < 0) this.mapLayerWater.putTileAt(326, x - x1, y - y1)
      }
    }

    this.isLoaded = true

    return null
  }
}
