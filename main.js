import Feature from 'ol/Feature.js';
import Map from 'ol/Map.js';
import Point from 'ol/geom/Point.js';
import View from 'ol/View.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {easeOut} from 'ol/easing.js';
import {fromLonLat} from 'ol/proj.js';
import {getVectorContext} from 'ol/render.js';
import {unByKey} from 'ol/Observable.js';
import '/style.css';
import Geolocation from 'ol/Geolocation.js';

const params = new URLSearchParams(window.location.search);
const latitud = params.get('latitud');
const longitud = params.get('longitud');


/*
//Original

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({

    center: fromLonLat([ -101.52597372027157, 21.06087279949958]),
    zoom: 11.5
  })
});
*/ /*
async function onRequestHandler(){
    const data = JSON.parse(this.response);
    while(true){
      addCityFeature(-101.52597372027157, 21.06087279949958)
      
      await sleep(4000);
    }
  
}*/
/*
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
*/
var coordinatesGeo = []




const tileLayer = new TileLayer({
  source: new OSM({
    url: "https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}",

    wrapX: false,
  }),
});


const view = new View({
  center: fromLonLat([ -101.52597372027157, 21.06087279949958]),
  zoom: 11.5,
});

const source = new VectorSource({
  wrapX: false,
});
const vector = new VectorLayer({
  source: source,
});

  
const map = new Map({
  layers: [tileLayer, vector],
  target: 'map',
  view: view,
});
  
  
  
  // function addRandomFeature() {
  //   const x = Math.random() * 360 - 180;
  //   const y = Math.random() * 170 - 85;
  //   const geom = new Point(fromLonLat([x, y]));
  //   const feature = new Feature(geom);
  //   source.addFeature(feature);
  // }
  // function addFixedFeature() {
  //   const coordinates = [-11322443.92342625,2410065.884843269];
  //   const geom = new Point(coordinates);
  //   const feature = new Feature(geom);
  //   source.addFeature(feature);
  // }
  
  
  const duration = 3000;
  function flash(feature) {
    const start = Date.now();
    const flashGeom = feature.getGeometry().clone();
    const listenerKey = tileLayer.on('postrender', animate);
  
    function animate(event) {
      const frameState = event.frameState;
      const elapsed = frameState.time - start;
      if (elapsed >= duration) {
        unByKey(listenerKey);
        return;
      }
      const vectorContext = getVectorContext(event);
      const elapsedRatio = elapsed / duration;
      // radius will be 5 at start and 30 at end.
      const radius = easeOut(elapsedRatio) * 25 + 5;
      const opacity = easeOut(1 - elapsedRatio);
  
    const style = new Style({
        image: new CircleStyle({
          radius: radius,
          stroke: new Stroke({
            color: 'rgba(255, 0, 0, ' + opacity + ')',
            width: 0.25 + opacity,
          }),
        }),
      });
  
      vectorContext.setStyle(style);
      vectorContext.drawGeometry(flashGeom);
      // tell OpenLayers to continue postrender animation
      map.render();
    }
  }
  
  source.on('addfeature', function (e) {
    flash(e.feature);
  });
  //
  // window.setInterval(addRandomFeature, 1000);
  // addFixedFeature();
  // window.setInterval(addFixedFeature, 5000);


  function addFromLonLatFeature(longitude, latitude) {
    const x = longitude;
    const y = latitude;
    const geom = new Point(fromLonLat([x, y]));
    const feature = new Feature(geom);
    source.addFeature(feature);
  }

  var coordinatesGeo = []

  async function onRequestHandler(){
    while(true){
      addCityFeature(longitud, latitud);
      try {
        const { longitude, latitude } = await getCurrentLocation(); 
        addCityFeature(longitude, latitude);
      } catch (error) {
        console.error(error);
        response.writeHead(500);
        response.end();
      }
      await sleep(2000);
    }
  }


  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  onRequestHandler();
  

  function addCityFeature(longitude, latitude) {
    const features = source.getFeatures();
    const isSecondFeature = features.length === 1;
    const geom = new Point(fromLonLat([longitude, latitude]));
    const style = new Style({
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({
          color: isSecondFeature ? 'orange' : 'red'
        }),
        stroke: new Stroke({
          color: 'white',
          width: 2
        })
      })
    });
    const feature = new Feature(geom);
    feature.setStyle(style);
    source.addFeature(feature);
  }

  const geolocation = new Geolocation({
   
    trackingOptions: {
      enableHighAccuracy: true,
    },
    projection: view.getProjection(),
  });

  geolocation.setTracking(true)

  let latitudGeo 
  let longitudGeo

  geolocation.on('change', function () {

    this.latitudGeo = geolocation.getPosition()[0]    
    this.longitudGeo = geolocation.getPosition()[1]
  });

  geolocation.on('error', function (error) {
    console.log(error)
  });

  const accuracyFeature = new Feature();
geolocation.on('change:accuracyGeometry', function () {
  accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
});

const positionFeature = new Feature();



new VectorLayer({
  map: map,
  source: new VectorSource({
    features: [accuracyFeature, positionFeature],
  }),
});


 function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          reject(new Error("Nose pudo."));
        }
      );
    } else {
      reject(new Error("Poronga."));
    }
  });
}
  