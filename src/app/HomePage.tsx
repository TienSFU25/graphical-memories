import * as React from 'react';

import Header from './Header';
import Visualizer from '../visualization/Graph';
import Collapsible from '../_test/Collapsible';
import { InputWrapper } from '../popups';
import TransitionTest from '../_test/TransitionTest';
import Chessboard from '../_test/Chessboard/index';
import DragTest from '../_test/DragTest/index';

import '../css/app.scss';
import '../css/edit.scss';

class HomePage extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <DragTest />
        <Header />
        <InputWrapper />
        <Visualizer />
      </div>
    );
  }
}

export default HomePage;
