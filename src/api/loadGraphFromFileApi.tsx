import { Promise } from 'bluebird';
import { graph } from '../data/visSample';

function loadGraphFromFile() {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res(graph);
    }, 1000);
  });
}

export default loadGraphFromFile;
