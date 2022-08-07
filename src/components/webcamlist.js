import React from 'react';
import WebcamListItem from './webcamlistitem.js';

class WebcamList extends React.Component {

  updateWebcams(webcams) {
    this.setState({webcams: webcams});
  }
 
  render() {
    return <div class="webcamlist">
      {this.props.webcams.map((webcam, index) => (  
        <WebcamListItem key={webcam.pkwebcam}  webcamLastupdate={webcam.lastupdate} webcamStatus={webcam.status} title={webcam.title} city={webcam.city} webcamImgUrl={webcam.imgurlmedres} country={webcam.country} countryCode={webcam.countrycode} predictions={webcam.Predictions} isDayTime={this.props.isDayTime} />  
      ))}
    </div>
  }
}

export default WebcamList;