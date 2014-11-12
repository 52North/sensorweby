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