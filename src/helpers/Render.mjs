import L from 'leaflet';
import { PredictionHelper } from './Prediction.mjs';

class RenderHelper {

    static getWebcamPredictionHtml(webcamTitle, webcamCity, webcamCountry, webcamCountryCode, webcamLastupdate, webcamStatus, webcamImgUrl, predictions, isDayTime, cssClassPrefix, iconCssClassPrefix) {
        
        var prediction = PredictionHelper.formatFirstPrediction(predictions, isDayTime, webcamLastupdate, webcamStatus, webcamImgUrl, iconCssClassPrefix);
        var html = 
        `<div class="${cssClassPrefix}">
            <div class="${cssClassPrefix}-aside">
                <div class="${cssClassPrefix}-image">
                    <img src="${prediction.fullImgUrl}" />
                </div>
            </div>
            <div class="${cssClassPrefix}-data">
                <div class="${cssClassPrefix}-title"><i class="${prediction.iconClasses}"></i>&nbsp;<span class="${cssClassPrefix}-predictionconfidence">${prediction.confidence}</span>&nbsp;${webcamTitle}</div>
                
                <div class="${cssClassPrefix}-city">${webcamCity} <span class="${cssClassPrefix}-country">${webcamCountry}&nbsp;(${webcamCountryCode})</span></div>
            
                <div class="${cssClassPrefix}-createdat">${prediction.createdat}</div>
            </div>
        </div>`;
        
        return html;
    }

    static getWebcamMarkerToolTipHtml(webcamTitle, webcamCity, webcamCountry, webcamCountryCode, webcamLastupdate, webcamStatus, webcamImgUrl, predictions, isDayTime) {
        
        var html = RenderHelper.getWebcamPredictionHtml(webcamTitle, webcamCity, webcamCountry, webcamCountryCode, webcamLastupdate, webcamStatus, webcamImgUrl, predictions, isDayTime, 'webcammarkertooltip', 'list');
        return html;
    }

    static getWebcamListItemHtml(webcamTitle, webcamCity, webcamCountry, webcamCountryCode, webcamLastupdate, webcamStatus, webcamImgUrl, predictions, isDayTime) {
        
        var html = RenderHelper.getWebcamPredictionHtml(webcamTitle, webcamCity, webcamCountry, webcamCountryCode, webcamLastupdate, webcamStatus, webcamImgUrl, predictions, isDayTime, 'webcamlistitem', 'list');
        return html;
    }

    static getMarkerIcon(webcam, isDayTime) {
        
        var prediction;
        var modellabel;
        var modellabelicon;
        var markerIcon;

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

        // check if the webcam has a location
        if (webcam.location !== undefined) {
            
            if (webcam.status === 'active') {
                if (isDayTime) {
                    markerIcon = activeIcon;
                } else {
                    markerIcon = activeNightIcon;
                }
            } else {
                markerIcon = inactiveIcon;
            }

            if (webcam.Predictions !== undefined) {
                if (webcam.Predictions.length > 0) {
                    // found a prediction
                    prediction = webcam.Predictions[0];
                    if (prediction !== null) {
                        modellabel = prediction.PredictionModelLabel;
                        modellabelicon = modellabel.cssclass;
                        markerIcon = icons[modellabelicon];
                    }
                }
            }
        }
        return markerIcon;
    }
}

export { RenderHelper };