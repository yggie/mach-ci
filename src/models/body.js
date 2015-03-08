export class Body {
  constructor(id, position, rotation, geometry) {
    this.id = id;
    this.stateIndex = 0;
    this.geometry = geometry;
    this.material = new THREE.MeshNormalMaterial({shading: THREE.FlatShading});
    this.states = [{
      pos: position,
      rot: rotation
    }];

    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  useState(index) {
    let state = this.states[index];
    this.stateIndex = index;
    this.mesh.position.copy(state.pos);
    this.mesh.quaternion.copy(state.rot);
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
