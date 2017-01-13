import {combineReducers} from 'redux';
import selectedEntity from '../graphMetadata/selectedEntityReducer';
import graph from '../visualization/mainGraphReducer';

const rootReducer = combineReducers({
  selectedEntity,
  graph
});

export default rootReducer;
