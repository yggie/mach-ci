import React from 'react';

export default class TestCasesList extends React.Component {
  render() {
    var suite = this.props.testSuite;
    return (
      /* jshint ignore:start */
      <ul>
        {
          (suite && suite.testCases().length) ? (
            suite.testCases().map(function (testCase) {
              return (
                <li key={testCase.title()}>{testCase.title()}</li>
              );
            })
          ) : (
            <p>No test cases were found in the current test suite</p>
          )
        }
      </ul>
      /* jshint ignore:end */
    );
  }
}
