import {combineReducers} from 'redux';
import selectedEntity from '../network/selectedEntityReducer';
import visNetwork from '../network/visNetworkReducer';
import networkData from '../network/rawNetworkDataReducer';

const rootReducer = combineReducers({
  selectedEntity,
  visNetwork,
  networkData
});

export default rootReducer;
