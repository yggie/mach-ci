'use strict';

import React from 'react';

export default class ReportDetailLogs extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.scrollIndex !== nextProps.scrollIndex ||
      this.props.snippets !== nextProps.snippets;
  }

  render() {
    let snippets = this.props.snippets,
        scrollIndex = this.props.scrollIndex || 0,
        snippetToRender = snippets[scrollIndex];

    return (
      <pre className="logs">
        { snippetToRender }
      </pre>
    );
  }
}
