export default interface Entity extends HTMLElement {
  components: any
  addComponent: (component) => Entity
}

