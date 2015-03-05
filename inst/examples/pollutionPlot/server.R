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
sta.wind <- sta.ws[match(sensorweb4R::id(sta.ws), sensorweb4R::id(sta.wd))]

flog.info("Building distance matrix")
sta.all <- stations(endpoint)
dm <- distanceMatrix(sta.all)

rm(phe.all, sta.wd, sta.ws)

findNearestStation <- function(x) {

    if (sensorweb4R::id(x) %in% sensorweb4R::id(sta.wind)) {
        return(x)
    }

    filter <- function(x) sensorweb4R::id(x) %in% sensorweb4R::id(sta.wind)
    nearest(x, sta.all, dm, filter.fun = filter, n = 1)
}

requestData <- function(ts.ws, ts.wd, ts.pollutant, timespan) {
    ts <- rbind2(rbind2(ts.ws, ts.wd), ts.pollutant)
    data <- getData(ts, timespan = timespan)
    times <- unique(sort(do.call(c, lapply(data, time))))
    values <- lapply(data, function(x) value(x)[match(times, time(x))])
    data <- data.frame(lapply(data, function(x) value(x)[match(times, time(x))]))
    names(data) <- c("ws", "wd", sensorweb4R::id(ts.pollutant))
    data$date <- times
    data$wd <- data$wd/10
    data
}

#time <- strptime(c("2015-01-17T23:00:00Z","2015-02-26T22:59:59Z"), "%Y-%m-%dT%H:%M:%OS", tz = "UTC")
#input <- list(series=fetch(Timeseries(id="ts_6b4312a023c204544035387722ca8794", endpoint=endpoint)),
#              time=lubridate::new_interval(time[1], time[2]))

shinyServer(function(input, output, session) {

    output$timeseriesSelection <- renderUI({
        validate(need(length(input$series) > 0, "No timeseries selected."))

        choices <- resourceURL(input$series)
        names(choices) <- label(input$series)

        selectInput("selectedTimeseries",
                    label = "Timeseries",
                    choices = choices)
    })

    ts.pollutant <- reactive({
        selected <- input$selectedTimeseries
        validate(need(selected, "No timeseries selected."))
        fetch(fromURI(selected)$timeseries[1])
    })

    sta.near <- reactive({
        ts.pollutant <- ts.pollutant()
        sta <- station(ts.pollutant)
        validate(need(sensorweb4R::id(sta) %in% sensorweb4R::id(sta.all), "Unknown station"))
        findNearestStation(sta)
    })

    ts.ws <- reactive({
        # currently needed due to limited filtering
        # support in the old timeseries api
        sta.near <- sta.near()
        ts <- timeseries(sta.near, phenomenon = phe.ws)
        ts[station(ts) == sta.near]
    })

    ts.wd <- reactive({
        # currently needed due to limited filtering
        # support in the old timeseries api
        sta.near <- sta.near()
        ts <- timeseries(sta.near, phenomenon = phe.wd)
        ts[station(ts) == sta.near]
    })

    time <- reactive({
        validate(need(time, "No timespan selected"))
        input$time
    })

    data <- reactive({
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
            need(length(na.omit(data[sensorweb4R::id(ts.pollutant)])) > 0, "No pollution data for timespan."))
        validate(need(dim(data.nona)[1] > 2, "Not enough data."))
        data.nona
    })

    output$note <- reactive({
        sta.near <- tryCatch(sta.near(), error = function(x)"")
        if (is.character(sta.near)) return(sta.near)
        ts.pollutant <- ts.pollutant()
        if (sta.near != station(ts.pollutant)) {
            paste0("Wind data is taken from the nearest station ", label(sta.near), ".")
        }
    })

    output$pollutionPlot <- renderPlot({
        data <- data()
        ts.pollutant <- ts.pollutant()

        validate(need(dim(unique(data[sensorweb4R::id(ts.pollutant)])[1]) > 1,
                      paste("Due to a strange bug in openair we can not plot",
                            "this series as is contains only a single value for",
                            "every timestamp")))

        pollutionRose(data, pollutant = sensorweb4R::id(ts.pollutant))
    })
})