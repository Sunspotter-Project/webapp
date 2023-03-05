class DateTimeHelper {

    static getLocale() {
        return (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language;
    }

    static formatDateTimeString(dateTimeAsString, options) {
        const date = new Date(dateTimeAsString);
        const dateFormatted = DateTimeHelper.formatDate(date, options);
        return dateFormatted;
    }

    static formatDate(date, formatOptions = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    }) {
        const locale = this.getLocale();
        const format = new Intl.DateTimeFormat(
            locale,
            formatOptions
        )
        const formattedDate = format.format(date);
        return formattedDate;
    }

    static formatUnixTimestamp(unixTimestamp, options) {
        let dateFormatted = '';
        if (!isNaN(unixTimestamp)) {
            const unixTimestampAsInt = parseInt(unixTimestamp);
            const date = new Date(unixTimestampAsInt * 1000);
            dateFormatted = DateTimeHelper.formatDate(date, options);
        } else {
            console.error(`Can't format unixtimestamp ${unixTimestamp} to a formatted date`);
        }
        return dateFormatted;
    }
}

export { DateTimeHelper };
