'use strict';

import * as utils from '../utils';
import Body from './body';
import Contact from './contact';
import PointCloud from '../graphics/point-cloud';
import TriangleMesh from '../graphics/triangle-mesh';

export default class Report {
  constructor(logs) {
    let self = this;
    self.fullLogs = logs;
    self.bodies = {};
    self._snippets = [];
    self._pointClouds = {};
    self._triangleMeshes = {};
    self._contacts = [];

    let currentStep = 0,
        snippet = [];

    logs.split('\n').forEach(function (line) {
      var match = null,
          id = null,
          position = null,
          rotation = null;

      snippet.push(line);

      if (match = line.match(/^\s*test ([^\s]+) \.\.\./)) {
        // do not return, there is no guarantee that this is the complete log
        self._title = match[1];
      }

      if (match = line.match(/(ok|FAILED)$/)) {
        self.result = match[1];
      } else if (match = line.match(/\[NEW\] (?:RigidBody|StaticBody)\[(.+)\]: Pos=(.+), Rot=(.+), Shape=(.+)/)) {
        id = match[1];
        position = utils.parseVector(match[2]);
        rotation = utils.parseQuaternion(match[3]);

        self.bodies[id] = new Body(id, position, rotation, match[4]);
      } else if (match = line.match(/\[FRAME\] NEW/)) {
        if (currentStep !== 0) {
          self._snippets.push(snippet.splice(0, snippet.length - 1).join('\n'));
        }
        currentStep = currentStep + 1;
      } else if (match = line.match(/\[FRAME\] (?:RigidBody|StaticBody)\[(.+)\]: Pos=(.+), Rot=(.+)/)) {
        id = match[1];
        position = utils.parseVector(match[2]);
        rotation = utils.parseQuaternion(match[3]);

        self.bodies[id].addStateAt(currentStep, position, rotation);
      } else if (match = line.match(/\[FRAME\] PointCloud\[(.+)\]: (.+)/)) {
        id = match[1];
        position = utils.parseVector(match[2]);

        let pointCloud = self.findOrCreatePointCloud(id);
        pointCloud.addPointAtFrame(position, currentStep);
      } else if (match = line.match(/\[FRAME\] TriangleMesh\[(.+)\]: (.+) -> (.+) -> (.+)/)) {
        id = match[1];

        let point0 = utils.parseVector(match[2]);
        let point1 = utils.parseVector(match[3]);
        let point2 = utils.parseVector(match[4]);

        let triangleMesh = self.findOrCreateTriangleMesh(id);
        triangleMesh.addFaceAtFrame([point0, point1, point2], currentStep);
      } else if (match = line.match(/\[FRAME\] Contact: Center=(.+), Normal=(.+)/)) {
        let center = utils.parseVector(match[1]);
        let normal = utils.parseVector(match[2]);

        let contact = new Contact(center, normal);
        self.addContact(contact, currentStep);
      }
    });

    self._snippets.push(snippet.join('\n'));
    self.numberOfFrames = self._snippets.length;
  }


  title() {
    return this._title;
  }


  shortTitle() {
    return this._title.replace(/\w+::/g, function (match) {
      return match[0].toUpperCase() + ':';
    });
  }


  snippets() {
    return this._snippets;
  }


  didPass() {
    return this.result === 'ok';
  }


  didFail() {
    return this.result === 'FAILED';
  }


  contacts() {
    return this._contacts;
  }


  pointClouds() {
    let self = this;

    return Object.keys(self._pointClouds).map(function (key) {
      return self._pointClouds[key];
    });
  }


  triangleMeshes() {
    let self = this;

    return Object.keys(self._triangleMeshes).map(function (key) {
      return self._triangleMeshes[key];
    });
  }

  findOrCreatePointCloud(id) {
    return this._pointClouds[id] || (this._pointClouds[id] = new PointCloud(id));
  }

  findOrCreateTriangleMesh(id) {
    return this._triangleMeshes[id] || (this._triangleMeshes[id] = new TriangleMesh(id));
  }

  addContact(contact, frame) {
    this._contacts[frame] = this._contacts[frame] || [];
    this._contacts[frame].push(contact);
  }
}
