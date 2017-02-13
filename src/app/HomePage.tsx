import * as React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import MouseBackend from 'react-dnd-mouse-backend';
import TouchBackend from 'react-dnd-html5-touch-backend';

import Header from './Header';
import Visualizer from '../visualization/Graph';
import Collapsible from '../_test/Collapsible';
import { InputWrapper } from '../popups';
import TransitionTest from '../_test/TransitionTest';
import Chessboard from '../_test/Chessboard/index';
import DragTest from '../_test/DragTest/index';
import '../css/app.scss';
import '../css/edit.scss';

// doesnt work with SVGS :|
// @DragDropContext(HTML5Backend)
@DragDropContext(MouseBackend)
// @DragDropContext(TouchBackend)
export default class HomePage extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Header />
        <InputWrapper />
        <Visualizer />
      </div>
    );
  }
}
