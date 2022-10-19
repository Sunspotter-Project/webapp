import React from 'react';
import { RenderHelper } from '../helpers/Render.mjs';

class WebcamListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      webcamLastupdate: this.props.webcamLastupdate,
      webcamStatus: this.props.webcamStatus,
      webcamImgUrl: this.props.webcamImgUrl,
      prediction: this.props.prediction,
      isDayTime: this.props.isDayTime
    }
  }

  render() {
    const htmlString = RenderHelper.getWebcamListItemHtml(this.props.title, this.props.city, this.props.country, this.props.countryCode, this.state.webcamLastupdate, this.state.webcamStatus, this.state.webcamImgUrl, this.state.prediction, this.state.isDayTime)
    return <div dangerouslySetInnerHTML={{ __html: htmlString }}></div>;

  }
}

export default WebcamListItem;
