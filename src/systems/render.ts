import System from '../ecs/system'
import * as Components from '../components/components'


export default class RenderSystem extends System {
  deps = [
    Components.RenderObject.name,
  ]

  update(time, delta) {
    for (const entity of this.group) {
      let RenderObject: Components.RenderObject

      ({RenderObject} = entity.components)

      if(RenderObject.gameObject) RenderObject.gameObject.update(delta)
    }
  }
}