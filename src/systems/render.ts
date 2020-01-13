import System from '../ecs/system'
import * as Components from '../components/components'


export default class RenderSystem extends System {
  deps = [
    Components.RenderObject.name,
  ]

  update(time, delta) {
    for (const entity of this.group) {
      let RenderObject: Components.RenderObject
      let Health: Components.Health
      let Selectable: Components.Selectable
      let Slots: Components.Slots

      ({RenderObject, Health, Selectable, Slots} = entity.components)


    }
  }
}