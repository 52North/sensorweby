library("shiny")
source("swc.R")

shinyUI(
  swcPage(
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