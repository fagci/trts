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
    mainScene.scene.setActive(false)

    this.items = [
      { title: '<<< Back', click: () => {
        uiScene.scene.setVisible(true)
        mainScene.scene.setActive(true)
        this.scene.stop()
      } }
    ]

    this.cameras.main.setBackgroundColor('rgba(34,68,92,0.75)')
    console.log(`Menu scene create`)

    this.items.forEach((item,i) => {
      this.add.text(32, 32 + i * 48, item.title)
        .setInteractive({ useHandCursor: true })
        .on('pointerup', item.click)
        .on('pointerover', function(){ this.setTintFill(0xffffaa)})
        .on('pointerout', function(){ this.setTintFill(0xffffff)})
    })
  }
}