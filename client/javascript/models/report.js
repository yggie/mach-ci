'use strict';

import * as utils from '../utils';
import Body from './body';

export default class Report {
  constructor(logs) {
    let self = this;
    self.fullLogs = logs;
    self.bodies = {};
    self._snippets = [];

    let currentStep = 0,
        snippet = [];

    logs.split('\n').forEach(function (line) {
      var match = null,
          id = null,
          position = null,
          rotation = null;

      snippet.push(line);
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
        if (currentStep !== 0) {
          self._snippets.push(snippet.splice(0, snippet.length - 1).join('\n'));
        }
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

    self._snippets.push(snippet.join('\n'));
    self.numberOfFrames = currentStep;
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
}
