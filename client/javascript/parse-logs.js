'use strict';

import Report from './models/report';

export default function (logs) {
    let reports = [];

    let caseLog = null;
    logs.split('\n').forEach(function (line) {
      let regex = /^\s*test [^\s]+ \.\.\.(.*)$/g;
      let match = regex.exec(line);
      if (match) {
        if (caseLog && caseLog.length > 0) {
          reports.push(new Report(caseLog.join('\n')));
        }

        if (match[1] !== ' [RENDERABLE]') {
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

    return reports;
};
