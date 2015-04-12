'use strict';

import React from 'react';
import $ from 'jquery';

import Store from './store';
import TestCasesList from './components/test-cases-list.jsx';
import TestSuite from './models/test-suite';

export default class Application extends React.Component {
  constructor() {
    super();

    let logsElement = document.getElementById('logs'),
        logs = '';

    if (logsElement) {
      logs = logsElement.innerText || '';
    }

    this.state = {
      testSuite: Store.create(TestSuite, logs)
    };
  }


  componentDidMount() {
    var self = this;

    $.ajax({
      url: '/sample-05-04-2015.log',
      success: function (result) {
        self.setState({
          testSuite: Store.create(TestSuite, result)
        });
      }
    });
  }


  render() {
    return (
      <div>
        <header className="main-header">
          <a href="/">Mithril CI v0.0.1</a>
        </header>

        <main className="main-content">
          <TestCasesList testSuite={this.state.testSuite} />
        </main>
      </div>
    );
  }
}
