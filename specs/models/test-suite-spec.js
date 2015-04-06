import TestSuite from '../../client/javascript/models/test-suite';

describe('TestSuite model', function () {
  'use strict';

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
    let suite = new TestSuite(logs());
    expect(suite.logs()).to.equal(logs());
  });


  it('has all the test cases present in the logs', function () {
    let suite = new TestSuite(logs()),
        cases = suite.testCases();

    expect(cases.length).to.equal(3);
    expect(cases[0].title()).to.equal('tests::some_test');
    expect(cases[1].title()).to.equal('tests::some_other_test');
    expect(cases[2].title()).to.equal('tests::another_test');
  });
});
