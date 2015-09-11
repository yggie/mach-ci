'use strict';

const CLASSNAME_COLLAPSED = 'searchbox ';
const CLASSNAME_EXPANDED = 'searchbox expanded ';

import React from 'react';

export default class Searchbox extends React.Component {
  constructor() {
    super();

    this.state = {
      className: CLASSNAME_COLLAPSED,
      query: '',
      filteredReports: []
    };
  }


  componentDidMount() {
    this.setState({
      filteredReports: this.filter(this.props.reports, this.state.query)
    });
  }


  componentWillReceiveProps(newProps) {
    this.setState({
      filteredReports: this.filter(newProps.reports, this.state.query)
    });
  }


  shouldComponentUpdate(newProps, newState) {
    let state = this.state;

    return newProps.reports !== this.props.reports ||
      newState.query !== state.query ||
      newState.className !== state.className;
  }


  onQueryChange = (event) => {
    let query = event.target.value;
    this.setState({
      query: query,
      filteredReports: this.filter(this.props.reports, query)
    });
  }


  filter(reports, queryString) {
    if (queryString.length === 0) {
      return reports;
    }

    let regex = new RegExp(queryString, 'i');
    let filteredReports = reports.filter(function (report) {
      return report.shortTitle().match(regex);
    });

    return filteredReports;
  }


  onSelectReport(report) {
    if (this.props.onSelectReport) {
      this.setState({ className: CLASSNAME_COLLAPSED });
      this.props.onSelectReport.call(null, report);
    }
  }


  onKeyDown = (event) => {
    if (event.keyCode === 27) { // ESC
      this.setState( { className: CLASSNAME_COLLAPSED });
    }
  }


  onMouseOver = () => {
    this.setState({ className: CLASSNAME_EXPANDED });
  }


  onMouseOut = () => {
    this.setState({ className: CLASSNAME_COLLAPSED });
  }


  render() {
    let self = this;

    return (
      <div className={self.state.className + (self.props.className || '')}
        onMouseOver={self.onMouseOver}
        onMouseOut={self.onMouseOut}
        onKeyDown={self.onKeyDown}>

        <div className="searchbox-field">
          <form autoComplete="off">
            <input className="searchbox-query"
              type="search"
              name="query"
              onChange={self.onQueryChange}
              placeholder="Search reports by name..."/>
            <input className="searchbox-field-submit" type="submit" value=""/>
            <span className="fa fa-search searchbox-field-icon"></span>
          </form>
        </div>

        <ul className="searchbox-options">
          {
            self.state.filteredReports.map(function (report) {
              return (
                <li className="searchbox-options-item"
                  onClick={self.onSelectReport.bind(self, report)}>
                  {report.shortTitle()}
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }
}
