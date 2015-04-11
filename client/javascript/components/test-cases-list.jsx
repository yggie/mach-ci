'use strict';

import React from 'react';
import classNames from 'classnames';

import ReportDetail from './report-detail.jsx';

export default class TestCasesList extends React.Component {
  componentWillMount() {
    this.selectReport(0);
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    this.selectReport(0);
  }

  selectReport(reportIndex) {
    let suite = this.props.testSuite,
        selectedReport = suite ? suite.testCases()[reportIndex] : null;

    this.setState({ selectedReport: selectedReport });
  }

  render() {
    var self = this,
        suite = self.props.testSuite,
        selectedReport = self.state.selectedReport,
        numberOfTests = suite ? suite.testCases().length : 0;

    return (
      <section>
        <section className="card">
          <h3>Summary</h3>

          Tests: {numberOfTests}
        </section>

        <section className="card reports-detail-view">
          <aside className="reports-list">
            <ul>
              {
                (numberOfTests) ? (
                  suite.testCases().map(function (testCase, index) {
                    return (
                      <li onClick={self.selectReport.bind(self, index)} key={testCase.title()}>
                        <i className={
                          classNames('fa', {
                            'fa-check': testCase.didPass(),
                            'fa-close': !testCase.didPass()
                          })
                        }></i> {testCase.shortTitle()}
                      </li>
                    );
                  })
                ) : (
                  <p>No test cases were found in the current test suite</p>
                )
              }
            </ul>
          </aside>

          {
            (selectedReport) ? (
              <ReportDetail selectedReport={selectedReport} />
            ) : (
              <div className="report-detail">
                <p>No report has been selected.</p>
              </div>
            )
          }
        </section>
      </section>
    );
  }
}
