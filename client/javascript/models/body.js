export default class Body {
  constructor(id, position, rotation, geometry) {
    this.id = id;
    this.stateIndex = 0;
    this.geometry = geometry;
    this.states = [{
      pos: position,
      rot: rotation
    }];
  }

  useState(index) {
    this.stateIndex = index;
  }

  addStateAt(index, position, rotation) {
    this.states[index] = {
      pos: position,
      rot: rotation
    };
  }

  get position() {
    return this.states[this.stateIndex].pos;
  }

  get rotation() {
    return this.states[this.stateIndex].rot;
  }
}
