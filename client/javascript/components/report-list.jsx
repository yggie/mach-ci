'use strict';

import React from 'react';

import ReportDetail from './report-detail/report-detail.jsx';

export default class ReportList extends React.Component {
  componentWillMount() {
    this.selectReport(0);
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    this.selectReport(0);
  }

  selectReport(report) {
    this.setState({ selectedReport: report });
  }

  render() {
    var self = this,
        suite = self.props.reportSuite,
        selectedReport = self.state.selectedReport,
        okReports = suite ? suite.reports({ result: 'ok' }) : [],
        failedReports = suite ? suite.reports({ result: 'FAILED' }) : [],
        numberOfReports = okReports.length + failedReports.length;

    return (
      <section>
        <section className="card">
          <h3>Summary</h3>

          Reports: {numberOfReports}
        </section>

        <section className="card reports-detail-view">
          <aside className="reports-list">
            <h3>Failed Tests</h3>
            <ul>
              {
                (numberOfReports) ? (
                  failedReports.map(function (report) {
                    return (
                      <li onClick={self.selectReport.bind(self, report)} key={report.title()}>
                        <i className="fa fa-close"></i> {report.shortTitle()}
                      </li>
                    );
                  })
                ) : (
                  <p>No failures were reported</p>
                )
              }
            </ul>

            <h3>Passed Tests</h3>
            <ul>
              {
                (okReports.length) ? (
                  okReports.map(function (report) {
                    return (
                      <li onClick={self.selectReport.bind(self, report)} key={report.title()}>
                        <i className="fa fa-check"></i> {report.shortTitle()}
                      </li>
                    );
                  })
                ) : (
                  <p>No passes were reported</p>
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
