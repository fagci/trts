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
    this.load.image("ss", "/gfx/ss.png")
    this.load.image("ssex", "/gfx/ssex.png")
    this.load.atlas('mc', '/gfx/ss.png', '/gfx/ss.json')
  }

  createAnims() {
    this.anims.create({
      key: 'water',
      repeat: -1,
      frameRate: 5,
      frames: this.anims.generateFrameNames('mc', {
        prefix: 'water_',
        start: 1,
        end: 5,
      })
    })
    this.anims.create({
      key: 'test',
      frameRate: 2,
      repeat: -1,
      frames: this.anims.generateFrameNames('mc', {
        frames: ['cover_red', 'cover_black']
      })
    })
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
    
    this.text = this.add.text(32, SH / 2 - 32, 'Loading...', { color: '#246' })
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
    this.createAnims()
    this.scene.start('MainScene')
  }
}