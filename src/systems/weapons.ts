import System from "../ecs/system"
import Entity from "../ecs/entity"
import * as Components from "../components/components"
import { directionVector } from "../../utils/geometry"
import * as PIXI from "pixi.js"

export default class Weapons extends System {
  shoot(from: Entity, weapon: Components.Weapon) {
    const fromRenderObject:PIXI.Container = from.RenderObject
    if(!fromRenderObject.parent) return
    if (window.app.ticker.lastTime < weapon.lastFire + weapon.fireDelay) return
    const bullet = Entity.create("Bullet", this.world.map, this.world)
    
    const spreadAngle = ((Math.random() - 0.5) * Math.PI) / (weapon.spreadAngle || 0)
    const velocityVector = directionVector(new PIXI.Point(), fromRenderObject.rotation - spreadAngle, 12)
    const damageSource = new Components.DamageSource({from,value: weapon.damage})
    const moving = new Components.Moving({ velocity: velocityVector })
    
    bullet
      .addComponent(moving)
      .addComponent(damageSource)
      .addComponent(new Components.Team({ value: from.Team.value }))
      .Position.copyFrom(fromRenderObject.parent.position) //TODO: set from gun position 
    
    weapon.capacity--
    weapon.lastFire = window.app.ticker.lastTime
    this.world.addEntity(bullet)
  }

  update(dt: number): void {
    for (const [id, entity] of this.world.getEntitiesWith('LifeTime')) {
      if (entity.Dead) continue
      let LifeTime: Components.LifeTime = entity.LifeTime
      
      // TODO: на самом деле это дальность полёта снаряда
      LifeTime.value -= window.app.ticker.elapsedMS
      if (LifeTime.value <= 0) this.world.destroyEntity(entity)
    }

    for (const [id, gun] of this.world.getEntitiesWith('Armed')) {
      if (gun.Dead) continue // FIXME: разобраться со слотами
      let weapon = gun.Armed.weapon
      gun.RenderObject.rotation += 0.01 * dt
      if (weapon.capacity > 0) this.shoot(gun, weapon)
    }
  }
}

