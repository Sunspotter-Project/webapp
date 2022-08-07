class DateTimeHelper {

    static getLocale() {
        return (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language;
    }

    static formatDateTimeString(dateTimeAsString) {
        var date = new Date(dateTimeAsString);
        var dateFormatted = DateTimeHelper.formatDate(date);
        return dateFormatted;
    }
    
    static formatDate(date) {
        var locale = this.getLocale();
        var format = new Intl.DateTimeFormat(
            locale,
            {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            }
        )
        const formattedDate = format.format(date);
        return formattedDate;
    }

    static formatUnixTimestamp(unixTimestamp) {
        var date;
        var dateFormatted = '';
        var unixTimestampAsInt;
        if (!isNaN(unixTimestamp)) {
            unixTimestampAsInt = parseInt(unixTimestamp);
            date = new Date(unixTimestamp * 1000);
            dateFormatted = DateTimeHelper.formatDate(date);
        } else {
            console.error(`Can't format unixtimestamp ${unixTimestamp} to a formatted date`);
        }
        return dateFormatted;
    }
}

export { DateTimeHelper };