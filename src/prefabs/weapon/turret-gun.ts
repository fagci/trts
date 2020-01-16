import { RenderObject } from '../../components/components'
import Sprite = Phaser.GameObjects.Sprite
import BasePrefab from '../base-prefab'

export class TurretGun extends BasePrefab {
  parentObject: Sprite

  constructor(scene, entity, parent) {
    super(scene, entity)
    this.parentObject = parent.components.RenderObject.gameObject
  }

  update() {
    super.update()
    const { x, y } = this.parentObject
    this.setPosition(x, y)
    this.entityIdText.setPosition(x, y)
  }
}