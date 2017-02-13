import * as React from 'react';

import Header from './Header';
import Visualizer from '../visualization/Graph';
import Collapsible from './Collapsible';
import { InputWrapper } from '../popups';
import TransitionTest from './TransitionTest';

import '../css/app.scss';
import '../css/edit.scss';

class HomePage extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <TransitionTest />
        <Header />
        <InputWrapper />
        <Visualizer />
      </div>
    );
  }
}

export default HomePage;
