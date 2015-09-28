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
      reflectivity: 0.5,
      transparent: true,
      opacity: 0.7
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
    this._contacts = [];
    this.bodies = [];
    this.currentFrame = 0;
    this.numberOfFrames = report ? report.numberOfFrames : 0;

    this._contactMaterial = new THREE.PointCloudMaterial({
      color: '#ff0',
      size: 0.1
    });

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

      report.contacts().forEach(function (contactsInFrame, frame) {
        console.log(frame);
        if (contactsInFrame.length) {
          let geometry = new THREE.Geometry();
          contactsInFrame.forEach(function (contact) {
            geometry.vertices.push(contact.center().clone());
          });
          this._contacts[frame] = new THREE.PointCloud(geometry, this._contactMaterial);
        }
      }.bind(this));
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


  initialize(scene) {
    let currentFrame = this.currentFrame;
    this.bodies.forEach(function (body) {
      scene.add(body.mesh);
    });
    this.pointClouds().forEach(function (pointCloud) {
      scene.add(pointCloud.threeObjectAt(currentFrame));
    });
    this.triangleMeshes().forEach(function (triangleMesh) {
      scene.add(triangleMesh.threeObjectAt(currentFrame));
    });

    let contactsInFrame = this._contacts[currentFrame];
    console.log(currentFrame, contactsInFrame, this._contacts);
    if (contactsInFrame) {
      scene.add(contactsInFrame);
    }
  }


  cleanup(scene) {
    let currentFrame = this.currentFrame;
    this.bodies.forEach(function (body) {
      scene.remove(body.mesh);
    });

    this.pointClouds().forEach(function (pointCloud) {
      scene.remove(pointCloud.threeObjectAt(currentFrame));
    });

    this.triangleMeshes().forEach(function (triangleMesh) {
      scene.remove(triangleMesh.threeObjectAt(currentFrame));
    });

    let contactsInFrame = this._contacts[currentFrame];
    if (contactsInFrame) {
      scene.remove(contactsInFrame);
    }
  }


  setFrame(frame, scene) {
    let bodies = this.bodies,
        length = bodies.length,
        currentFrame = this.currentFrame;

    this.pointClouds().forEach(function (pointCloud) {
      scene.remove(pointCloud.threeObjectAt(currentFrame));
    });
    this.triangleMeshes().forEach(function (triangleMesh) {
      scene.remove(triangleMesh.threeObjectAt(currentFrame));
    });
    let contactsInFrame = this._contacts[currentFrame];
    if (contactsInFrame) {
      scene.remove(contactsInFrame);
    }

    this.currentFrame = frame;
    for (let i = 0; i < length; i++) {
      let body = bodies[i];

      body.useState(frame);
    }

    this.pointClouds().forEach(function (pointCloud) {
      scene.add(pointCloud.threeObjectAt(frame));
    });
    this.triangleMeshes().forEach(function (triangleMesh) {
      scene.add(triangleMesh.threeObjectAt(frame));
    });
    let newContactsInFrame = this._contacts[frame];
    if (newContactsInFrame) {
      scene.add(newContactsInFrame);
    }
  }
}
