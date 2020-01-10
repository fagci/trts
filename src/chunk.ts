import { Noise } from "noisejs";
import { GameObjects } from "phaser";
import MainScene from "./scenes/main-scene";

export default class Chunk {
  scene: MainScene;
  x: any;
  y: any;
  tiles: Phaser.GameObjects.Group;
  isLoaded: boolean;
  

  static noise: Noise;


  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.tiles = this.scene.add.group()
    this.isLoaded = false;
  }

  getHeight(i: number, j: number) {
    return (
      1.0 * Chunk.noise.perlin2(i / 100, j / 100) +
      0.75 * Chunk.noise.perlin2(i / 50, j / 50) +
      0.5 * Chunk.noise.perlin2(i / 25, j / 25) +
      0.25 * Chunk.noise.perlin2(i / 12, j / 12)
    );
  }

  getBiome(h: number) {
    if (h < 0.12) return 26;
    if (h < 0.18) return 2;
    if (h < 0.5) return 0;
    if (h < 0.85) return 1;
    return 98;
  }

  getBiomeName(h: number) {
    if (h < 0.12) return 'sand';
    if (h < 0.18) return 'ground';
    if (h < 0.5) return 'grass';
    if (h < 0.85) return 'stone';
    return 'snow';
  }

  unload() {
    if (this.isLoaded) {
      this.tiles.clear(true, true);

      this.isLoaded = false;
    }
  }

  createChunkNew() {
    const data = [];
    const dataWater = [];

    for (let j = 0; j < 256; j++) {
      let row = [];
      for (let i = 0; i < 256; i++) {
        row.push(this.getBiome(this.getHeight(i, j)));
      }
      data.push(row);
    }

    for (let j = 0; j < 256; j++) {
      let row = [];
      for (let i = 0; i < 256; i++) {
        row.push(this.getHeight(i, j) < 0.05 ? 99 : -1);
      }
      dataWater.push(row);
    }

    const tileMap = this.make.tilemap({
      data,
      tileWidth: 16,
      tileHeight: 16,
      insertNull: true
    });
    const tileMapWater = this.make.tilemap({
      data: dataWater,
      tileWidth: 16,
      tileHeight: 16,
      insertNull: true
    });

    this.tileSet = tileMap.addTilesetImage("ss");

    tileMap.createStaticLayer(0, this.tileSet);
    tileMapWater.createStaticLayer(0, this.tileSet);
  }

  load() {
    if (this.isLoaded) return
    
    for (let x = 0; x < this.scene.chunkSize; x++) {
      for (let y = 0; y < this.scene.chunkSize; y++) {

        let tileX = (this.x * (this.scene.chunkSize * this.scene.tileSize)) + (x * this.scene.tileSize);
        let tileY = (this.y * (this.scene.chunkSize * this.scene.tileSize)) + (y * this.scene.tileSize);

        let perlinValue = this.getHeight(tileX/this.scene.tileSize,tileY/this.scene.tileSize);
        let key = this.getBiomeName(perlinValue)
        
        let tile = new Tile(this.scene, tileX, tileY, 'mc', key)
        this.tiles.add(tile)  
        if (perlinValue < 0.2) {
          tile = new Tile(this.scene, tileX, tileY, 'mc').play('water')
          this.tiles.add(tile)
        }
      }
    }
    
    this.isLoaded = true;
  }
}

class Tile extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key, frame?) {
    super(scene, x, y, key, frame);
    this.scene = scene;
    this.scene.add.existing(this);
    this.setOrigin(0);
  }
}
