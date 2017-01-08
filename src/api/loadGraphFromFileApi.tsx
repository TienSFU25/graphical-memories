import { Promise } from 'bluebird';
import graph from '../data/flare';

function loadGraphFromFile() {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res(graph);
    }, 1000);
  });
}

export default loadGraphFromFile;
