'use strict';

export default class Body {
  constructor(id, position, rotation, geometryDescription) {
    this.id = id;
    this.stateIndex = 0;
    this.geometryDescription = geometryDescription;
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
