
.onAttach <- function(libname, pkgname) {
    shiny::registerInputHandler("n52.datetime", function(x, shinysession, name) {
        if (is.null(x)) return(NA);
        if (is.numeric(x)) return(as.POSIXct(x, origin="1970-01-01", tz="UTC"));
        return(strptime(x, "%Y-%m-%dT%H:%M:%OS", tz = "UTC"));
    });
}
