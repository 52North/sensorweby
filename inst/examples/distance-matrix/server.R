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

formatTime <- function(x) {
    if (is.null(x) || is.na(x)) x else format(x, "%Y-%m-%dT%H:%M:%OS3")
}

url <- 'http://sosrest.irceline.be'
service <- 'srv_6d9ccea8d609ecb74d4a512922bb7cee'

futile.logger::flog.info("Requesting stations")
stations <- sensorweb4R::get_stations(url, service = service)

futile.logger::flog.info("Creating distance matrix ...")
dm <- sensorweb4R::create_distance_matrix(stations)

get_station_for_timeseries <- function(ts_url) {
    response <- httr::GET(ts_url)
    httr::stop_for_status(response)
    json <- jsonlite::fromJSON(httr::content(response, "text"))
    return(json$station$properties$id)
}

get_nearest_station_for_timeseries <- function(ts_url, ...) {
    futile.logger::flog.info("Requesting station for TS %s", ts_url)
    station <- get_station_for_timeseries(ts_url)
    futile.logger::flog.info("Requesting nearest stations for station %s", station)
    return(sensorweb4R::get_nearest_stations(station, ...))
}

# function is called once each session
shiny::shinyServer(func = function(input, output, session) {
    futile.logger::flog.debug("New session at server.") # is false: %s", toString(serverInfo()))

    # only works in reactive environment..
    #futile.logger::flog.debug("New session: %s", toString(paste(names(as.list(session$clientData)), as.list(session$clientData), sep = ": ")))

    output$begin <- shiny::renderText({
        formatTime(input$begin);
    });

    output$end <- shiny::renderText({
        formatTime(input$end);
    });

    output$timeseries <- shiny::renderUI({
        if (length(input$series) == 0) "NA"
        else htmltools::tags$ul(lapply(input$series, htmltools::tags$li))
    });

    output$nearest_stations <- shiny::renderUI({
        if (length(input$series) == 0) {
            return("NA" )
        } else {

            items <- lapply(input$series, function(ts) {
                nearest <- get_nearest_station_for_timeseries(ts, stations, dm, n=5)
                text <- sprintf("%s (%s)", nearest@data$label, nearest@data$id)
                items <- lapply(text, htmltools::tags$li)
                list <- htmltools::tags$ul(items)
                return(htmltools::tags$li(ts, list))
            })

            return(htmltools::tags$ul(items))
        }

    })

    output$pollutionRose <- shiny::renderPlot({
        futile.logger::flog.trace("Rendering plot for %s", input$pollutant)

        pollutant <- switch(input$pollutant,
                            NOX="nox",
                            NO2="no2",
                            O3="o3",
                            PM10="pm10",
                            SO2="so2",
                            CO="co",
                            PM25="pm25");
        openair::pollutionRose(openair::mydata, pollutant = pollutant, year = 2001);
    });

});
