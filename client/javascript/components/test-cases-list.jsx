/* global React:false */

export class TestCasesList extends React.Component {
  render() {
    return (
      /* jshint ignore:start */
      <ul>
        {
          this.props.testCases.map(function (testCase) {
            return (
              <li>{testCase.title}</li>
            );
          })
        }
      </ul>
      /* jshint ignore:end */
    );
  }
}
