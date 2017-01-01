import * as React from 'react';

class App extends React.Component<any, any> {
  static propTypes = {
    children: React.PropTypes.object.isRequired
  }

  render() {
    return (
      <div className="container-fluid">
        {this.props.children}
      </div>
    );
  }
}

export default App;
