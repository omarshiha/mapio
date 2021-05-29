import React, {Component} from 'react';

import Map from 'ol/Map';
import View from 'ol/View';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {OSM, Vector as VectorSource} from 'ol/source';
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import './App.css';

import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:4001";

class App extends Component {
  constructor(props) {
    super(props);
    this.map = null;
    this.vectorSource = new VectorSource();
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource
    });
    this.rasterLayer = new TileLayer({
      source: new OSM(),
    });
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    console.log("app")
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", data => {
      this.setState({
        data
      })
      this.updateFeaturesLocation();
    });

    this.map = new Map({
      target: 'mapCanvas',
      layers: [this.rasterLayer, this.vectorLayer],
      view: new View({
        projection: 'EPSG:4326',
        center: [-71.064548, 42.352376],
        zoom: 15
      })
    });
  }

  updateFeaturesLocation(){
    let {data} = this.state;
    this.map.removeLayer(this.vectorLayer);

    this.vectorSource = new VectorSource();
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource
    });

    data.map((f) => {
      var iconFeature = new Feature({
        geometry: new Point([f.coords.longitude, f.coords.latitude]),
        name: f.featureId
      });
      this.vectorSource.addFeature(iconFeature);
    });
    this.map.addLayer(this.vectorLayer);
    // this.map.setView( new View({
    //   projection: 'EPSG:4326',
    //   center: [data[0].coords.longitude , data[0].coords.latitude],
    //   zoom: 15
    // }));
  }

  render() {
    let {data} = this.state;
    return (
        <div>
          <div id='mapCanvas' style={{ width: "100%", height: "600px" }} />
          <div>
            {data.map((f) => {
              return <div>
                <a>Feature Id: {f.featureId}</a> &nbsp;&nbsp;
                <a>Coordinates: {f.coords.latitude} {f.coords.longitude}</a>
              </div>
            })}
          </div>
        </div>
    );
  }
}

export default App;
