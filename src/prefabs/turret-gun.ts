import {RenderObject} from '../components/components'
import Sprite = Phaser.GameObjects.Sprite

export class TurretGun extends Phaser.Physics.Arcade.Sprite {
  parentObject: Sprite

  constructor(scene, entity, parent) {
    let RenderObject: RenderObject
    ({RenderObject} = entity.components)
    super(scene, 0, 0, 'swss', RenderObject.texture)
    scene.add.existing(this)
    this.setDepth(2)

    this.parentObject = parent.components.RenderObject.gameObject
  }

  update() {
    const {x, y} = this.parentObject
    this.setPosition(x,y)
  }


}