import { Scene } from 'phaser'

export default class MenuScene extends Scene {
  items: [{ title: string, click: Function }]

  constructor() {
    super('MenuScene')
  }

  create() {
    const uiScene = this.scene.get('UIScene')
    const mainScene = this.scene.get('MainScene')

    uiScene.scene.setVisible(false)
    mainScene.scene.sleep()

    this.items = [
      { title: '<<< Back', click: () => {
        uiScene.scene.setVisible(true)
        mainScene.scene.wake()
        this.scene.stop()
      } }
    ]

    this.cameras.main.setBackgroundColor('rgba(0,0,0,0.75)')
    console.log(`Menu scene create`)

    this.items.forEach(item => {
      this.add.text(32, 32 + this.items.length * 48, item.title)
        .setInteractive({ useHandCursor: true })
        .on('pointerup', item.click)
    })
  }
}