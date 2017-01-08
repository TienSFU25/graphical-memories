import {combineReducers} from 'redux';
import selectedEntity from '../network/selectedEntityReducer';

const rootReducer = combineReducers({
  selectedEntity
});

export default rootReducer;
