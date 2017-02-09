import { Promise } from 'bluebird';
import * as $ from 'jquery';

const CLIP_ART_ENDPOINT = 'https://openclipart.org/search/json/';

export function getImages(keyword) {
  let options: JQueryAjaxSettings = {
      url: `${CLIP_ART_ENDPOINT}?query=${keyword}&amount=20`
  };

  return $.ajax(options);
}
