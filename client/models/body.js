'use strict';

export default class Body {
  constructor(id, position, rotation, geometryDescription) {
    this.id = id;
    this.currentState = 0;
    this.geometryDescription = geometryDescription;
    this.states = [{
      pos: position,
      rot: rotation
    }];
  }

  useState(index) {
    this.currentState = index;
  }

  addStateAt(index, position, rotation) {
    this.states[index] = {
      pos: position,
      rot: rotation
    };
  }

  get position() {
    return this.states[this.currentState].pos;
  }

  get rotation() {
    return this.states[this.currentState].rot;
  }
}
