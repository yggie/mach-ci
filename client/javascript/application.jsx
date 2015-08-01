'use strict';

import React from 'react';
import $ from 'jquery';

import Store from './store';
import ReportList from './components/report-list.jsx';
import ReportSuite from './models/report-suite';

export default class Application extends React.Component {
  constructor() {
    super();

    let logsElement = document.getElementById('logs'),
        logs = '';

    if (logsElement) {
      logs = logsElement.innerText || '';
    }

    this.state = {
      reportSuite: Store.create(ReportSuite, logs)
    };
  }


  componentDidMount() {
    var self = this;

    $.ajax({
      url: '/sample-01-08-2015.log',
      success: function (result) {
        self.setState({
          reportSuite: Store.create(ReportSuite, result)
        });
      }
    });
  }


  render() {
    return (
      <div>
        <header className="main-header">
          <a href="/">Mach CI v0.0.1</a>
        </header>

        <main className="main-content">
          <ReportList reportSuite={this.state.reportSuite} />
        </main>
      </div>
    );
  }
}
