import * as React from 'react';

import './loader.css';

class Loader extends React.Component<any, any> {
  render() {
    return (
      <div className="cs-loader">
        <div className="cs-loader-inner">
          <label>	●</label>
          <label>	●</label>
          <label>	●</label>
          <label>	●</label>
          <label>	●</label>
          <label>	●</label>
        </div>
      </div>
    );
  }
};

export default Loader;
