import {combineReducers} from 'redux';
import selectedEntity from '../graphMetadata/selectedEntityReducer';
import graph from '../visualization/mainGraphReducer';
import editBox from '../visualization/editBoxReducer';

const rootReducer = combineReducers({
  selectedEntity,
  graph,
  editBox
});

export default rootReducer;
