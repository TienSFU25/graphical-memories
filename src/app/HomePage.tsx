import * as React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import MouseBackend from 'react-dnd-mouse-backend';
import TouchBackend from 'react-dnd-html5-touch-backend';

import Header from './Header';
import Visualizer from '../visualization/Graph';
import Collapsible from '../_test/Collapsible';
import { InputWrapper } from '../popups';
import Tooltip from '../tooltip';
import '../css/app.scss';
import '../css/edit.scss';

// const Icons = require('babel!svg-react!./test.svg?name=Icon');
// const theImage = require('../images/office.jpg');

// doesnt work with SVGS :|
// @DragDropContext(HTML5Backend)
export default class HomePage extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Tooltip />
        <InputWrapper />
        <Visualizer />
      </div>
    );
  }
}
