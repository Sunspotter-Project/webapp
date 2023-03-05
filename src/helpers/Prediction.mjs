import { DateTimeHelper } from './DateTime.mjs';

class PredictionHelper {

    static formatPrediction(prediction, isDayTime, webcamLastupdate, webcamStatus, webcamImgUrl, iconCssClassPrefix) {

        let predictionData = {};

        // found a prediction and its day time
        if (this.isValidPrediction(prediction) && isDayTime) {
            const runid = prediction.runid;
            const tfindex = prediction.tfindex;
            const imgurl = prediction.imgurl;
            predictionData.fullImgUrl = `./predictions/${runid}/${tfindex}/${imgurl}`;

            // iconClasses
            const icon = prediction.icon;
            const iconCssClassSuffix = prediction.cssclass;
            predictionData.iconClasses = `fa ${icon} prediction-icon ${iconCssClassPrefix}-prediction-icon-${iconCssClassSuffix}`;

            // confidence
            predictionData.confidence = `${Math.round(prediction.confidence * 100.0)}%`;
        } else {
            // no prediction found or its night time
            predictionData.fullImgUrl = webcamImgUrl;
            predictionData.iconClasses = `fa fa-video-camera prediction-icon ${iconCssClassPrefix}-webcam-icon-${webcamStatus} ${isDayTime ? '' : 'night-theme'}`;
            predictionData.confidence = 'live';
        }

        predictionData.dateTimeText = PredictionHelper.getPredictionDateTimeText(webcamLastupdate, prediction.createdat)

        return predictionData;
    }

    static getPredictionDateTimeText(webcamLastupdate, predictionCreatedat) {
        let dateTimeText = `Aufnahme: ${ DateTimeHelper.formatUnixTimestamp(webcamLastupdate) }`;
        if (predictionCreatedat) {
            dateTimeText += `, Vorhersage: ${ DateTimeHelper.formatDateTimeString(predictionCreatedat, { hour: "numeric", minute: "numeric" }) }`;
        }
        return dateTimeText;
    }

    static formatFirstPrediction(predictions, isDayTime, webcamLastupdate, webcamStatus, webcamImgUrl, iconCssClassPrefix) {
        var prediction = null;

        if ((predictions !== null) && (predictions !== undefined)) {
            if (predictions.length > 0) {
                prediction = predictions[0];
            }
        }
        return this.formatPrediction(prediction, isDayTime, webcamLastupdate, webcamStatus, webcamImgUrl, iconCssClassPrefix);
    }

    static isValidPrediction(prediction) {
        return prediction !== undefined &&
            prediction.confidence !== null &&
            prediction.imgurl !== null &&
            prediction.tfindex !== null &&
            prediction.createdat !== null &&
            prediction.name !== null &&
            prediction.icon !== null &&
            prediction.cssclass !== null;
    }
}

export { PredictionHelper };
