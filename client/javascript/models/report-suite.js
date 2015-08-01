'use strict';

import Report from './report';

export default class ReportSuite {
  constructor(logs) {
    this._logs = logs;

    let reports = [];

    let caseLog = null;
    logs.split('\n').forEach(function (line) {
      let regex = /^\s*test [^\s]+ \.\.\.(.*)$/g;
      let match = regex.exec(line);
      if (match) {
        if (caseLog && caseLog.length > 0) {
          reports.push(new Report(caseLog.join('\n')));
        }

        if (match[1] !== ' [NEW_SIMULATION]') {
          caseLog = null;
          return;
        }

        caseLog = [];
      }

      if (caseLog) {
        caseLog.push(line);

        if (line === 'ok' || line === 'fail') {
          reports.push(new Report(caseLog.join('\n')));
          caseLog = null;
        }
      }
    });

    if (caseLog && caseLog.length > 0) {
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
