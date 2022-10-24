import React from 'react';
import { RenderHelper } from '../helpers/Render.mjs';

class WebcamListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const htmlString = RenderHelper.getWebcamListItemHtml(this.props.title, this.props.city, this.props.country, this.props.countryCode, this.props.webcamLastupdate, this.props.webcamStatus, this.props.webcamImgUrlMedRes, this.props.webcamImgUrlHighRes, this.props.prediction, this.props.isDayTime)
    return <div dangerouslySetInnerHTML={{ __html: htmlString }}></div>;

  }
}

export default WebcamListItem;
