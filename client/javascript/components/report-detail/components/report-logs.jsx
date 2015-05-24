'use strict';

import React from 'react';

export default class ReportLogs extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.frame !== nextProps.frame ||
      this.props.snippets !== nextProps.snippets;
  }

  render() {
    let snippets = this.props.snippets,
        frame = this.props.frame || 0,
        snippetToRender = snippets[frame];

    return (
      <pre className="logs">
        { snippetToRender }
      </pre>
    );
  }
}
