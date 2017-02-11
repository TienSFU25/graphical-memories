import {combineReducers} from 'redux';
import selectedEntity from '../graphMetadata/selectedEntityReducer';
import graph from '../visualization/mainGraphReducer';
import editBox from '../popups/editBoxReducer';
import carouselImages from '../carousel/carouselReducer';
import editMode from '../editMode/reducer';

const rootReducer = combineReducers({
  selectedEntity,
  graph,
  editBox,
  carouselImages,
  editMode
});

export default rootReducer;
