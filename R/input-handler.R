
.timeInputHandler <- function(x, shinysession, name) {
    if (is.null(x) || is.na(x))
        as.POSIXct(NA)
    else if (is.numeric(x))
        as.POSIXct(x, origin="1970-01-01", tz = "UTC")
    else
        strptime(x, "%Y-%m-%dT%H:%M:%OS", tz = "UTC")
}


.timeseriesInputHandler <- function(x, shinysession, name) {
    
    flog.info("Parsing timeseries:\n\t%s", paste(x, collapse="\n\t"))
    
    if (is.null(x) || is.na(x) || length(x) == 0) 
        sensorweb4R::Timeseries()
    else 
        sensorweb4R::fromURI(x)$timeseries
}

.timeIntervalInputHandler <- function(x, shinysession, name) {
    x <- .timeInputHandler(x, shinysession, name)
    lubridate::new_interval(x[1], x[2])
}