class UrlUtil {

    static getHostname() {
        var hostname = window.location.protocol + window.location.protocol;
        if (window.location.port !== '') {
            hostname += `:${window.location.port}`
        }
        return hostname;
    }
}

export { UrlUtil };