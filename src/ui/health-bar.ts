import Entity from '../ecs/entity'
import { Health } from '../components/components'

export default class HealthBar extends Phaser.GameObjects.Graphics {
  barBgRect: Phaser.Geom.Rectangle
  barFgRect: Phaser.Geom.Rectangle
  entity: Entity

  health: Health

  readonly width = 32
  readonly height = 6

  constructor(scene: Phaser.Scene, entity: Entity) {
    super(scene)
    
    this.entity = entity
    this.health = entity.components.Health

    this.barBgRect = new Phaser.Geom.Rectangle(0, 0, this.width, this.height)
    this.barFgRect = new Phaser.Geom.Rectangle(0, 0, this.width * (this.health.value / this.health.max), this.height)
    this.update()
  }

  update() {
    this.barFgRect.width = this.width * (this.health.value / this.health.max)
    this
      .clear()
      .fillStyle(this.health.value / this.health.max < 0.25 ? 0xee0000: 0x00ee00)
      .lineStyle(1, 0)
      .strokeRectShape(this.barBgRect)
      .fillRectShape(this.barFgRect)
  }
}