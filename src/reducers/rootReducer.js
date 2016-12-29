import {combineReducers} from 'redux';
import selectedEntity from './selectedEntityReducer';
import visNetwork from './visNetworkReducer';
import networkData from './rawNetworkDataReducer';

const rootReducer = combineReducers({
  selectedEntity,
  visNetwork,
  networkData
});

export default rootReducer;
