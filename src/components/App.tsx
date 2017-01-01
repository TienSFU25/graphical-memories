import * as React from 'react';
// import Header from './common/Header';

interface AppProps {
  children: Object
}

class App extends React.Component<AppProps, any> {
  render() {
    return (
      <div className="container-fluid">
        {this.props.children}
      </div>
    );
  }
}

export default App;
