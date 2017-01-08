import {combineReducers} from 'redux';
import selectedEntity from '../graphMetadata/selectedEntityReducer';
import rawGraph from '../graphMetadata/rawGraphReducer';

const rootReducer = combineReducers({
  selectedEntity,
  rawGraph
});

export default rootReducer;
