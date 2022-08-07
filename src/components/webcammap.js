import React from 'react';
import L from 'leaflet';
import '../plugins/leaflet-control-center.js';
import 'mapbox-gl-leaflet';
import axios from 'axios';
// when the docs use an import:
import * as GeoSearch from 'leaflet-geosearch';
import 'leaflet-sidebar-v2'
import WebcamList from './webcamlist.js';
import './webcamfilter.js';
import { DaylightUtil } from '../helpers/Daylight.mjs';
import { RenderHelper } from '../helpers/Render.mjs';

// MapBox settings
var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
var mbToken ="pk.eyJ1IjoiY2hyaXNtYXQiLCJhIjoiY2t3czJwMnZiMTI5dzJvcW92eXprdzFzbiJ9._xwDQhYdhIME1GejRLG0-A";
var mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mbToken;

class WebcamMap extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.onMapMooved = this.onMapMooved.bind(this);
    this.onWebcamsLoaded = this.onWebcamsLoaded.bind(this);
    this.onWebcamFilterChanged = this.onWebcamFilterChanged.bind(this);
    this.addWebcamMarkers = this.addWebcamMarkers.bind(this);
    this.clearWebcamMarkers = this.clearWebcamMarkers.bind(this);
    this.loadWebcams = this.loadWebcams.bind(this);

    this.webcamlimit = 50;
    this.webcamage = 1800; // 1800s -> 30min
    this.initialMapCenter = [46.8527,9.5306]; // Chur (CH)
    this.markers = [];
    this.markerLayer = L.layerGroup(this.markers);
    this.nightTimeLayer = L.tileLayer(mbUrl, {id: 'mapbox/dark-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr}); // night style
    this.dayTimeLayer = L.tileLayer(mbUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr}); // gray style (day)

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
    
    // add marker layer
    this.map.addLayer(this.markerLayer);

    // event handlers
    this.map.on('moveend', this.onMapMooved.bind(this));

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
 

    var bounds = this.map.getBounds();
    var pml = this.getCheckedPredictionModelLabels(); 
    var confidence = this.getSelectedConfidence();
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
    axios.get('/webcam', { params }).then(this.onWebcamsLoaded);
  }

  onWebcamsLoaded(response) {
    var webcams = response.data;
    this.setState({webcams: webcams});
    this.addWebcamMarkers(webcams);
  }

  onMapMooved(event) {
    var map = event.target;
    var bounds = map.getBounds();
    var pml = this.getCheckedPredictionModelLabels();
    var confidence = this.getSelectedConfidence();
    this.updateIsDayTime();
    this.loadWebcams(this.webcamlimit, this.webcamage, bounds, pml, confidence);
  }

  onWebcamFilterChanged(event) {
    var bounds = this.map.getBounds();
    var pml = this.getCheckedPredictionModelLabels();
    var confidence = this.getSelectedConfidence();
    this.updateIsDayTime();
    this.loadWebcams(this.webcamlimit, this.webcamage, bounds, pml, confidence);
  }

  addWebcamMarkers(webcams) {
    var webcam;
    var marker;
    var tooltipHtml;
    var latitude, longitude;
    var location;
    var markerIcon;

    this.clearWebcamMarkers();

    for (var i = 0; i < webcams.length; i++) {
      webcam = webcams[i];
      markerIcon = RenderHelper.getMarkerIcon(webcam, this.state.isDayTime);
      location = webcam.location;
      latitude = location.coordinates[0];
      longitude = location.coordinates[1];
      marker = L.marker([latitude, longitude], {alt: webcam.id, icon: markerIcon}); //.on('click', this.onMarkerClick).addTo(this.map);
      
      tooltipHtml = RenderHelper.getWebcamMarkerToolTipHtml(webcam.title, webcam.city, webcam.country, webcam.countrycode, webcam.lastupdate, webcam.status, webcam.imgurlmedres, webcam.Predictions, this.state.isDayTime)
      marker.bindTooltip(tooltipHtml);
      this.markerLayer.addLayer(marker);
      this.markers.push({ pkwebcam: webcam.pkwebcam, marker: marker});
      
    }
  }

  clearWebcamMarkers() {
    if (this.markerLayer !== undefined) {
      this.markerLayer.clearLayers();
    }
  }

  onMarkerClick() {
    alert('clicked marker');
  }

  updateIsDayTime() {
    var location = this.map.getCenter();
    var isDayTime = DaylightUtil.isDayTime(new Date(), location);
    isDayTime = true;
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
    const height = window.innerWidth >= 992 ? window.innerHeight : 400
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