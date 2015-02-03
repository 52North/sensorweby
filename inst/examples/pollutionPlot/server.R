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

flog.threshold(futile.logger::DEBUG, name = "sensorweb4R")
flog.threshold(futile.logger::DEBUG)

endpoint <- example.endpoints()[2]
flog.debug("Searching for wind phenomenons")
phe.all <- phenomena(endpoint)
phe.ws <- phe.all[names(phe.all) == "61110 - WSP-SCA"]
phe.wd <- phe.all[names(phe.all) == "61102 - DD"]

flog.debug("Searching for stations with wind data")
sta.ws <- stations(endpoint, phenomenon = phe.ws)
sta.wd <- stations(endpoint, phenomenon = phe.wd)
sta.wind <- sta.ws[match(id(sta.ws), id(sta.wd))]

flog.debug("Building distance matrix")
sta.all <- stations(endpoint)
dm <- distanceMatrix(sta.all)

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

#time <- strptime(c("2015-01-29T23:00:00Z","2015-01-30T22:59:59Z"), "%Y-%m-%dT%H:%M:%OS", tz = "UTC")
#input <- list(series=fetch(Timeseries(id="ts_619363f8d5a45c3c3b5c333ea898937d", endpoint=endpoint)),
#              time=lubridate::new_interval(time[1], time[2]))

shinyServer(function(input, output, session) {
    flog.threshold(futile.logger::DEBUG)
    
    ts.pollutant <- reactive({
        if (length(input$series) > 0) {
            ts <- input$series[1]
        } else {
            ts <- NULL
        }
        flog.debug("Pollutant: %s", ts)
        ts
    })
    
    sta.near <- reactive({
        
        ts <- ts.pollutant()
        if (!is.null(ts)) {
            sta <- station(ts)
            if (id(sta) %in% id(sta.all)) {
                findNearestStation(sta)
            } else {
                NULL
            }
        } else {
            NULL
        }
    })
    
    ts.ws <- reactive({
        sta.near <- sta.near()
        if (is.null(sta.near)) {
            NULL
        } else {
            ts <- timeseries(sta.near, phenomenon = phe.ws)
            # currently needed due to limited filtering
            # support in the old timeseries api
            ts <- ts[station(ts) == sta.near]
            flog.debug("Wind speed timeseries: %s", ts)
            ts
        }
    })
    
    ts.wd <- reactive({
        sta.near <- sta.near()
        if (is.null(sta.near)) {
            NULL
        } else {
            ts <- timeseries(sta.near, phenomenon = phe.wd)
            # currently needed due to limited filtering
            # support in the old timeseries api
            ts <- ts[station(ts) == sta.near]
            flog.debug("Wind direction timeseries: %s", ts)
            ts
        }
    })

    time <- reactive({
        t <- input$time
        flog.debug("Timespan: %s", t)
        t
    })
    
    data <- reactive({
        time <- time()
        ts.ws <-ts.ws()
        ts.wd <- ts.wd()
        ts.pollutant <- ts.pollutant()
        if (is.null(time) ||
                is.null(ts.ws) || 
                is.null(ts.wd) || 
                is.null(ts.pollutant)) {
            NULL
        } else {
            flog.debug("Requesting data for %s", time)
            data <- requestData(ts.ws, ts.wd, ts.pollutant, time)
            if (!all(is.na(data$ws)) && !all(is.na(data$wd))) {
                data
            } else {
                flog.info("No wind data for %s", time)
                NULL
            } 
        }
        
    })
    
    output$pollutionPlot <- renderPlot({
        data <- data()
        ts.pollutant <- ts.pollutant()
        if (is.null(data) || is.null(ts.pollutant)) {
            NULL
        } else {
            pollutionRose(data, pollutant = id(ts.pollutant))   
        }
        
    })
})