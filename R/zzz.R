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


.onLoad <- function(libname, pkgname) {
    shiny::registerInputHandler("n52.datetime", .timeInputHandler);
    shiny::registerInputHandler("n52.timeseries", .timeseriesInputHandler)
    shiny::registerInputHandler("n52.timeseries.colors", .timeseriesColorInputHandler)
    shiny::registerInputHandler("n52.timeinterval", .timeIntervalInputHandler)
}

.onUnload <- function(libpath) {
    shiny::removeInputHandler("n52.datetime")
    shiny::removeInputHandler("n52.timeseries")
    shiny::removeInputHandler("n52.timeseries.colors")
    shiny::removeInputHandler("n52.timeinterval")
}