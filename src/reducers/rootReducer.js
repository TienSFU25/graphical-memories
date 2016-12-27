import {combineReducers} from 'redux';
import hello from './helloReducer';

const rootReducer = combineReducers({
  hello
});

export default rootReducer;
