import BasePrefab from '../base-prefab'

export class Plane extends BasePrefab {
  constructor(scene, entity) {
    super(scene, entity)
    scene.physics.add.existing(this)
    // this.body.gravity.set(1, -3)
    scene.cameras.main.startFollow(this, true, 0.5, 0.5)
  }

  update(delta) {
    super.update(delta)
    this.updateAngle(delta)
  }

  updateAngle(delta) {
    const a = Phaser.Math.Angle.Wrap(this.body.velocity.angle() + Math.PI / 2)
    this.rotation = Phaser.Math.Linear(this.rotation, a, delta)
  }
}