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
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('keydown', this.onKeyDown);

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
    let state = this.state;

    if (state.playing && !prevState.playing) {
      this.play();
    } else if (!state.playing && state.timeout) {
      clearTimeout(state.timeout);

      this.setState({
        timeout: null
      });
    }
  }


  componentWillUnmount() {
    this.setState({
      playing: false
    });
  }


  onSliderChange = (event) => {
    let state = this.state;
    let wasPlaying = (state.sliderActive) ? state.wasPlayingBeforeSlider : state.playing;

    this.setState({
      currentFrame: parseInt(event.target.value, 10),
      wasPlayingBeforeSlider: wasPlaying,
      sliderActive: true,
      playing: false
    });
  }


  onSliderMouseUp = () => {
    this.setState({
      sliderActive: false,
      playing: this.state.wasPlayingBeforeSlider
    });
  }


  onKeyUp = (event) => {
    if (event.keyCode === 32) { // spacebar
      this.setState({
        playing: !this.state.playing
      });

      return false;
    }

    return true;
  }


  onKeyDown = (event) => {
    switch (event.keyCode) {
      case 37: // left arrow
        this.setFrame(this.state.currentFrame - 1 + this.props.report.numberOfFrames);
        break;

      case 39: // right arrow
        this.setFrame(this.state.currentFrame + 1);
        break;

      default:
        return true;
    }

    return false;
  }


  setFrame(frame) {
    this.setState({
      currentFrame: frame % this.props.report.numberOfFrames
    });
  }


  play = () => {
    this.setFrame(this.state.currentFrame + 1);

    if (this.state.playing) {
      this.setState({
        timeout: setTimeout(this.play, 50)
      });
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
        ref="wrapper">
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
