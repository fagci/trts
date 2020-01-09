import { Noise } from "noisejs";
import Chunk from "../chunk";

export default class MainScene extends Phaser.Scene {
  tileSet: Phaser.Tilemaps.Tileset;
  tileSetWater: Phaser.Tilemaps.Tileset;
  keyW: Phaser.Input.Keyboard.Key;
  keyS: Phaser.Input.Keyboard.Key;
  keyA: Phaser.Input.Keyboard.Key;
  keyD: Phaser.Input.Keyboard.Key;
  followPoint: Phaser.Math.Vector2;
  cameraSpeed: number = 10;
  chunkSize = 16;
  tileSize = 16;
  chunks = [];

  constructor() {
    super({
      key: "MainScene"
    });
    Chunk.noise = new Noise(1);
  }

  preload(): void {
    this.load.image("ss", "/gfx/ss.png");
  }

  create(): void {
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.followPoint = new Phaser.Math.Vector2(
      this.cameras.main.worldView.x + this.cameras.main.worldView.width * 0.5,
      this.cameras.main.worldView.y + this.cameras.main.worldView.height * 0.5
    );

    
  }

  getChunk(x, y) {
    var chunk = null;
    for (var i = 0; i < this.chunks.length; i++) {
      if (this.chunks[i].x == x && this.chunks[i].y == y) {
        chunk = this.chunks[i];
      }
    }
    return chunk;
  }

  update() {
    var snappedChunkX =
      this.chunkSize * this.tileSize * Math.round(this.followPoint.x / (this.chunkSize * this.tileSize));
    var snappedChunkY =
      this.chunkSize * this.tileSize * Math.round(this.followPoint.y / (this.chunkSize * this.tileSize));

    snappedChunkX = snappedChunkX / this.chunkSize / this.tileSize;
    snappedChunkY = snappedChunkY / this.chunkSize / this.tileSize;

    for (var x = snappedChunkX - 2; x < snappedChunkX + 2; x++) {
      for (var y = snappedChunkY - 2; y < snappedChunkY + 2; y++) {
        var existingChunk = this.getChunk(x, y);

        if (existingChunk == null) {
          var newChunk = new Chunk(this, x, y);
          this.chunks.push(newChunk);
        }
      }
    }

    for (var i = 0; i < this.chunks.length; i++) {
      var chunk = this.chunks[i];

      if (Phaser.Math.Distance.Between(snappedChunkX, snappedChunkY, chunk.x, chunk.y) < 3) {
        if (chunk !== null) {
          chunk.load();
        }
      } else {
        if (chunk !== null) {
          chunk.unload();
        }
      }
    }

    if (this.keyW.isDown) {
      this.followPoint.y -= this.cameraSpeed;
    }
    if (this.keyS.isDown) {
      this.followPoint.y += this.cameraSpeed;
    }
    if (this.keyA.isDown) {
      this.followPoint.x -= this.cameraSpeed;
    }
    if (this.keyD.isDown) {
      this.followPoint.x += this.cameraSpeed;
    }

    this.cameras.main.centerOn(this.followPoint.x, this.followPoint.y);
  }
}
