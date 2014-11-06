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

library("shiny")

# remove this line if the file is packaged...
removeInputHandler("n52.datetime");

registerInputHandler("n52.datetime", function(x, shinysession, name) {
  if (is.null(x)) return(NA);
  if (is.numeric(x)) return(as.POSIXct(x, origin="1970-01-01", tz="UTC"));
  return(strptime(x, "%Y-%m-%dT%H:%M:%OS", tz = "UTC"));
}, force=TRUE);

#' Begin Time Input
#'
#' \code{swcTimeBeginInput} adds a new reactive input that contains the currently
#' selected start time (as a \code{POSIXct}) of the JavaScript SensorWebClient.
#'
#' @param id the id of the input
#' @return a HTML \code{input} tag
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
#' @examples
#' \dontrun{
#'  swcTimeEndInput('end')
#' }
swcTimeEndInput <- function(id) {
  tags$input(class="jsc-time-end", type="hidden", "data-input-id"=id)
}

#' Timeseries Input
#'
#' \code{swcTimeseriesInput} adds a new reactive input that contains a
#' list identifiers of the currently selected time series of the JavaScript
#' SensorWebClient.
#'
#' @param id the id of the input
#' @return a HTML \code{input} tag
#' @examples
#' \dontrun{
#'  swcTimeseriesInput('series')
#' }
swcTimeseriesInput <- function(id) {
  tags$input(class="jsc-timeseries", type="hidden", "data-input-id"=id)
}

#' I18N Definition
#'
#' \code{swcI18N} adds a new I18N value to the JavaScript SensorWebClient.
#'
#' @param lang the language identifier
#' @param key the message key
#' @param value the message value
#' @return a HTML \code{script} tag setting the value
#' @examples
#' \dontrun{
#'  swcI18N('eng', 'button_label', 'OK')
#' }
swcI18N <- function(lang, key, value) {
  tags$script(type="text/javascript", sprintf("i18n.%s.%s = '%s'", lang, key, value));
}

#' Left Panel Definition
#'
#' \code{swcLeftPanel} creates the left panel of the analysis view of the
#' JavaScript SensorWebClient.
#'
#' @inheritParams shiny::tag
#' @return a HTML \code{div} tag for the left panel
#' @examples
#' \dontrun{
#' swcLeftPanel(
#'   plotOutput("output", width="100%", height="100%")
#' )
#' }
swcLeftPanel <- function(...) {
  tags$div(class="col-xs-12 col-sm-8 col-lg-9 fullHeight", list(...));
}

#' Right Panel Definition
#'
#' \code{swcLeftPanel} creates the right panel of the analysis view of the
#' JavaScript SensorWebClient.
#'
#' @inheritParams shiny::tag
#' @param header the header of the right panel
#' @return a HTML \code{div} tag for the right panel
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
};

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
                    debug=FALSE) {

  imports <- list(
    HTML('<!--[if lt IE 9]>'),
    tags$script(
      type="text/javascript",
      src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"
    ),
    tags$script(
      type="text/javascript",
      src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"
    ),
    HTML('<![endif]-->'),

    tags$script(
      type="text/javascript",
      src="shared/selectize/js/selectize.min.js"
    ),
    tags$script(
      type="text/javascript",
      src="js/jsc-0.2.0.deps.min.js"
    ),
    tags$script(
      type="text/javascript",
      src="js/jsc-0.2.0.min.js"
    ),
    tags$script(
      type="text/javascript",
      src="js/jsc-shiny.js"
    ),
    tags$link(
      rel="stylesheet",
      type="text/css",
      href="css/jsc-0.2.0.deps.min.css"
    ),
    tags$link(
      rel="stylesheet",
      type="text/css",
      href="css/jsc-0.2.0.min.css"
    )
  );


  head <- tags$head(
    if (!is.null(title)) tags$title(title),
    if (!is.null(description)) tags$meta(name="description", content=description),
    if (!is.null(author)) tags$meta(name="author", content=author),
    tags$meta(
      "http-equiv"="Content-Type",
      content="text/html; charset=utf-8"
    ),
    tags$meta(
      "http-equiv"="X-UA-Compatible",
      content="IE=edge"
    ),

    imports,

    tags$script(
      type="text/javascript",
      sprintf("var DEBUG = !!%i;", debug)
    )
  );

  navigation <- list(
    tags$span(
      class="navbar-brand",
      tags$span(class="glyphicon glyphicon-stats"),
      tags$span("{{_i}}main.analysisView{{/i}}")
    ),
    tags$a(
      class="btn btn-default navbar-btn button-right",
      "data-target"="#chart",
      href="#chart",
      type="button",
      tags$span(class="glyphicon glyphicon-stats"),
      tags$span(class="buttonCaption", "{{_i}}main.chartView{{/i}}")
    ),
    tags$a(
      class="btn btn-default navbar-btn button-right",
      "data-target"="#map",
      href="#map",
      type="button",
      tags$span(class="glyphicon glyphicon-globe"),
      tags$span(class="buttonCaption", "{{_i}}main.mapView{{/i}}")
    ),
    tags$a(
      class="btn btn-default navbar-btn button-right",
      "data-target"="#settings",
      href="#settings",
      type="button",
      tags$span(class="glyphicon glyphicon-cog"),
      tags$span(class="buttonCaption", "{{_i}}main.settings{{/i}}")
    ),
    tags$a(
      class="btn btn-default navbar-btn button-right",
      "data-target"="#tour",
      href="#tour",
      type="button",
      tags$span(class="glyphicon glyphicon-question-sign")
    )
  );


  body <- tags$body(
    tags$div(
      class="jsc-main",
      tags$div(
        class="swc-page",
        id="analysis-page",
        tags$div(
          class="navbar navbar-fixed-top",
          role="navigation",
          tags$div(
            class="container-fluid",
            tags$div(
              class="navbar-header analysis",
              navigation
            )
          )
        ),
        tags$div(
          class="container-fluid content",
          tags$div(
            class="row fullHeight",
            list(...)
          )
        )
      )
    )
  );

  tags$html(lang="en",head,body);
}
