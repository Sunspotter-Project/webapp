import React from 'react';
import L from 'leaflet';
import '../plugins/leaflet-control-center.js';
import 'mapbox-gl-leaflet';
import axios from 'axios';
import Supercluster from 'supercluster';
// when the docs use an import:
import * as GeoSearch from 'leaflet-geosearch';
import 'leaflet-sidebar-v2'
import WebcamList from './webcamlist.js';
import './webcamfilter.js';
import { DaylightUtil } from '../helpers/Daylight.mjs';
import { RenderHelper } from '../helpers/Render.mjs';
import {PredictionHelper} from "../helpers/Prediction.mjs";

// MapBox settings
var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
var mbToken ="pk.eyJ1IjoiY2hyaXNtYXQiLCJhIjoiY2t3czJwMnZiMTI5dzJvcW92eXprdzFzbiJ9._xwDQhYdhIME1GejRLG0-A";
var mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mbToken;

class WebcamMap extends React.Component {

  constructor(props) {
    super(props);

    this.onMapMoved = this.onMapMoved.bind(this);
    this.onWebcamsLoaded = this.onWebcamsLoaded.bind(this);
    this.onWebcamFilterChanged = this.onWebcamFilterChanged.bind(this);
    this.loadWebcams = this.loadWebcams.bind(this);

    this.webcamlimit = 50;
    this.webcamage = 3600; // 3600s -> 1h
    this.initialMapCenter = [46.8527,9.5306]; // Chur (CH)
    this.webcamsOnMap = new Map();

    this.nightTimeLayer = L.tileLayer(mbUrl, {id: 'mapbox/dark-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr}); // night style
    this.dayTimeLayer = L.tileLayer(mbUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr}); // gray style (day)
    this.webcamClusterMarkers = L.layerGroup();
    this.webcamMarkers = L.layerGroup();

    this.webcamCluster = new Supercluster({
      log: true,
      radius: 60,
      extent: 256,
      maxZoom: 17
    });

    this.state = {
      webcams: [],
      isDayTime: true
    }
  }

  componentDidMount() {

    // setup map and map event handlers
    this.map = L.map('map', {
      center: [39.73, -104.99],
      zoom: 10,
      layers: [this.dayTimeLayer]
    }).setView(this.initialMapCenter, 8);

    this.map.addLayer(this.webcamClusterMarkers);
    this.map.addLayer(this.webcamMarkers);

    // event handlers
    this.map.on('moveend', this.onMapMoved.bind(this));

    window.addEventListener("resize", this.updateDimensions.bind(this))

    // add location search field to map
    const searchPositionIcon = L.divIcon({
      html: '<i class="fa fa-map-pin map-pin-icon"></i>',
      iconSize: [30, 30],
      className: ''
    });

    const searchMarkerOptions = {
      title: "Searched location",
      clickable: true,
      icon: searchPositionIcon
    }

    const search = new GeoSearch.GeoSearchControl({
      provider: new GeoSearch.OpenStreetMapProvider(),
      style: 'bar',
      marker: searchMarkerOptions
    });
    this.map.addControl(search);

    // add the webcam filter control to the map
    this.webcamFilter = L.webcamFilterControl({
      position: 'bottomcenter',     // left or right
      selectOptions: '5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100',
      selectedOption: '60',
      selectOptionsUnit: '%',
      onFilterChange: this.onWebcamFilterChanged
    }).addTo(this.map);

    // add sidebar to map

    var sidebar = L.control.sidebar({
      autopan: false,       // whether to maintain the centered map point when opening the sidebar
      closeButton: true,    // whether t add a close button to the panes
      container: 'sidebar', // the DOM container or #ID of a predefined sidebar container that should be used
      position: 'right',     // left or right
    }).addTo(this.map);

    // open the webcam list per default
    sidebar.open('webcamlist');

    this.updateIsDayTime();

    const bounds = this.map.getBounds();
    const pml = this.getCheckedPredictionModelLabels();
    const confidence = this.getSelectedConfidence();
    this.loadWebcams(this.webcamlimit, this.webcamage, bounds, pml, confidence);
  }

  getCheckedPredictionModelLabels() {
    var pmlEl
    var checkedPml = [];

    pmlEl = document.getElementById('pml-sunny');
    if (pmlEl !== null) {
      if (pmlEl.checked) {
        checkedPml.push('sunny');
      }
    }

    pmlEl = document.getElementById('pml-cloudy-rainy');
    if (pmlEl !== null) {
      if (pmlEl.checked) {
        checkedPml.push('cloudy-rainy');
      }
    }
    return checkedPml.join(',');
  }

  getSelectedConfidence() {
    var confidence = '';
    var confidenceEl;

    confidenceEl = document.getElementById('confidence');
    if (confidenceEl !== null) {
      confidence = confidenceEl.value;
    }

    return confidence;
  }

  loadWebcams(limit, age, bounds, pml, confidence) {
    const params = {
      limit: limit,
      age: age,
      bounds: bounds.toBBoxString(),
      pml: pml
    };
    axios.get('/webcam/v2', { params }).then(this.onWebcamsLoaded);
  }

  onWebcamsLoaded(response) {

    const data = response.data;
    const webcamsGeoJson = data.features;
    this.webcamCluster.load(webcamsGeoJson);
    this.updateWebcams(this.map);
  }

  onMapMoved(event) {
    const map = event.target;
    this.updateWebcams(map);
  }

  isPointInBounds(mapBounds, latLng) {
    const westLng = mapBounds.getWest();
    const southLat = mapBounds.getSouth();
    const eastLng = mapBounds.getEast();
    const northLat = mapBounds.getNorth();
    const lat = latLng.lat;
    const lng = latLng.lng;
    const isInLng = lng >= westLng && lng <= eastLng;
    const isInLat = lat >= southLat && lat <= northLat;
    return isInLat && isInLng;
  }

  removeWebcamMarkersOfLowerZoomLevels(zoomLevel) {
    const removedWebcams = [];
    this.webcamsOnMap.forEach((webcam, key) => {
      if (webcam.zoomLevel > zoomLevel) {
        this.webcamMarkers.removeLayer(webcam.marker);
        removedWebcams.push(key);
      }
    });
    removedWebcams.forEach((webcamId) => {
      this.webcamsOnMap.delete(webcamId);
    })
  }


  updateWebcams(map) {
    const mapBounds = map.getBounds();
    const pml = this.getCheckedPredictionModelLabels();
    const confidence = this.getSelectedConfidence();
    this.updateIsDayTime();

    const mapZoom = map.getZoom();
    this.removeWebcamMarkersOfLowerZoomLevels(mapZoom);

    const westLng = mapBounds.getWest();
    const southLat = mapBounds.getSouth();
    const eastLng = mapBounds.getEast();
    const northLat = mapBounds.getNorth();
    const clusterBounds = [westLng, southLat, eastLng, northLat];
    const clusters = this.webcamCluster.getClusters(clusterBounds, mapZoom);

    this.addWebcamsWithMinimalDistanceToTheirWebcamClusterToMap(clusters, mapZoom);
    // show only webcams in list which are located within the map bounds
    const webcams = Array.from(this.webcamsOnMap.values())
        .filter(value => this.isPointInBounds(mapBounds, value.marker.getLatLng()))
        .map(_ => _.webcam);
    // this triggers updating the webcam list
    this.setState({webcams: webcams});
  }

  addWebcamsWithMinimalDistanceToTheirWebcamClusterToMap(clusters, mapZoom) {
    this.webcamClusterMarkers.clearLayers();

    clusters.map((cluster) => {

      // uncomment the lines to see the location of the cluster as a marker
      /*
      const latlng = L.latLng(cluster.geometry.coordinates[1], cluster.geometry.coordinates[0]);
      const clusterMarker = this.createClusterIcon(cluster, latlng);
      this.clusterMarkers.addLayer(clusterMarker);
       */

      const distance = (coordsA, coordsB) => {
        const deltaLng = Math.abs(parseFloat(coordsA[0]) - parseFloat(coordsB[0]));
        const deltaLat = Math.abs(parseFloat(coordsA[1]) - parseFloat(coordsB[1]));
        const distance = Math.sqrt(Math.pow(deltaLng, 2) + Math.pow(deltaLat, 2));
        return distance;
      }

      const minDistance = (distances) => {

        if (distances.length <= 0) return null;

        let min = distances[0];
        let minIdx = 0;
        for (let i = 1; i < distances.length; ++i) {
          if (distances[i] < min) {
            min = distances[i];
            minIdx = i;
          }
        }
        return { value: min, idx: minIdx };
      }

      if (!isNaN(cluster.id)) {

        // get point with minimal distance to the cluster point
        const clusteredPoints = this.webcamCluster.getLeaves(cluster.id, 10, 0);
        const clusteredPointsDistances = clusteredPoints.map((clusteredPoint) => {
          return distance(clusteredPoint.geometry.coordinates, cluster.geometry.coordinates)
        });

        const minimalDistance = minDistance(clusteredPointsDistances);
        const minimalDistanceClusteredPoint = clusteredPoints[minimalDistance.idx];

        const webcam = minimalDistanceClusteredPoint.properties;
        const webcamId = webcam.webcamid;

        if (!this.webcamsOnMap.has(webcamId)) {
          const clusteredPointMarker = this.getWebcamMarker(minimalDistanceClusteredPoint);
          this.webcamMarkers.addLayer(clusteredPointMarker);
          this.webcamsOnMap.set(webcamId, { webcam: webcam, zoomLevel: mapZoom, marker: clusteredPointMarker });
        }
      }
    });
  }

  createClusterIcon(feature, latlng) {
    if (!feature.properties.cluster) return L.marker(latlng);

    const count = feature.properties.point_count;
    const sunIcon = L.divIcon({
      html: '<i class="fa fa-sun-o map-prediction-icon-sun">',
      iconSize: [20, 20],
      className: 'myDivIcon'
    });

    return L.marker(latlng, {icon: sunIcon});
  }

  onWebcamFilterChanged(event) {
    var bounds = this.map.getBounds();
    var pml = this.getCheckedPredictionModelLabels();
    var confidence = this.getSelectedConfidence();
    this.updateIsDayTime();
    this.loadWebcams(this.webcamlimit, this.webcamage, bounds, pml, confidence);
  }

  getWebcamMarker(webcamGeoJson) {
    const webcam = webcamGeoJson.properties;

    const location = webcamGeoJson.geometry;
    const longitude = location.coordinates[0];
    const latitude = location.coordinates[1];
    const markerIcon = RenderHelper.getMarkerIcon(location, webcam.status, webcam.prediction, this.state.isDayTime);
    const marker = L.marker([latitude, longitude], {alt: webcam.id, icon: markerIcon}); //.on('click', this.onMarkerClick).addTo(this.map);

    if (!PredictionHelper.isValidPrediction(webcam.prediction)) {
      const imgurlhighres = webcam.imgurlhighres;
      marker.on('click', (e) => {
        window.open(imgurlhighres, '_blank');
      });
    }

    const tooltipHtml = RenderHelper.getWebcamMarkerToolTipHtml(webcam.title, webcam.city, webcam.country, webcam.countrycode, webcam.lastupdate, webcam.status, webcam.thumbnail, webcam.preview, webcam.prediction, this.state.isDayTime)
    marker.bindTooltip(tooltipHtml, { direction: 'top', offset: [0, 0], tooltipAnchor: [10, 10]});
    return marker;
  }

  updateIsDayTime() {
    const location = this.map.getCenter();
    const isDayTime = DaylightUtil.isDayTime(new Date(), location);
    if (this.state.isDayTime !== isDayTime) {
      this.setState({isDayTime: isDayTime});
      this.setMapDayNighTimeLayer(isDayTime);
      // enable and disable the webcam filter according to the day or night time
      if (isDayTime) {
        this.webcamFilter.check();
        this.webcamFilter.enable();
      } else {
        this.webcamFilter.uncheck();
        this.webcamFilter.disable();
      }
    }
  }

  setMapDayNighTimeLayer(isDayTime) {
    if (isDayTime) {
      this.map.removeLayer(this.nightTimeLayer);
      this.map.addLayer(this.dayTimeLayer);
    } else {
      this.map.removeLayer(this.dayTimeLayer);
      this.map.addLayer(this.nightTimeLayer);
    }
  }

  updateDimensions() {
    const height = window.innerHeight;
    this.setState({ height: height })
  }

  UNSAFE_componentWillMount() {
    this.updateDimensions()
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this))
  }

  render() {
    return <div class="webcammap"><div id="map" style={{ height: this.state.height }}></div>
      <div id="sidebar" class="leaflet-sidebar collapsed">

        <div class={`leaflet-sidebar-tabs ${this.state.isDayTime ? '':'night-theme'}`}>
            <ul role="tablist">
                <li><a href="#webcamlist" role="tab"><i class="fa fa-video-camera"></i></a></li>
                <li><a href="#location" role="tab"><i class="fa fa-location-arrow active-location"></i></a></li>
            </ul>
        </div>

        <div class={`leaflet-sidebar-content ${this.state.isDayTime ? '':'night-theme'}`}>

            <div class="leaflet-sidebar-pane" id="webcamlist">
                <h1 class="leaflet-sidebar-header">
                    Sunspotter
                    <div class="leaflet-sidebar-close"><i class="fa fa-caret-right"></i></div>
                </h1>
                <WebcamList webcams={this.state.webcams} isDayTime={this.state.isDayTime} />
            </div>

            <div class="leaflet-sidebar-pane" id="home">
                <h1 class="leaflet-sidebar-header">
                    sidebar-v2
                    <div class="leaflet-sidebar-close"><i class="fa fa-caret-right"></i></div>
                </h1>
                <p>A responsive sidebar for mapping libraries</p>
            </div>
        </div>
      </div>
    </div>
  }
}

export default WebcamMap;
