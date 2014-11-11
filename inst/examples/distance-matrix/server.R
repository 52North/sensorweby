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
