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
library(openair)
library(sensorweb4R)
library(futile.logger)

formatTime <- function(x) {
    if (is.null(x) || is.na(x)) x else format(x, "%Y-%m-%dT%H:%M:%OS3")
}

# function is called once each session
shinyServer(func = function(input, output, session) {
    flog.debug("New session at server.") # is false: %s", toString(serverInfo()))

    # only works in reactive environment..
    #flog.debug("New session: %s", toString(paste(names(as.list(session$clientData)), as.list(session$clientData), sep = ": ")))

    output$begin <- renderText({
        formatTime(input$begin);
    });

    output$end <- renderText({
        formatTime(input$end);
    });

    output$colorsout <- renderUI({
        tags$ul(lapply(input$colors, tags$li))
    });

    output$timeseries <- renderUI({
        if (length(input$series) == 0) "NA"
        else tags$ul(lapply(input$series, tags$li))
    });

    output$pollutionRose <- renderPlot({
        flog.trace("Rendering plot for %s", input$pollutant)

        pollutant <- switch(input$pollutant,
                            NOX="nox",
                            NO2="no2",
                            O3="o3",
                            PM10="pm10",
                            SO2="so2",
                            CO="co",
                            PM25="pm25");
        pollutionRose(mydata, pollutant = pollutant, year = 2001);
    });

});