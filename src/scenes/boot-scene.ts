export default class BootScene extends Phaser.Scene {
  constructor(test) {
    super({
        key: 'BootScene'
    })
  }

  loadResources() {
    this.load.image("ss", "/gfx/ss.png")
    this.load.atlas('mc','/gfx/ss.png','/gfx/ss.json')
  }

  preload() {
    const SH: number = this.sys.game.renderer.height
    const SW: number = this.sys.game.renderer.width

    const progress = this.add.graphics()
    const text = this.add.text(32, SH / 2 - 32, 'Loading...', {color: '#246'})
    
    this.load.on('progress', value => {

      text.text = `Loading... ${(value * 100).toFixed(0)}%`
      
      progress.clear()
      progress.fillStyle(0x224466)
      progress.lineStyle(2, 0x224466)
      progress.strokeRect(32, SH / 2, SW - 64, 16)
      progress.fillRect(32, SH / 2, (SW-64) * value, 16)

    })

    this.load.on('complete', () => {
      progress.destroy()
      text.destroy()
      this.createAnims()
      this.scene.start('MainScene')
    })

    this.loadResources()
  }
  createAnims() {
    this.anims.create({
      key:'water',
      repeat: -1,
      frameRate: 5,
      frames: this.anims.generateFrameNames('mc', {
        prefix: 'water_',
        start: 1, 
        end: 5,
      })
    })
    this.anims.create({
      key:'test',
      frameRate: 2,
      repeat: -1,
      frames: this.anims.generateFrameNames('mc',{
        frames:['cover_red','cover_black']
      })
    })
  }
}