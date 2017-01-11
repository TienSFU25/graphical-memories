import * as _ from 'lodash';

export function attachIds(dataRoot) {
  let i = 0;

  const attachId = (node) => {
    if (node == null) return;

    node.id = i;
    i += 1;

    const children = node.children || node._children;

    _.forEach(children, child => {
      attachId(child);
    });
  };

  attachId(dataRoot);
}
