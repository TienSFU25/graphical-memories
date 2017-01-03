import * as React from 'react';
import { Button } from 'react-bootstrap';

const SaveButton = ({onClick}) => {
  return (
    <Button onClick={onClick}>Save!</Button>
  );
};

export default SaveButton;
