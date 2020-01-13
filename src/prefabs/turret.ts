import {Position, RenderObject} from '../components/components'

export class Turret extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, entity) {
    let Position: Position, RenderObject: RenderObject
    ({Position, RenderObject} = entity.components)
    super(scene, Position.x, Position.y, RenderObject.texture)
    console.log(RenderObject.texture)
    scene.add.existing(this)
  }
}