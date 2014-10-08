
library(shiny)
library(openair)

formatTime <- function(x) {
  if (is.null(x) || is.na(x)) x else format(x, "%Y-%m-%dT%H:%M:%OS3")
}

shinyServer(function(input, output) {
  
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