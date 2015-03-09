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

library("shiny")

#' Begin Time Input
#'
#' \code{swcTimeBeginInput} adds a new reactive input that contains the currently
#' selected start time (as a \code{POSIXct}) of the JavaScript SensorWebClient.
#'
#' @param id the id of the input
#' @return a HTML \code{input} tag
#' @export
#' @examples
#' \dontrun{
#'  swcTimeBeginInput('begin')
#' }
swcTimeBeginInput <- function(id) {
  tags$input(class="jsc-time-start", type="hidden", "data-input-id"=id)
}

#' End Time Input
#'
#' \code{swcTimeEndInput} adds a new reactive input that contains the currently
#' selected end time (as a \code{POSIXct}) of the JavaScript SensorWebClient.
#'
#' @param id the id of the input
#' @return a HTML \code{input} tag
#' @export
#' @examples
#' \dontrun{
#'  swcTimeEndInput('end')
#' }
swcTimeEndInput <- function(id) {
  tags$input(class="jsc-time-end", type="hidden", "data-input-id"=id)
}

#' Timeseries Input
#'
#' `swcTimeseriesInput` adds a new reactive input that contains the currently
#' selected time series of the JavaScript SensorWebClient (as a
#' `sensorweb4R::Timeseries`. Returns a HTML `input` tag.
#' @param id the id of the input
#' @return a HTML \code{input} tag
#' @export
#' @examples
#' \dontrun{
#'  swcTimeseriesInput('series')
#' }
swcTimeseriesInput <- function(id) {
  tags$input(class="jsc-timeseries", type="hidden", "data-input-id"=id)
}

#' Time Interval Input
#'
#' \code{swcIntervalInput} adds a new reactive input that contains the
#' currently selected timespan for the JavaScript SensorWebClient as a
#' lubridate interval.
#'
#' @param id the id of the input
#' @return a HTML \code{input} tag
#' @export
#' @import lubridate
#' @examples
#' \dontrun{
#'  swcIntervalInput('time')
#' }
swcIntervalInput <- function(id) {
    tags$input(class="jsc-time-interval", type="hidden", "data-input-id"=id)
}

#' I18N Definition
#'
#' \code{swcI18N} adds a new I18N value to the JavaScript SensorWebClient.
#'
#' @param lang the language identifier
#' @param key the message key
#' @param value the message value
#' @return a HTML \code{script} tag setting the value
#' @export
#' @examples
#' \dontrun{
#'  swcI18N('eng', 'button_label', 'OK')
#' }
swcI18N <- function(lang, key, value) {
  tags$script(type="text/javascript", paste0("i18n.", lang,".", key, " = '", value, "'", collapse = ";"))
}



#' Left Panel Definition
#'
#' \code{swcLeftPanel} creates the left panel of the analysis view of the
#' JavaScript SensorWebClient.
#'
#' @inheritParams shiny::tag
#' @return a HTML \code{div} tag for the left panel
#' @export
#' @examples
#' \dontrun{
#' swcLeftPanel(
#'   plotOutput("output", width="100%", height="100%")
#' )
#' }
swcLeftPanel <- function(...) {
  tags$div(class="col-xs-12 col-sm-8 col-lg-9 fullHeight", list(...))
}

#' Full Panel Definition
#'
#' \code{swcLeftPanel} creates the full panel fo the analysis view of the
#' JavaScript SensorWebClient.
#'
#' @inheritParams shiny::tag
#' @return a HTML \code{div} tag for the full-size panel
#' @export
#' @examples
#' \dontrun{
#' swcLeftPanel(
#'   plotOutput("output", width="100%", height="100%")
#' )
#' }
swcFullPanel <- function(...) {
    tags$div(class="col-xs-12 col-sm-12 col-lg-12 fullHeight", list(...))
}

#' Right Panel Definition
#'
#' \code{swcLeftPanel} creates the right panel of the analysis view of the
#' JavaScript SensorWebClient.
#'
#' @inheritParams shiny::tag
#' @param header the header of the right panel
#' @return a HTML \code{div} tag for the right panel
#' @export
#' @examples
#' \dontrun{
#' swcRightPanel(
#'   header="Parameters",
#'   selectInput(
#'     "pollutant",
#'     label="Pollutant",
#'     choices = c("NOX", "NO2", "O3", "PM10", "SO2", "CO", "PM25"),
#'     selected = "NOX"
#'   ),
#'   swcTimeBeginInput("begin"),
#'   swcTimeEndInput("end"),
#'   swcTimeseriesInput("series"),
#' )
#' }
swcRightPanel <- function(header, ...) {
  tagList(
    tags$div(id="analysis-sidebar",
             class="col-xs-6 col-sm-4 col-lg-3 analysis-sidebar rightPanel",
             tags$h3(class="header", header),
             list(...)),
    tags$div(
      class="visible-xs leftPanelButton",
      tags$button(
        type="button",
        class="btn btn-primary btn-xs",
        "data-toggle"="#analysis-sidebar",
        "data-title"=header,
        header
      )
    ),
    tags$style(type="text/css", '#analysis-sidebar.active {background: rgba(66, 139, 202, 0.5);}')
  )
}

