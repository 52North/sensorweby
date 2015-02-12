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

library(shiny)
library(sensorweby)

shinyUI(  
    swcPage( 
        title = "Sensorweby",
        swcIntervalInput("time"),
        swcTimeseriesInput("series"),
        swcLeftPanel(
            conditionalPanel(condition = "input.analysis == 'time'", 
                             plotOutput(outputId = "timePlot",
                                        height = "100%")),
            conditionalPanel(condition = "input.analysis == 'rose'", 
                             plotOutput(outputId = "rosePlot",
                                        height = "100%"))
        ),
        swcRightPanel(
            header = "Parameters",
            selectInput(inputId = "analysis", 
                        label = "Analysis", 
                        choices = c("Pollution Rose" = "rose",
                                    "Time Plot" = "time")),
            conditionalPanel(condition = "input.analysis == 'rose'",
                             uiOutput(outputId = "selector"), 
                             textOutput(outputId = "note", inline = TRUE))
        )
    )
);
