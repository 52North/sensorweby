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

library(sensorweby)
library(sensorweb4R)
library(openair)
library(lubridate)
library(futile.logger)

endpoint <- example.endpoints()[2]
flog.info("Searching for wind phenomenons")
phe.all <- phenomena(endpoint)
phe.ws <- phe.all[names(phe.all) == "61110 - WSP-SCA"]
phe.wd <- phe.all[names(phe.all) == "61102 - DD"]

flog.info("Searching for stations with wind data")
sta.ws <- stations(endpoint, phenomenon = phe.ws)
sta.wd <- stations(endpoint, phenomenon = phe.wd)
sta.wind <- sta.ws[match(id(sta.ws), id(sta.wd))]

flog.info("Building distance matrix")
sta.all <- stations(endpoint)
dm <- distanceMatrix(sta.all)
flog.info("Done")
rm(phe.all, sta.wd, sta.ws)

findNearestStation <- function(x) {
    
    if (id(x) %in% id(sta.wind)) {
        return(x)
    }
    
    filter <- function(x) id(x) %in% id(sta.wind)
    nearest(x, sta.all, dm, filter.fun = filter, n = 1)
}

requestData <- function(ts.ws, ts.wd, ts.pollutant, timespan) { 
    ts <- rbind2(rbind2(ts.ws, ts.wd), ts.pollutant)
    data <- getData(ts, timespan = timespan)
    times <- unique(sort(do.call(c, lapply(data, time))))
    values <- lapply(data, function(x) value(x)[match(times, time(x))])
    data <- data.frame(lapply(data, function(x) value(x)[match(times, time(x))]))
    names(data) <- c("ws", "wd", id(ts.pollutant))
    data$date <- times
    data$wd <- data$wd/10
    data
}

#time <- strptime(c("2015-01-17T23:00:00Z","2015-02-26T22:59:59Z"), "%Y-%m-%dT%H:%M:%OS", tz = "UTC")
#input <- list(series=fetch(Timeseries(id="ts_6b4312a023c204544035387722ca8794", endpoint=endpoint)),
#              time=lubridate::new_interval(time[1], time[2]))

shinyServer(function(input, output, session) {
    
    output$selector <- renderUI({
        flog.info("Creating selector")
        x <- input$series
        if (length(x) > 0) {
            choices <- resourceURL(x)
            names(choices) <- label(x)
            selectInput("selectedTimeseries",
                        label = "Timeseries",
                        choices = choices)
        } else {
            NULL
        }
    })
    
    ts.pollutant <- reactive({
        flog.info("Creating ts.pollutant")
        selected <- input$selectedTimeseries
        validate(need(selected, "No timeseries selected."))
        resources <- fromURI(selected)
        series <- resources$timeseries
        fetch(series)
    })
    
    sta.near <- reactive({
        flog.info("Creating sta.near")
        ts.pollutant <- ts.pollutant()
        sta <- station(ts.pollutant)
        validate(need(id(sta) %in% id(sta.all), "Unknown station"))
        findNearestStation(sta)
    })
    
    ts.ws <- reactive({
        flog.info("Creating ts.ws")
        # currently needed due to limited filtering
        # support in the old timeseries api
        sta.near <- sta.near()
        ts <- timeseries(sta.near, phenomenon = phe.ws)
        ts[station(ts) == sta.near]
    })
    
    ts.wd <- reactive({
        flog.info("Creating ts.wd")
        # currently needed due to limited filtering
        # support in the old timeseries api
        sta.near <- sta.near()
        ts <- timeseries(sta.near, phenomenon = phe.wd)
        ts[station(ts) == sta.near]
    })
    
    time <- reactive({
        flog.info("Creating time")
        validate(need(time, "No timespan selected"))
        input$time
    })
    
    data.rose <- reactive({
        flog.info("Creating data.rose")
        time <- time()
        ts.ws <-ts.ws()
        ts.wd <- ts.wd()
        ts.pollutant <- ts.pollutant()
        flog.info("Requesting data for %s", time)
        data <- requestData(ts.ws, ts.wd, ts.pollutant, time)
        data.nona <- na.omit(data)
        validate(
            need(length(na.omit(data$ws)) > 0, "No wind speed data for timespan."),
            need(length(na.omit(data$wd)) > 0, "No wind direction data for timespan."),
            need(length(na.omit(data[id(ts.pollutant)])) > 0, "No pollution data for timespan."))
        validate(need(dim(data.nona)[1] > 2, "Not enough data."))
        data.nona
    })
    
    data.time <- reactive({
        flog.info("Creating data.time")
        series <- input$series
        validate(need(length(series) > 0, 'No Timeseries selected'))
        time <- time()
        data <- getData(series, timespan = time)
        times <- unique(sort(do.call(c, lapply(data, time))))
        values <- lapply(data, function(x) value(x)[match(times, time(x))])
        names(values) <- id(series)
        values$date <- times
        df <- as.data.frame(values)
        validate(need(dim(df)[1] > 0, "No data available"))
        df
    })
    
    
    output$note <- reactive({
        flog.info("Creating note")
        sta.near <- tryCatch(sta.near(), error = function(x) NULL)
        if (is.null(sta.near)) return("")
        ts.pollutant <- ts.pollutant()
        if (sta.near != station(ts.pollutant)) {
            paste0("Wind data is taken from the nearest station ", label(sta.near), ".")
        }
    })
    
    output$timePlot <- renderPlot({
        flog.info("Creating timePlot")
        df <- data.time()
        series <- input$series
        timePlot(df, pollutant = id(series), 
                 name.pol = label(series),
                 plot.type = "h", smooth = TRUE, 
                 ci = TRUE, ylab=c())
    })
    
    output$rosePlot <- renderPlot({
        flog.info("Creating rosePlot")
        data <- data.rose()
        ts.pollutant <- ts.pollutant()
        
        validate(need(dim(unique(data[id(ts.pollutant)])[1]) > 1,
                      paste("Due to a strange bug in openair we can not plot",
                            "this series as is contains only a single value for",
                            "every timestamp")))
        
        pollutionRose(data, pollutant = id(ts.pollutant))
    })
})