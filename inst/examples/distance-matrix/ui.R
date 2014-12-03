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

shiny::shinyUI(
  sensorweby::swcPage(
    title="Shiny Sensor Web Client",
    author="Christian Autermann",
    description="Javascript Sensor Web Client Example for Shiny",

    sensorweby::swcLeftPanel(
      plotOutput("pollutionRose", width="100%", height="100%")
    ),

    sensorweby::swcRightPanel(
      header="Parameters",

      shiny::selectInput(
        "pollutant",
        label="Pollutant",
        choices = c("NOX", "NO2", "O3", "PM10", "SO2", "CO", "PM25"),
        selected = "NOX"
      ),

      sensorweby::swcTimeBeginInput("begin"),
      sensorweby::swcTimeEndInput("end"),
      sensorweby::swcTimeseriesInput("series"),

      htmltools::tags$label(class="control-label", "Time Series"),
      shiny::htmlOutput("timeseries"),

      htmltools::tags$label(class="control-label", "Begin Time"),
      shiny::htmlOutput("begin"),

      htmltools::tags$label(class="control-label", "End Time"),
      shiny::htmlOutput("end"),

      htmltools::tags$label(class="control-label", "Nearest Stations"),
      shiny::htmlOutput("nearest_stations")
    )
  )
)
