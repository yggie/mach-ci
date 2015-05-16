'use strict';

import ReportSuite from '../../client/javascript/models/report-suite';

describe('ReportSuite model', function () {
  let logs = function () {
    return `
           Running target/debug/lib-a8870084aab755f9

      running 3 test
      test tests::some_test ... ok
      test tests::some_other_test ... ok
      test tests::another_test ... fail

      test result: FAILED. 2 passed; 1 failed; 0 ignored; 0 measured
    `;
  };


  it('has a copy of the original logs', function () {
    let suite = new ReportSuite(logs());
    expect(suite.logs()).to.equal(logs());
  });


  it('has all the reports present in the logs', function () {
    let suite = new ReportSuite(logs()),
        reports = suite.reports();

    expect(reports.length).to.equal(3);
    expect(reports[0].title()).to.equal('tests::some_test');
    expect(reports[1].title()).to.equal('tests::some_other_test');
    expect(reports[2].title()).to.equal('tests::another_test');
  });
});
