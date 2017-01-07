import * as React from 'react';
import * as d3 from 'd3';
import '../css/app.scss';
// import { thing } from './flare';

import initD3 from './hello';

class Content extends React.Component<any, any> {
  componentDidMount() {
    initD3();
  }

  render() {
    return (
      <div>
        <div>This is for d3</div>
        <div id="chart"></div>
      </div>
    );
  }
};

export default Content;
