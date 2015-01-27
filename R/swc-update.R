#' Install JavaScript SensorWebClient
#'
#' \code{installSensorWebClient} downloads, builds and installs the JavaScript SensorWebClient.
#'
#' @param owner the GitHub repository owner
#' @param repo the GitHub repository name
#' @param version the version that should be installed
#' @export
#' @examples
#' \dontrun{installSensorWebClient()}
installSensorWebClient <- function(owner = '52North', repo = 'js-sensorweb-client',
                                   version = getLatestSensorWebClientTag()) {
    basePath <- devtools::as.package('.')$path
    tmpDir <- tempfile(pattern = 'swc-temp-dir')
    dir.create(tmpDir, recursive=TRUE)
    wwwDir <- file.path(basePath, 'inst', 'www')
    
    zipFile <- .downloadSensorWebClientZipFile(owner, repo, version, tmpDir)
    projectDir <- .extractSensorWebClientZipFile(zipFile, tmpDir)
    distFile <- .buildSensorWebClient(projectDir, tmpDir)
    
    .replaceExistingSensorWebClientInstallation(distFile, tmpDir, wwwDir)
    
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
#' @export
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

.replaceExistingSensorWebClientInstallation <- function (distFile, tmpDir, wwwDir) {
    jscDir <- file.path(wwwDir, 'jsc')
    futile.logger::flog.trace("Deleting %s", jscDir)
    unlink(jscDir, recursive = TRUE)
    
    futile.logger::flog.trace("Extracting %s to %s", distFile, tmpDir)
    untar(tarfile = distFile, exdir = tmpDir, compressed = TRUE)
    file.copy(from = Sys.glob(file.path(tmpDir, 'jsClient-*')), to = wwwDir, recursive = TRUE)
    file.rename(from = Sys.glob(file.path(wwwDir, 'jsClient-*')), to = jscDir)
}

.extractSensorWebClientZipFile <- function(zipFile, tmpDir) {
    base <- unzip(zipFile, list = TRUE)$Name[1]
    futile.logger::flog.trace("Extracting %s to %s", zipFile, tmpDir);
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