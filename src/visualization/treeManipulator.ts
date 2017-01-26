import * as _ from 'lodash';

let i = 0;
export function attachIds(dataRoot, isd3Node = false) {
  const attachId = (node) => {
    if (node == null) return;

    if (isd3Node) {
      node.data.id = i;
    } else {
      node.id = i;
    }

    i += 1;

    const children = node.children || node._children;

    _.forEach(children, child => {
      attachId(child);
    });
  };

  attachId(dataRoot);
}

export function getNextId() {
  i += 1;
  return i;
}
