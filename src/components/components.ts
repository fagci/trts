import Entity from '../ecs/entity'

export class RenderObject {
  texture: string | []
  container: Phaser.GameObjects.Container
  constructor(options?: object) {
    if (options) Object.assign(this, options)
  }
}

export class Health {
  max: number = 100
  value: number = 100

  constructor(options: { max?: number, health?: number }) {
    if (options) {
      Object.assign(this, options)
      if (options.health === undefined) this.value = this.max
    }
  }

  take(damage: Damage) {
    this.value -= damage.value
    if (this.value < 0) this.value = 0
  }
}

export class Position extends Phaser.Geom.Point {

  constructor(options?: {}) {
    super()
    if (options) Object.assign(this, options)
  }
}

export class Damage {
  value: number
  from: Entity
  to: Entity

  constructor(options?: { from: Entity; to: Entity; value: number }) {
    if (options) Object.assign(this, options)
  }
}

export class DamageSource {
  value: number
  from: Entity

  constructor(options?: { from: Entity; value: number }) {
    if (options) Object.assign(this, options)
  }
}

export class Moving {
  mass: number = 1
  force: Phaser.Geom.Point = new Phaser.Geom.Point(0, 0)
  velocity: Phaser.Geom.Point = new Phaser.Geom.Point(0, 0)
  direction: number = 0
  maxVelocity: number = 12 // TODO: needed?

  constructor(options?: {}) {
    if (options) Object.assign(this, options)
  }
}

export class Destroy {
}

export class Solid extends Phaser.Geom.Rectangle {
  collisions: { [entityId: number]: Entity } = {}
}

export class Dead {
}

export class Dissolve {
  value: number
  max: any

  constructor(options?: { value?: number, max: number }) {
    if (options) Object.assign(this, options)
    if (options.value === undefined) this.value = this.max
  }
}

const PowerSource = {
  AIR: { current: 0.05 },
  THERMAL: { current: 0.01 },
  MECHANICAL: { current: 1 },
  FUEL: { current: 3.9 },
}

export class Energy {
  totalCapacity: number = 100
  capacity: number = 0

  constructor(options: { totalCapacity?: number, capacity?: number }) {
    if (options) Object.assign(this, options)
  }
}

export class EnergyGenerator extends Energy {
  powerSource: any = PowerSource.THERMAL
  range: number = 64

  constructor(options: any) {
    super(options)
    if (options.type) this.powerSource = PowerSource[options.type]
  }

  generate() {
    this.capacity += this.powerSource.current
  }
}

export class EnergyTransponder extends Energy {
  source: Entity
  range: number = 128
  current: number = 3

  constructor(options: any) {
    super(options)
    if (options) Object.assign(this, options)
  }

  takeFrom(source: Energy) {
    if (this.capacity >= this.totalCapacity) return
    const taken = Phaser.Math.Clamp(this.current, 0, source.capacity)
    this.capacity += taken
    source.capacity -= taken
    return taken
  }
}

export class EnergyConsumer extends Energy {
  source: Entity
  load: number = 1

  constructor(options: any) {
    super(options)
    if (options) Object.assign(this, options)
  }

  takeFrom(source: Energy) {
    if (this.capacity >= this.totalCapacity) return
    const taken = Phaser.Math.Clamp(this.load, 0, source.capacity)
    this.capacity += taken
    source.capacity -= taken
  }

  consume() {
    if (this.capacity >= this.load) {
      this.capacity -= this.load
      return this.load
    }
    return 0
  }
}

export class Slots {
  items: Array<Entity> = []
  places: Array<string> = []

  constructor(options: { items: [] }) {
    if (options) Object.assign(this, options)
  }
}

export class Team {
  value: string

  constructor(options: { value: string }) {
    if (options) Object.assign(this, options)
  }
}

const Weapons = {
  MACHINE_GUN: {
    roundCapacity: 50,
    initialCapacity: 2500,
    reloadTime: 5000,
    damage: 12,
    fireDelay: 25,
    spreadAngle: 15,
  },
}

export class Weapon {
  capacity: number = 0
  lastFire: number = 0

  roundCapacity: number
  initialCapacity: number
  reloadTime: number
  damage: number
  fireDelay: number
  spreadAngle: number

  constructor(options: {}) {
    if (options) Object.assign(this, options)
    this.capacity = this.initialCapacity || 0
  }
}

export class Armed {
  type: string = 'NONE'
  weapon: Weapon

  constructor(options: {}) {
    if (options) Object.assign(this, options)
    this.weapon = new Weapon(Weapons[this.type])
  }
}

export class LifeTime {
  value: number = 10000

  constructor(options: {}) {
    if (options) Object.assign(this, options)
  }
}

export class Factory {

  constructor(options: {}) {
    if (options) Object.assign(this, options)
  }
}

export class Selectable {
  selected: boolean = false
  color: number = 0xff0000

  constructor(options: {}) {
    if (options) Object.assign(this, options)
  }
}
