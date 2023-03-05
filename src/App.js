import './App.css';
import 'leaflet/dist/leaflet.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'leaflet-geosearch/dist/geosearch.css';
import 'leaflet-sidebar-v2/css/leaflet-sidebar.css';
import 'font-awesome/css/font-awesome.css';
import './components/components.css';
import WebcamMap from './components/webcammap.js';
import Header from "./components/header";
import Footer from "./components/footer";

function App() {
  return (
    <div className="App">
      <Header logo="./logo-smiley.svg" placeholder="Find the sun" />
      <div class="content">
        <WebcamMap />
      </div>
      <Footer />
    </div>
  );
}

export default App;
