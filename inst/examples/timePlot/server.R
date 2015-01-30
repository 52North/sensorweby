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
library(lubridate)
library(futile.logger)

shinyServer(func = function(input, output, session) {
    output$timePlot <- renderPlot({
        flog.info("Requesting data for %s timeseries for %s", length(input$series), input$time)
        data <- getData(input$series, timespan = input$time)
        times <- unique(sort(do.call(c, lapply(data, time))))
        values <- lapply(data, function(x) value(x)[match(times, time(x))])
        names(values) <- id(input$series)
        values$date <- times
        df <- as.data.frame(values)
        if (dim(df)[1] > 0) {
            openair::timePlot(df, pollutant = id(input$series), 
                              name.pol = label(input$series),
                              plot.type = "h", smooth = TRUE, 
                              ci = TRUE, ylab=c())
        }
    })
})