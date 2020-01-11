import { Geom } from 'phaser'

export default class BootScene extends Phaser.Scene {
  progressBgRect: Geom.Rectangle
  progressFgRect: Geom.Rectangle
  progress: Phaser.GameObjects.Graphics
  text: Phaser.GameObjects.Text

  constructor() {
    super('BootScene')
  }

  loadResources() {
    this.load
      .image("mc", require("../../assets/gfx/mc.png"))
      .atlas('swss', require("../../assets/gfx/swss.png"), require("../../assets/gfx/swss.json"))
      .json('entities', require("../../assets/entities/entities.json"))
      .json('maps', require("../../assets/maps/maps.json"))
  }

  create() {
    this.scene.start('MainScene')
  }

  preload() {
    this.load.on('start', this.onLoadStart, this)
    this.load.on('progress', this.onLoadProgress, this)
    this.load.on('complete', this.onLoadComplete, this)

    this.loadResources()
  }

  private onLoadStart() {
    const mainCamera = this.cameras.main
    const SH: number = mainCamera.height
    const SW: number = mainCamera.width

    this.progress = this.add.graphics()
    this.progressBgRect = new Geom.Rectangle(32, SH / 2, SW - 64, 16)
    Geom.Rectangle.CenterOn(this.progressBgRect, 0.5 * SW, 0.5 * SH)
    this.progressFgRect = Geom.Rectangle.Clone(this.progressBgRect)
    
    this.text = this.add.text(32, SH / 2 - 32, 'Loading...', { color: '#246', smoothed: false })
  }

  private onLoadProgress(value) {
    this.text.text = `Loading... ${(value * 100).toFixed(0)}%`
    this.progressFgRect.width = (this.cameras.main.width - 64) * value
    this.progress
      .clear()
      .fillStyle(0x224466)
      .lineStyle(2, 0x224466)
      .strokeRectShape(this.progressBgRect)
      .fillRectShape(this.progressFgRect)
  }

  private onLoadComplete() {
    this.progress.destroy()
    this.text.destroy()
  }
}