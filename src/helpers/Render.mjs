import L from 'leaflet';
import { PredictionHelper } from './Prediction.mjs';

class RenderHelper {

    static getWebcamPredictionHtml(webcamTitle, webcamCity, webcamCountry, webcamCountryCode, webcamLastupdate, webcamStatus, webcamImgUrlMedRes, webcamImgUrlHighRes, prediction, isDayTime, cssClassPrefix, iconCssClassPrefix) {

        const predictionData = PredictionHelper.formatPrediction(prediction, isDayTime, webcamLastupdate, webcamStatus, webcamImgUrlMedRes, iconCssClassPrefix);
        const predictionImage = `<img src="${predictionData.fullImgUrl}" />`;
        const predictionImageAndLink = `<a href="${webcamImgUrlHighRes}" target="_blank" >${predictionImage}</a>`;
        const predictionImageResult = PredictionHelper.isValidPrediction(prediction) ? predictionImage : predictionImageAndLink;
        const html =
        `<div class="${cssClassPrefix}">
            <div class="${cssClassPrefix}-aside">
                <div class="${cssClassPrefix}-image">
                    ${predictionImageResult}
                </div>
            </div>
            <div class="${cssClassPrefix}-data">
                <div class="${cssClassPrefix}-title"><i class="${predictionData.iconClasses}"></i>&nbsp;<span class="${cssClassPrefix}-predictionconfidence">${predictionData.confidence}</span>&nbsp;${webcamTitle}</div>
                
                <div class="${cssClassPrefix}-city">${webcamCity} <span class="${cssClassPrefix}-country">${webcamCountry}&nbsp;(${webcamCountryCode})</span></div>
            
                <div class="${cssClassPrefix}-createdat">${predictionData.createdatText}&nbsp;${predictionData.createdat}</div>
            </div>
        </div>`;

        return html;
    }

    static getWebcamMarkerToolTipHtml(webcamTitle, webcamCity, webcamCountry, webcamCountryCode, webcamLastupdate, webcamStatus, webcamImgUrlMedRes, webcamImgUrlHighRes, prediction, isDayTime) {

        const html = RenderHelper.getWebcamPredictionHtml(webcamTitle, webcamCity, webcamCountry, webcamCountryCode, webcamLastupdate, webcamStatus, webcamImgUrlMedRes, webcamImgUrlHighRes, prediction, isDayTime, 'webcammarkertooltip', 'list');
        return html;
    }

    static getWebcamListItemHtml(webcamTitle, webcamCity, webcamCountry, webcamCountryCode, webcamLastupdate, webcamStatus, webcamImgUrlMedRes, webcamImgUrlHighRes, prediction, isDayTime) {

        const html = RenderHelper.getWebcamPredictionHtml(webcamTitle, webcamCity, webcamCountry, webcamCountryCode, webcamLastupdate, webcamStatus, webcamImgUrlMedRes, webcamImgUrlHighRes, prediction, isDayTime, 'webcamlistitem', 'list');
        return html;
    }

    static getMarkerIcon(webcamLocation, webcamStatus, prediction, isDayTime) {

        let markerIcon;

        const activeIcon = L.divIcon({
            html: '<i class="fa fa-video-camera map-webcam-icon-active"></i>',
            iconSize: [20, 20],
            className: 'myDivIcon'
        });

        const activeNightIcon = L.divIcon({
            html: '<i class="fa fa-video-camera map-webcam-icon-active night-theme"></i>',
            iconSize: [20, 20],
            className: 'myDivIcon'
        });

        const inactiveIcon = L.divIcon({
            html: '<i class="fa fa-video-camera map-webcam-icon-inactive"></i>',
            iconSize: [20, 20],
            className: 'myDivIcon'
        });

        const sunIcon = L.divIcon({
            html: '<i class="fa fa-sun-o map-prediction-icon-sun">',
            iconSize: [20, 20],
            className: 'myDivIcon'
        });

        const cloudIcon = L.divIcon({
            html: '<i class="fa fa-cloud map-prediction-icon-cloud"></i>',
            iconSize: [20, 20],
            className: 'myDivIcon'
        });

        const icons = { "active": activeIcon, "inactive": inactiveIcon, "activeNight": activeNightIcon, "sun": sunIcon, "cloud": cloudIcon };

        if (webcamLocation !== undefined) {
            if (webcamStatus === 'active') {
                if (isDayTime) {
                    markerIcon = activeIcon;
                } else {
                    markerIcon = activeNightIcon;
                }
            } else {
                markerIcon = inactiveIcon;
            }
            if (PredictionHelper.isValidPrediction(prediction) && isDayTime) {
                markerIcon = icons[prediction.cssclass];
            }
        }
        return markerIcon;
    }
}

export { RenderHelper };
