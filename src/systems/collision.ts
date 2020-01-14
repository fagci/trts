import System from '../ecs/system'
import * as Components from '../components/components'
import Entity from '../ecs/entity'

export default class Collision extends System {
  static checkCollision(from: Entity, to: Entity): boolean {
    const {Position:FP,Solid:FS} = from
    const {Position:TP,Solid:TS} = to
    let b1 = new PIXI.Rectangle(
      FP.x + FS.x,
      FP.y + FS.y,
      FS.width,
      FS.height,
      )
    let b2 = new PIXI.Rectangle(
      TP.x + TS.x,
      TP.y + TS.y,
      TS.width,
      TS.height,
      )

    return boxIntersects(b1, b2)
  }

  update(dt: number): void {
    for (const [fromId, from] of this.world.getEntitiesWith('Solid')) {
      let Position: Components.Position
      ({Position} = from)
      
      if (!Position) continue
      
      for (const [toId, to] of this.entities) {
        if(toId === fromId || !to.Solid || !to.Position) continue

        if(Collision.checkCollision(from, to)) {
          from.Solid.collisions[toId] = to
          to.Solid.collisions[fromId] = from
        } else {
          to.Solid.collisions[fromId] = null
          from.Solid.collisions[toId] = null
        }
      }
    }
  }
}