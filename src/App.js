import './App.css';
import 'leaflet/dist/leaflet.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'leaflet-geosearch/dist/geosearch.css';
import 'leaflet-sidebar-v2/css/leaflet-sidebar.css';
import 'font-awesome/css/font-awesome.css';
import './components/components.css';
import WebcamMap from './components/webcammap.js';

function App() {
  return (
    <div className="App">
      <div class="content">
        <WebcamMap />
      </div>
    </div>
  );
}

export default App;
