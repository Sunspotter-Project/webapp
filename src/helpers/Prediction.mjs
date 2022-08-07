import { DateTimeHelper } from './DateTime.mjs';

class PredictionHelper {
    
    static formatPrediction(prediction, isDayTime, webcamLastupdate, webcamStatus, webcamImgUrl, iconCssClassPrefix) {
        
        var modellabel;
        var runid;
        var tfindex;
        var imgurl;
        var icon;
        var iconCssClassSuffix;
        var predictionData = {};
        
        // found a prediction and its day time
        if (prediction !== null) {
            modellabel = prediction.PredictionModelLabel;
            // fullImgUrl
            runid = prediction.PredictionRun.predictionrunid;
            tfindex = modellabel.tfindex;
            imgurl = prediction.imgurl;
            predictionData.fullImgUrl = `./predictions/${runid}/${tfindex}/${imgurl}`;

            // iconClasses
            icon = modellabel.icon;
            iconCssClassSuffix = modellabel.cssclass;
            predictionData.iconClasses = `fa ${icon} prediction-icon ${iconCssClassPrefix}-prediction-icon-${iconCssClassSuffix}`;

            // confidence
            predictionData.confidence = `${Math.round(prediction.confidence * 100.0)}%`;
        } else {
            // no prediction found or its night time
            predictionData.fullImgUrl = webcamImgUrl;
            predictionData.iconClasses = `fa fa-video-camera prediction-icon ${iconCssClassPrefix}-webcam-icon-${webcamStatus} ${isDayTime ? '' : 'night-theme'}`;
            predictionData.confidence = 'live';
            
        }
        // createdat (use lastupdate unixtimestamp of the webcam)
        predictionData.createdat = DateTimeHelper.formatUnixTimestamp(webcamLastupdate);
        return predictionData;
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
}

export { PredictionHelper };