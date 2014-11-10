# Copyright (C) 2014 52°North Initiative for Geospatial Open Source
# Software GmbH
#
# This program is free software; you can redistribute it and/or modify it
# under the terms of the GNU General Public License version 2 as published
# by the Free Software Foundation.
#
# If the program is linked with libraries which are licensed under one of
# the following licenses, the combination of the program with the linked
# library is not considered a "derivative work" of the program:
#
#     - Apache License, version 2.0
#     - Apache Software License, version 1.0
#     - GNU Lesser General Public License, version 3
#     - Mozilla Public License, versions 1.0, 1.1 and 2.0
#     - Common Development and Distribution License (CDDL), version 1.0
#
# Therefore the distribution of the program linked with libraries licensed
# under the aforementioned licenses, is permitted by the copyright holders
# if the distribution is compliant with both the GNU General Public
# License version 2 and the aforementioned licenses.
#
# This program is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
# Public License for more details.
#


#' Run shiny sensor web client
#' 
#' \code{run} starts the Shiny application with an advanced JavaScript sensor web client
#' 
#' @examples
#' \dontrun{
#'  run()
#' }
#' @import futile.logger
#' @import yaml
#' @export
run <- function(configFile = "js-swc/settings.yml") {
    futile.logger::flog.info("Starting sensorweby ...")
    
    settings <- yaml::yaml.load_file(system.file(configFile , package = "sensorweby"))
    futile.logger::flog.info("Settings: %s", toString(paste(names(settings), settings, sep = ": ")))
    
    # configure logging
    futile.logger::flog.layout(futile.logger::layout.format("[~l] [~t] [~n.~f] ~m"))
    futile.logger::flog.threshold(getLoglevelForName(getSetting(settings[["logging"]], "level", "info")))
    if( !is.null(settings[["logging"]][["file"]])) {
        file <- settings[["logging"]][["file"]]
        futile.logger::flog.info("Logging to file %s with level %s", file, futile.logger::flog.logger()$threshold)
        
        futile.logger::flog.appender(futile.logger::appender.file(file = file))
        futile.logger::flog.appender(futile.logger::appender.file(file = file), "shiny")
        futile.logger::flog.appender(futile.logger::appender.file(file = file), "sensorweby")
    }
    
    # configure app
    appDir <- system.file(getSetting(settings[["shiny"]], "appDir"), package = "sensorweby")
    futile.logger::flog.info("Starting sensorweby at %s", toString(appDir))
    
    shiny::runApp(appDir = appDir,
                  port = getSetting(settings[["shiny"]], "port"),
                  host = getSetting(settings[["shiny"]], "host", getOption("shiny.host", "127.0.0.1")),
                  quiet = getSetting(settings[["shiny"]], "quiet", FALSE),
                  display.mode = getSetting(settings[["shiny"]], "display.mode", "auto"))
}

getSetting <- function(settings, option, default = NULL) {
    if(missing(default))
        return(settings[[option]])
    if(option %in% names(settings))
        return(settings[[option]])
    else return(default)
}

getLoglevelForName <- function(x) {
    name <- gsub("^\\s+|\\s+$", "", x) # remove leading/trailing whitespace
    name <- tolower(name)
    
    level <- switch(name, "trace" = futile.logger::TRACE,
                    "debug" = futile.logger::DEBUG,
                    "warn" = futile.logger::WARN,
                    "info" = futile.logger::INFO,
                    "error" = futile.logger::ERROR,
                    "fatal" = futile.logger::FATAL)
    
    if(is.null(level)) {
        futile.logger::flog.warn("Could not infer level from %s", x)
        return(futile.logger::INFO)
    }
    return(level)
}
