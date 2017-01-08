import * as React from 'react';
import * as d3 from 'd3';
import '../css/app.scss';

import TreeManager from './TreeManager';

class Content extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      tree: null
    };
  }

  componentDidMount() {
    this.setState({tree: new TreeManager('#chart')});
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
