import {combineReducers} from 'redux';
import selectedEntity from '../graphMetadata/selectedEntityReducer';
import graph from '../visualization/graphReducer';

const rootReducer = combineReducers({
  selectedEntity,
  graph
});

export default rootReducer;
