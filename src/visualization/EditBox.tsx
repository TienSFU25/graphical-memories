import * as React from 'react';

const EditBox = ({htmlCoords}) => {
  const style = {
    top: htmlCoords.y + window.pageYOffset,
    left: htmlCoords.x
  };

  return (
    <input type="text" className="editBox" style={style} />
  );
};

export default EditBox;
