'use strict';

import ReportLogs from '../../../client/components/report-viewer/report-logs.jsx';

describe('ReportLogs', function () {
  it('passes the class along', function () {
    let element = specs.render(
      <ReportLogs className="my-class" frame={0} snippets={['a', 'b']}/>
    );

    expect(element.props.className).to.equal('my-class');
  });

  it('only renders the current frame text in the element', function () {
    let snippets = ['a snippet text', 'another snippet text', 'final text'];
    let string = specs.renderToString(
      <ReportLogs className="my-class"
        frame={1}
        snippets={snippets}/>
    );

    expect(string).not.to.contain(snippets[0]);
    expect(string).to.contain(snippets[1]);
    expect(string).not.to.contain(snippets[2]);
  });

  it('displays a counter indicating which frame you are currently on', function () {
    let string = specs.renderToString(
      <ReportLogs className="my-class"
        frame={2}
        snippets={['a', 'b', 'c', 'd']}/>
    );

    expect(string).to.contain('3 / 4');
  });
});
