
library("shiny")

# remove this line if the file is packaged...
removeInputHandler("n52.datetime");

registerInputHandler("n52.datetime", function(x, shinysession, name) {
  if (is.null(x)) return(NA);
  if (is.numeric(x)) return(as.POSIXct(x, origin="1970-01-01", tz="UTC"));
  return(strptime(x, "%Y-%m-%dT%H:%M:%OS", tz = "UTC"));  
}, force=TRUE);

swcTimeBeginInput <- function(id) {
  tags$input(class="jsc-time-start", type="hidden", "data-input-id"=id)
}
swcTimeEndInput <- function(id) {
  tags$input(class="jsc-time-end", type="hidden", "data-input-id"=id)
}
swcTimeseriesInput <- function(id) { 
  tags$input(class="jsc-timeseries", type="hidden", "data-input-id"=id)
}
swcI18N <- function(lang, key, value) {
  tags$script(type="text/javascript", sprintf("i18n.%s.%s = '%s'", lang, key, value));
}
swcLeftPanel <- function(...) {
  tags$div(class="col-xs-12 col-sm-8 col-lg-9 fullHeight", list(...));
}




swcRightPanel <- function(header, ...) {
  tagList(
    tags$div(id="analysis-sidebar",
             class="col-xs-6 col-sm-4 col-lg-3 analysis-sidebar rightPanel",
             tags$h3(class="header", header),
             list(...)),
    tags$div(
      class="visible-xs leftPanelButton",
      tags$button(
        type="button",
        class="btn btn-primary btn-xs",
        "data-toggle"="#analysis-sidebar",
        "data-title"=header,
        header
      )
    ),
    tags$style(type="text/css", '#analysis-sidebar.active {background: rgba(66, 139, 202, 0.5);}')
  )
};

swcPage <- function(...,
                    title=NULL, 
                    author=NULL, 
                    description=NULL, 
                    debug=FALSE) {
  
  imports <- list(
    HTML('<!--[if lt IE 9]>'),
    tags$script(
      type="text/javascript", 
      src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"
    ),
    tags$script(
      type="text/javascript", 
      src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"
    ),
    HTML('<![endif]-->'),
    
    tags$script(
      type="text/javascript", 
      src="shared/selectize/js/selectize.min.js"
    ),
    tags$script(
      type="text/javascript",             
      src="js/jsc-0.2.0.deps.min.js"
    ),
    tags$script(
      type="text/javascript", 
      src="js/jsc-0.2.0.min.js"
    ),
    tags$script(
      type="text/javascript", 
      src="js/jsc-shiny.js"
    ),
    tags$link(
      rel="stylesheet", 
      type="text/css", 
      href="css/jsc-0.2.0.deps.min.css"
    ),
    tags$link(
      rel="stylesheet", 
      type="text/css",
      href="css/jsc-0.2.0.min.css"
    )
  );
  
  
  head <- tags$head(
    if (!is.null(title)) tags$title(title),
    if (!is.null(description)) tags$meta(name="description", content=description),
    if (!is.null(author)) tags$meta(name="author", content=author),
    tags$meta(
      "http-equiv"="Content-Type",
      content="text/html; charset=utf-8"
    ),
    tags$meta(
      "http-equiv"="X-UA-Compatible", 
      content="IE=edge"
    ),

    imports,
    
    tags$script(
      type="text/javascript", 
      sprintf("var DEBUG = !!%i;", debug)
    )
  );

  navigation <- list(
    tags$span(
      class="navbar-brand",
      tags$span(class="glyphicon glyphicon-stats"),
      tags$span("{{_i}}main.analysisView{{/i}}")
    ),
    tags$a(
      class="btn btn-default navbar-btn button-right",
      "data-target"="#chart", 
      href="#chart", 
      type="button",
      tags$span(class="glyphicon glyphicon-stats"),
      tags$span(class="buttonCaption", "{{_i}}main.chartView{{/i}}")
    ),
    tags$a(
      class="btn btn-default navbar-btn button-right",
      "data-target"="#map", 
      href="#map", 
      type="button",
      tags$span(class="glyphicon glyphicon-globe"),
      tags$span(class="buttonCaption", "{{_i}}main.mapView{{/i}}")
    ),
    tags$a(
      class="btn btn-default navbar-btn button-right",
      "data-target"="#settings", 
      href="#settings", 
      type="button",
      tags$span(class="glyphicon glyphicon-cog"),
      tags$span(class="buttonCaption", "{{_i}}main.settings{{/i}}")
    ),
    tags$a(
      class="btn btn-default navbar-btn button-right",
      "data-target"="#tour", 
      href="#tour", 
      type="button",
      tags$span(class="glyphicon glyphicon-question-sign")
    )
  );
  
  
  body <- tags$body(
    tags$div(
      class="jsc-main",
      tags$div(
        class="swc-page", 
        id="analysis-page",
        tags$div(
          class="navbar navbar-fixed-top", 
          role="navigation",
          tags$div(
            class="container-fluid",
            tags$div(
              class="navbar-header analysis", 
              navigation
            )
          )
        ),
        tags$div(
          class="container-fluid content", 
          tags$div(
            class="row fullHeight", 
            list(...)
          )
        )
      )
    )
  );
  
  tags$html(lang="en",head,body);
}