import BasePrefab from '../base-prefab'

export class Plane extends BasePrefab {
  constructor(scene, entity) {
    super(scene, entity)
    scene.physics.add.existing(this)
    scene.cameras.main.startFollow(this)
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