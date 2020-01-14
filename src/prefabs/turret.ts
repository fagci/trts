import {Position, RenderObject, Slots} from '../components/components'
import MapManager from '../map-manager'

export class Turret extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, entity) {
    let Position: Position, RenderObject: RenderObject, Slots: Slots
    ({Position, RenderObject, Slots} = entity.components)
    super(scene, Position.x, Position.y, 'swss', RenderObject.texture)
    scene.add.existing(this)
    this.setDepth(2)

    let turretEntity = Slots.items[0] //just only one turret for now

    MapManager.makePrefabForEntity(scene, turretEntity)
  }
}