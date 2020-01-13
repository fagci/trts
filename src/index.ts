import 'phaser'
import DebugDrawPlugin from 'phaser-plugin-debug-draw';
import BootScene from './scenes/boot-scene'
import Game from './game'
import MainScene from './scenes/main-scene'
import UIScene from './scenes/ui-scene'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scene: [
    BootScene,
    MainScene,
    UIScene,
  ],
  plugins: {
    scene: [
      {
        key: 'DebugDrawPlugin',
        plugin: DebugDrawPlugin,
        mapping: 'debugDraw'
      }
    ]
  },
  banner: false,
  pixelArt: true,
  roundPixels: true,
  disableContextMenu: true,
  backgroundColor: '#eda',
  scale: {
    mode: Phaser.Scale.ScaleModes.RESIZE,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {x: 0, y: 0},
      debug: false,
    },
  },
}

window.addEventListener('load', () => {
  const game = new Game(config)
})