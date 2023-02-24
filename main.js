import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    //center: [-11322452.477314737,2410094.009778922],
    //zoom: 18
    center: [0,0],
    zoom: 2
  })
});
