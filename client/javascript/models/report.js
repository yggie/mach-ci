'use strict';

import * as utils from '../utils';
import Body from './body';

export default class Report {
  constructor(logs) {
    let self = this;
    self._snippet = logs;
    self.bodies = {};

    let currentStep = 0;

    logs.split('\n').forEach(function (line) {
      var match = null,
          id = null,
          position = null,
          rotation = null;

      match = line.match(/^\s*test ([^\s]+) \.\.\./);
      if (match) {
        // do not return, there is no guarantee that this is the complete log
        self._title = match[1];
      }

      match = line.match(/(ok|fail)$/);
      if (match) {
        self.result = match[1];
        return;
      }

      match = line.match(/\[Collisions create_body\] Body\[(.+)\]: Pos=(.+), Rot=(.+), Shape=(.+)/);
      if (match) {
        id = match[1];
        position = utils.parseVector(match[2]);
        rotation = utils.parseQuaternion(match[3]);

        self.bodies[id] = new Body(id, position, rotation, match[4]);
        return;
      }

      match = line.match(/\[Dynamics update\] START/);
      if (match) {
        currentStep = currentStep + 1;
        return;
      }

      match = line.match(/\[Dynamics update\] Body\[(.+)\]: Pos=(.+), Rot=(.+)/);
      if (match) {
        id = match[1];
        position = utils.parseVector(match[2]);
        rotation = utils.parseQuaternion(match[3]);

        self.bodies[id].addStateAt(currentStep, position, rotation);
        return;
      }
    });

    self.numberOfSteps = currentStep;
  }


  snippet() {
    return this._snippet;
  }


  title() {
    return this._title;
  }


  shortTitle() {
    return this._title.replace(/\w+::/g, function (match) {
      return match[0].toUpperCase() + ':';
    });
  }


  didPass() {
    return this.result === 'ok';
  }
}
