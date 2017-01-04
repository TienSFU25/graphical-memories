import * as React from 'react';
import * as d3 from 'd3';
import '../css/app.scss';
// import { thing } from './flare';

import * as hello from './hello.js';

class Content extends React.Component<any, any> {
  componentDidMount() {
    console.log(hello);
  }

  render() {
    return (
      <div>
        <div>This is for d3</div>
        <div className="chart"></div>
      </div>
    );
  }
};

export default Content;
