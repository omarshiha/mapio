import React, {Component} from 'react';

import Map from 'ol/Map';
import View from 'ol/View';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {OSM, Vector as VectorSource} from 'ol/source';
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import XYZ from 'ol/source/XYZ';
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
      data: {}
    };
  }

  componentDidMount() {

    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", data => {
      this.setState({
        data
      })
      this.updatePointLocation();
    });

    this.map = new Map({
      target: 'mapCanvas',
      layers: [this.rasterLayer, this.vectorLayer],
      view: new View({
        projection: 'EPSG:4326',
        center: [0, 0],
        zoom: 2
      })
    });
  }

  updatePointLocation(){
    let {data} = this.state;
    var iconFeature = new Feature({
      geometry: new Point([data.longitude, data.latitude]),
      name: "car123"
    });
    this.map.removeLayer(this.vectorLayer);

    this.vectorSource = new VectorSource();
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource
    });
    this.vectorSource.addFeature(iconFeature);
    this.map.addLayer(this.vectorLayer);
    this.map.setView( new View({
      projection: 'EPSG:4326',
      center: [data.longitude , data.latitude],
      zoom: 18
    }));
  }

  render() {
    let {data} = this.state;
    return (
        <div>
          <div id='mapCanvas' style={{ width: "100%", height: "600px" }} />
          It's <time dateTime={data}>lat: {data.latitude} , lon: {data.longitude}</time>
        </div>
    );
  }
}

export default App;
