import SunCalc from 'suncalc';

class DaylightUtil {

    static isDayTime(date, location) {
        date = Date.now();
        const times = SunCalc.getTimes(date, location.lat, location.lng);
        const sunrise = times.sunrise;
        const sunset = times.sunset;
        const sunVisible = ((date > sunrise) && (date < sunset));
        return sunVisible;
    }
}

export { DaylightUtil };