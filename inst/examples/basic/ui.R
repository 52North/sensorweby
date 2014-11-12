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

library(shiny)
library(sensorweby)

shinyUI(
  swcPage(
    debug=TRUE,
    title="Shiny Sensor Web Client",
    author="Christian Autermann",
    description="Javascript Sensor Web Client Example for Shiny",
    
    swcLeftPanel(
      plotOutput("pollutionRose", width="100%", height="100%")
    ),
    
    swcRightPanel(
      header="Parameters",
      
      selectInput(
        "pollutant", 
        label="Pollutant",
        choices = c("NOX", "NO2", "O3", "PM10", "SO2", "CO", "PM25"),
        selected = "NOX"
      ),
      
      swcTimeBeginInput("begin"),
      swcTimeEndInput("end"),
      swcTimeseriesInput("series"),
      
      tags$label(class="control-label", "Time Series"),
      htmlOutput("timeseries"),
      
      tags$label(class="control-label", "Begin Time"),
      htmlOutput("begin"),
      
      tags$label(class="control-label", "End Time"),
      htmlOutput("end")
    )
  )
);
