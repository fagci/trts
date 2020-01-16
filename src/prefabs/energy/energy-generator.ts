import {EnergySource} from './energy-source'
import { BlendModes } from 'phaser'

export class EnergyGenerator extends EnergySource {
    emitter: Phaser.GameObjects.Particles.ParticleEmitter
  constructor(scene, entity) {
    super(scene, entity)
    let particles = scene.add.particles('smoke').setDepth(3);

    this.emitter = particles.createEmitter();
    this.emitter
      .setPosition(this.x, this.y)
      .setSpeed(30)
      .setScale(0.1)
      .setAlpha(0.3)
      .setBlendMode(BlendModes.DARKEN)
    this.emitter.onParticleEmit((particle) => {
      particle.rotation = Math.PI*2*Math.random()
    })
  }

  update() {
    super.update()
    this.emitter.setPosition(this.x, this.y);
  }
}