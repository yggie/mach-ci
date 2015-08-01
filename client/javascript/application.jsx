'use strict';

import React from 'react';
import $ from 'jquery';

import Searchbox from './components/searchbox.jsx';
import ReportViewer from './components/report-viewer.jsx';
import parseLogs from './parse-logs';

export default class Application extends React.Component {
  constructor() {
    super();

    let $logs = $('#logs');
    let logs = $logs.length ? ($logs[0].innerText || '') : '';

    this.state = {
      logs: logs,
      reports: [],
      selectedReport: null
    };
  }


  componentDidMount() {
    var self = this;

    $.ajax({
      url: '/sample-01-08-2015.log',
      success: function (newLogs) {
        self.setState({
          logs: newLogs
        });
      }
    });
  }


  shouldComponentUpdate(newProps, newState) {
    let shouldUpdate = false;
    let state = this.state;
    if (newState.logs !== state.logs) {
      shouldUpdate = true;

      let reports = parseLogs(newState.logs);
      this.setState({
        reports: reports,
        selectedReport: reports[0]
      });
    }

    if (newState.reports !== state.reports ||
        newState.selectedReport !== state.selectedReport) {
      shouldUpdate = true;
    }

    return shouldUpdate;
  }


  onReportSelected(report) {
    this.setState({
      selectedReport: report
    });
  }


  render() {
    return (
      <main className="main-content">
        <header className="main-header">
          <Searchbox className="main-searchbox"
            reports={this.state.reports}
            onSelectReport={this.onReportSelected.bind(this)} />
        </header>

        {(
          (this.state.selectedReport) ? (
            <ReportViewer report={this.state.selectedReport} />
          ) : (
            <p>No report has been selected</p>
          )
        )}
      </main>
    );
  }
}
