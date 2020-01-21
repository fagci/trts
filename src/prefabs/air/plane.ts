import BasePrefab from '../base-prefab'

export class Plane extends BasePrefab {
  constructor(scene, entity) {
    super(scene, entity)
    scene.physics.add.existing(this)
  }

  update(delta) {
    super.update(delta)
    if(this.body.velocity.length() > 0) this.updateAngle(delta)
  }

  updateAngle(delta) {
    const a = Phaser.Math.Angle.Wrap(this.body.velocity.angle() + Math.PI / 2)
    this.rotation = Phaser.Math.Linear(this.rotation, a, delta)
  }
}