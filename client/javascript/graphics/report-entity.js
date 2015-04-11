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

    mesh.position.copy(state.pos);
    mesh.quaternion.copy(state.rot);
  }
}

export default class ReportEntity {
  constructor(report) {
    this._report = report;
    this._bodies = [];

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


  bodies() {
    return this._bodies;
  }
}
