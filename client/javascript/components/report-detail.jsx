'use strict';

import React from 'react';
import THREE from 'three';
import classNames from 'classnames';

import ReportEntity from '../graphics/report-entity';

export default class ReportDetail extends React.Component {
  constructor() {
    super();

    this.state = {
      reportEntity: new ReportEntity(null)
    };
  }


  componentDidMount() {
    let container = React.findDOMNode(this.refs.canvas),
        renderer = new THREE.WebGLRenderer({
          antialias: true
        }),
        camera = new THREE.PerspectiveCamera(45, 1.0, 1, 100),
        scene = new THREE.Scene();

    this.setState({
      container: container,
      renderer: renderer,
      camera: camera,
      scene: scene,
      reportEntity: new ReportEntity(this.props.selectedReport)
    }, this.prepareToAnimate.bind(this));
  }


  componentWillReceiveProps(nextProps) {
    let scene = this.state.scene,
        reportEntity = this.state.reportEntity;

    reportEntity.bodies().forEach(function (body) {
      scene.remove(body.mesh);
    });

    this.setState({
      reportEntity: new ReportEntity(nextProps.selectedReport)
    }, this.prepareToAnimate.bind(this));
  }


  prepareToAnimate() {
    let parent = React.findDOMNode(this),
        reportEntity = this.state.reportEntity,
        camera = this.state.camera,
        container = this.state.container,
        scene = this.state.scene,
        renderer = this.state.renderer;

    camera.position.z = 5;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(parent.clientWidth, parent.clientWidth * 9 / 14);
    container.appendChild(renderer.domElement);

    reportEntity.bodies().forEach(function (body) {
      scene.add(body.mesh);
    });

    if (reportEntity.canRender()) {
      this.animate();
    }
  }


  animate() {
    let container = this.state.container,
        camera = this.state.camera,
        scene = this.state.scene,
        renderer = this.state.renderer;

    // window.requestAnimationFrame(this.animate.bind(this));

    camera.aspect = container.clientWidth / container.clientHeight;

    renderer.render(scene, camera);
  }


  render() {
    let selectedReport = this.props.selectedReport,
        reportEntity = this.state.reportEntity;

    return (
      <section className="report-detail">
        <h1>{selectedReport.title()}</h1>
        <p>Status: {selectedReport.didPass() ? 'Success' : 'Fail'}</p>

        <div className={classNames({
          'hidden': !reportEntity.canRender()
        })} ref="canvas"></div>
      </section>
    );
  }
}
