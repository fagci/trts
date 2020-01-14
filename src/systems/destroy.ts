import System from '../ecs/system'

export default class Destroy extends System {
  update(dt: number): void {
    for (const [id, entity] of this.world.getEntitiesWith('Destroy')) {
      this.world.destroyEntity(entity)
    }
  }
}