'use strict';

import React from 'react';
import classNames from 'classnames';

import ReportDetail from './report-detail/report-detail.jsx';

export default class ReportList extends React.Component {
  componentWillMount() {
    this.selectReport(0);
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    this.selectReport(0);
  }

  selectReport(reportIndex) {
    let suite = this.props.reportSuite,
        selectedReport = suite ? suite.reports()[reportIndex] : null;

    this.setState({ selectedReport: selectedReport });
  }

  render() {
    var self = this,
        suite = self.props.reportSuite,
        selectedReport = self.state.selectedReport,
        reports = suite ? suite.reports() : [],
        numberOfReports = reports.length;

    return (
      <section>
        <section className="card">
          <h3>Summary</h3>

          Reports: {numberOfReports}
        </section>

        <section className="card reports-detail-view">
          <aside className="reports-list">
            <ul>
              {
                (numberOfReports) ? (
                  reports.map(function (report, index) {
                    return (
                      <li onClick={self.selectReport.bind(self, index)} key={report.title()}>
                        <i className={
                          classNames('fa', {
                            'fa-check': report.didPass(),
                            'fa-close': !report.didPass()
                          })
                        }></i> {report.shortTitle()}
                      </li>
                    );
                  })
                ) : (
                  <p>No reports were found in the logs</p>
                )
              }
            </ul>
          </aside>

          {
            (selectedReport) ? (
              <ReportDetail report={selectedReport} />
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
