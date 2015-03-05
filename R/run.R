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
run <- function(directory, ...) {
    futile.logger::flog.info("Starting sensorweby ...")
    .configureLogging()
    # configure app
    futile.logger::flog.info("Starting sensorweby at %s", toString(directory))
    shiny::runApp(appDir = directory, ...)
}

#' @export
runExample <- function(name) {
    dir <- system.file(paste0("examples/", name), package="sensorweby")
    if (!file.exists(dir)) {
        stop("Not a valid example")
    }
    run(dir)
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