#' JavaScript SensorWebClient Page Definition
#'
#' \code{swcPage} creates a new page containing the JavaScript
#' SensorWebClient.
#'
#' @inheritParams shiny::tag
#' @param title the title of the page
#' @param author the HTML \code{meta} tag author
#' @param description the HTML \code{meta} tag description
#' @param debug indicates if the client should be run in debug mode
#' @return a HTML \code{html} tag containing the client
#' @export
#' @examples
#' \dontrun{
#' swcPage(
#'   swcLeftPanel(...),
#'   swcRightPanel(...)
#' )
#' }
swcPage <- function(...,
                    title=NULL,
                    author=NULL,
                    description=NULL,
                    debug=FALSE,
                    version = "1.0.0-SNAPSHOT",
                    caption=c(de = "Analyse", en = "Analysis")) {

    
    addResourcePath("sensorweby", system.file("www/sensorweby", package="sensorweby"))

    for (name in c("css", "fonts", "images", "js", "templates")) {
        addResourcePath(name, system.file(paste0("www/jsc/", name), package="sensorweby"))
    }

    ext <- ifelse(debug, ".js", ".min.js")

    head <- tags$head(
        if (!is.null(title)) tags$title(title),
        if (!is.null(description)) tags$meta(name="description", content=description),
        if (!is.null(author)) tags$meta(name="author", content=author),
        tags$meta("http-equiv"="Content-Type", content="text/html; charset=utf-8"),
        tags$meta("http-equiv"="X-UA-Compatible", content="IE=edge"),
<<<<<<< HEAD
        tags$link(rel="stylesheet", type="text/css", href="css/jsc-1.0.0-SNAPSHOT.deps.min.css"),
        tags$link(rel="stylesheet", type="text/css", href="css/jsc-1.0.0-SNAPSHOT.min.css"),
=======
        tags$link(rel="stylesheet", type="text/css", href=sprintf("css/jsc-%s.deps.min.css", version)),
        tags$link(rel="stylesheet", type="text/css", href=sprintf("css/jsc-%s.min.css", version)),
>>>>>>> 52f062ad7fbc2af8fbbb0f93cde373fc616edc93
        HTML('<!--[if lt IE 9]>'),
        tags$script(src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"),
        tags$script(src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"),
        HTML('<![endif]-->'),
        tags$script(sprintf("var DEBUG = !!%i;", debug)),
        tags$script(src="sensorweby/isTouchOrIsMobile.js"),
<<<<<<< HEAD
        tags$script(src=sprintf("js/jsc-1.0.0-SNAPSHOT.deps%s", ext)),
        tags$script(src=sprintf("js/jsc-1.0.0-SNAPSHOT%s", ext)),
=======
        tags$script(src=sprintf("js/jsc-%s.deps%s",version, ext)),
        tags$script(src=sprintf("js/jsc-%s%s",version, ext)),
>>>>>>> 52f062ad7fbc2af8fbbb0f93cde373fc616edc93
        swcI18N(names(caption), "main.analysisView", caption),
        tags$script(src="sensorweby/sensorweby.js")
    )

    body <- tags$body(tags$div(class="jsc-main swc-main", .analysisPage(...)))
    tags$html(lang="en", head, body)
}

.navbarBtn <- function(href, icon, caption=NULL){
    tags$a(class="btn btn-default navbar-btn button-right",
           "data-target"=href,
           href=href,
           type="button",
           if (!is.null(icon)) tags$span(class=paste("glyphicon", icon)),
           if (!is.null(caption)) tags$span(class="buttonCaption", caption))
}

.navbar <- function(caption, icon, ...) {
    tags$div(class="navbar navbar-fixed-top",
             role="navigation",
             tags$div(class="container-fluid",
                      tags$div(class="navbar-header analysis",
                               tags$span(class="navbar-brand",
                                         tags$span(class=paste("glyphicon", icon)),
                                         tags$span(caption)),
                               list(...))))
}

.analysisPage <- function(...) {
    chartView <- .navbarBtn("#chart", "glyphicon-stats", "{{_i}}main.chartView{{/i}}")
    mapView <- .navbarBtn("#map", "glyphicon-globe", "{{_i}}main.mapView{{/i}}")
    settings <- .navbarBtn("#settings", "glyphicon-cog", "{{_i}}main.settings{{/i}}")
    tour <- .navbarBtn("#tour", "glyphicon-question-sign")

    navbar <- .navbar("{{_i}}main.analysisView{{/i}}", "glyphicon-stats",
                        chartView, mapView, settings, tour)
    tags$div(class="swc-page",
             id="analysis-page",
             navbar,
             tags$div(class="container-fluid content",
                      tags$div(class="row fullHeight", list(...))))
}