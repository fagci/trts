import {EnergySource} from './energy-source'

export class EnergyGenerator extends EnergySource {
    emitter: any;
  constructor(scene, entity) {
    super(scene, entity)
    let particles = scene.add.particles('spark').setDepth(3);

    this.emitter = particles.createEmitter();
    this.emitter.setPosition(this.x, this.y);
    this.emitter.setSpeed(20);
    this.emitter.setBlendMode(Phaser.BlendModes.ADD);
  }

  update() {
    super.update()
    this.emitter.setPosition(this.x, this.y);
  }
}