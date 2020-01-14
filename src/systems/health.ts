import System from '../ecs/system'
import {Dead, Dissolve} from '../components/components'

export default class Health extends System {
  update(dt: number): void {
    for (const [id, entity] of this.entities) {
      if (entity.Dead) continue
      const {Damage, Health} = entity
      if (Damage && Health) {
        Health.take(Damage)
        entity.removeComponent(Damage)
        
        if (Health.value > 0) continue

        entity.addComponent(new Dissolve({max: 5000}))
        entity.addComponent(new Dead())

        const {Solid, Slots} = entity

        if (Solid) entity.removeComponent(Solid)
        if (Slots) entity.removeComponent(Slots)
      }
    }
  }
}