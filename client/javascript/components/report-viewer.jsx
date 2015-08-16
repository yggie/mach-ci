'use strict';

import React from 'react';

import ReportLogs from './report-viewer/report-logs.jsx';
import ReportCanvas from './report-viewer/report-canvas.jsx';

export default class ReportViewer extends React.Component {
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
    }, this.play.bind(this));
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


  onSliderChange = (event) => {
    this.setState({
      currentFrame: parseInt(event.target.value, 10),
      keepPlaying: false
    });
  }


  onSliderMouseUp = () => {
    this.setState({
      keepPlaying: true
    }, this.play.bind(this));
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


  onTogglePlay(event) {
    if (event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      this.setState({
        keepPlaying: !this.state.keepPlaying
      }, function () {
        if (this.state.keepPlaying) {
          this.play();
        }
      }.bind(this));
    }
  }


  render() {
    let report = this.props.report,
        numberOfFrames = report.numberOfFrames,
        currentFrame = this.state.currentFrame || 0;

    return (
      <div className="canvas-wrapper">
        <ReportCanvas report={report} frame={currentFrame}/>

        <div className="control-box">
          <input className="canvas-slider"
            type="range"
            min="0"
            max={numberOfFrames}
            value={currentFrame}
            onChange={this.onSliderChange}
            onMouseUp={this.onSliderMouseUp} />

          <ReportLogs className="report-logs"
            snippets={report.snippets()}
            frame={currentFrame} />
        </div>
      </div>
    );
  }
}
