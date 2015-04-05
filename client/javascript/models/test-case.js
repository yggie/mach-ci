import * as utils from '../utils';
import { Body } from './body';

export class TestCase {
  constructor(logs) {
    let self = this;
    self.original = logs;
    self.bodies = {};

    let currentStep = 0;
    logs.split('\n').forEach(function (line) {
      var match = null,
          id = null,
          position = null,
          rotation = null,
          geometry = null;

      match = line.match(/---- (.*) stdout ----/);
      if (match) {
        self.title = match[1];
        return;
      }

      match = line.match(/\[Collisions create_body\] Body\[(.+)\]: Pos=(.+), Rot=(.+), Shape=(.+)/);
      if (match) {
        id = match[1];
        position = utils.parseVector(match[2]);
        rotation = utils.parseQuaternion(match[3]);
        geometry = utils.parseGeometry(match[4]);

        self.bodies[id] = new Body(id, position, rotation, geometry);
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

  static buildFromFullLogs(fullLog) {
    let cases = [];

    let caseLog = null;
    fullLog.split('\n').map(function (line) {
      let match = line.match(/----.+----/g);
      if (match) {
        if (caseLog) {
          cases.push(new TestCase(caseLog.join('\n')));
        }
        caseLog = [];
      }

      if (caseLog) {
        caseLog.push(line);
      }
    });

    cases.push(new TestCase(caseLog.join('\n')));

    return cases;
  }

  prepareRender(scene) {
    for (var id in this.bodies) {
      var body = this.bodies[id];
      body.useState(0);
      scene.add(body.mesh);
    }
  }
}
