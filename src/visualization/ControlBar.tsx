import * as React from 'react';
import { PropTypes } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import graphManipulationActions from '../graphMetadata/graphManipulationActions';

const ControlBar = ({onClickAdd, onClickDelete}) => {
  return (
    <ButtonGroup>
      <Button onClick={onClickAdd}>Add Child</Button>
      <Button onClick={onClickDelete}>Delete</Button>
    </ButtonGroup>
  );
};

export default ControlBar;
