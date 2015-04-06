import * as utils from '../utils';
import Body from './body';

export default class TestCase {
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

      match = line.match(/^\s*test ([^\s]+) \.\.\./);
      if (match) {
        // do not return, there is no guarantee that this is the complete log
        self.title = match[1];
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

  didPass() {
    return this.result === 'ok';
  }

  static buildFromFullLogs(fullLog) {
    let cases = [];

    let caseLog = null;
    fullLog.split('\n').map(function (line) {
      let match = line.match(/^\s*test [^\s]+ \.\.\./g);
      if (match) {
        if (caseLog) {
          cases.push(new TestCase(caseLog.join('\n')));
        }
        caseLog = [];
      }

      if (caseLog) {
        caseLog.push(line);
      }

      match = line.match(/(?:ok|fail)$/);
      if (match) {
        cases.push(new TestCase(caseLog.join('\n')));
        caseLog = null;
      }
    });

    if (caseLog) {
      cases.push(new TestCase(caseLog.join('\n')));
    }

    return cases;
  }
}
