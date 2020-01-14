import System from '../ecs/system'
import * as Components from '../components/components'

export default class MovingSystem extends System {
  deps = [
    Components.Position.name,
    Components.Moving.name,
  ]

  update(time: number, delta: number) {
    let d = 1 // TODO: calculate delta for movement
    for (const entity of this.group) {
      let Position: Components.Position, Moving: Components.Moving
      ({Position, Moving} = entity.components)
      if (Position && Moving) { // TODO: if is static, pass or remove entire Velocity component
        let {force, velocity, mass, maxVelocity} = Moving

        velocity.x += force.x * delta / mass
        velocity.y += force.y * delta / mass


        velocity.x = Phaser.Math.Clamp(velocity.x, 0, maxVelocity)
        velocity.y = Phaser.Math.Clamp(velocity.y, 0, maxVelocity)

        Position.x += velocity.x
        Position.y += velocity.y

        Moving.direction = Phaser.Geom.Line.Angle(new Phaser.Geom.Line(0, 0, velocity.x, velocity.y))
      }
    }
  }
}