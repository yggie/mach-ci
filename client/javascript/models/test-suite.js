import Report from './report';

export default class TestSuite {
  constructor(logs) {
    this._logs = logs;

    let cases = [];

    let caseLog = null;
    logs.split('\n').map(function (line) {
      let match = line.match(/^\s*test [^\s]+ \.\.\./g);
      if (match) {
        if (caseLog) {
          cases.push(new Report(caseLog.join('\n')));
        }
        caseLog = [];
      }

      if (caseLog) {
        caseLog.push(line);
      }

      match = line.match(/(?:ok|fail)$/);
      if (match) {
        cases.push(new Report(caseLog.join('\n')));
        caseLog = null;
      }
    });

    if (caseLog) {
      cases.push(new Report(caseLog.join('\n')));
    }

    this._cases = cases;
  }


  logs() {
    return this._logs;
  }


  testCases() {
    return this._cases;
  }
}
