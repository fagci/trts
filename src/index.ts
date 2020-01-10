import 'phaser'
import MainScene from './scenes/main-scene'
import EntityManager from './ecs/entity-manager'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scene: MainScene,
  banner: false,
  antialias: false,
  roundPixels: true,
  disableContextMenu: true,
  backgroundColor: '#cceeff',
  scale: {
    mode: Phaser.Scale.ScaleModes.RESIZE,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {x: 0, y: 0},
    },
  },
}

class C1 {
}

class C2 {
}

class C3 {
}

const root = EntityManager.create('root')
const entity1 = EntityManager.create('E1').addComponent(new C1).addComponent(new C2).addComponent(new C3)
const entity2 = EntityManager.create('E2').addComponent(new C1).addComponent(new C3)
const entity3 = EntityManager.create('E3').addComponent(new C2).addComponent(new C3)
root.appendChild(entity1)
root.appendChild(entity2)
root.appendChild(entity3)

console.log(root, EntityManager.getEntities(['C2', 'C3'], root))

window.addEventListener('load', () => {
  // const game = new Game(config)
})