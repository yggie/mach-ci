'use strict';

import React from 'react';

export default class ReportDetail extends React.Component {
  render() {
    let selectedReport = this.props.selectedReport;

    return (
      <section className="report-detail">
        <h1>{selectedReport.title()}</h1>
        <p>Status: {selectedReport.didPass() ? 'Success' : 'Fail'}</p>
      </section>
    );
  }
}
