'use strict';

import THREE from 'three';

import * as utils from '../utils';

class BodyEntity {
  constructor(body) {
    this._body = body;

    this.geometry = utils.parseGeometry(body.geometryDescription);
    this.material = new THREE.MeshNormalMaterial({
      shading: THREE.FlatShading
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.useState(0);
  }


  useState(index) {
    let state = this._body.states[index],
        mesh = this.mesh;

    if (state) {
      mesh.position.copy(state.pos);
      mesh.quaternion.copy(state.rot);
    } else {
      // TODO fix this hax
      mesh.position.set(99999, 99999, 99999);
    }
  }
}

export default class ReportEntity {
  constructor(report) {
    this._report = report;
    this._bodies = [];
    this._stateIndex = 0;

    if (report) {
      let bodies = report.bodies,
          bodyList = this._bodies;
      for (let id in bodies) {
        let body = bodies[id];

        bodyList.push(new BodyEntity(body));
      }
    }

    this._canRender = this._bodies.length !== 0;
  }


  canRender() {
    return this._canRender;
  }


  nextState() {
    let bodies = this._bodies,
        length = bodies.length;

    this._stateIndex = (this._stateIndex + 1) % this._report.numberOfSteps;
    for (let i = 0; i < length; i++) {
      let body = bodies[i];

      body.useState(this._stateIndex);
    }
  }


  bodies() {
    return this._bodies;
  }
}
