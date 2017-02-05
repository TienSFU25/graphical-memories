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
  return i - 1;
}

function _isDefined(e) {
  if (e === null || typeof(e) === "undefined") {
    return false;
  } else {
    return true;
  }
}

export function findNode(node, id, parent = null) {
  const idEquals = (node, id) => {
    return node.id === id || (node.data && node.data.id === id);
  }
  return findNodeGeneric(node, idEquals, id, parent);
};

export function findNodeByName(node, name, parent = null) {
  const nameEquals = (node, name) => {
    return node.name === name || (node.data && node.data.name === name);
  }
  return findNodeGeneric(node, nameEquals, name, parent);
}

export function findNodeGeneric(node, condition, param, parent = null) {
  if (node == null) return null;

  const children = node.children || node._children;
  // console.log(`checking ${node.name}`);
  if (condition(node, param)) {
    return { node, parent };
  } else if (children) {
    for (let index = 0; index < children.length; index++) {
      const child = children[index];
      const result = findNodeGeneric(child, condition, param, node);

      if (_isDefined(result)) {
        return result
      }

      // return null;
    }
  } else {
    return null;
  }
};

// Radial tree related
export function project(x, y): [number, number] {
  var angle = (x - 90) / 180 * Math.PI, radius = y;
  return [radius * Math.cos(angle), radius * Math.sin(angle)];
};

export function translate([x, y], dx, dy) {
  return [x + dx, y + dy];
};

// BFS sibling search
export function findSibling(findNode, subgraphs, younger=true) {
  // find which graph this node belongs in
  let root = findNode;

  while (root.parent) {
    root = root.parent;
  }

  const subgraph = subgraphs[root.rid];
  const subflat = subgraph.flat;

  // linear search. binary search might not work since sort key (name) can be duplicated
  let nodeIndex = -1;

  for (let i = 0; i < subflat.length; i ++) {
    if (subflat[i].data.id == findNode.data.id) {
      nodeIndex = i;
      break;
    }
  }

  const offset = younger ? -1: 1;

  if (nodeIndex + offset >= 0 && nodeIndex + offset < subflat.length) {
    return subflat[nodeIndex + offset];
  } else {
    return subflat[nodeIndex];
  }
}
