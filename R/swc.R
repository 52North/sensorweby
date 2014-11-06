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

#' Install JavaScript SensorWebClient
#'
#' \code{installSensorWebClient} downloads, builds and installs the JavaScript SensorWebClient.
#'
#' @param owner the GitHub repository owner
#' @param repo the GitHub repository name
#' @param version the version that should be installed
#' @examples
#' \dontrun{installSensorWebClient()}
installSensorWebClient <- function(owner = '52North', repo = 'js-sensorweb-client',
                                   version = getLatestSensorWebClientTag()) {
    basePath <- devtools::as.package('.')$path
    tmpDir <- tempfile(pattern = 'swc-temp-dir')
    dir.create(tmpDir, recursive=TRUE)
    swcDir <- file.path(basePath, 'inst', 'js-swc')

    zipFile <- .downloadSensorWebClientZipFile(owner, repo, version, tmpDir)
    projectDir <- .extractSensorWebClientZipFile(zipFile, tmpDir)
    distFile <- .buildSensorWebClient(projectDir, tmpDir)

    .replaceExistingSensorWebClientInstallation(distFile, tmpDir, swcDir)
    
    futile.logger::flog.trace("Deleting %s", tmpDir)
    unlink(tmpDir, recursive = TRUE)
}

#' Get latest JavaScript SensorWebClient version
#'
#' \code{getLatestSensorWebClientTag} retrieves the latest tag on GitHub or 'develop' if no tags are found.
#'
#' @param owner the GitHub repository owner
#' @param repo the GitHub repository name
#' @return the latest version or 'develop'
#' @examples
#' \dontrun{
#'  installSensorWebClient()
#' }
getLatestSensorWebClientTag <- function(owner = '52North', repo = 'js-sensorweb-client') {
    tags = .getAllSensorWebClientTags(owner, repo)
    return(ifelse(length(tags) == 0, 'develop', tags[[1]]))
}

.getAllSensorWebClientTags <- function(owner = '52North', repo = 'js-sensorweb-client') {
    # devtools::install_github('cscheid/rgithub')
    tags = github::get.repository.tags(owner, repo)
    return(sapply(tags$content, function(x) x$name))
}

.replaceExistingSensorWebClientInstallation <- function (distFile, tmpDir, swcDir) {
    futile.logger::flog.trace("Deleting %s", file.path(swcDir, 'www'))
    unlink(file.path(swcDir, 'www'), recursive = TRUE)
    futile.logger::flog.trace("Extracting %s to %s", distFile, tmpDir)
    untar(tarfile = distFile, exdir = tmpDir, compressed = TRUE)
    file.copy(from = Sys.glob(file.path(tmpDir, 'jsClient-*')), to = swcDir, recursive = TRUE)
    file.rename(from = Sys.glob(file.path(swcDir, 'jsClient-*')), to = file.path(swcDir, 'www'))
}

.extractSensorWebClientZipFile <- function(zipFile, tmpDir) {
    base <- unzip(zipFile, list = TRUE)$Name[1]
    futile.logger::flog.trace("Extracting %s to %s", file.path(tmpDir, base));
    unzip(zipFile, exdir = tmpDir)
    return(normalizePath(file.path(tmpDir, base)))
}

.downloadSensorWebClientZipFile <- function(owner, repo, version, tmpDir) {
    url <- paste('https://api.github.com/repos', RCurl::curlEscape(owner),
                 RCurl::curlEscape(repo), 'zipball', RCurl::curlEscape(version), sep='/')
    zipFile <- tempfile(fileext='.zip', tmpdir = tmpDir)
    futile.logger::flog.trace("Downloading ZIP archive %s to %s", url, zipFile)
    writeBin(RCurl::getBinaryURL(url, followLocation = TRUE,
                                 httpHeader = c('User-Agent'='sensorweby')), con = zipFile)
    return(zipFile);
}

.buildSensorWebClient <- function(directory, tmpDir) {
    system(paste("mvn -q clean install -P shiny -f", file.path(directory, "pom.xml")))
    return (Sys.glob(file.path(directory, "target", "jsClient-*-shiny.tar.gz")))
}
