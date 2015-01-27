

.timeInputHandler <- function(x, shinysession, name) {
    if (is.null(x) || is.na(x))
        as.POSIXct(NA)
    else if (is.numeric(x))
        as.POSIXct(x, origin="1970-01-01", tz = "UTC")
    else
        strptime(x, "%Y-%m-%dT%H:%M:%OS", tz = "UTC")
}