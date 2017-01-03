import { NetworkData } from '../types';
import jsonToVisNetwork from './jsonToVisNetwork';
import datasetToNetwork from './datasetToNetwork';

export function mapToNetworkData(input: any): NetworkData {
  if (typeof(input) === 'string') {
    input = JSON.parse(input);
  }

  if (input.nodes._data) {
    return datasetToNetwork(input);
  } else {
    return jsonToVisNetwork(input);
  }
}
