'use strict';

import React from 'react';
import classNames from 'classnames';

export default class ReportDetailLogs extends React.Component {
  render() {
    let snippets = this.props.snippets,
        scrollIndex = this.props.scrollIndex;

    return (
      <pre className="logs">
        {
          snippets.map(function (snippet, index) {
            return (
              <div key={index}
                  className={classNames({ 'current': index = scrollIndex })}>
                {snippet}
              </div>
            );
          })
        }
      </pre>
    );
  }
}
