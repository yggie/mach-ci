'use strict';

import THREE from 'three';

import * as utils from '../utils';
import ColorGenerator from './color-generator';

class BodyEntity {
  constructor(body, options) {
    this._body = body;

    this.geometry = utils.parseGeometry(body.geometryDescription);

    this.material = new THREE.MeshLambertMaterial({
      color: options.color,
      envMap: options.envMap,
      reflectivity: 0.5
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
      mesh.position.set(Infinity, Infinity, Infinity);
    }
  }
}

export default class ReportEntity {
  constructor(report, environment) {
    this._report = report;
    this.bodies = [];
    this.currentFrame = 0;
    this.numberOfFrames = report ? report.numberOfFrames : 0;

    let colors = new ColorGenerator();

    if (report) {
      let bodies = report.bodies,
          bodyList = this.bodies;
      for (let id in bodies) {
        let body = bodies[id];

        bodyList.push(new BodyEntity(body, {
          color: colors.next(),
          envMap: environment.envMap()
        }));
      }
    }

    this.canRender = true;
  }


  logs() {
    return this._report ? this._report.fullLogs : '';
  }


  snippets() {
    return this._report ? this._report._snippets : [];
  }


  pointClouds() {
    return this._report ? this._report.pointClouds() : [];
  }


  triangleMeshes() {
    return this._report ? this._report.triangleMeshes() : [];
  }


  setFrame(index) {
    let bodies = this.bodies,
        length = bodies.length;

    this.currentFrame = index;
    for (let i = 0; i < length; i++) {
      let body = bodies[i];

      body.useState(index);
    }
  }
}
