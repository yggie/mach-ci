'use strict';

import React from 'react';

import ReportLogs from './components/report-logs.jsx';
import ReportCanvas from './components/report-canvas.jsx';

export default class ReportDetail extends React.Component {
  constructor() {
    super();

    this.state = {
      currentFrame: 0
    };
  }


  componentDidMount() {
    this.setState({
      keepPlaying: true,
      currentFrame: 0
    }, function () {
      this.play();
    }.bind(this));
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.report !== this.props.report) {
      this.setState({
        currentFrame: 0
      });
    }
  }


  componentWillUnmount() {
    this.setState({
      keepPlaying: false
    });
  }


  play() {
    let state = this.state,
        currentFrame = state.currentFrame,
        report = this.props.report,
        frame = (currentFrame + 1) % report.numberOfFrames;

    this.setState({
      currentFrame: frame
    });

    if (state.keepPlaying) {
      setTimeout(this.play.bind(this), 50);
    }
  }


  render() {
    let report = this.props.report,
        currentFrame = this.state.currentFrame;

    return (
      <section className="report-detail">
        <h1>{report.title()}</h1>
        <p>Status: {report.didPass() ? 'Success' : 'Fail'}</p>

        <ReportCanvas report={report} frame={currentFrame} />
        <ReportLogs snippets={report.snippets()} frame={currentFrame} />
      </section>
    );
  }
}
