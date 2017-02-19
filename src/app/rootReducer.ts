import {combineReducers} from 'redux';
import selectedEntity from '../graphMetadata/selectedEntityReducer';
import graph from '../visualization/mainGraphReducer';
import editBox from '../popups/editBoxReducer';
import carouselImages from '../carousel/carouselReducer';
import zoomEnabled from '../zoomMode/reducer';
import toolTip from '../toolTip/reducer';

const rootReducer = combineReducers({
  selectedEntity,
  graph,
  editBox,
  carouselImages,
  zoomEnabled,
  toolTip
});

export default rootReducer;
