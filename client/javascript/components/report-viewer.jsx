'use strict';

import React from 'react';

import ReportLogs from './report-viewer/report-logs.jsx';
import ReportCanvas from './report-viewer/report-canvas.jsx';

export default class ReportViewer extends React.Component {
  constructor() {
    super();

    this.state = {
      currentFrame: 0,
      playing: false
    };
  }


  componentDidMount() {
    this.setState({
      playing: true,
      currentFrame: 0
    });
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.report !== this.props.report) {
      this.setState({
        currentFrame: 0
      });
    }
  }


  componentDidUpdate(prevProps, prevState) {
    if (this.state.playing && !prevState.playing) {
      this.play();
    }
  }


  componentWillUnmount() {
    this.setState({
      playing: false
    });
  }


  onSliderChange = (event) => {
    this.setState({
      currentFrame: parseInt(event.target.value, 10),
      playing: false
    });
  }


  onSliderMouseDown = () => {
    this.setState({
      wasPlayingBeforeSlider: this.state.playing
    });
  }


  onSliderMouseUp = () => {
    this.setState({
      playing: this.state.wasPlayingBeforeSlider
    });
  }


  onKeyUp = (event) => {
    if (event.keyCode === 32) { // spacebar
      this.setState({
        playing: !this.state.playing
      });
    }
  }


  play = () => {
    let state = this.state,
        currentFrame = state.currentFrame,
        report = this.props.report,
        frame = (currentFrame + 1) % report.numberOfFrames;

    this.setState({
      currentFrame: frame
    });

    if (state.playing) {
      setTimeout(this.play, 50);
    }
  }


  onTogglePlay(event) {
    if (event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      this.setState({
        playing: !this.state.playing
      });
    }
  }


  render() {
    let report = this.props.report,
        numberOfFrames = report.numberOfFrames,
        currentFrame = this.state.currentFrame || 0;

    return (
      <div className="canvas-wrapper"
        onKeyUp={this.onKeyUp}>
        <ReportCanvas report={report} frame={currentFrame}/>

        <div className="control-box">
          <input className="canvas-slider"
            type="range"
            min="0"
            max={numberOfFrames}
            value={currentFrame}
            onChange={this.onSliderChange}
            onMouseDown={this.onSliderMouseDown}
            onMouseUp={this.onSliderMouseUp} />

          <ReportLogs className="report-logs"
            snippets={report.snippets()}
            frame={currentFrame} />
        </div>
      </div>
    );
  }
}
