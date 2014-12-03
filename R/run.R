# Copyright 2014 52°North Initiative for Geospatial Open Source Software GmbH
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


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
run <- function(directory) {
    options("sensorweby.settingsFile" = file.path(directory, "settings.yml"))

    futile.logger::flog.info("Starting sensorweby ...")

    .configureLogging()

    # configure app
    futile.logger::flog.info("Starting sensorweby at %s", toString(directory))

    host <- getOption("shiny.host", "127.0.0.1")
    host <- getSetting("shiny.host", host)
    port <- getSetting("shiny.port")
    quiet <- getSetting("shiny.quiet", FALSE)
    display.mode <- getSetting("shiny.display-mode", "auto")

    shiny::runApp(appDir = directory, port = port, host = host,
                  quiet = quiet, display.mode = display.mode)
}

#' @export
runExample <- function(name) {
    dir <- system.file(paste0("examples/", name), package="sensorweby")
    if (!file.exists(dir)) {
        stop("Not a valid example")
    }
    run(dir)
}

.loadYAML <- function(file) {
    if (is.null(file) || !file.exists(file)) {
        return(list())
    }
    return(yaml::yaml.load_file(file))
}

#'
#' Merges to list by adding properties of \code{y}t o \code{x} if they are not
#' present, overwriting properties of \code{x} with the values of \code{y},
#' if \code{x} or \code{y} are not lists, and applying the function recursive to
#' properties that are lists in both \code{x} and \code{y}.
#'
#' @param x the target list
#' @param y the source list
#'
#' @return \code{x} with properties of \code{y}
#'
.extend <- function(x, y) {
    if (!is.list(x) || !is.list(y)) return(y)
    xnames <- names(x)
    for (n in names(y))
        x[[n]] <- ifelse(n %in% xnames, .extend(x[[n]], y[[n]]), y[[n]])
    return(x)
}

.configureLogging <- function() {
    # configure logging
    futile.logger::flog.layout(futile.logger::layout.format("[~l] [~t] [~n.~f] ~m"))
    futile.logger::flog.threshold(getLoglevelForName(getSetting("logging.level", "info")))
    file <- getSetting("logging.file")
    if( !is.null(file)) {
        futile.logger::flog.info("Logging to file %s with level %s", file,
                                 futile.logger::flog.logger()$threshold)
        futile.logger::flog.appender(futile.logger::appender.file(file = file))
        futile.logger::flog.appender(futile.logger::appender.file(file = file), "shiny")
        futile.logger::flog.appender(futile.logger::appender.file(file = file), "sensorweby")
    }
}

#'
#' Loads the settings for the sensorweby application if and only if the option
#' \code{sensorweby.settings} is \code{NULL}. If the settings are not yet
#' present the default configuration is loaded and merged with a custom config
#' file that may be set using the \code{sensorweby.settingsFile} option.
#'
#' @return a list containing the settings
#'
.loadSettings <- function() {
    settings <- getOption("sensorweby.settings")
    if (is.null(settings)) {
        settings <- .loadYAML(system.file("settings.yml" , package = "sensorweby"))
        settings <- .extend(settings, .loadYAML(getOption("sensorweby.settingsFile")))
        options("sensorweby.settings" = settings)
    }
    return(settings)
}

#'
#' Gets the setting specified by \code{key}. The key is a string containing the
#' complete path to the setting, where properties are seperated using a \code{.}.
#'
#' @param key the settings key
#' @param default an optional default value
#'
#' @return the key
#' @export
#' @examples
#' \dontrun{
#' getSetting("shiny.host")
#' getSetting("timeseriesapi.filters.service")
#' }
getSetting <- function(key, default=NULL) {
    path <- unlist(strsplit(key, ".", fixed=TRUE))
    settings <- .loadSettings()
    for (setting in path) {
        if (setting %in% names(settings)) {
            settings <- settings[[setting]]
        } else {
          return(default)
        }
    }
    return(settings)
}

getLoglevelForName <- function(x) {
    # remove leading/trailing whitespace
    name <- gsub("^\\s+|\\s+$", "", x)
    name <- tolower(name)

    level <- switch(name,
                    "trace" = futile.logger::TRACE,
                    "debug" = futile.logger::DEBUG,
                    "warn" = futile.logger::WARN,
                    "info" = futile.logger::INFO,
                    "error" = futile.logger::ERROR,
                    "fatal" = futile.logger::FATAL)

    if (is.null(level)) {
        warning(paste0("Could not infer level from ", x))
        return(futile.logger::INFO)
    }
    return(level)
}
