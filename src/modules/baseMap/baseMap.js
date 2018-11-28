import L from 'leaflet'
import $ from 'jquery'

require('../../../assets/css/leaflet.css');

require('leaflet/dist/images/marker-icon.png');
require('leaflet/dist/images/marker-icon-2x.png');
require('leaflet/dist/images/marker-shadow.png');
require('leaflet/dist/images/layers.png');
require('leaflet/dist/images/layers-2x.png');

function BaseMap (divName) {
  this.divName = divName;
  this.map = L.map(this.divName);
  this.layers = {
    base: {
      tiles: [

      ]
    },
    overlay: {
      wms: [

      ]
    }
  };

  this.nodes = [];
}

BaseMap.prototype.loadTiles = async function () {
  let result;
  try {
    result = await $.ajax({
      url: mapviewer.constants.API_MAP_URL,
      type: 'GET'
    });
  } catch (err) {
    console.log(err);
  }

  for (let x in result) {
    let source = result[x]
    for (let y in source.layers) {
      let layer = source.layers[y]
      let output = {
        name: source.name + ' - ' + layer.name,
        tiles: source.url + (layer.options.path || ''),
        options: layer.options
      }

      if (layer.isBase && source.type === 'tiles') this.layers.base.tiles.push(output);
      else if (!layer.isBase && source.type === 'wms') this.layers.overlay.wms.push(output);
    }
  }

  // Load layers in leaflet
  let baseMaps = {}

  for (let x in this.layers.base.tiles) {
    let tile = this.layers.base.tiles[x];
    let tileLayer = L.tileLayer(tile.tiles, tile.options);
    baseMaps[tile.name] = tileLayer;
    if (!parseInt(x)) { // We set first one to default
      tileLayer.addTo(this.map);
    }
  }

  let overlayMaps = {}
  for (let x in this.layers.overlay.wms) {
    let tile = this.layers.overlay.wms[x]
    tile.options['crs'] = L.CRS.EPSG4326
    let tileLayer = L.tileLayer.wms(tile.tiles, tile.options)
    overlayMaps[tile.name] = tileLayer
    let index = -1;
    try {
      if (tile.options.selected) tileLayer.addTo(this.map);
    } catch (err) {
      console.log(err);
    }
  }

  let controlLayers = L.control.layers(baseMaps, overlayMaps, {position: 'bottomright'})
  controlLayers.addTo(this.map)
}

BaseMap.prototype.addNode = function (point, options) { // Point in [lat, lon]
  let marker = L.marker(point).addTo(this.map);
  this.nodes.push(marker);

  try {
    if (options.setCenter) {
      this.setCenterFromPoint(point, mapviewer.constants.NODE_ZOOM_DEFAULT);
    }
  } catch (err) {
    // No options
  }
}

BaseMap.prototype.setCenterFromPoint = function (point, zoom) {
  this.map.setView(L.latLng(point[0], point[1]), zoom);
}

BaseMap.prototype.setCenterFromBounds = function (bounds) {
  this.map.fitBounds(bounds);
}

export default BaseMap;
