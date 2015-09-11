'use strict';

import parseLogs from '../client/parse-logs';

describe('parseLogs', function () {
  let logs = function () {
    return `
           Running target/debug/lib-a8870084aab755f9

      running 5 test
      test tests::some_test ... ok
      test tests::some_other_test ... ok
      test tests::just_another_test ... abc
      ok
      test tests::renderable_test ... [RENDERABLE]
      ok
      test tests::another_test ... fail

      test result: FAILED. 4 passed; 1 failed; 0 ignored; 0 measured
    `;
  };


  it('instantiates renderable report instances from the logs', function () {
    let reports = parseLogs(logs());

    expect(reports.length).to.equal(1);
    expect(reports[0].title()).to.equal('tests::renderable_test');
  });
});
