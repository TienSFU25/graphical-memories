import {combineReducers} from 'redux';
import selectedEntity from '../graphMetadata/selectedEntityReducer';
import graph from '../visualization/mainGraphReducer';
import editBox from '../popups/editBoxReducer';
import carouselImages from '../carousel/carouselReducer';
import zoomEnabled from '../zoomMode/reducer';

const rootReducer = combineReducers({
  selectedEntity,
  graph,
  editBox,
  carouselImages,
  zoomEnabled
});

export default rootReducer;
