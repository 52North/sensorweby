% Generated by roxygen2 (4.1.0): do not edit by hand
% Please edit documentation in R/swc.R
\name{swcFullPanel}
\alias{swcFullPanel}
\title{Full Panel Definition}
\usage{
swcFullPanel(...)
}
\arguments{
\item{...}{Unnamed items that comprise this list of tags.}
}
\value{
a HTML \code{div} tag for the full-size panel
}
\description{
\code{swcLeftPanel} creates the full panel fo the analysis view of the
JavaScript SensorWebClient.
}
\examples{
\dontrun{
swcLeftPanel(
  plotOutput("output", width="100\%", height="100\%")
)
}
}

