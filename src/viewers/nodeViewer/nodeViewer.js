require('./nodeViewer.html');
import $ from 'jquery';
import BaseMap from '../../modules/baseMap/baseMap';

var map;

$(document).ready(async function(){
  map = new BaseMap('map');
  let lat = document.getElementById('lat').value;
  let lon = document.getElementById('lon').value;
  await map.loadTiles();
  map.addNode([lat, lon], {
    setCenter: true
  });
});
