import * as React from 'react';

class App extends React.Component<any, any> {
  static propTypes = {
    children: React.PropTypes.object.isRequired
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default App;
