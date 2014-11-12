
.timeInputHandler <- function(x, shinysession, name) {
    if (is.null(x)) return(NA);
    if (is.numeric(x)) return(as.POSIXct(x, origin="1970-01-01", tz="UTC"));
    return(strptime(x, "%Y-%m-%dT%H:%M:%OS", tz = "UTC"));
}

.onLoad <- function(libname, pkgname) {
    shiny::registerInputHandler("n52.datetime", .timeInputHandler);
}

.onUnload <- function(libpath) {
    shiny::removeInputHandler("n52.datetime")
}