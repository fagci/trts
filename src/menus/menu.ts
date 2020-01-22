import {Events, Input, Scene} from 'phaser'

type KeyMap = { [key: string]: Input.Keyboard.Key }
type MenuItem = {
  active: boolean,
  title: string,
  icon: string | number,
}

export default class Menu extends Events.EventEmitter {
  protected items: { [title: string]: MenuItem } = {}
  protected activeItemIndex: number = -1
  protected navigationButtons: KeyMap

  Events = {
    PRESS: 'press',
    ACTIVE: 'active',
    ESCAPE: 'escape',
  }

  constructor(scene: Scene) {
    super()
    this.navigationButtons = scene.input.keyboard.addKeys('up,down,left,right,enter') as KeyMap
    this.navigationButtons.up.on('up', this.prev, this)
    this.navigationButtons.down.on('up', this.next, this)
  }

  addItem(item: MenuItem) {
    this.items[item.title] = item
  }

  next() {
    console.log(`Next ${this.activeItemIndex}`)
    this.activeItemIndex++
    if (this.activeItemIndex >= Object.keys(this.items).length) {
      this.activeItemIndex = 0
    }
  }

  prev() {
    console.log(`Prev ${this.activeItemIndex}`)
    this.activeItemIndex--
    if (this.activeItemIndex < 0) {
      this.activeItemIndex = Object.keys(this.items).length - 1
    }
  }
}
