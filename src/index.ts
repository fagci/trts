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
  a = 'test1'
  b = 'test2'
}

class C2 {
  a = 'test1'
  b = 'test2'
}

class C3 {
  a = 'test1'
  b = 'test2'
}

const root = EntityManager.create('root')

for (let i = 0; i < 10000; i++) {
  const entity = EntityManager.create(`Entity ${i}`)
    if(Math.random()<0.4) entity.addComponent(new C1)
    if(Math.random()<0.8) entity.addComponent(new C2)
    if(Math.random()>0.4) entity.addComponent(new C3)
  root.appendChild(entity)
}
console.time('filter')
console.log(root, EntityManager.getEntities(['C2', 'C3'], root))
console.timeEnd('filter')

window.addEventListener('load', () => {
  // const game = new Game(config)
})