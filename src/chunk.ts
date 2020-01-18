import { Noise } from 'noisejs'
import MainScene from './scenes/main-scene'

export default class Chunk {
  static size: number = 16

  static sizeExp: number = Math.log2(Chunk.size)
  static noise: Noise
  scene: MainScene
  x: number
  y: number
  isLoaded: boolean
  tileSet: Phaser.Tilemaps.Tileset
  mapLayer: Phaser.Tilemaps.StaticTilemapLayer
  mapLayerWater: Phaser.Tilemaps.StaticTilemapLayer

  constructor(scene, x, y) {
    this.scene = scene
    if (!Chunk.noise) Chunk.noise = scene.noise
    this.x = x
    this.y = y
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
    this.mapLayer.destroy()
    this.mapLayerWater.destroy()
  }

  load() {
    if (this.isLoaded) return
    const x1 = this.x << Chunk.sizeExp
    const y1 = this.y << Chunk.sizeExp

    const x2 = (this.x + 1) << Chunk.sizeExp
    const y2 = (this.y + 1) << Chunk.sizeExp

    let x, y, v, row, rowWater
    let data: number[][] = []
    let dataWater: number[][] = []

    for (y = y1; y < y2; y++) {
      row = []
      rowWater = []
      for (x = x1; x < x2; x++) {
        v = Chunk.getHeight(x, y)
        row.push(Chunk.getBiome(v))

        if (v < 0) rowWater.push(326)
        else rowWater.push(null)
      }
      data.push(row)
      dataWater.push(rowWater)
    }

    this.isLoaded = true

    const tileMap = this.scene.make.tilemap({data, tileWidth: 16, tileHeight: 16})
    const tileMapWater = this.scene.make.tilemap({data: dataWater, tileWidth: 16, tileHeight: 16})
    
    const tileSet = tileMap.addTilesetImage('mc', null, 16, 16, 1, 2)
    const tileSetWater = tileMap.addTilesetImage('mc', null, 16, 16, 1, 2)
    
    // const tileMapWater = this.scene.add.tilemap(null, 16, 16, 16, 16, dataWater, true)
    this.mapLayer = tileMap.createStaticLayer(0, tileSet, this.x << 8, this.y << 8).setDepth(-1)
    this.mapLayerWater = tileMapWater.createStaticLayer(0, tileSetWater, this.x << 8, this.y << 8).setDepth(-1)
    return null
  }
}
