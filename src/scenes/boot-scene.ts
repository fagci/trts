export default class BootScene extends Phaser.Scene {
  constructor(test) {
    super({
        key: 'BootScene'
    })
    console.log('BootScene constructor')
  }

  loadResources() {
    this.load.image("ss", "/gfx/ss.png")
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
      text.destroy
      this.scene.start('MainScene')
    })

    this.loadResources()
  }
}