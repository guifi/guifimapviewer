require('./general.html');
import $ from 'jquery';
import BaseMap from '../../modules/baseMap/baseMap';

var map;

$(document).ready(async function(){
  map = new BaseMap('map');
  let url = new URL(window.location.href);

  let lat = url.searchParams.get('lat') || mapviewer.constants.NODE_LAT_DEFAULT;
  let lon = url.searchParams.get('lon') || mapviewer.constants.NODE_LON_DEFAULT;
  let zoom = url.searchParams.get('zoom') || mapviewer.constants.NODE_ZOOM_DEFAULT;

  map.setCenterFromPoint([lat, lon], zoom);
  await map.loadTiles();
});
