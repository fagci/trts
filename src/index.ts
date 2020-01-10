import 'phaser'
import MainScene from './scenes/main-scene'
import EntityManager from './ecs/entity-manager'
import System from './ecs/system'
import MovingSystem from './systems/moving'
import {Moving, Position} from './components/components'

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


class C3 {
  a = 'test1'
  b = 'test2'
}

const root = EntityManager.create('root')

for (let i = 0; i < 10000; i++) {
  const entity = EntityManager.create(`Entity ${i}`)
    if(Math.random()<0.4) entity.addComponent(new Position())
    if(Math.random()<0.8) entity.addComponent(new Moving())
    if(Math.random()>0.4) entity.addComponent(new C3)
  root.appendChild(entity)
}
console.time('filter')
console.log(root, EntityManager.getEntities([Moving.name, Position.name], root))
console.timeEnd('filter')

System.addSystem(new MovingSystem())

console.time('sys loop')
System.update(1)
console.timeEnd('sys loop')


window.addEventListener('load', () => {
  // const game = new Game(config)
})