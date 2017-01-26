import {combineReducers} from 'redux';
import selectedEntity from '../graphMetadata/selectedEntityReducer';
import graph from '../visualization/mainGraphReducer';
import editBox from '../popups/editBoxReducer';

const rootReducer = combineReducers({
  selectedEntity,
  graph,
  editBox
});

export default rootReducer;
