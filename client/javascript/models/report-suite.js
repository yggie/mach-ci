'use strict';

import Report from './report';

export default class ReportSuite {
  constructor(logs) {
    this._logs = logs;

    let reports = [];

    let caseLog = null;
    logs.split('\n').map(function (line) {
      let match = line.match(/^\s*test [^\s]+ \.\.\./g);
      if (match) {
        if (caseLog) {
          reports.push(new Report(caseLog.join('\n')));
        }
        caseLog = [];
      }

      if (caseLog) {
        caseLog.push(line);
      }

      match = line.match(/(?:ok|fail)$/);
      if (match) {
        reports.push(new Report(caseLog.join('\n')));
        caseLog = null;
      }
    });

    if (caseLog) {
      reports.push(new Report(caseLog.join('\n')));
    }

    this._reports = reports;
  }


  logs() {
    return this._logs;
  }


  reports(filter) {
    var reports = this._reports;

    if (filter) {
      if (typeof filter.result !== 'undefined') {
        reports = reports.filter(function (report) {
          return report.result === filter.result;
        });
      }
    }

    return reports;
  }
}
