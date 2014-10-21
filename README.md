# sensorweby

A JavaScript sensor web client with graphs and analytics powered by Shiny. `sensorweby` is an R extension package building on [Shiny](http://www.rstudio.com/shiny/) and the [52°North JavaScript SOS client](https://github.com/52North/js-sensorweb-client/).

[![Build Status](https://travis-ci.org/52North/sensorweby.png?branch=master)](https://travis-ci.org/52North/sensorweby)

## Installation

The sensorweby package is not on CRAN yet, so please download and install the package manually. The first option is using the package ``devtools``, which also works well for your own fork or development versions by other contributors.

```r
require(devtools)
devtools::install_github("52North/sensorweby")
```

Alternatively, you can download the source code and install the package from source. For this to work must have both [git](http://git-scm.com/downloads) and R (see documentation [here](http://cran.r-project.org/bin/windows/base/rw-FAQ.html#Rcmd-is-not-found-in-my-PATH_0021) for Windows) on your path. Then run the following commands:


```sh
git clone https://github.com/52North/sensorweby
R CMD INSTALL sensorweby
```

## Running 

The `sensorweby` package only has one function to start the interactive web client:

```r
library(sensorweby)
run()
```

To close the client interrupt R, usually by hitting Esc or Ctrl + C.

For more information about running Shiny apps on the server see the [Shiny documentation](http://shiny.rstudio.com/).

## Configuration

You can configure the application by passing a configuration file in YAML format to the function `run(..)`. The default configuration files is at `js-swc/settings.yml`.


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

This R extension package is licensed under [GPL version 2](https://tldrlegal.com/license/gnu-general-public-license-v2).

Documentation (namely the vignettes) are published under [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/).

