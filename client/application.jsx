'use strict';

import React from 'react';
import $ from 'jquery';

import Searchbox from './components/searchbox.jsx';
import ReportViewer from './components/report-viewer.jsx';
import parseLogs from './parse-logs';

export default class Application extends React.Component {
  constructor() {
    super();

    this.state = this.stateWithLogs('');
  }


  stateWithLogs(logs) {
    let reports = parseLogs(logs);

    return {
      logs: logs,
      reports: reports,
      selectedReport: reports[0]
    };
  }


  componentDidMount() {
    var self = this;

    $.ajax({
      url: '/default.log',
      success: function (newLogs, status, request) {
        console.log(request.getResponseHeader('Last-Modified'));
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
      this.setState(this.stateWithLogs(newState.logs));
    }

    if (newState.reports !== state.reports ||
        newState.selectedReport !== state.selectedReport) {
      shouldUpdate = true;
    }

    return shouldUpdate;
  }


  onReportSelected = (report) => {
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
            onSelectReport={this.onReportSelected} />
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
