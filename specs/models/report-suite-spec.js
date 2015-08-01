'use strict';

import ReportSuite from '../../client/javascript/models/report-suite';

describe('ReportSuite model', function () {
  let logs = function () {
    return `
           Running target/debug/lib-a8870084aab755f9

      running 5 test
      test tests::some_test ... ok
      test tests::some_other_test ... ok
      test tests::just_another_test ... abc
      ok
      test tests::renderable_test ... [NEW_SIMULATION]
      ok
      test tests::another_test ... fail

      test result: FAILED. 4 passed; 1 failed; 0 ignored; 0 measured
    `;
  };


  it('has a copy of the original logs', function () {
    let suite = new ReportSuite(logs());
    expect(suite.logs()).to.equal(logs());
  });


  it('only captures fully simulated reports', function () {
    let suite = new ReportSuite(logs()),
        reports = suite.reports();

    expect(reports.length).to.equal(1);
    expect(reports[0].title()).to.equal('tests::renderable_test');
  });
});
