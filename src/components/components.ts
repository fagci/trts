import Entity from '../ecs/entity'

export class RenderObject {
  texture: string
  animation: string
  gameObject: Phaser.GameObjects.GameObject
}

export class Health {
  max: number = 100
  value: number = 100

  init() {
    if (this.value === undefined) this.value = this.max
  }

  take(damage: Damage) {
    this.value -= damage.value
    if (this.value < 0) this.value = 0
  }
}

export class Position extends Phaser.Geom.Point {
  private tx: number
  private ty: number

  init() {
    if (this.tx) this.x = this.tx * 16
    if (this.ty) this.y = this.ty * 16
  }
}

export class Damage {
  value: number
  from: Entity
  to: Entity
}

export class DamageSource {
  value: number
  from: Entity
}

export class Moving {
  mass: number = 1
  force: Phaser.Geom.Point = new Phaser.Geom.Point(0, 0)
  velocity: Phaser.Geom.Point = new Phaser.Geom.Point(0, 0)
  direction: number = 0
  maxVelocity: number = 12 // TODO: needed?
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

  init() {
    if (this.value === undefined) this.value = this.max
  }
}

const PowerSource = {
  AIR: {current: 0.05},
  THERMAL: {current: 0.01},
  MECHANICAL: {current: 1},
  FUEL: {current: 3.1},
}

export class Energy {
  current: number = 1
  capacity: number = 0
  totalCapacity: number = 100
  range: number = 64
  connections: { [name: string]: Entity } = {} // this = source, connections to sinks because of transmit range

  isDirty: boolean = false
  connectionsTotalCurrent: number = 0

  updateConnectionsData() {
    this.connectionsTotalCurrent = 0
    
    for(let sinkEntityId in this.connections) {
      if(this.connections.hasOwnProperty(sinkEntityId)) {
        this.connectionsTotalCurrent += 
          this.connections[sinkEntityId].components.Energy.current
      }
    }
    this.isDirty = true
  }

  addConnection(entity:Entity) {
    if(this.hasConnection(entity)) return
    this.connections[entity.id] = entity
    this.updateConnectionsData()
  }

  removeConnection(entity:Entity) {
    if(!this.hasConnection(entity)) return
    delete this.connections[entity.id]
    this.updateConnectionsData()
  }

  hasConnection(entity: Entity) {
    return this.connections[entity.id] !== undefined
  }
}

export class EnergyGenerator {
  type: string
  powerSource: any = PowerSource.THERMAL

  init() {
    if (this.type) this.powerSource = PowerSource[this.type]
  }
}

export class EnergyTransponder {
  range: number = 128
}

export class EnergyConsumer {
  usage: number = 100
}

export class Slots {
  items: Array<Entity> = []
  places: Array<string> = []
}

export class Team {
  value: string
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

  init() {
    this.capacity = this.initialCapacity || 0
  }
}

export class Armed {
  type: string = 'NONE'
  weapon: Weapon

  init() {
    this.weapon = new Weapon()
    Object.assign(this.weapon, Weapons[this.type])
  }
}

export class LifeTime {
  value: number = 10000
}

export class Selectable {
  selected: boolean = false
  color: number = 0xff0000
}
