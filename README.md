# sensorweby

A JavaScript sensor web client with graphs and analytics powered by Shiny. `sensorweby` is an R extension package building on [Shiny](http://www.rstudio.com/shiny/) and the [52°North JavaScript SOS client](https://github.com/52North/js-sensorweb-client/).

[![Build Status](https://travis-ci.org/52North/sensorweby.png?branch=master)](https://travis-ci.org/52North/sensorweby)

## Installation

The sensorweby package is not on CRAN yet, so please download and install the package manually. The first option is using the package ``devtools``, which also works well for your own fork or development versions by other contributors.

```r
devtools::install_github("52North/sensorweby")
```

Alternatively, you can download the source code and install the package from source. For this to work must have both [git](http://git-scm.com/downloads) and R (see documentation [here](http://cran.r-project.org/bin/windows/base/rw-FAQ.html#Rcmd-is-not-found-in-my-PATH_0021) for Windows) on your path. Then run the following commands:


```sh
git clone https://github.com/52North/sensorweby
R CMD INSTALL sensorweby
```

## Running 

A `sensorweby` app is very similar to a standard `shiny` app. So refer to their [extensive documentation](http://shiny.rstudio.com/). This package adds new UI builder functions to generate the JavaScript SensorWebClient UI and a analysis page therein (see `?swcPage`, `?swcLeftPanel`, `?swcRightPanel` and `?swcFullPanel`).

It also adds new inputs to obtain the session state, namely the currently selected time interval and timeseries of the JavaScript client (see `?swcTimeseriesInput`, `?swcIntervalInput`, `?swcTimeBeginInput` and `?swcTimeEndInput`).

Using these functions you easily can enhance the JavaScript client using the analytical power of R.

### Example

This `ui.R` creates the complete client and adds a *Analytics* page. This page contains a single `plotOutput` and two `sensorweby` inputs:

```r
library(shiny)
library(sensorweby)

shinyUI(
    swcPage(
        caption = c(en = "Time Plot"),
        title = "Sensorweby",
        swcIntervalInput("time"),
        swcTimeseriesInput("series"),
        swcFullPanel(plotOutput("plot", width="100%", height="100%"))
    )
)
```

The accompanying  `server.R` takes the two `reactive` inputs and creates the plot output using `sensorweb4R` to request and `openair` to plot the data:

```r
library(sensorweby)
library(sensorweb4R)
library(openair)
library(lubridate)

shinyServer(function(input, output, session) {
    output$plot <- renderPlot({

        validate(
            need(length(input$series) > 0, 'No Timeseries selected'),
            need(input$time, "No timespan selected")
        )
        data <- getData(input$series, timespan = input$time)
        times <- unique(sort(do.call(c, lapply(data, time))))
        values <- lapply(data, function(x) value(x)[match(times, time(x))])
        names(values) <- id(input$series)
        values$date <- times
        df <- as.data.frame(values)

        validate(need(dim(df)[1] > 0, "No data available"))

        timePlot(df, pollutant = id(input$series),
                 name.pol = label(input$series),
                 plot.type = "h", smooth = TRUE,
                 ci = TRUE, ylab=c())
    })
})
```

You also can run [various examples](https://github.com/52North/sensorweby/tree/master/inst/examples) using the `runExample` function. For the above simply run

```r
sensorweby::runExample("timePlot")
```

To close the client interrupt R, usually by hitting Esc or Ctrl + C.

For more information about running Shiny apps on the server see the [Shiny documentation](http://shiny.rstudio.com/).

## Configuration

The JavaScript client can be configured by placing a `www/settings.json` file inside the app directory. For configuration options refer to the documentation of the [client](https://github.com/52North/js-sensorweb-client/).

### Input Functions

#### Begin Time Input

`swcTimeBeginInput` adds a new reactive input that contains the currently selected start time (as a `POSIXct`) of the JavaScript SensorWebClient. Returns a HTML `input` tag.

| Parameter | Description         |
|-----------|---------------------|
| `id `     | the id of the input |

##### Example

```r
swcTimeBeginInput('begin')

```

#### End Time Input

`swcTimeEndInput` adds a new reactive input that contains the currently
selected end time (as a `POSIXct`) of the JavaScript SensorWebClient.
Returns a HTML `input` tag.

| Parameter | Description         |
|-----------|---------------------|
| `id `     | the id of the input |

##### Example

```r
swcTimeEndInput('end')

```

#### Time Interval Input

`swcIntervalInput` adds a new reactive input that contains the currently
selected timespan (as a `lubridate::interval`) of the JavaScript SensorWebClient. Returns a HTML `input` tag.

| Parameter | Description         |
|-----------|---------------------|
| `id `     | the id of the input |

##### Example

```r
swcIntervalInput('time')

```

#### Timeseries Input

`swcTimeseriesInput` adds a new reactive input that contains the currently selected time series of the JavaScript SensorWebClient (as a `sensorweb4R::Timeseries`. Returns a HTML `input` tag.

| Parameter | Description         |
|-----------|---------------------|
| `id `     | the id of the input |

##### Example

```r
swcTimeseriesInput('series')

```

### Interface Builder Functions


#### I18N Definition

`swcI18N` adds a new I18N value to the JavaScript SensorWebClient. Returns a HTML `script` tag setting the value.

| Parameter | Description             |
|-----------|-------------------------|
| `lang`    | the language identifier |
| `key`     | the message key         |
| `value`   | the message value       |

##### Example

```r

swcI18N('eng', 'button_label', 'OK')

```

#### Left Panel Definition

`swcLeftPanel` creates the left panel of the analysis view of the JavaScript SensorWebClient. Returns a HTML `div` tag for the left panel.

| Parameter   | Description                                         |
|-------------|-----------------------------------------------------|
| `...`       | inherited from `shiny::tags$div`                    |

##### Example

```r
swcLeftPanel(
    plotOutput("output", width="100%", height="100%")
)

```

#### Right Panel Definition

`swcLeftPanel` creates the right panel of the analysis view of the JavaScript SensorWebClient. Returns a HTML `div` tag for the right panel.

| Parameter   | Description                                         |
|-------------|-----------------------------------------------------|
| `header`    | the header of the right panel                       |
| `...`       | inherited from `shiny::tags$div`                    |

##### Example

```r
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
    swcTimeseriesInput("series")
)

```


#### Full Panel Definition

`swcFullPanel` creates a panel spanning the complete analysis view of the JavaScript SensorWebClient. Returns a HTML `div` tag for the panel.

| Parameter   | Description                                         |
|-------------|-----------------------------------------------------|
| `...`       | inherited from `shiny::tags$div`                    |

##### Example

```r
swcFullPanel(
    plotOutput("output", width="100%", height="100%")
)

```

#### JavaScript SensorWebClient Page Definition

`swcPage` creates a new page containing the JavaScript SensorWebClient. Returns a HTML `html` tag containing the client.

| Parameter     | Description                                         |
|---------------|-----------------------------------------------------|
| `title`       | the title of the page                               |
| `author`      | the HTML `meta` tag author                          |
| `description` | the HTML `meta` tag description                     |
| `debug`       | indicates if the client should be run in debug mode |
| `...`         | inherited from `shiny::tags$div`                    |

##### Example

```r
swcPage(
    swcLeftPanel(...),
    swcRightPanel(...)
)

```

## Developer Documentation

### Updating the JS SensorWebClient

To install the latest tag just run:

```r
installSensorWebClient()
```

To install your own fork:

```r
installSensorWebClient(owner = 'myusername', version = 'mybranch')
```

Both commands require the packages `RCurl` and [`github`](https://github.com/cscheid/rgithub) to be installed. Also, [Maven](http://maven.apache.org/) has to be found in your `PATH`.

## Contact / Support

Please direct support questions to the 52°North Sensor Web Community mailing list/forum: http://sensorweb.forum.52north.org/ (and read the [guidelines](http://52north.org/resources/mailing-list-and-forums/mailinglist-guidelines) beforehand).

Add an issue/comment on [the GitHub repository](https://github.com/52North/sensorweby) if you found a bug or want to collaborate on new features.

## License

This R extension package is licensed under [Apache License 2](https://www.tldrlegal.com/l/apache2).

Documentation (namely the vignettes) are published under [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/).

