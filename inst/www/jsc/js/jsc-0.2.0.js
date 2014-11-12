/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Permalink = {
    getUrlParameter: function(sParam) {
        var hash = window.location.search;
        hash = hash.substring(hash.indexOf('?') + 1);
        var parameters = hash.split('&');
        for (var i = 0; i < parameters.length; i++) {
            var sParameterName = parameters[i].split('=');
            if (sParameterName[0] == sParam) {
                return decodeURIComponent(sParameterName[1]);
            }
        }
    }
};
/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var i18n = {};
var languageChooser;
function _(key) {
    var lang = currentLanguage();
    var text = readI18n(lang, key) || readI18n("en", key);
    if ($.isEmptyObject(text)) {
        return key;
    } else {
        return text;
    }
}

function currentLanguage() {
    return Permalink.getUrlParameter('lang') || Permalink.getUrlParameter('locale') || navigator.language || navigator.userLanguage;
}

function languagesAvailable() {
    return Object.keys(i18n);
}

function createLanguageChooser() {
    var options = $(".language-chooser-box ul");
    createFlagImage = function(code) {
        return $("<img />", {
            src: "../images/blank.gif",
            name: readI18n(code, 'fullName')
        })
                .addClass("flag flag-" + code)
                .addClass("pull-right");
    };
    //$(".language-chooser-box button").append(createFlagImage(currentLanguage()));
    $.each(languagesAvailable(), function(idx, code) {
        if (code.indexOf('_') === -1) {
            var item = $("<li />", {
                role: "menuitem"
            })
                    .append(readI18n(code, 'fullName'))
                    .append(createFlagImage(code))
                    .on("click", function() {
                        var ok = window.confirm(_("settings.requiresRestart"));
                        if (ok) {
                            window.location = PermalinkController.createPermalink() + "&locale=" + code;
                        }
                    });

            options.append(item);
        }
    });
}

function readI18n(lang, key) {
    try {
        var keyArray = key.split('.');
        var value = i18n[lang];
        if (!value) {
            var langParts = lang.split('-');
            // convert lang to 'en_US' as 'en-US' not allowed
            var value = i18n[langParts[0] + "_" + langParts[1]];
            if (!value && langParts.length > 1) {
// no subregion, try e.g. en-US => en
                value = i18n[langParts[0]];
            }
        }
        while (keyArray.length) {
            var property = keyArray.splice(0, 1);
            value = read_prop(value, property[0]);
        }
        if ($.isEmptyObject(value)) {
            console.error("Missing i18n key '" + key + "' for language " + lang);
        }
        return value;
    } catch (ex) {
        console.error("Don't find the i18n key '" + key + "' for language " + lang);
    }
}

function read_prop(obj, prop) {
    return obj[prop];
}/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
i18n.en = {
    fullName: 'English',
    ok: 'OK',
    main: {
        legend: 'Legend',
        diagram: 'Diagram',
        mapView: 'Map view',
        settings: 'Settings',
        stationSelection: 'Select a station',
        chartView: 'Chart view',
        allPhenomena: 'All Phenomena',
        phenomenon: 'Phenomenon',
        favoritesList: 'Favorites',
        importFavorites: 'Import',
        exportFavorites: 'Export',
        importExportHelp: 'Choose a file to import or export favorites',
        noFileSelected: 'No file selected'
    },
    chart: {
        noTimeseriesSelected: 'You have selected no timeseries or the selected timeseries have no values in the given time range.',
        outsideOfDataRange: 'Outside of data range!',
        annotation: 'Data without warrenty!'
    },
    table: {
        time: "Time"
    },
    map: {
        userLocation: 'Here is your current location',
        stationSelection: {
            station: 'Station',
            selectAllTimeseries: 'select all timeseries'
        },
        stationLocation: {
            station: 'Station',
            timeseries: 'Timeseries',
            provider: 'Provider'
        },
        providerList: {
            provider: 'Provider',
            stations: 'Stations',
            timeseries: 'Timeseries',
            phenomena: 'Phenomena'
        },
        search: {
            label: 'search for address ...',
            noResult: 'Sorry, that address could not be found.'
        }
    },
    listSelection: {
        header: 'Select timeseries by list',
        headers: {
            category: 'Category',
            station: 'Station',
            phenomenon: 'Phenomenon',
            procedure: 'Sensor'
        },
        warning: {
            moreThanOneTimeseries: 'found more than one timeseries'
        }
    },
    legend: {
        entry: {
            noData: 'no Data available',
            jumpToLastValue: 'jump to last value',
            firstValueAt: 'First value at',
            lastValueAt: 'Last value at'
        }
    },
    "export": {
        label: 'get data as CSV-File'
    },
    timeSelection: {
        header: 'Time Range',
        presetsHeader: 'presets',
        presets: {
            lastHour: 'last hour',
            today: 'today',
            yesterday: 'yesterday',
            todayYesterday: 'today & yesterday',
            thisWeek: 'this week',
            lastWeek: 'last week',
            thisMonth: 'this month',
            lastMonth: 'last month',
            thisYear: 'this year',
            lastYear: 'last year'
        },
        custom: {
            header: 'custom',
            start: 'Start date',
            end: 'End date'
        },
        warning: {
            startBeforeEnd: 'The start date can not be greater then the end date',
            maxTimeRange: 'The time range can not be greater then one year'
        }
    },
    styleChange: {
        header: 'Change style',
        currentColor: 'Current color',
        selectColor: 'Select a new color',
        selectBarInterval: 'Select the bar interval',
        barChartInterval: {
            hour: 'Hour',
            day: 'Day',
            week: 'Week',
            month: 'Month'
        },
        zeroScaled: 'zero scaled Y-axis',
        groupedAxis: 'grouped axis'
    },
    settings: {
        header: 'Settings',
        resetStatus: 'Reset status',
        chooseLanguage: 'Switch language',
        requiresRestart: 'Needs Restart!',
        permalink: {
            create: 'Create a permalink as',
            inWindow: 'link in a new window',
            inMail: 'link in an email',
            inClipboard: 'Link to clipboard',
            clipboardInfo: 'Copy to clipboard: Ctrl+C, Enter',
            inQrCode: 'as QR-Code',
            favorite: 'Status as favorite entry'
        },
        clusterMarker: 'cluster marker',
        markerWithLastInfo: {
            header: 'marker with last value information',
            label: 'attention - some data provider are very slow'
        },
        saveStatus: 'save status',
        generalizeData: 'generalize Data',
        imprint: {
            header: 'Imprint',
            github: 'Find this project at <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a>',
            text: '<p><a href="http://52north.org" target="_blank">52&deg;North GmbH</a> is responsible for this website.</p><p>52&deg;North Initiative for Geospatial Open Source Software GmbH<br>Martin-Luther-King-Weg 24<br>48155 Muenster, Germany</p>'
        }
    },
    permalink: {
        noMatchingTimeseriesFound: 'No matching timeseries is found.'
    },
    guide: {
        step1: {
            header: 'JavaScript Client - Guided Tour',
            text: 'This tour gives in a few steps an overview how to use this client. First we add a timeseries from the map.'
        },
        step2: {
            header: 'Go to the map',
            text: 'Here we switch the view to get a map.'
        },
        step3: {
            header: 'Map view',
            text: 'This is the map view. In the map you can see markers or markergroups.'
        },
        step4: {
            header: 'Change Provider',
            text: 'Here you can select another timeseries provider.'
        },
        step5: {
            header: 'Show location',
            text: 'And here you can locate your device on the map.'
        },
        step6: {
            header: 'List selection',
            text: 'Here you can select a timeseries out of ordered lists.'
        },
        step7: {
            header: 'Select a station',
            text: 'Please select now a station on the map.'
        },
        step8: {
            header: 'Select timeseries',
            text: 'Select this checkbox. If there is only one timeseries for this station, the checkbox is already checked. Now you can go on with the "OK" button to load the timeseries.'
        },
        step9: {
            header: 'Legend entry',
            text: 'Here you see the added time series. You can delete or locate the time series or change the color.'
        },
        step10: {
            header: 'Chart',
            text: 'This is the chart of the selected time series.'
        },
        step11: {
            header: 'Change time',
            text: 'Here you can change the time extent for your selected time series.'
        },
        step12: {
            header: 'Table View',
            text: 'Here you get a table of the raw data values to your selected time series.'
        },
        step13: {
            header: 'Favorite management',
            text: 'The legend entries/timeseries could be saved as favorites. In this view all favorites are listed and could be maintained.'
        },
        step14: {
            header: 'Finished',
            text: 'Well done!<br> This client is a product of <a href="http://52north.org" target="_blank">52&deg;North GmbH</a>. You can find the source code on <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a>.'
        }
    },
    favorite: {
        firstValueAt: 'First value at',
        lastValueAt: 'Last value at',
        edit: {
            header: "Edit favorite"
        },
        group: {
            add: "The status '{0}' is added to the favorite list.",
            exists: "This status still exists.",
            noTimeseries: "Currently no timeseries are selected.",
            notSupported: "The provider of an entry of the status '{0}' isn't supported and can't be loaded."
        },
        single: {
            add: "A new favorite '{0}' is added to the list.",
            remove: "The favorite '{0}' is removed.",
            exists: "This favorite still exists.",
            notSupported: "The provider of the favorite '{0}' isn't supported and can't be loaded."
        }
    },
    inform: {
        error: "An error occured: ",
        warn: "Please remember that: "
    }
};/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
i18n.en_GB = {
    main: {
        favoritesList: 'Favourites'
    },
    settings: {
        permalink: {
            favorite: 'Status as favourite entry'
        }
    },
    guide: {
        step13: {
            header: 'Favourite management',
            text: 'The legend entries/timeseries could be saved as favourites. In this view all favourites are listed and could be maintained.'
        }
    },
    favorite: {
        edit: {
            header: "Edit favourite"
        },
        group: {
            add: "The status '{0}' is added to the favourite list."
        },
        single: {
            add: "A new favourite '{0}' is added to the list.",
            remove: "The favourite '{0}' is removed.",
            exists: "This favourite still exists.",
            notSupported: "The provider of the favourite '{0}' isn't supported and can't be loaded."
        }
    }
};/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
i18n.de = {
    fullName: 'Deutsch',
    ok: 'OK',
    main: {
        legend: 'Legende',
        diagram: 'Diagramm',
        mapView: 'Kartenansicht',
        settings: 'Einstellungen',
        stationSelection: 'Wähle eine Station aus',
        chartView: 'Diagrammansicht',
        allPhenomena: 'Alle Phänomene',
        phenomenon: 'Phänomen',
        favoritesList: 'Favoriten',
        importFavorites: 'Importieren',
        exportFavorites: 'Exportieren',
        importExportHelp: 'Datei für den Im- oder Exportieren wählen',
        noFileSelected: 'Keine Datei ausgewählt'
    },
    table: {
        time: "Zeit"
    },
    chart: {
        noTimeseriesSelected: 'Sie haben keine Zeitreihe ausgewählt oder die gewählten Zeitreihen haben keine Werte in dem derzeitigen Zeitraum.',
        outsideOfDataRange: 'Außerhalb des Datenbereichs!',
        annotation: 'Daten ohne Gewähr!'
    },
    map: {
        userLocation: 'Hier ist ihr Standort',
        stationSelection: {
            station: 'Station',
            selectAllTimeseries: 'wähle alle Zeitreihen'
        },
        stationLocation: {
            station: 'Station',
            timeseries: 'Zeitreihe',
            provider: 'Datenanbieter'
        },
        providerList: {
            provider: 'Datenanbieter',
            stations: 'Stationen',
            timeseries: 'Zeitreihen',
            phenomena: 'Phänomene'
        },
        search: {
            label: 'suche Addresse ...',
            noResult: 'Sorry, es konnte keine Adresse gefunden werden.'
        }
    },
    listSelection: {
        header: 'Listenbasierte Zeitreihenauswahl',
        headers: {
            category: 'Kategorie',
            station: 'Station',
            phenomenon: 'Phänomen',
            procedure: 'Sensor'
        },
        warning: {
            moreThanOneTimeseries: 'Mehr als eine Zeitreihe gefunden'
        }
    },
    legend: {
        entry: {
            noData: 'keine Daten verfügbar',
            jumpToLastValue: 'Springe zur letzten Messung',
            firstValueAt: 'Erster Wert bei',
            lastValueAt: 'Letzter Wert bei'
        }
    },
    "export": {
        label: 'Daten als CSV-File'
    },
    timeSelection: {
        header: 'Zeitraum',
        presetsHeader: 'Vordefiniert',
        presets: {
            lastHour: 'letzte Stunde',
            today: 'heute',
            yesterday: 'gestern',
            todayYesterday: 'heute & gestern',
            thisWeek: 'diese Woche',
            lastWeek: 'letzte Woche',
            thisMonth: 'diesen Monat',
            lastMonth: 'letzten Monat',
            thisYear: 'dieses Jahr',
            lastYear: 'letztes Jahr'
        },
        custom: {
            header: 'Freidefiniert',
            start: 'Startzeitpunkt',
            end: 'Endzeitpunkt'
        },
        warning: {
            startBeforeEnd: 'Der Startzeitpunkt darf nicht größer als der Endzeitpunkt sein',
            maxTimeRange: 'Der ausgewählte Zeitraum darf nicht größer als ein Jahr sein'
        }
    },
    styleChange: {
        header: 'Ändern der Zeitreihengestaltung',
        currentColor: 'Derzeitige Farbe',
        selectColor: 'Wähle neue Farbe',
        selectBarInterval: 'Wähle Balkeninterval',
        barChartInterval: {
            hour: 'Stunde',
            day: 'Tag',
            week: 'Woche',
            month: 'Monat'
        },
        zeroScaled: 'Nullbasierte Y-Achse',
        groupedAxis: 'gruppierte Achse'
    },
    settings: {
        header: 'Einstellungen',
        resetStatus: 'Lösche den Status',
        chooseLanguage: 'Sprache wechseln',
        requiresRestart: 'Erfordert Neustart!',
        permalink: {
            create: 'Erstelle Permalink',
            inWindow: 'öffnen im neuen Fenster',
            inMail: 'öffnen in leerer Mail',
            inClipboard: 'Link in die Zwischenablage',
            clipboardInfo: 'Kopiere in die Zwischenablage: Ctrl+C, Enter',
            inQrCode: 'als QR-Code',
            favorite: 'Status in die Favoritenliste übernehmen'
        },
        clusterMarker: 'Marker gruppieren',
        markerWithLastInfo: {
            header: 'Marker mit Wert der letzten Messung',
            label: 'Achtung - dies kann bei einigen Providern zu langen Afragen führen'
        },
        saveStatus: 'Status mitzeichnen',
        generalizeData: 'Daten generalisiert abfragen',
        imprint: {
            header: 'Impressum',
            github: 'Zur <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a>-Seite dieses Projekts',
            text: '<p><a href="http://52north.org" target="_blank">52&deg;North GmbH</a> ist für diese Website verantwortlich.</p><p>52&deg;North Initiative for Geospatial Open Source Software GmbH<br>Martin-Luther-King-Weg 24<br>48155 Muenster, Deutschland</p>'
        }
    },
    permalink: {
        noMatchingTimeseriesFound: 'Keine passende Zeitreihe gefunden.'
    },
    guide: {
        step1: {
            header: 'JavaScript Client - Geführte Tour',
            text: 'Die Tour gibt in ein paar Schritten einen Überblick über den Client. Zuerst fügen wir eine Zeitreihe von der Karte hinzu.'
        },
        step2: {
            header: 'Zur Karte',
            text: 'Hier kann man die zur Kartenansicht wechseln.'
        },
        step3: {
            header: 'Karten Ansicht',
            text: 'In der Karte siehst du die Stationen als Marker oder Markergruppen.'
        },
        step4: {
            header: 'Änder den Datenanbieter',
            text: 'Hier kannst du aus einer Liste von Datenanbieter auswählen.'
        },
        step5: {
            header: 'Eigene Position',
            text: 'Hier kannst du dich lokalisieren lassen.'
        },
        step6: {
            header: 'Listenauswahl',
            text: 'Hier ist einen Zeitreihenauswahl durch geortnete Listen möglich.'
        },
        step7: {
            header: 'Auswahl einer Station',
            text: 'Bitte wähle eine Station auf der Karte aus.'
        },
        step8: {
            header: 'Zeitreihe auswählen',
            text: 'Wähle einen Zeitreihe durch anklicken der Checkbox. Liegt an dieser Station nur eine Zeitreihe vor, ist diese direkt angewählt. Durch klicken des OK-Buttons wird die Zeitreihe eingeladen.'
        },
        step9: {
            header: 'Legendeneintrag',
            text: 'Hier wird die zugefügte Zeitreihe angezeigt. Du kannst die Zeitreihe hier wieder entfernen oder den Style ändern.'
        },
        step10: {
            header: 'Diagramm',
            text: 'Dies ist das Diagramm der gewählten Zeitreihen.'
        },
        step11: {
            header: 'Zeit ändern',
            text: 'Hier kann der Zeitraum angepasst werden.'
        },
        step12: {
            header: 'Tabellenansicht',
            text: 'Hier bekommt man die Rohdaten in einer Tabelle präsentiert.'
        },
        step13: {
            header: 'Favoritenverwaltung',
            text: 'Die Legendeneinträge/Zeitreihen können als Favoriten abgespeichert werden. Hier werden alle Favoriten gelistet und können verwaltet werden.'
        },
        step14: {
            header: 'Fertig',
            text: 'Super!<br> Dieser Client ist ein Produkt von <a href="http://52north.org" target="_blank">52&deg;North GmbH</a>. Auf <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a> findest du den aktuellen Entwicklungsstand.'
        }
    },
    favorite:{
        firstValueAt: 'Erster Wert bei',
        lastValueAt: 'Letzter Wert bei',
        edit: {
            header: "Favorit editieren"
        },
        group:{
            add: "Der Status wird mit dem Name '{0}' in den Favoriten abgelegt.",
            noTimeseries: "Derzeit sind keine Zeitreihen ausgewählt.",
            exists: "Dieser Status existiert bereits.",
            notSupported: "Der Datenanbieter eines Eintrag aus '{0}' wird nicht unterstützt und kann deswegen nicht eingeladen werden."
        },
        single: {
            add: "Einer neuer Favorit mit dem Name '{0}' ist abgelegt worden.",
            remove: "Der Favorit '{0}' ist entfernt worden.",
            exists: "Dieser Favorit existiert bereits.",
            notSupported: "Der Datenanbieter des Favoriten '{0}' wird nicht unterstützt und kann deswegen nicht eingeladen werden."
        }
    },
    inform: {
        error: "Ein Fehler ist aufgetreten: ",
        warn: "Bitte beachten Sie: "
    }
};/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function TimeSeries(tsId, meta, apiUrl) {

    var internalId = tsHelper.createInternalId(tsId, apiUrl);
    var values = [];
    var refValues = {};
    var synced = false;
    var zeroScaled = Settings.defaultZeroScale;
    var groupedAxis = Settings.defaultGroupedAxis;
    var timeBuffer = Settings.timeseriesDataBuffer || moment.duration(2, 'h');
    $.each(meta.referenceValues, $.proxy(function(index, elem) {
        refValues[elem.referenceValueId] = new ReferenceValue(elem.referenceValueId, elem.label);
    }, this));
    var style = {};
    if (meta.hasOwnProperty('renderingHints')) {
        var chartType = meta.renderingHints.chartType;
        var width = meta.renderingHints.properties.width;
        var color = meta.renderingHints.properties.color;
        var interval = meta.renderingHints.properties.interval;
        var lineType = meta.renderingHints.properties.type;
        style = new TimeseriesStyle(chartType, width, color, interval, lineType);
    } else {
        style = TimeseriesStyle.createDefault(tsId);
    }

    this.getTsId = function() {
        return tsId;
    };

    this.getInternalId = function() {
        return internalId;
    };

    this.getApiUrl = function() {
        return apiUrl;
    };

    this.getStyle = function() {
        return style;
    };

    this.isZeroScaled = function() {
        return zeroScaled;
    };

    this.setZeroScaled = function(bool) {
        zeroScaled = bool;
    };
    
    this.isGroupedAxis = function(){
        return groupedAxis;
    };
    
    this.setGroupedAxis = function(bool) {
        groupedAxis = bool;
    };

    this.isSynced = function() {
        return synced;
    };

    this.getUom = function() {
        return meta.uom;
    };

    this.getLabel = function() {
        return meta.label;
    };

    this.unSynced = function() {
        synced = false;
    };

    this.getValues = function() {
        return values;
    };

    this.getLastValue = function() {
        if (meta && meta.lastValue) {
            return meta.lastValue;
        }
        return null;
    };

    this.isCurrent = function() {
        return this.getLastValue() != null && moment().subtract(Settings.ignoreAfterDuration).isBefore(moment(this.getLastValue().timestamp));
    };

    this.getLastValueFormatted = function() {
        if (meta && meta.lastValue) {
            return meta.lastValue.value + " " + meta.uom + " (" + moment(meta.lastValue.timestamp).format(Settings.dateformat) + ")";
        }
        return null;
    };

    this.getFirstValue = function() {
        if (meta && meta.firstValue) {
            return meta.firstValue;
        }
        return null;
    };

    this.getFirstValueFormatted = function() {
        if (meta && meta.firstValue) {
            return meta.firstValue.value + " " + meta.uom + " (" + moment(meta.firstValue.timestamp).format(Settings.dateformat) + ")";
        }
        return null;
    };

    this.getCoordinates = function() {
        return meta.station.geometry.coordinates;
    };

    this.getStationId = function() {
        return meta.station.properties.id;
    };

    this.getStationLabel = function() {
        return meta.station.properties.label;
    };

    this.getServiceLabel = function() {
        return meta.parameters.service.label;
    };

    this.getPhenomenonLabel = function() {
        return meta.parameters.phenomenon.label;
    };

    this.getProcedureLabel = function() {
        return meta.parameters.procedure.label;
    };

    this.getCategoryLabel = function() {
        if (meta.parameters.category && (meta.parameters.phenomenon.label != meta.parameters.category.label)) {
            return meta.parameters.category.label;
        }
        return "";
    };

    this.getStatusIntervals = function() {
        return meta.statusIntervals;
    };

    this.hasData = function() {
        return values.length != 0;
    };

    this.getRefValuesForId = function(id) {
        if (refValues.hasOwnProperty(id)) {
            return refValues[id];
        }
        return [];
    };

    this.getRefValues = function(id) {
        return refValues;
    };

    this.persist = function() {
        return {
            style: style.persist(),
            apiUrl: apiUrl,
            tsId: tsId
        };
    };

    this.fetchData = function(timespan, complete) {
        var from = moment(timespan.from).subtract(timeBuffer);
        var till = moment(timespan.till).add(timeBuffer);
        timespan = Time.getRequestTimespan(from, till);
        this.promise = Rest.tsData(tsId, apiUrl, timespan, internalId);
        this.promise.done($.proxy(this.fetchedDataFinished, {context: this, complete: complete}));
        return this.promise;
    };

    this.fetchedDataFinished = function(data, refdata) {
        this.context.createTimeBuffer(data);
        values = data;
        $.each(refdata, function(id, elem) {
            if (refValues[id]) {
                refValues[id].setValues(elem);
            }
        });
        synced = true;
        this.complete(this.context);
    };

    this.createTimeBuffer = function(data) {
        if (data.length >= 2) {
            timeBuffer = moment.duration(data[1][0] - data[0][0]);
        }
    };

    this.destroy = function() {
        this.promise.reject(internalId);
    };
}
;/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function ReferenceValue(id, label) {

    var color = Color.stringToColor(id);
    var values = [];
    var selected = false;

    this.getId = function() {
        return id;
    };

    this.getLabel = function() {
        return label;
    };

    this.getColor = function() {
        return color;
    };

    this.getValues = function() {
        return values;
    };

    this.setValues = function(v) {
        values = v;
    };

    this.isSelected = function() {
        return selected;
    };

    this.selected = function(s) {
        selected = s;
    };
}/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function TimeseriesStyle(chartType, width, color, intervalString, lineType) {
    createInterval = function(interval) {
        switch (interval) {
            case "byHour":
                return 1;
            case "byDay":
                return 24;
            case "byWeek":
                return 7 * 24;
            case "byMonth":
                return 30 * 24;
            default:
                return 1;
        }
    };

    var interval = createInterval(intervalString);

    this.getColor = function() {
        return color;
    };

    this.setColor = function(setcolor) {
        color = setcolor;
    };

    this.getChartType = function() {
        return chartType;
    };

    this.setChartType = function(ct) {
        chartType = ct;
    };

    this.isBarChart = function() {
        return chartType == "bar";
    };

    this.isLineChart = function() {
        return chartType == "line";
    };

    this.getIntervalByHours = function() {
        return interval;
    };

    this.getLineType = function() {
        return lineType;
    };

    this.getWidth = function() {
        return width;
    };

    this.persist = function() {
        return {
            chartType: chartType,
            color: color,
            interval: interval,
            lineType: lineType
        };
    };

    this.setIntervalByHours = function(inter) {
        interval = inter;
    };

}
;
/* create a default timeseries style constructor */
TimeseriesStyle.createDefault = function(id) {
    var chartType = "line";
    var width = Settings.commonLineWidth;
    var color = Color.stringToColor(id);
    var interval = "byHour";
    var lineType = "solid";
    return new TimeseriesStyle(chartType, width, color, interval, lineType);
};

/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Settings = {
    // For more informations about the settings options, please check: http://52north.github.io/js-sensorweb-client
    // The entries in this list will be removed from the provider list offered to the user
    providerBlackList: [
        {
            serviceID: 'srv_6d9ccea8d609ecb74d4a512922bb7cee', // ircel
            apiUrl: 'http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/'
        },
        {
            serviceID: 'srv_7cabc8c30a85fab035c95882df6db343', // BfG sos
            apiUrl: 'http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/'
        },
        {
            serviceID: 'srv_7cabc8c30a85fab035c95882df6db343', // Wupperverbands-SOS
            apiUrl: 'http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/'
        }
    ],
    // A list of timeseries-API urls and an appropriate identifier to create internal timeseries ids
    restApiUrls: {
//		'http://192.168.1.135:8080/sensorwebclient-webapp/api/v1/' : 'localhost'
//		'http://localhost:8090/sensorwebclient-webapp-3.3.0-SNAPSHOT/api/v1/' : 'localhost'
        'http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/': '52nSensorweb',
        'http://sosrest.irceline.be/api/v1/': 'irceline',
        'http://www.fluggs.de/sos2/api/v1/': 'fluggs',
        'http://sensors.geonovum.nl/sos/api/v1/': 'geonovum'
    },
    // default selected provider
    defaultProvider: {
        serviceID: 'srv_738111ed219f738cfc85be0c8d87843c',
        apiUrl: 'http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/'
    },
    // default setting for clustering stations
    clusterStations: true,
    // default setting for generalization of the data
    generalizeData: true,
    // default setting for save status
    saveStatus: false,
    // default setting for concentration marker
    concentrationMarker: false,
    // zoom level in the map, used for user location and station position
    zoom: 13,
    // date/time format which is used on several places
    dateformat: 'DD.MM.YY HH:mmZ',
    shortDateformat: 'DD.MM.YY',
    // duration after which latest values shall be ignored when rendering marker in the map
    ignoreAfterDuration: moment.duration(1, 'y'),
    // duration buffer for time series request
    timeseriesDataBuffer: moment.duration(2, 'h'),
    // default color for circled marker, when last value is older than 'ignoreAfterDuration' or the timeseries has no last value
    defaultMarkerColor: '#123456',
    // default scaling of loaded diagram
    defaultZeroScale: false,
    // default grouping timeseries with same uom
    defaultGroupedAxis: true,
    // additional parameters which are append to the request urls
    additionalParameters: {
        locale: 'de'
    },
    // default language for i18n
    defaultLanguage: 'en',
    // should saving the status be possible,
    saveStatusPossible: true,
    // entries on a page for the values table
    pagesize: 20,
    // line width for selected timeseries
    selectedLineWidth: 5,
    // common line width for unselected timeseries
    commonLineWidth: 2,
    // chart styling options see for more details: https://github.com/flot/flot/blob/master/API.md
    chartOptions: {},
    // colorlist to select for a different timeseries color
    colorList: ['#1abc9c', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50', '#f1c40f',
        '#d35400', '#c0392b', '#7f8c8d'],
    // interval to display the timeseries in a bar diagram with label and value in hours
    intervalList: [
        {label: _('styleChange.barChartInterval.hour'), value: 1},
        {label: _('styleChange.barChartInterval.day'), value: 24},
        {label: _('styleChange.barChartInterval.week'), value: 7 * 24},
        {label: _('styleChange.barChartInterval.month'), value: 30 * 24}
    ],
    timeRangeData: {
        presets: [
            {
                name: 'lastHour',
                label: _('timeSelection.presets.lastHour'),
                interval: {
                    from: moment().subtract('hours', 1),
                    till: moment(),
                    mode: 'minutes'
                }
            },
            {
                name: 'today',
                label: _('timeSelection.presets.today'),
                interval: {
                    from: moment().startOf('day'),
                    till: moment().endOf('day'),
                    mode: 'day'
                }
            },
            {
                name: 'yesterday',
                label: _('timeSelection.presets.yesterday'),
                interval: {
                    from: moment().subtract('days', 1).startOf('day'),
                    till: moment().subtract('days', 1).endOf('day'),
                    mode: 'day'
                }
            },
            {
                name: 'todayYesterday',
                label: _('timeSelection.presets.todayYesterday'),
                interval: {
                    from: moment().subtract('days', 1).startOf('day'),
                    //till: moment(),
                    mode: 'day'
                }
            },
            {
                name: 'thisWeek',
                label: _('timeSelection.presets.thisWeek'),
                interval: {
                    from: moment().startOf('week'),
                    //till: moment(),
                    mode: 'week'
                }
            },
            {
                name: 'lastWeek',
                label: _('timeSelection.presets.lastWeek'),
                interval: {
                    from: moment().subtract('weeks', 1).startOf('week'),
                    till: moment().subtract('weeks', 1).endOf('week'),
                    mode: 'week'
                }
            },
            {
                name: 'thisMonth',
                label: _('timeSelection.presets.thisMonth'),
                interval: {
                    from: moment().startOf('month'),
                    //till: moment(),
                    mode: 'month'
                }
            },
            {
                name: 'lastMonth',
                label: _('timeSelection.presets.lastMonth'),
                interval: {
                    from: moment().subtract('months', 1).startOf('month'),
                    till: moment().subtract('months', 1).endOf('month'),
                    mode: 'month'
                }
            },
            {
                name: 'thisYear',
                label: _('timeSelection.presets.thisYear'),
                interval: {
                    from: moment().startOf('year'),
                    //till: moment(),
                    mode: 'year'
                }
            },
            {
                name: 'lastYear',
                label: _('timeSelection.presets.lastYear'),
                interval: {
                    from: moment().subtract('years', 1).startOf('year'),
                    till: moment().subtract('years', 1).endOf('year'),
                    mode: 'year'
                }
            }
        ]
    },
    wmsLayer: [],
    // configuration for the tile layer in the leaflet map (see for more information: http://leafletjs.com/reference.html#tilelayer )
    tileLayerUrl: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    tileLayerOptions: {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    },
    enableGeoSearch: true
};/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Template = {
    getTemplate: function(name) {
        var template = "";
        $.ajax({
            url: 'templates/' + name + '.html',
            success: function(data) {
                template = data;
            },
            dataType: "text",
            async: false
        });
        return template;
    },
    createHtml: function(templateID, data) {
        var template = Template.getTemplate(templateID);
        return Mustache.to_html(template, data);
    }
};/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Storage = {
    generateKey: function(postfix) {
        var loc = window.location;
        if (!loc.origin) {
            loc.origin = loc.protocol + "//" + loc.hostname
                    + (loc.port ? ':' + loc.port : '');
        }
        return loc.origin + loc.pathname + postfix;
    },
    saveObject: function(key, object) {
        if (Settings.saveStatusPossible) {
            try {
                $.totalStorage(key, object);
            } catch (e) {
                Settings.saveStatusPossible = false;
                // safari mobile in private mode???
                // http://davidwalsh.name/quota_exceeded_err
                // alert("No Status saving possible.");
            }
        }
    },
    load: function(key) {
        return $.totalStorage(key);
    }
};/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Inform = {
    error: function(message) {
        Inform._createMessage(_('inform.error'), message);
    },
    warn: function(message) {
        Inform._createMessage(_('inform.warn'), message);
    },
    _createMessage: function(level, message) {
        alert(level + "\n" + message);
    }
};/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Time = {
    isoTimespan: function(interval) {
        /*
         * a) Start and end, such as "2007-03-01T13:00:00Z/2008-05-11T15:30:00Z"
         * b) Start and duration, such as "2007-03-01T13:00:00Z/P1Y2M10DT2H30M"
         * c) Duration and end, such as "P1Y2M10DT2H30M/2008-05-11T15:30:00Z"
         */
        // return obj: {from, till, mode}
        var from = (interval && interval.from) || moment().startOf('day');
        var till = (interval && interval.till) || moment().endOf('day');
        var mode = (interval && interval.mode) || 'day';

        return {
            'from': from,
            'till': till,
            'mode': mode
        };
    },
    getRequestTimespan: function(from, till) {
        return moment(from).format() + '/' + moment(till).format();
    },
    createTimespan: function(interval) {
        var timespan = interval.split('/');
        if (timespan.length === 2) {
            var start = moment(timespan[0]);
            var end = moment(timespan[1]);
            if (start.isValid() && end.isValid()) {
                return {
                    from: start,
                    till: end,
                    mode: 'day'
                };
            }
        }
        return this.isoTimespan(interval);
    },
    getFormatedTime: function(timestamp) {
        return moment(timestamp).format(Settings.dateformat);
    }
};
/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Color = (function() {
    return  {
        stringToColor: function(string) {
            if (!string) return "#000000";
            return "#" + this.intToColorHex(this.hashCode(string));
        },
        //M. Jessup, http://stackoverflow.com/questions/2464745/compute-hex-color-code-for-an-arbitrary-string
        hashCode: function(str) {
            var hash = 0;
            for (var i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }
            return hash;
        },
        intToColorHex: function(i) {
            var rgb = ((i >> 16) & 0xFF).toString(16) +
                    ((i >> 8) & 0xFF).toString(16) +
                    (i & 0xFF).toString(16);
            rgb = rgb.toString();
            while (rgb.length < 6) {
                rgb = "0" + rgb;
            }
            return rgb;
        }
    };
})();/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Rest = {
    request: function(url, data, success, fail) {
        var promise = $.Deferred();
        if (Settings.additionalParameters) {
            if (!data) {
                data = {};
            }
            $.each(Settings.additionalParameters, function(key, value) {
                data[key] = value;
            });
        }
        $.ajax({
            url: url,
            data: data,
            type: "GET",
            dataType: "json",
            success: function(result) {
                success(promise, result);
            },
            error: function(error) {
                Rest.requestFailed(error);
                if (fail) {
                    fail(promise, error);
                }
            }
        });
        return promise;
    },
    requestFailed: function(error) {
        if (error.responseJSON && error.responseJSON.userMessage) {
            Inform.error(error.responseJSON.userMessage);
        }
    },
    tsData: function(id, apiUrl, timespan, internalId, extendedData) {
        var data = {
            timespan: timespan,
            generalize: Status.get('generalizeData'),
            expanded: true,
            format: 'flot'
        };
        if (extendedData) {
            data = $.extend(data, extendedData);
        }
        return this.request(apiUrl + "timeseries/" + id
                + "/getData", data, function(promise, result) {
                    var values = tsHelper.createDataOfResult(result, id);
                    var refValues = tsHelper.createRefDataOfResult(result, id);
                    promise.resolve(values, refValues);
                }, function(promise, error) {
            promise.reject(internalId);
        });
    },
    stations: function(id, apiUrl, data) {
        return Rest.request(apiUrl + "stations/"
                + this._createIdString(id), data, function(promise, result) {
            promise.resolve(result);
        });
    },
    features: function(id, apiUrl, data) {
        return Rest.request(apiUrl + "features/"
                + Rest._createIdString(id), data, function(promise, result) {
            promise.resolve(result);
        });
    },
    timeseries: function(id, apiUrl, data) {
        if ($.isEmptyObject(data)) {
            data = {};
        }
        data.expanded = true;
        data.rendering_hints = true;
        return Rest.request(apiUrl + "timeseries/"
                + this._createIdString(id), data, function(promise, result) {
            if ($.isArray(result)) {
                var timeseriesList = $.map(result, function(elem) {
                    return new TimeSeries(elem.id, elem, apiUrl);
                });
                promise.resolve(timeseriesList);
            } else {
                promise.resolve(new TimeSeries(result.id, result, apiUrl));
            }
        });
    },
    categories: function(id, apiUrl, data) {
        return Rest.request(apiUrl + "categories/"
                + Rest._createIdString(id), data, function(promise, result) {
            promise.resolve(result);
        });
    },
    phenomena: function(id, apiUrl, data) {
        return Rest.request(apiUrl + "phenomena/"
                + Rest._createIdString(id), data, function(promise, result) {
            promise.resolve(result);
        });
    },
    procedures: function(id, apiUrl, data) {
        return Rest.request(apiUrl + "procedures/"
                + Rest._createIdString(id), data, function(promise, result) {
            promise.resolve(result);
        });
    },
    services: function(apiUrl) {
        return Rest.request(apiUrl + "services", {
            expanded: true
        }, function(promise, result) {
            promise.resolve(result);
        });
    },
    search: function(apiUrl, params) {
        return Rest.request(apiUrl + "search", {
            q: params
        }, function(promise, result) {
            promise.resolve(result);
        });
    },
    abortRequest: function(promise) {
        if (promise && promise.state() === "pending") {
            promise.reject();
        }
    },
    _createIdString: function(id) {
        return (id === null ? "" : id);
    }
};/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Pages = {
    current: function() {
        return $(".swc-page-current").attr("id");
    },
    navigateToPage: function(toPage) {
        $(".swc-page-current").removeClass('swc-page-current');
        $(toPage).addClass('swc-page-current');
    },
    navigateToMap: function() {
        Pages.navigateToPage("#map-page");
        location.href = "#map";
        Pages.toggleLegend(false);
    },
    navigateToChart: function() {
        Pages.navigateToPage("#chart-page");
        location.href = "#chart";
        Pages.togglePhenomenon(false);
    },
    toggleLegend: function(active) {
        if (active) {
            $('.legend').toggleClass('active');
            if ($('.legend').hasClass('active')) {
                $('[data-toggle="legend"]').text("X");
            } else {
                $('[data-toggle="legend"]').text(_('main.legend'));
            }
        } else {
            $('.legend').removeClass('active');
            $('[data-toggle="legend"]').text(_('main.legend'));
        }
    },
    togglePhenomenon: function(active, label) {
        var name = !label ? _('main.allPhenomena') : label;
        if (active) {
            $('.phenomena').toggleClass('active');
            if ($('.phenomena').hasClass('active')) {
                $('[data-toggle="phenomena"]').text("X");
            } else {
                $('[data-toggle="phenomena"]').text(name);
            }
        } else {
            $('.phenomena').removeClass('active');
            $('[data-toggle="phenomena"]').text(name);
        }
    },
    activateNavButtonsHandler: function() {
        $('[data-target="#map"]').click(function() {
            Pages.navigateToMap();
        });
        $('[data-target="#chart"]').click(function() {
            Pages.navigateToChart();
        });
    },
    activateToggleButtonsHandler: function() {
        $('[data-toggle=legend]').click(function() {
            Pages.toggleLegend(true);
        });
        $('[data-toggle=phenomena]').click(function() {
            var label = $('.phenomena-entry').find('.selected').text();
            Pages.togglePhenomenon(true, label);
        });
    },
    init: function() {
        $(document).ready($.proxy(function() {
            this.activateNavButtonsHandler();
            this.activateToggleButtonsHandler();
        }, this));
        // navigation
        Pages.routeToPage();
    },
    routeToPage: function() {
        var hash = window.location.hash;
        if (hash.indexOf('?') != -1) {
            hash = hash.substring(hash.indexOf('#'), hash.indexOf('?'));
        }

        Pages._routeToPage(hash);
    },
    _routeToPage: function(hash) {
        switch (hash) {
            case "#map":
                Pages.navigateToPage("#map-page");
                break;
            case "#chart":
                Pages.navigateToPage("#chart-page");
                break;
            default:
                if (Status.hasTimeseries()) {
                    $('.swc-main div.swc-page:first').addClass('swc-page-current');
                } else {
                    Pages.navigateToMap();
                }
                break;
        }
    }
};
/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Modal = {
    show: function(template, data) {
        $('#modalWindow').html(Template.createHtml(template, data));
        $('#modalWindow').modal('show');
    },
    hide: function() {
        $('#modalWindow').modal('hide');
    },
    append: function(template, data) {
        $('.modal-body').append(Template.createHtml(template, data));
    }
};
/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var EventManager = {
    subscribe: function(event, fn) {
        DEBUG && console.log("Subscribe " + event);
        $(this).bind(event, fn);
    },
    unsubscribe: function(event, fn) {
        DEBUG && console.log("Unsubscribe " + event);
        $(this).unbind(event, fn);
    },
    publish: function(event, data) {
        DEBUG && console.log("Publish " + event);
        $(this).trigger(event, data);
    }
};/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Status = (function() {
    var status = {
        createDefaultValues: function() {
            this.defaultValues = {
                'provider': Settings.defaultProvider,
                'clusterStations': Settings.clusterStations,
                'generalizeData': Settings.generalizeData,
                'timeseries': {},
                'timespan': Time.isoTimespan(),
                'saveStatus': Settings.saveStatus,
                'concentrationMarker': Settings.concentrationMarker
            };
        },
        init: function() {
            this.createDefaultValues();
            this.key = Storage.generateKey('settings');
            this.load();
            if (!this.get('saveStatus')) {
                this.reset();
            }
        },
        load: function() {
            var load = Storage.load(this.key);
            if (load) {
                this.current = load;
            } else {
                this.current = this.defaultValues;
                this.save();
            }
        },
        save: function() {
            Storage.saveObject(this.key, this.current);
        },
        reset: function() {
            this.current = this.defaultValues;
            this.save();
            EventManager.publish("resetStatus");
        },
        set: function(key, value) {
            this.current[key] = value;
            this.save();
        },
        get: function(key) {
            if (!this.current[key]) {
                return this.defaultValues[key];
            }
            return this.current[key];
        },
        addTimeseries: function(ts) {
            this.current.timeseries[ts.getInternalId()] = ts.persist();
            this.save();
        },
        addTimeseriesById: function(id) {
            var ids = id.split("__");
            var apiUrl = null;
            $.each(Settings.restApiUrls, function(url, id) {
                if (id == ids[1]) {
                    apiUrl = url;
                    return;
                }
            });
            if (apiUrl) {
                this.current.timeseries[id] = {
                    apiUrl: apiUrl,
                    tsId: ids[0]
                };
                this.save();
            }
        },
        clearTimeseries: function() {
            this.current.timeseries = {};
            this.save();
        },
        removeTimeseries: function(ts) {
            delete this.current.timeseries[ts.getInternalId()];
            this.save();
        },
        hasTimeseriesWithId: function(id) {
            return !!this.current.timeseries[id];
        },
        getTimeseriesWithId: function(id) {
            return this.current.timeseries[id];
        },
        getTimeseries: function() {
            return this.current.timeseries;
        },
        hasTimeseries: function() {
            return $.isEmptyObject(this.current.timeseries) ? false : true;
        }
    };
    return status;
})();/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Button = {
    switchToggleButton: function(target) {
        var button = $(target);
        button.toggleClass('btn-primary');
        if (!button.hasClass('btn-primary')) {
            return false;
        } else {
            return true;
        }
    },
    setToggleButton: function(target, value) {
        var button = $(target);
        if (value) {
            button.addClass('btn-primary');
        } else {
            button.removeClass('btn-primary');
        }
    },
    setLoadingButton: function(button, loading) {
        var icon = button.find('span');
        if (loading) {
            icon.hide();
            button.append('<span class="glyphicon glyphicon-refresh icon-spin"></span>');
        } else {
            icon.show();
            button.find('.glyphicon.glyphicon-refresh').remove();
        }
    },
    setNewIcon: function(button, className) {
        button.find('span').hide();
        button.append('<span class="glyphicon ' + className + '"></span>');
    },
    removeNewIcon: function(button, className) {
        button.find('span.' + className).remove();
        button.find('span').show();
    }
};
/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* fix to support windows phone 8 */
if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
    var msViewportStyle = document.createElement('style');
    msViewportStyle.appendChild(document
            .createTextNode('@-ms-viewport{width:auto!important}'));
    document.querySelector('head').appendChild(msViewportStyle);
}
/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var tsHelper = {
    createInternalId: function(tsId, apiUrl) {
        return tsId + "__" + Settings.restApiUrls[apiUrl];
    },
    createDataOfResult: function(result, tsId) {
        // kvp format of the timeseries-api
        if (result[tsId] && result[tsId].values) {
            return this._createValues(result[tsId].values);
        }
        // highchart format of the timeseries-api
        var values = [];
        if (result instanceof Array) {
            var that = this;
            $.each(result, function(idx, elem) {
                if (elem.name == tsId) {
                    values = that._createValues(elem.data);
                }
            });
        }
        return values;
    },
    createRefDataOfResult: function(result, id) {
        var refs = {};
        var that = this;
        // kvp format of the timeseries-api
        if (result[id] && result[id].extra && result[id].extra.referenceValues) {
            $.each(result[id].extra.referenceValues, function(id, elem) {
                refs[id] = that._createValues(elem.values);
            });
        }
        // flot format of the timeseries-api
        if (result[id] && result[id].referenceValues) {
            $.each(result[id].referenceValues, function(id, values) {
                refs[id] = that._createValues(values);
            });
        }
        // highchart format of the timeseries-api
        if (result instanceof Array){
            $.each(result, function(idx, elem) {
                if (elem.name.indexOf('ref_') == 0) {
                    refs[elem.name] = that._createValues(elem.data);
                }
            });
        }
        return refs;
    },
    _createValues: function(array) {
        var values = [];
        if (array[0] instanceof Array) {
            return array;
        } else {
            $.each(array, function(index, elem) {
                values.push([elem.timestamp, elem.value]);
            });
        }
        return values;
    }
};/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var StartController = {
    init: function(settings) {
        jQuery.support.cors = true;
        this.loadMainPage();
        // merge settings
        $.extend(Settings, settings);
        NotifyController.init();
        Status.init();
        // Call all controller
        PermalinkController.init();
        Pages.init();
        Map.init();
        ListSelectionController.init();
        LegendController.init();
        TableController.init();
        TimeController.init();
        ChartController.init();
        TimeSeriesController.init();
        GuidedTourController.init();
        ExportController.init();
        StyleChangeController.init();
        FavoriteController.init();
        SettingsController.init();
    },
    loadMainPage: function(){
        var main = Template.createHtml("main");
        $('.jsc-main').append(main);
    }
};/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var PermalinkController = {
    timespanParam: 'span',
    timeseriesParam: 'ts',
    servicesParam: 'services',
    featuresParam: 'features',
    offeringsParam: 'offerings',
    proceduresParam: 'procedures',
    phenomenaParam: 'phenomena',
    init: function() {
        this.checkTimespan();
        this.checkTimeseries();
        this.checkConstellation();
    },
    evaluateParameter: function(parameterName, evaluateParameter) {
        var value = this.getParameter(parameterName);
        if (!$.isEmptyObject(value)) {
            evaluateParameter(value);
        }
    },
    getParameter: function(parameterName) {
        var value = Permalink.getUrlParameter(parameterName);
        return value;
    },
    checkTimespan: function() {
        var setTimespan =  function(timespan) {
            Status.set('timespan', Time.createTimespan(timespan));
        };
        this.evaluateParameter('timespan', setTimespan); // for backward compatibility
        this.evaluateParameter(this.timespanParam, setTimespan);
    },
    checkTimeseries: function() {
        var addTimeseries = function(timeseries) {
            Status.clearTimeseries();
            $.each(timeseries.split(','), function(idx, id) {
                Status.addTimeseriesById(id);
            });
        }
        this.evaluateParameter('timeseries', addTimeseries); // for backward compatibility
        this.evaluateParameter(this.timeseriesParam, addTimeseries);
    },
    checkConstellation: function() {
        var constellations = this.createConstellationParameterArray();
        if (constellations.length > 0) {
            Pages.navigateToChart();
            Status.clearTimeseries();
            var requestLength = 0;
            var foundTimeseriesId;
            var foundService;
            $.each(Settings.restApiUrls, function(url, serviceId) {
                $.each(constellations, function(idx, constellation) {
                    requestLength++;
                    Rest.search(url, constellation.join(',')).done($.proxy(function(result) {
                        if (result.length > 0) {
                            var timeseries = $.grep(result, function(n, i) {
                                return n.type === "timeseries" ? true : false;
                            });
                            if (!$.isEmptyObject(timeseries[0])) {
                                foundTimeseriesId = timeseries[0].id;
                                foundService = url;
                                TimeSeriesController.addTSbyId(foundTimeseriesId, foundService);
                            }
                        }
                        requestLength--;
                        if (requestLength === 0) {
                            if ($.isEmptyObject(foundTimeseriesId)) {
                                Inform.warn(_('permalink.noMatchingTimeseriesFound'));
                            }
                        }
                    }, this));
                });
            });
        }
    },
    createConstellationParameterArray: function() {
        var constellations = [];
        var services = this.getParameterArray(this.servicesParam);
        var features = this.getParameterArray(this.featuresParam);
        var offerings = this.getParameterArray(this.offeringsParam);
        var procedures = this.getParameterArray(this.proceduresParam);
        var phenomena = this.getParameterArray(this.phenomenaParam);
        if (services && features && offerings && procedures && phenomena) {
            if ((services.length == features.length) &&
                    (services.length == offerings.length) &&
                    (services.length == procedures.length) &&
                    (services.length == phenomena.length)) {
                for (i = 0; i < services.length; i++) {
                    var constellation = [];
                    constellation.push(services[i]);
                    constellation.push(features[i]);
                    constellation.push(offerings[i]);
                    constellation.push(procedures[i]);
                    constellation.push(phenomena[i]);
                    constellations.push(constellation);
                }
            } else {
                Inform.warn(_('permalink.wrongCombinationSize'));
            }
        }
        return constellations;
    },
    getParameterArray: function(param) {
        var array = this.getParameter(param)
        if (!$.isEmptyObject(array)) {
            return array.split(',');
        }
    },
    createTimespanParam: function() {
        var timespan = TimeController.currentTimespan;
        return this.timespanParam + "=" + Time.getRequestTimespan(timespan.from, timespan.till);
    },
    createTimeseriesParam: function() {
        var tsList = $.map(TimeSeriesController.getTimeseriesCollection(), function(ts, id) {
            return id;
        });
        if (tsList.length > 0) {
            var timeseries = tsList.join(",");
            return this.timeseriesParam + "=" + timeseries;
        }
        return "";
    },
    createPermalink: function() {
        var loc = window.location;
        if (!loc.origin) {
            loc.origin = loc.protocol + "//" + loc.hostname
                    + (loc.port ? ':' + loc.port : '');
        }
        var url = loc.origin + loc.pathname + "?";
        url = url + this.createTimeseriesParam();
        url = url + "&" + this.createTimespanParam();
        return url;
    }
};/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var SettingsController = {
    init: function() {
        $(document).ready(function() {
            $('[data-target="#settings"]').click(function() {
                Modal.show('settings');
                createLanguageChooser();
                if (Settings.saveStatusPossible) {
                    // reset status
                    $('.resetStatus').on('click', function() {
                        Status.reset();
                    });
                    // save status
                    Button.setToggleButton('.saveStatus', Status.get('saveStatus'));
                    $('.saveStatus').on('click', function(e) {
                        var save = Button.switchToggleButton(e.currentTarget);
                        Status.set('saveStatus', save);
                    });
                } else {
                    $('.resetStatus').remove();
                    $('.saveStatus').remove();
                }
                // cluster station option
                Button.setToggleButton('.clusteringStations', Status.get('clusterStations'));
                $('.clusteringStations').on('click', function(e) {
                    var clustering = Button.switchToggleButton(e.currentTarget);
                    Status.set('clusterStations', clustering);
                    EventManager.publish('clusterStations', clustering);
                });
                // generalize data
                Button.setToggleButton('.generalizeData', Status.get('generalizeData'));
                $('.generalizeData').on('click', function(e) {
                    var generalize = Button.switchToggleButton(e.currentTarget);
                    Status.set('generalizeData', generalize);
                    EventManager.publish('timeseries:update:complete');
                });
                // show concentration marker
                Button.setToggleButton('.concentrationMarker', Status.get('concentrationMarker'));
                $('.concentrationMarker').on('click', function(e) {
                    var concentMarker = Button.switchToggleButton(e.currentTarget);
                    Status.set('concentrationMarker', concentMarker);
                });
                // permalink
                $('.permalink .link').on('click', function() {
                    window.open(PermalinkController.createPermalink(), '_blank');
                }).show();
                $('.permalink .mail').on('click', function() {
                    window.location.href = "mailto:?body=" + encodeURIComponent(PermalinkController.createPermalink());
                }).show();
                $('.permalink .clipboard').on('click', function() {
                    window.prompt(_('settings.permalink.clipboardInfo'), PermalinkController.createPermalink());
                }).show();
                $('.permalink .qr').on('click', function() {
                    var img = qr.image({
                        value: PermalinkController.createPermalink(),
                        size: 5
                    });
                    $('.qr-code').find('img').remove();
                    $('.qr-code').append($(img));
                }).show();
                // imprint
                EventManager.publish('settings:opened');
            });
        });
    }

};/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var TimeSeriesController = {
    timeseries: {},
    init: function() {
        EventManager.subscribe("resetStatus", $.proxy(this.removeAllTS, this));
        EventManager.subscribe("timeextent:change", $.proxy(this.changeTimeExtent, this));
        this.loadSavedTimeseries();
    },
    loadSavedTimeseries: function() {
        $.each(Status.getTimeseries(), $.proxy(function(internalId, elem) {
            var promise = Rest.timeseries(elem.tsId, elem.apiUrl);
            var that = this;
            promise.done(function(ts) {
                if (elem.style) {
                    var style = ts.getStyle();
                    style.setColor(elem.style.color);
                    style.setChartType(elem.style.chartType);
                    style.setIntervalByHours(elem.style.interval);
                }
                that.addTS(ts);
            });
        }, this));
    },
    addTSbyId: function(tsId, apiUrl) {
        var promise = Rest.timeseries(tsId, apiUrl);
        var that = this;
        promise.done(function(ts) {
            that.addTS(ts);
        });
    },
    /*----- add timeseries -----*/
    addTS: function(ts) {
        Status.addTimeseries(ts);
        EventManager.publish("timeseries:add", [ts]);
        this.timeseries[ts.getInternalId()] = ts;
        // request data
        var from = TimeController.currentTimespan.from;
        var till = TimeController.currentTimespan.till;
        this.loadTsData(ts, {
            from: from,
            till: till
        });
    },
    loadTsData: function(ts, timespan) {
        EventManager.publish("timeseries:data:load", [ts]);
        ts.fetchData(timespan, $.proxy(this.finishedGetData, this)).fail($.proxy(function(id) {
            this.removeTS(this.timeseries[id]);
            this.checkSyncedStatus();
        }, this));
    },
    finishedGetData: function(ts) {
        EventManager.publish("timeseries:data:loadfinished", [ts]);
        this.checkSyncedStatus();
    },
    checkSyncedStatus: function() {
        var syncedComplete = true;
        $.each(this.timeseries, function(index, elem) {
            if (!elem.isSynced()) {
                syncedComplete = false;
                return;
            }
        });
        if (syncedComplete) {
            EventManager.publish("timeseries:synced", [this.timeseries]);
        }
    },
    /*----- update timeextent -----*/
    changeTimeExtent: function(event, timeExtent) {
        this.unsyncTimeseries();
        $.each(this.timeseries, $.proxy(function(index, elem) {
            this.loadTsData(elem, timeExtent);
        }, this));
    },
    unsyncTimeseries: function() {
        $.each(this.timeseries, function(index, elem) {
            elem.unSynced();
        });
    },
    /*----- remove timeseries -----*/
    removeTS: function(ts) {
        ts.destroy();
        Status.removeTimeseries(ts);
        delete this.timeseries[ts.getInternalId()];
        EventManager.publish("timeseries:remove", [ts]);
    },
    /*----- remove all timeseries -----*/
    removeAllTS: function() {
        this.timeseries = {};
        EventManager.publish("timeseries:removeAll");
    },
    getTimeseriesCollection: function() {
        return this.timeseries;
    },
    getMaxTimeExtent: function() {
        var earliestStart;
        var latestEnd;
        $.each(this.timeseries, $.proxy(function(index,elem) {
            if (elem.getFirstValue() || elem.getLastValue()) {
                var start = moment(elem.getFirstValue().timestamp);
                var end = moment(elem.getLastValue().timestamp);
                if ( !earliestStart || start.isAfter(earliestStart)) {
                    earliestStart = start;
                }
                if ( !latestEnd || end.isBefore(latestEnd)) {
                    latestEnd = end;
                }
            }
        }));
        return {
            from : earliestStart,
            till: latestEnd
        };
    }
};/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var TimeController = {
    currentTimespan: {},
    timeRangeData: Settings.timeRangeData,
    init: function() {
        // get last save timespan
        this.currentTimespan = Status.get('timespan');
        this.updateTimeExtent();
        $(document).ready(function() {
            $('[data-action=before]').click($.proxy(function() {
                TimeController.prevPeriode();
            }, this));
            $('[data-action=after]').click($.proxy(function() {
                TimeController.nextPeriode();
            }, this));
            $('[data-action=timeextent]').click($.proxy(function() {
                Modal.show("time-range-settings", TimeController.timeRangeData);
                var from = moment(TimeController.currentTimespan.from);
                var till = moment(TimeController.currentTimespan.till);
                $('#startPicker').text(from.format(Settings.dateformat));
                $('#endPicker').text(till.format(Settings.dateformat));
                $('#startPicker').data('date', from.format("YYYY-MM-DD"));
                $('#endPicker').data('date', till.format("YYYY-MM-DD"));
                $('#alertTimeExtent').hide();

                $('#startPicker').datepicker({position: 'above'}).on('changeDate', TimeController.evaluateDate);
                $('#endPicker').datepicker({position: 'above'}).on('changeDate', TimeController.evaluateDate);

                $('#confirmTimeExtent').click(function(event) {
                    var from = moment($('#startPicker').data('date')).startOf('day');
                    var till = moment($('#endPicker').data('date')).endOf('day');
                    TimeController.currentTimespan = {
                        from: from,
                        till: till,
                        mode: "range"
                    };
                    TimeController.updateTimeExtent();
                });

                $('.preset-btn').click(function(event) {
                    var btn = $(event.currentTarget);
                    TimeController.setPreset(btn.data('preset-value'));
                });

            }, this));
        });
        this.setLabel();
        EventManager.subscribe("timeseries:data:load", $.proxy(this.disableButtons, this));
        EventManager.subscribe("timeseries:synced", $.proxy(this.enableButtons, this));
        EventManager.subscribe("time:start:change", $.proxy(this.startChanged, this));
        EventManager.subscribe("time:end:change", $.proxy(this.endChanged, this));
        EventManager.subscribe("timeseries:update:complete", $.proxy(this.updateTimeExtent, this));
    },
    startChanged: function(event, start) {
        var diff = this.getCurrentDiff();
        this.currentTimespan.from = moment(start).startOf('day');
        this.currentTimespan.till = moment(start).add(diff).add('s', 1).startOf('day').subtract('ms', 1);
        this.updateTimeExtent();
    },
    endChanged: function(event, end) {
        var diff = this.getCurrentDiff();
        this.currentTimespan.from = moment(end).subtract(diff).endOf('day').add('ms', 1);
        this.currentTimespan.till = moment(end).endOf('day');
        this.updateTimeExtent();
    },
    getCurrentDiff: function() {
        var from = moment(this.currentTimespan.from);
        var till = moment(this.currentTimespan.till);
        return till.diff(from);
    },
    getCurrentStartAsMillis: function() {
        return moment(this.currentTimespan.from).unix() * 1000;
    },
    getCurrentEndAsMillis: function() {
        return moment(this.currentTimespan.till).unix() * 1000;
    },
    updateTimeExtent: function() {
        var maxExtent = TimeSeriesController.getMaxTimeExtent();

        var insideDataInterval = true;
        if (maxExtent.from && maxExtent.till) {
            var earliestStart = moment(maxExtent.from);
            var latestEnd = moment(maxExtent.till);
            var beforeEaliestStart = this.currentTimespan.till.isBefore(earliestStart);
            var afterLatestEnd = this.currentTimespan.from.isAfter(latestEnd);
            insideDataInterval = !(beforeEaliestStart || afterLatestEnd);
        }

        if ( !insideDataInterval) {
            // reset current timespan
            NotifyController.notify(_('chart.outsideOfDataRange'));
            this.currentTimespan = Status.get('timespan');
        }
        EventManager.publish("timeextent:change", {
            from: this.currentTimespan.from,
            till: this.currentTimespan.till
        });
        Status.set('timespan', this.currentTimespan);
        this.setLabel();
    },
    disableButtons: function() {
        $('[data-action="before"]').addClass('disabled');
        $('[data-action="after"]').addClass('disabled');
        $('[data-action="timeextent"]').addClass('disabled');
    },
    enableButtons: function() {
        $('[data-action="before"]').removeClass('disabled');
        $('[data-action="after"]').removeClass('disabled');
        $('[data-action="timeextent"]').removeClass('disabled');
    },
    setLabel: function() {
        var label = moment(this.currentTimespan.from).format(Settings.shortDateformat) + " - " + moment(this.currentTimespan.till).format(Settings.shortDateformat);
        $('[data-action=timeextent]').text(label);
    },
    prevPeriode: function() {
        this.getNearbyPeriode('subtract');
        this.updateTimeExtent();
    },
    nextPeriode: function() {
        this.getNearbyPeriode('add');
        this.updateTimeExtent();
    },
    setPreset: function(name) {
        var interval;
        $.each(this.timeRangeData.presets, function(idx,elem) {
            if (elem.name === name) {
                interval = this.interval;
                return false;
            }
        });
        this.currentTimespan = Time.isoTimespan(interval);
        this.updateTimeExtent();
        Modal.hide();
    },
    setFlexibleTimeExtent: function(from, till) {
        this.currentTimespan = {
            'from': from,
            'till': till,
            'mode': 'range'
        };
        this.updateTimeExtent();
    },
    evaluateDate: function(ev) {
        if (ev.viewMode == "days") {
            var id = "#" + ev.currentTarget.id;
            if (moment($('#startPicker').data('date')).isAfter($('#endPicker').data('date'))) {
                $('#alertTimeExtent').show();
                $('#confirmTimeExtent').addClass('disabled');
                $('#alertTimeExtent').text(_('timeSelection.warning.startBeforeEnd'));
            } else if (Math.abs(moment($('#startPicker').data('date')).diff($('#endPicker').data('date'), 'years', true)) > 1) {
                $('#alertTimeExtent').show();
                $('#confirmTimeExtent').addClass('disabled');
                $('#alertTimeExtent').text(_('timeSelection.warning.maxTimeRange'));
            } else {
                $('#alertTimeExtent').hide();
                $('#confirmTimeExtent').removeClass('disabled');
                startDate = new Date(ev.date);
            }
            $(id).text(moment($(id).data('date')).format(Settings.dateformat));
            $(id).datepicker('hide');
        }
    },
    getNearbyPeriode: function(method) {
        var mode = this.currentTimespan.mode;
        var from = moment(this.currentTimespan.from);
        var till = moment(this.currentTimespan.till);

        var newFrom, newTill;

        switch (mode) {
            case 'range':
                var diff = till.diff(from);
                newFrom = from[method](diff);
                newTill = till[method](diff);
                break;
            case 'day':
                newFrom = from[method]('days', 1).startOf('day');
                newTill = till[method]('days', 1).endOf('day');
                break;
            case 'month':
                newFrom = from[method]('months', 1).startOf('month');
                newTill = till[method]('months', 1).endOf('month');
                break;
            case 'week':
                newFrom = from[method]('weeks', 1).startOf('week');
                newTill = till[method]('weeks', 1).endOf('week');
                break;
            case 'year':
                newFrom = from[method]('years', 1).startOf('year');
                newTill = till[method]('years', 1).endOf('year');
                break;
            default:
                newFrom = from;
                newTill = till;
                break;
        }
        this.currentTimespan = {
            'from': newFrom,
            'till': newTill,
            'mode': mode
        };
    }
};
/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Map = {
    defaultTileLayerUrl: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    defaultTileLayerOptions: {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    },
    timeseriesCache: [],
    init: function() {
        this.tileLayerUrl = Settings.tileLayerUrl || this.defaultTileLayerUrl;
        this.tileLayerOptions = Settings.tileLayerOptions || this.defaultTileLayerOptions;
        $(document).ready(function() {
            $('[data-action="provider"]').click(function() {
                Map.openProviderList();
            });
            $('[data-action="locate"]').click(function() {
                Map.locateUser();
            });
        });
        this.createMap();
        this.loadStations();
        EventManager.subscribe("resetStatus", $.proxy(this.loadStations, this));
        EventManager.subscribe("clusterStations", $.proxy(this.loadStations, this));
        EventManager.subscribe("timeseries:showInMap", $.proxy(this.showTsInMap, this));
    },
    createMap: function() {
        if ($("#map").length > 0) {
            this.map = L.map('map');
            L.tileLayer(this.tileLayerUrl, this.tileLayerOptions).addTo(this.map);
            var overlayMaps = {};
            $.each(Settings.wmsLayer, $.proxy(function(idx, layer) {
                try {
                    var wms = L.tileLayer.wms(layer.url, layer.options).addTo(this.map);
                    overlayMaps[layer.name] = wms;
                } catch (e) {
                    console.error('Could not add wms.');
                };
            }, this));
            if (!$.isEmptyObject(overlayMaps)) {
                L.control.layers(null, overlayMaps, {
                    position: 'topleft'
                }).addTo(this.map);
            }
            L.Icon.Default.imagePath = 'images';
            this.map.whenReady(function(map) {
                // locate user methods
                this.map.on('locationfound', this.onLocationFound);
                this.map.on('locationerror', this.onLocationError);
            }, this);

            L.control.scale().addTo(this.map);
            if (Settings.enableGeoSearch) {
                new L.Control.GeoSearch({
                    url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
                    jsonpParam: 'json_callback',
                    propertyName: 'display_name',
                    searchLabel: _('map.search.label'),
                    notFoundMessage: _('map.search.noResult'),
                    propertyLoc: ['lat', 'lon'],
                    position: 'topcenter',
                    minLength: 2,
                    showMarker: false,
                    provider: new L.GeoSearch.Provider.OpenStreetMap(),
                    zoomLevel: 13
                }).addTo(this.map);
            }
            this.map.fitBounds([
            [-80, -170],
            [80, 170]]);
        }
    },
    /*----- stations -----*/
    loadStations: function() {
        this.loading(true);
        var provider = Status.get('provider');
        Rest.stations(null, provider.apiUrl, {
            service: provider.serviceID
        }).done($.proxy(function(result) {
            this.createStationMarker(result, Status.get('clusterStations'));
            this.loading(false);
        }, this));
        Rest.phenomena(null, provider.apiUrl, {
            service: provider.serviceID
        }).done($.proxy(this.fillPhenomenaList, this));
    },
    createStationMarker: function(results, clustering) {
        if (!this.map) {
            this.createMap();
        }
        if (this.stationMarkers) {
            this.map.removeLayer(this.stationMarkers);
        }
        if (results.length > 0) {
            var firstElemCoord = results[0].geometry.coordinates;
            var topmost = firstElemCoord[1];
            var bottommost = firstElemCoord[1];
            var leftmost = firstElemCoord[0];
            var rightmost = firstElemCoord[0];
            this.stationMarkers = clustering ? new L.MarkerClusterGroup() : new L.LayerGroup();
            that = this;
            $.each(results, $.proxy(function(n, elem) {
                var geom = elem.geometry.coordinates;
                if (!isNaN(geom[0]) || !isNaN(geom[1])) {
                    if (geom[0] > rightmost) {
                        rightmost = geom[0];
                    }
                    if (geom[0] < leftmost) {
                        leftmost = geom[0];
                    }
                    if (geom[1] > topmost) {
                        topmost = geom[1];
                    }
                    if (geom[1] < bottommost) {
                        bottommost = geom[1];
                    }
                    var marker = new L.Marker([geom[1], geom[0]], {
                        id: elem.properties.id
                    });
                    marker.on('click', $.proxy(that.markerClicked, that));
                    this.stationMarkers.addLayer(marker);
                }
            }, this));
            this.map.addLayer(this.stationMarkers);
            this.map.fitBounds([
                [parseFloat(bottommost), parseFloat(leftmost)],
                [parseFloat(topmost), parseFloat(rightmost)]]);
        }
    },
    createColoredMarkers: function(results) {
        if (this.stationMarkers) {
            this.map.removeLayer(this.stationMarkers);
        }
        if (results.length > 0) {
            var firstElemCoord = results[0].getCoordinates();
            var topmost = firstElemCoord[1];
            var bottommost = firstElemCoord[1];
            var leftmost = firstElemCoord[0];
            var rightmost = firstElemCoord[0];
            this.stationMarkers = new L.LayerGroup();
            that = this;
            $.each(results, $.proxy(function(n, elem) {
                var geom = elem.getCoordinates();
                if (!isNaN(geom[0]) || !isNaN(geom[1])) {
                    if (geom[0] > rightmost) {
                        rightmost = geom[0];
                    }
                    if (geom[0] < leftmost) {
                        leftmost = geom[0];
                    }
                    if (geom[1] > topmost) {
                        topmost = geom[1];
                    }
                    if (geom[1] < bottommost) {
                        bottommost = geom[1];
                    }
                    var marker;
                    if (elem.isCurrent()) {
                        var interval = this.getMatchingInterval(elem);
                        var fillcolor = interval && interval.color ? interval.color : Settings.defaultMarkerColor;
                        marker = new L.circleMarker([geom[1], geom[0]], {
                            id: elem.getStationId(),
                            fillColor: fillcolor,
                            color: "#000",
                            opacity: 1,
                            weight: 2,
                            fillOpacity: 0.8
                        });
                    } else {
                        marker = new L.Marker([geom[1], geom[0]], {
                            id: elem.getStationId()
                        });
                    }
                    marker.on('click', $.proxy(that.markerClicked, that));
                    this.stationMarkers.addLayer(marker);
                }
            }, this));
            this.map.addLayer(this.stationMarkers);
            this.map.fitBounds([
                [parseFloat(bottommost), parseFloat(leftmost)],
                [parseFloat(topmost), parseFloat(rightmost)]]);
        }
    },
    getMatchingInterval: function(elem) {
        var matchedInterval = null;
        if (elem.getLastValue() && elem.getStatusIntervals()) {
            var lastValue = elem.getLastValue().value;
            $.each(elem.getStatusIntervals(), function(idx, interval) {
                if (interval.upper == null) {
                    interval.upper = Number.MAX_VALUE;
                }
                if (interval.lower == null) {
                    interval.lower = Number.MIN_VALUE;
                }
                if (!isNaN(interval.upper) && !isNaN(interval.lower) && parseFloat(interval.lower) < lastValue && lastValue < parseFloat(interval.upper)) {
                    matchedInterval = interval;
                    return false;
                }
            });
        }
        return matchedInterval;
    },
    loading: function(loading) {
        Button.setLoadingButton($('[data-action="provider"]'), loading);
    },
    markerClicked: function(marker) {
        this.loading(true);
        var apiUrl = Status.get('provider').apiUrl;
        this.openStationWindow(marker.target.options.id, apiUrl);
    },
    openStationWindow: function(id, url) {
        Rest.stations(id, url).done($.proxy(function(results) {
            var phenomena = {};
            $.each(results.properties.timeseries, function(id, elem) {
                var phenomID = elem.phenomenon.id;
                if (Map.selectedPhenomenon == null || Map.selectedPhenomenon == phenomID) {
                    if (!phenomena.hasOwnProperty(phenomID)) {
                        phenomena[phenomID] = {};
                        phenomena[phenomID].timeseries = [];
                        phenomena[phenomID].label = elem.phenomenon.label;
                        phenomena[phenomID].category = elem.category && elem.category.label ? elem.category.label : "";
                    }
                    phenomena[phenomID].timeseries.push({
                        id: id,
                        internalId: tsHelper.createInternalId(id, url),
                        selected: Status.hasTimeseriesWithId(id),
                        procedure: elem.procedure.label,
                        category: elem.category && elem.category.label ? elem.category.label : ""
                    });
                }
            });
            this.loading(false);
            Modal.show("station", {
                "name": results.properties.label,
                "phenomena": $.map(phenomena, function(elem) {
                    return elem;
                })
            });
            $('#confirmTimeseriesSelection').on('click', function() {
                $.each($('.tsItem').has(':checked'), function(id, elem) {
                    Map.addTimeseries(Map.timeseriesCache[$(this).data('internalid')]);
                });
            });
            if ($('.tsItem').length > 1) {
                $('.selectAllOption').show();
                $('.selectAllOption .checkbox').on('click', function(event) {
                    var checked = $(event.currentTarget).find(':checkbox').is(':checked');
                    $.each($('.tsItem'), function(idx, elem) {
                        $(elem).find(':checkbox').prop('checked', checked);
                    });
                });
            } else {
                $('.tsItem').find(':checkbox').prop('checked', true);
            }
            $.each(phenomena, function(id, elem) {
                $.each(elem.timeseries, function(id, elem) {
                    if (Map.timeseriesCache[elem.internalId] == null) {
                        Rest.timeseries(elem.id, url).done(function(timeseries) {
                            Map.updateTsEntry(timeseries);
                        });
                    } else {
                        Map.updateTsEntry(Map.timeseriesCache[elem.internalId]);
                    }
                });
            });
            EventManager.publish("map:stationLoaded");
        }, this));
    },
    updateTsEntry: function(timeseries) {
        $('[data-id=' + timeseries.getTsId() + ']').addClass('loaded').find(':input').prop('disabled', false);
        var lastValue = timeseries.getLastValueFormatted();
        if (lastValue) {
            $('[data-id=' + timeseries.getTsId() + ']').find('.additionalInfo').text(lastValue).show();
        }
        Map.timeseriesCache[timeseries.getInternalId()] = timeseries;
    },
    addTimeseries: function(timeseries) {
        Pages.navigateToChart();
        Modal.hide();
        TimeSeriesController.addTS(timeseries);
    },
    /*----- stations -----*/
    fillPhenomenaList: function(results) {
        Pages.togglePhenomenon(false);
        $('.phenomena-entry').empty();
        this.createDefaultPhenomenaEntry();
        $.each(results, $.proxy(function(index, elem) {
            var html = this.createPhenomenaEntry(elem);
            $('.phenomena-entry').append(html);
            $('[data-id=' + elem.id + ']').click($.proxy(function(event) {
                $('.phenomena-entry').find('.selected').removeClass('selected');
                $('[data-id=' + elem.id + ']').find('.item').addClass('selected').addClass('loadPhen');
                this.selectedPhenomenon = elem.id;
                var coloredMarkers = Status.get('concentrationMarker');
                var provider = Status.get('provider');
                Rest.abortRequest(this.phenomenonPromise);
                if (coloredMarkers) {
                    this.phenomenonPromise = Rest.timeseries(null, provider.apiUrl, {
                        service: provider.serviceID,
                        phenomenon: elem.id,
                        expanded: true,
                        force_latest_values: true,
                        status_intervals: true
                    }).done($.proxy(function(result) {
                        $.each(result, function(idx, elem) {
                            Map.timeseriesCache[elem.getInternalId()] = elem;
                        });
                        Pages.togglePhenomenon(false, elem.label);
                        this.createColoredMarkers(result);
                    }, this)).always($.proxy(function() {
                        $('[data-id=' + elem.id + ']').find('.item').removeClass('loadPhen');
                    }));
                } else {
                    this.phenomenonPromise = Rest.stations(null, provider.apiUrl, {
                        service: provider.serviceID,
                        phenomenon: elem.id
                    }).done($.proxy(function(result) {
                        Pages.togglePhenomenon(false, elem.label);
                        this.createStationMarker(result, false);
                    }, this)).always($.proxy(function() {
                        $('[data-id=' + elem.id + ']').find('.item').removeClass('loadPhen');
                    }));
                }
            }, this));
        }, this));
    },
    createPhenomenaEntry: function(phenomenon) {
        this.selectedPhenomenon = null;
        var html = Template.createHtml("phenomenon-entry", {
            id: phenomenon.id,
            label: phenomenon.label
        });
        return html;
    },
    createDefaultPhenomenaEntry: function() {
        $('.phenomena-entry').append(this.createPhenomenaEntry({
            id: "all",
            label: _('main.allPhenomena')
        }));
        $('[data-id=all]').click($.proxy(function(event, bla) {
            $('.phenomena-entry').find('.selected').removeClass('selected');
            $('[data-id=all]').find('.item').addClass('selected');
            Pages.togglePhenomenon(false);
            Map.loadStations();
        }));
        $('[data-id=all]').append("<hr />");
        $('[data-id=all]').find('.item').addClass('selected');
    },
    /*----- provider list -----*/
    openProviderList: function() {
        this.loading(true);
        this.apiConnectCounter = Object.keys(Settings.restApiUrls).length;
        this.providerList = [];
        $.each(Settings.restApiUrls, $.proxy(function(url, elem) {
            Rest.services(url).done($.proxy(this.createProviderList, this, url));
        }, this));
    },
    createProviderList: function(apiUrl, results) {
        this.apiConnectCounter--;
        var currProv = Status.get('provider');
        $.each(results, $.proxy(function(idx, elem) {
            var blacklisted = false;
            $.each(Settings.providerBlackList, $.proxy(function(idx, black) {
                if (black.serviceID == elem.id && black.apiUrl == apiUrl) {
                    blacklisted = true;
                    return;
                }
            }, this));
            if (!blacklisted) {
                this.providerList.push({
                    "name": elem.label,
                    "version": elem.version,
                    "stations": elem.quantities.stations,
                    "timeseries": elem.quantities.timeseries,
                    "phenomena": elem.quantities.phenomena,
                    "url": elem.serviceUrl,
                    "apiUrl": apiUrl,
                    "id": elem.id,
                    "selected": currProv.serviceID == elem.id && currProv.apiUrl == apiUrl,
                    "type": elem.type
                });
            }
        }, this));
        if (this.apiConnectCounter === 0) {
            var data = {
                "providers": this.providerList
            };
            this.loading(false);
            Modal.show('providers', data);
            $('.providerItem').on('click', function() {
                var id = $(this).data('id');
                var apiUrl = $(this).data('api');
                Status.set('provider', {
                    serviceID: id,
                    apiUrl: apiUrl
                });
                Map.loadStations();
                Modal.hide();
            });
        }
    },
    /*----- locate user -----*/
    locateUser: function() {
        Button.setLoadingButton($('[data-action="locate"]'), true);
        this.map.locate({
            setView: true,
            maxZoom: Settings.zoom
        });
    },
    onLocationFound: function(e) {
        Button.setLoadingButton($('[data-action="locate"]'), false);
        var popup = L.popup().setLatLng(e.latlng).setContent('<p>' + _('map.userLocation') + '</p>');
        Map.map.openPopup(popup);
    },
    onLocationError: function(e) {
        Button.setLoadingButton($('[data-action="locate"]'), false);
        Inform.error(e.message);
    },
    showTsInMap: function(event, ts) {
        Pages.navigateToMap();
        var coords = ts.getCoordinates(), pos = L.latLng(coords[1], coords[0]);
        Map.map.setView(pos, Settings.zoom);
        var station = null;
        $.each(this.stationMarkers.getLayers(), function(idx, marker) {
            if (marker.options.id == ts.getStationId()) {
                station = marker;
            }
        });
        var popup = L.popup({
            autoPan: false
        });
        popup.setContent(Template.createHtml("station-popup", {
            station: ts.getStationLabel(),
            timeseries: ts.getLabel(),
            service: ts.getServiceLabel()
        }));
        if (station) {
            setTimeout(function() {
                station.bindPopup(popup).openPopup();
            }, 1000);
        } else {
            popup.setLatLng(pos);
            popup.openOn(Map.map);
        }
        popup.on('close', function() {
            if (station) {
                station.unbindPopup();
            }
        });
    }
};
/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var ListSelectionController = {
    category: {
        type: "category",
        heading: _('listSelection.headers.category'),
        call: Rest.categories
    },
    station: {
        type: "feature",
        heading: _('listSelection.headers.station'),
        call: Rest.features
    },
    phenomenon: {
        type: "phenomenon",
        heading: _('listSelection.headers.phenomenon'),
        call: Rest.phenomena
    },
    procedure: {
        type: "procedure",
        heading: _('listSelection.headers.procedure'),
        call: Rest.procedures
    },
    init: function() {
        this.entries = {
            category: [this.category, this.station, this.phenomenon, this.procedure],
            sensor: [this.procedure, this.station, this.category, this.phenomenon],
            station: [this.station, this.category, this.phenomenon, this.procedure],
            phenomenon: [this.phenomenon, this.category, this.station, this.procedure]
        };
        // show button to start list selection
        $('[data-action="listSelection"]').show();
        $('[data-action="listSelection"]').click(function() {
            ListSelectionController.open();
        });
    },
    open: function() {
        Modal.show("list-selection");
        $('a[data-toggle="tab"]').on('shown.bs.tab', $.proxy(function(e) {
            var tab = $(e.target).data('tab');
            var accordionId = $('#' + tab + ' .panel-group')[0].id;
            $('#' + tab + ' .panel-group').empty();
            // send request
            this.startRequest(tab, 0, {
                service: Status.get('provider').serviceID
            });
            // build html elements
            $.each(this.entries[tab], function(idx, elem) {
                elem.accordion = accordionId;
                elem.collapse = accordionId + elem.type;
                $('#' + tab + ' .panel-group').append(Template.createHtml("list-selection-skeleton", elem));
            });
        }, this));
        $('#selectionList a:first').tab('show');
    },
    startRequest: function(tab, index, data) {
        var entry = this.entries[tab][index];
        var apiUrl = Status.get('provider').apiUrl;
        if (entry) {
            var promise = entry.call(null, apiUrl, data);
            promise.done($.proxy(function(result) {
                $('#' + tab + ' #' + entry.collapse + ' .panel-body').empty();
                $.each(result, function(idx, e) {
                    var elem = e.id ? e : e.properties;
                    var html = Template.createHtml("list-selection-entry", {
                        id: elem.id,
                        label: elem.label
                    });
                    $('#' + tab + ' #' + entry.collapse + ' .panel-body').append(html);
                });
                // close other collapse
                $('#' + tab + ' .collapse.in').collapse('hide');
                // open collapse
                $('#' + tab + ' #' + entry.collapse + '.collapse').collapse('show');
                // onclick
                $('#' + tab + ' #' + entry.collapse + ' .panel-body div').on('click', $.proxy(function(e) {
                    var label = $.trim(e.target.innerHTML);
                    $('#' + tab + ' [href=#' + entry.collapse + ']').text(entry.heading + ' - ' + label);
                    $('#' + tab + ' #' + entry.collapse).collapse('hide');
                    data[entry.type] = e.target.dataset.id;
                    this.startRequest(tab, index + 1, data);
                }, this));
            }, this));
        } else {
            // load ts
            Rest.timeseries(null, apiUrl, data).done(function(result) {
                if (result.length == 1) {
                    TimeSeriesController.addTS(result[0]);
                    Modal.hide();
                    Pages.navigateToChart();
                } else {
                    Inform.warn(_('listSelection.warning.moreThanOneTimeseries'));
                }
            });
        }
    }
};/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var ChartController = {
    defaultOptions: {
        series: {
            lines: {
                show: true,
                fill: false
            },
//            points : {
//                show: true
//            },
            shadowSize: 1
        },
        selection: {
            mode: "xy"
        },
        xaxis: {
            mode: "time",
            timezone: "browser"
//            timeformat: "%Y/%m/%d",
                    //use these the following two lines to have small ticks at the bottom ob the diagram
//            tickLength: 5,
//            tickColor: "#000"
        },
        yaxis: {
            show: true,
            additionalWidth: 17,
            panRange: false
//			tickFormatter : function(val, axis) {
//				var factor = axis.tickDecimals ? Math.pow(10, axis.tickDecimals) : 1;
//				var formatted = "" + Math.round(val * factor) / factor;
//				return formatted + "<br>" + this.uom;
//			}
        },
        legend: {
            // show: false
        },
        pan: {
            interactive: true,
            frameRate: 10
        }
    },
    visible: true,
    data: [],
    init: function() {
        this.selectedLineWidth = Settings.selectedLineWidth;
        this.commonLineWidth = Settings.commonLineWidth;
        this.options = $.extend(this.defaultOptions, Settings.chartOptions);
        EventManager.subscribe("timeseries:data:load", $.proxy(this.loadDataForChart, this));
        EventManager.subscribe("timeseries:data:loadfinished", $.proxy(this.loadDataFinished, this));
        EventManager.subscribe("timeseries:synced", $.proxy(this.plotChart, this));
        EventManager.subscribe("timeseries:add:referenceValue", $.proxy(this.showReferenceValue, this));
        EventManager.subscribe("timeseries:remove:referenceValue", $.proxy(this.removeReferenceValue, this));
        EventManager.subscribe("timeseries:remove", $.proxy(this.removeTS, this));
        EventManager.subscribe("timeseries:removeAll", $.proxy(this.clearChart, this));
        EventManager.subscribe("timeseries:selected", $.proxy(this.selectTs, this));
        EventManager.subscribe("timeseries:unselectAll", $.proxy(this.unselectAll, this));
        EventManager.subscribe("timeseries:hide", $.proxy(this.hideData, this));
        EventManager.subscribe("timeseries:show", $.proxy(this.showData, this));
        EventManager.subscribe("navigation:open", $.proxy(this.hideChart, this));
        EventManager.subscribe("navigation:close", $.proxy(this.showChart, this));
        EventManager.subscribe("timeseries:changeStyle", $.proxy(this.changeStyle, this));
        EventManager.subscribe("timeseries:zeroScaled", $.proxy(this.zeroScaled, this));
        EventManager.subscribe("timeseries:groupedAxis", $.proxy(this.changeStyle, this));

        $(window).resize($.proxy(function() {
            var newRatio = $(document).width() / $(document).height();
            if (newRatio !== window.ratio) {
                window.ratio = newRatio;
                this.plotChart();
            }
        }, this));
        $('[data-action=selection]').hide();
        $('[data-action=selection]').on('click', $.proxy(function() {
            EventManager.publish("timeseries:unselectAll");
            this.renderChart();
            $('[data-action=selection]').hide();
        }, this));
        this.plotChart();

        $('#placeholder').bind('plotpanEnd', function(event, plot) {
            var xaxis = plot.getXAxes()[0];
            var from = moment(xaxis.min);
            var till = moment(xaxis.max);
            TimeController.setFlexibleTimeExtent(from, till);
        });
    },
    hideChart: function(event, view) {
        this.visible = false;
        $('#placeholder').hide();
    },
    showChart: function(event, view) {
        this.visible = true;
        $('#placeholder').show();
        this.plotChart();
    },
    hideData: function(event, id) {
        this.removeData(id);
        this.plotChart();
    },
    showData: function(event, id) {
        var ts = TimeSeriesController.getTimeseriesCollection()[id];
        this.loadDataFinished(null, ts);
        this.plotChart();
    },
    selectTs: function(event, id) {
        if (this.plot) {
            $.each(this.plot.getData(), function(idx, ts) {
                if (ts.id === id) {
                    ts.lines.lineWidth = ChartController.selectedLineWidth;
                    ts.bars.lineWidth = ChartController.selectedLineWidth;
                    ts.selected = true;
                    $.each($('.axisTarget'), function(idx, axis) {
                        if (ts.yaxis.n === $(axis).data('axis.n')) {
                            $(axis).toggleClass("selected");
                        }
                    });
                }
            });
            this.plot.draw();
            $.each(this.data, function(index, elem) {
                if (elem.id === id) {
                    elem.selected = true;
                }
            });
        }
    },
    unselectAll: function(event) {
        if (this.plot) {
            $.each(this.plot.getData(), function(index, elem) {
                elem.lines.lineWidth = ChartController.commonLineWidth;
                elem.bars.lineWidth = ChartController.commonLineWidth;
                elem.selected = false;
            });
            $.each(this.data, function(index, elem) {
                elem.selected = false;
            });
            $('.axisTarget').removeClass('selected');
            this.plot.draw();
        }
    },
    loadDataForChart: function(event, ts) {
        if (this.visible) {
            var label = ts.getLabel();
            var html = Template.createHtml("data-loading-entry", {
                id: ts.getInternalId(),
                color: ts.getStyle().getColor(),
                label: label
            });
            $('#loadingDiagram').append(html);
        }
    },
    zeroScaled: function(event, ts) {
        // update all timeseries
        $.each(TimeSeriesController.getTimeseriesCollection(), function(idx, elem) {
            if (ts.getUom() === elem.getUom()) {
                elem.setZeroScaled(ts.isZeroScaled());
            }
        });
        // update data of timeseries
        $.each(this.data, function(idx, elem) {
            if (elem.uom === ts.getUom()) {
                elem.zeroScaled = ts.isZeroScaled();
            }
        });
        this.changeStyle(null, ts);
    },
    changeStyle: function(event, ts) {
        this.loadDataFinished(null, ts);
        this.plotChart();
    },
    loadDataFinished: function(event, ts) {
        $('#loadingDiagram').find('[data-id=' + ts.getInternalId() + ']').remove();
        $.each(ts.getRefValues(), $.proxy(function(id, elem) {
            var refVal = this.dataAlreadyIn(elem.getId());
            if (refVal) {
                refVal.data = elem.getValues();
            }
        }, this));
        if (ts.hasData()) {
            var temp = this.dataAlreadyIn(ts.getInternalId());
            if (temp) {
                this.updateData(temp, ts);
            } else {
                this.data.push(this.createData(ts));
            }
        } else {
            this.removeData(ts.getInternalId());
        }
    },
    updateData: function(data, ts) {
        this.addStyleAndValues(data, ts);
    },
    createData: function(ts) {
        var data = {
            id: ts.getInternalId(),
            uom: ts.getUom(),
            phenomenon: ts.getPhenomenonLabel()
        };
        this.addStyleAndValues(data, ts);
        return data;
    },
    addStyleAndValues: function(data, ts) {
        var style = ts.getStyle();
        data.color = style.getColor();
        data.zeroScaled = ts.isZeroScaled();
        data.groupedAxis = ts.isGroupedAxis();
        data.stationLabel = ts.getStationLabel();
        if (style.isBarChart()) {
            data.bars = {
                show: true,
                barWidth: style.getIntervalByHours() * 60 * 60 * 1000
            };
            data.lines = {
                show: false
            };
            var sumvalues = [];
            var idx = 0;
            var values = ts.getValues();
            var entry = values[idx];
            while (entry) {
                var startInterval = entry[0];
                var endInterval = moment(entry[0]).add('hours', style.getIntervalByHours());
                var sum = 0;
                while (entry && moment(entry[0]).isBefore(endInterval)) {
                    idx++;
                    sum = sum + entry[1];
                    entry = values[idx];
                }
                sumvalues.push([startInterval, sum]);
            }
            data.data = sumvalues;
        } else {
            if (style.getLineType().indexOf("dotted") >= 0) {
                data.points = {
                    show: true,
                    fill: true,
                    fillColor: style.getColor(),
                    radius: style.getWidth()
                };
            }
            if (style.getLineType().indexOf("solid") >= 0) {
                data.lines = {
                    show: true,
                    lineWidth: style.getWidth()
                };
            } else {
                data.lines = {
                    show: false
                };
            }
            data.data = ts.getValues();
        }
    },
    removeTS: function(event, ts) {
        $('#loadingDiagram').find('[data-id=' + ts.getInternalId() + ']').remove();
        this.removeData(ts.getInternalId());
        // remove ref values
        $.each(ts.getRefValues(), $.proxy(function(index, elem) {
            this.removeData(elem.getId());
        }, this));
        this.plotChart();
    },
    showReferenceValue: function(event, data) {
        var ts = TimeSeriesController.getTimeseriesCollection()[data.tsId];
        var refVal = ts.getRefValuesForId(data.refId);
        this.data.push({
            data: refVal.getValues(),
            id: refVal.getId(),
            color: refVal.getColor(),
            uom: ts.getUom(),
            lines: {
                lineWidth: Settings.commonLineWidth
            }
        });
        this.plotChart();
    },
    removeReferenceValue: function(event, data) {
        this.removeData(data.refId);
        this.plotChart();
    },
    clearChart: function() {
        this.data = [];
        this.plotChart();
    },
    plotChart: function() {
        if (this.visible) {
            var placeholder = $('#placeholder');
            //placeholder.show();

            if (this.data.length === 0) {
                placeholder.empty();
                placeholder.append(Template.createHtml('chart-empty'));
                return;
            }
            this.updateXAxis();
            this.options.yaxes = this.createYAxis();

            this.plot = $.plot('#placeholder', this.data, this.options);
            placeholder.append("<div class='chart-annotation'>" + _('chart.annotation') +  "</div>");
            $.each(this.plot.getAxes(), $.proxy(function(i, axis) {
                if (!axis.show)
                    return;
                var box = axis.box;
                if (axis.direction === "y") {
                    $("<div class='axisTarget' style='position:absolute; left:" + box.left + "px; top:" + box.top + "px; width:" + box.width + "px; height:" + box.height + "px'></div>")
                        .data("axis.n", axis.n)
                        .appendTo(this.plot.getPlaceholder())
                        .click($.proxy(function(event) {
                            var target = $(event.currentTarget);
                            var selected = false;
                            $.each($('.axisTarget'), function(index, elem) {
                                elem = $(elem);
                                if (target.data('axis.n') === elem.data('axis.n')) {
                                    selected = elem.hasClass("selected");
                                    return false; // break loop
                                }
                            });
                            EventManager.publish("timeseries:unselectAll");
                            $.each(this.plot.getData(), function(index, elem) {
                                if (elem.yaxis.n === axis.n && !selected) {
                                    EventManager.publish("timeseries:selected", elem.id);
                                    target.addClass("selected");
                                    if ( !elem.groupedAxis) {
                                        return false; // break loop
                                    }
                                }
                            });
                            this.plot.draw();
                        }, this));


                    var yaxisLabel = $("<div class='axisLabel yaxisLabel' style=left:" + box.left + "px;></div>").text(axis.options.uom).appendTo('#placeholder');
                    $.each(axis.options.tsColors, function(idx, color) {
                        $('<span>').html('&nbsp;&#x25CF;').css('color', color).addClass('labelColorMarker').appendTo(yaxisLabel);
                    });
                    yaxisLabel.css("margin-left", -(yaxisLabel.width() - yaxisLabel.height()) / 2 - 3);
                }
            }, this));
            var drawNew = false;
            $.each(this.plot.getData(), function(index, elem) {
                if (elem.selected) {
                    elem.lines.lineWidth = ChartController.selectedLineWidth;
                    elem.bars.lineWidth = ChartController.selectedLineWidth;
                    drawNew = true;

                    $.each($('.axisTarget'), function() {
                        if ($(this).data('axis.n') === elem.yaxis.n) {
                            if (!$(this).hasClass('selected')) {
                                $(this).addClass('selected');
                                return false;
                            }
                        }
                    });
                }
            });
            if (drawNew) {
                this.plot.draw();
            }
        }
    },
    updateXAxis: function() {
        this.options.xaxis.min = TimeController.getCurrentStartAsMillis();
        this.options.xaxis.max = TimeController.getCurrentEndAsMillis();
    },
    createYAxis: function() {
        var axesList = {};
        $.each(this.data, function(index, elem) {
            if (elem.groupedAxis === undefined || elem.groupedAxis) {
                if (!axesList.hasOwnProperty(elem.uom)) {
                    axesList[elem.uom] = {
                        id: ++Object.keys(axesList).length,
                        uom: elem.uom,
                        tsColors: [elem.color],
                        zeroScaled: elem.zeroScaled
                    };
                    elem.yaxis = axesList[elem.uom].id;
                } else {
                    axesList[elem.uom].tsColors.push(elem.color);
                    elem.yaxis = axesList[elem.uom].id;
                }
            } else {
                axesList[elem.id] = {
                    id: ++Object.keys(axesList).length,
                    uom: elem.uom + " @ " + elem.stationLabel,
                    tsColors: [elem.color],
                    zeroScaled: elem.zeroScaled
                };
                elem.yaxis = axesList[elem.id].id;
            }
        });
        var axes = [];
        $.each(axesList, function(idx, elem) {
            axes.splice(elem.id - 1, 0, {
                uom: elem.uom,
                tsColors: elem.tsColors,
                min: elem.zeroScaled ? 0 : null
            });
        });
        return axes;
    },
    dataAlreadyIn: function(id) {
        var elem = null;
        elem = $.map(this.data, function(elem) {
            if (id === elem.id) {
                return elem;
            }
        });
        return elem[0];
    },
    removeData: function(id) {
        var idx = -1;
        $.each(this.data, function(i, elem) {
            if (id == elem.id) {
                idx = i;
                return;
            }
        });
        if (idx >= 0) {
            this.data.splice(idx, 1);
        }
    }
};/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var LegendController = {
    init: function() {
        EventManager.subscribe("timeseries:add", $.proxy(this.addTS, this));
        EventManager.subscribe("timeseries:remove", $.proxy(this.removeTS, this));
        EventManager.subscribe("timeseries:removeAll", $.proxy(this.removeAll, this));
        EventManager.subscribe("timeseries:selected", $.proxy(this.selectTS, this));
        EventManager.subscribe("timeseries:unselectAll", $.proxy(this.deselectAllTS, this));
        EventManager.subscribe("timeseries:data:loadfinished", $.proxy(this.checkNoData, this));
        EventManager.subscribe("timeseries:changeStyle", $.proxy(this.changeStyle, this));
        EventManager.subscribe("timeseries:synced", $.proxy(this.syncedTS, this));
    },
    addTS: function(event, ts) {
        var html = this.createEntry(ts);
        this.removeEntry(ts.getInternalId());
        $('.legend-entry').append(html);
        this.addClickEvents(ts);
    },
    addClickEvents: function(ts) {
        $('[data-id=' + ts.getInternalId() + '] .firstLastEntry').on('click', function(event) {
            event.stopPropagation();
            var time = $(event.currentTarget).data('firsttime');
            if (time) {
                EventManager.publish("time:start:change", time);
            }
            time = $(event.currentTarget).data('lasttime');
            if (time) {
                EventManager.publish("time:end:change", time);
            }
        });
        $('[data-id=' + ts.getInternalId() + '] .legendItemheader').click($.proxy(function(event) {
            if (!$('[data-id=' + ts.getInternalId() + ']').hasClass('selected')) {
                EventManager.publish("timeseries:unselectAll");
                EventManager.publish("timeseries:selected", ts.getInternalId());
            } else {
                EventManager.publish("timeseries:unselectAll");
            }
        }, this));
        $('[data-id=' + ts.getInternalId() + '] .hideDiagram').click($.proxy(function(event) {
            target = $(event.currentTarget);
            if (target.hasClass('glyphicon-eye-close')) {
                EventManager.publish("timeseries:hide", ts.getInternalId());
            } else {
                EventManager.publish("timeseries:show", ts.getInternalId());
            }
            target.toggleClass('glyphicon-eye-close');
            target.toggleClass('glyphicon-eye-open');
        }, this));
        $('[data-id=' + ts.getInternalId() + '] .delete').click($.proxy(function(event) {
            TimeSeriesController.removeTS(ts);
        }, this));
        $('[data-id=' + ts.getInternalId() + '] .inMap').click($.proxy(function(event) {
            EventManager.publish("timeseries:showInMap", ts);
        }, this));
        $('[data-id=' + ts.getInternalId() + '] .changeStyle').click($.proxy(function(event) {
            StyleChangeController.open(ts);
        }, this));
        $('[data-id=' + ts.getInternalId() + '] .showInfo').click($.proxy(function(event) {
            $('[data-id=' + ts.getInternalId() + ']').find('.collapseLegendEntry').toggle();
        }, this));
        $('[data-id=' + ts.getInternalId() + '] .refEntry').on('click', function(event) {
            var target = $(event.currentTarget);
            target.toggleClass('selected');
            var ev;
            if (target.hasClass('selected')) {
                ev = "timeseries:add:referenceValue";
            } else {
                ev = "timeseries:remove:referenceValue";
            }
            EventManager.publish(ev, {
                "tsId": ts.getInternalId(),
                "refId": target.data('refid')
            });
        });
    },
    checkNoData: function(event, ts) {
        var warn = $('.legend-entry').find('[data-id=' + ts.getInternalId() + '] .noDataWarning');
        if (!ts.hasData()) {
            warn.show();
        } else {
            warn.hide();
        }
    },
    selectTS: function(event, id) {
        $('.legend-entry').find('[data-id=' + id + ']').addClass('selected');
    },
    changeStyle: function(event, ts) {
        this.updateEntry(ts);
    },
    deselectAllTS: function(event) {
        $('.legend-entry').find('.legendItem.selected').removeClass('selected');
    },
    removeTS: function(event, ts) {
        this.removeEntry(ts.getInternalId());
    },
    removeAll: function(event) {
        $('.legend-entry').empty();
    },
    removeEntry: function(id) {
        $('.legend-entry').find('[data-id=' + id + ']').remove();
    },
    updateEntry: function(ts) {
        var html = this.createEntry(ts);
        $(html).replaceAll('.legend-entry [data-id=' + ts.getInternalId() + ']');
        this.addClickEvents(ts);
    },
    syncedTS: function() {
        var noData = true;
        $.each(TimeSeriesController.timeseries, function(idx, elem){
            if (elem.hasData()) {
                noData = false;
            }
        });
        if (noData) {
            Pages.toggleLegend(true);
        }
    },
    createEntry: function(ts) {
        var firstValue = ts.getFirstValue();
        var lastValue = ts.getLastValue();
        var refValues = $.map(ts.getRefValues(), function(elem, id) {
            return {
                id: elem.getId(),
                label: elem.getLabel(),
                color: elem.getColor()
            };
        });
        var html = Template.createHtml("legend-entry", {
            id: ts.getInternalId(),
            color: ts.getStyle().getColor(),
            synced: ts.isSynced(),
            uom: this.createText(ts.getUom),
            phenomenon: this.createText(ts.getPhenomenonLabel()),
            procedure: this.createText(ts.getProcedureLabel()),
            station: this.createText(ts.getStationLabel()),
            category: this.createText(ts.getCategoryLabel()),
            firstValueTime: firstValue ? firstValue.timestamp : "",
            firstValueTimeFormatted: firstValue ? moment(firstValue.timestamp).format(Settings.dateformat) : "",
            firstValue: firstValue ? firstValue.value : "",
            lastValueTime: lastValue ? lastValue.timestamp : "",
            lastValueTimeFormatted: lastValue ? moment(lastValue.timestamp).format(Settings.dateformat) : "",
            lastValue: lastValue ? lastValue.value : "",
            referenceValues: refValues
        });
        return html;
    },
    createText: function(text) {
        return text ? text : "";
    }
};/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var StyleChangeController = {
    defaultColorList: ['#1abc9c', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50', '#f1c40f',
        '#d35400', '#c0392b', '#7f8c8d'],
    defaultIntervalList: [
        {label: _('styleChange.barChartInterval.hour'), value: 1},
        {label: _('styleChange.barChartInterval.day'), value: 24},
        {label: _('styleChange.barChartInterval.week'), value: 7 * 24},
        {label: _('styleChange.barChartInterval.month'), value: 30 * 24}
    ],
    init: function() {
        this.colorList = Settings.colorList || this.defaultColorList;
        this.intervalList = Settings.intervalList || this.defaultIntervalList;
    },
    open: function(ts) {
        var style = ts.getStyle();
        var data = {
            currentColor: style.getColor(),
            colorList: this.colorList,
            zeroScaled: ts.isZeroScaled(),
            groupedAxis: ts.isGroupedAxis()
        };
        if (style.isBarChart()) {
            data.bar = true;
            data.interval = this.intervalList;
        }
        ;
        Modal.show("style-change", data);
        $('.colorButton').on('click', function(e) {
            var color = $(e.target).data('color');
            if (style.getColor() != color) {
                style.setColor(color);
                EventManager.publish("timeseries:changeStyle", ts);
            }
        });
        $('.intervalButton').on('click', function(e) {
            var interval = $(e.target).data('interval');
            if (style.getIntervalByHours() != interval) {
                style.setIntervalByHours(interval);
                EventManager.publish("timeseries:changeStyle", ts);
            };
        });
        $('.zeroScaled').on('click', function(e) {
            var zeroScaled = Button.switchToggleButton(e.target);
            ts.setZeroScaled(zeroScaled);
            EventManager.publish("timeseries:zeroScaled", ts);
        });
        $('.groupedAxis').on('click', function(e) {
            var groupedAxis = Button.switchToggleButton(e.target);
            ts.setGroupedAxis(groupedAxis);
            EventManager.publish("timeseries:groupedAxis", ts);
        });
    }
};/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var TableController = {
    isVisible: false,
    pageStart: 0,
    pageSize: Settings.pagesize || 10,
    init: function() {
        this.tableButton = $('[data-action="dataTable"]');
        this.tableView = $('#tableView');
        this.tableButton.show();
        this.tableButton.on('click', $.proxy(function(event) {
            var button = $(event.currentTarget);
            var legendButton = $('[data-toggle="legend"]');
            if (this.isVisible == false) {
                this.isVisible = true;
                this.tableView.show();
                Button.setNewIcon(button, 'glyphicon-stats');
                legendButton.hide();
                EventManager.publish("navigation:open", "table");
            } else {
                this.isVisible = false;
                this.tableView.hide();
                legendButton.show();
                Button.removeNewIcon(button, 'glyphicon-stats');
                EventManager.publish("navigation:close", "table");
            }
        }, this));
        EventManager.subscribe("navigation:open", $.proxy(this.createTable, this));
        EventManager.subscribe("timeseries:synced", $.proxy(this.createTable, this));
        EventManager.subscribe("timeseries:remove", $.proxy(this.createTable, this));
        EventManager.subscribe("timeseries:changeStyle", $.proxy(this.updateTable, this));
    },
    createTable: function() {
        if (this.isVisible) {
            this.tableView.empty();
            this.sortingFunc = null;
            this.pageStart = 0;
            this.createHtmlTableHeader();
            this.tableView.append(this.htmltable);
            this.updateTable();
            this.createHeaderClickHandler();
        }
    },
    updateTable: function() {
        if (this.isVisible) {
            var array = this.createValueArray();
            if (this.sortingFunc) {
                array.sort(this.sortingFunc);
            }
            if (array.length > 0) {
                var colorArray = this.createColorArray();
                this.createHtmlTable(array, colorArray);
            }
            this.createPaging(array.length, this.pageSize, this.pageStart);
            this.createPagingClickHandler(array.length);
        }
    },
    createHeaderClickHandler: function() {
        $('.table th').on('click', $.proxy(function(event) {
            var target = $(event.currentTarget);
            var index = target.data('index');
            if (target.hasClass('sortedUp')) {
                target.removeClass('sortedUp').addClass('sortedDown');
                this.changeSortLabel(target, false);
                this.sortingFunc = this.downsort(index);
            } else if (target.hasClass('sortedDown')) {
                target.removeClass('sortedDown').addClass('sortedUp');
                this.changeSortLabel(target, true);
                this.sortingFunc = this.upsort(index);
            } else {
                $('.table th').removeClass('sortedUp').removeClass('sortedDown');
                target.addClass('sortedUp');
                this.changeSortLabel(target, true);
                this.sortingFunc = this.upsort(index);
            }
            this.updateTable();
        }, this));
    },
    changeSortLabel: function(target, up) {
        $('#sorting').remove();
        var span = $('<span>').attr('id', 'sorting');
        if (up) {
            span.html('&nbsp;&#x25BE;');
        } else {
            span.html('&nbsp;&#x25B4;');
        }
        target.append(span);
    },
    createPagingClickHandler: function(length) {
        $('.pagination li a').on('click', $.proxy(function(event) {
            var start = $(event.target).data('start');
            if (typeof (start) !== "undefined" && start >= 0 && start <= length) {
                this.pageStart = start;
                this.updateTable();
            }
        }, this));
    },
    createPaging: function(arraylength, pagesize, pagestart) {
        this.tableView.find('div.paging').remove();
        var div = $('<div class="paging"></div>'),
                paging = $('<ul class="pagination"></ul>');
        paging.append(this.pageButton('&laquo;', 0));
        paging.append(this.pageButton('&lsaquo;', pagestart - pagesize));
        paging.append(this.pageButton(Math.ceil((pagestart + 1) / pagesize) + '/' + Math.ceil(arraylength / pagesize)));
        paging.append(this.pageButton('&rsaquo;', pagestart + pagesize));
        paging.append(this.pageButton('&raquo;', Math.floor(arraylength / pagesize) * pagesize));
        div.append(paging);
        this.tableView.append(div);
    },
    pageButton: function(label, start) {
        var elem = $('<li></li>'),
                a = $('<a>' + label + '</a>');
        a.data('start', start);
        elem.append(a);
        return elem;
    },
    createColorArray: function() {
        var array = [];
        $.each(TimeSeriesController.getTimeseriesCollection(), function(index, ts) {
            array.push(ts.getStyle().getColor());
        });
        return array;
    },
    createValueArray: function() {
        var array = [];
        $.each(TimeSeriesController.getTimeseriesCollection(), function(index, ts) {
            var values = ts.getValues();
            var i = (array[0] != null && array[0].length > 0) ? array[0].length : 0;
            var arrayindex = 0;
            $.each(values, function(idx, tvpair) {
                var time = tvpair[0];
                var value = tvpair[1];
                if (i == 0) {
                    array.push([time, value]);
                } else {
                    while (array[arrayindex] != null && array[arrayindex][0] < time) {
                        array[arrayindex][i] = "-";
                        arrayindex++;
                    }
                    if (array[arrayindex] != null && array[arrayindex][0] == time) {
                        array[arrayindex][i] = value;
                    } else {
                        var entry = [];
                        entry.push(time);
                        for (var j = 1; j < i; j++) {
                            entry.push("-");
                        }
                        entry.push(value);
                        array.splice(arrayindex, 0, entry);
                    }
                    arrayindex++;
                }
            });
        });
        return array;
    },
    upsort: function(id) {
        return function(a, b) {
            if (isNaN(a[id]) && isNaN(b[id]))
                return 0;
            if (isNaN(a[id]))
                return -1;
            if (isNaN(b[id]))
                return 1;
            return a[id] - b[id];
        };
    },
    downsort: function(id) {
        return function(a, b) {
            if (isNaN(a[id]) && isNaN(b[id]))
                return 0;
            if (isNaN(a[id]))
                return 1;
            if (isNaN(b[id]))
                return -1;
            return b[id] - a[id];
        };
    },
    createHtmlTableHeader: function() {
        this.htmltable = $('<table></table>').addClass('table').addClass('table-condensed');
        var header = $('<thead></thead>');
        var headerrow = $('<tr></tr>');
        headerrow.append($('<th></th>').data('index', 0).text(_('table.time')));
        var index = 1;
        $.each(TimeSeriesController.getTimeseriesCollection(), function(id, elem) {
            var title = $('<div></div>').text(elem.getStationLabel());
            var phenomenonLabel = $('<span></span>').text(elem.getPhenomenonLabel() + " (" + elem.getUom() + ")");
            var categoryLabel = $('<div></div>').text(elem.getCategoryLabel());
            headerrow.append($('<th></th>').data('index', index++).append(title).append(phenomenonLabel).append(categoryLabel));
        });
        this.htmltable.append(header.append(headerrow));
    },
    createHtmlTable: function(array, colorArray) {
        this.htmltable.find('tbody tr').remove();
        var cArray = colorArray;
        $.each(array, $.proxy(function(tsIndex, elem) {
            if (tsIndex < this.pageStart || tsIndex >= (this.pageStart + this.pageSize)) {
                return;
            }
            var row = $('<tr></tr>');
            $.each(elem, function(index, value) {
                if (index == 0) {
                    row.append($('<td></td>').text(
                            moment(value).format(Settings.dateformat)));
                } else {
                    row.append($('<td></td>').css('color', cArray[index - 1])
                            .append($('<b></b>').text(value)));
                }
            });
            this.htmltable.append(row);
        }, this));
        return this.htmltable;
    }
};/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var ExportController = {
    init: function() {
        var version = this.msieversion();
        if (!version || version > 9) {
            EventManager.subscribe('timeseries:add', $.proxy(this.loadTimeseries, this));
        }
    },
    loadTimeseries: function(event, ts) {
        tsId = ts.getInternalId();
        var button = $('<div class="additionalLegendEntry"><span class="glyphicon glyphicon-download"></span><span> ' + _('export.label') + '</span></div>');
        $('.legendItem[data-id="' + tsId + '"]').find('.collapseLegendEntry').append(button);
        button.on('click', $.proxy(function() {
            this.createCSVforTS(ts);
        }, this));
    },
    createCSVforTS: function(ts) {
        // create header
        var csvContent = 'Sensor Station;Sensor Phenomenon;Date;Value\n';
        // create value body
        $.each(ts.getValues(), function(idx, valueTuple) {
            // add station
            csvContent += ts.getStationLabel() + ';';
            // add phenomenon
            csvContent += ts.getPhenomenonLabel() + ' (' + ts.getUom() + ');';
            // add timestamp
            csvContent += moment(valueTuple[0]).format() + ';';
            // add value
            csvContent += valueTuple[1];
            csvContent += '\n';
        });
        this.triggerDownload(csvContent, ts.getLabel());
    },
    triggerDownload: function(content, suggestedFilename) {
        var filename = suggestedFilename;
        if (!filename) {
            filename = 'export.csv';
        }
        if (filename.indexOf('.csv') == -1) {
            filename += '.csv';
        }
        if (navigator.msSaveBlob) {
            // IE 10 or greater...
            var blob = new Blob(["\uFEFF" + content], {
                type: 'text/csv;charset=utf-8;',
                encoding: "utf-8"
            });
            navigator.msSaveBlob(blob, filename);
        } else {
            // FF, Chrome ...
            var a = document.createElement('a');
            a.href = 'data:text/csv;base64,' + btoa(content);
            a.target = '_blank';
            a.download = filename;
            document.body.appendChild(a);
            a.click();
        }
    },
    msieversion: function() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");
        if (msie > 0)      // If Internet Explorer, return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));
    }
};/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var GuidedTourController = (function() {

    var timeseriesAdd = function(evt, ts) {
        if (!ts.hasData() && ts.getLastValue().timestamp) {
            EventManager.publish("time:end:change", ts.getLastValue().timestamp);
            return;
        }
        EventManager.unsubscribe("timeseries:data:loadfinished", timeseriesAdd);
        this.showNext();
    };

    var stationLoaded = function() {
        EventManager.unsubscribe("map:stationLoaded", stationLoaded);
        setTimeout($.proxy(function() {
            this.showNext();
        }, this), 200);
    };

    /*
     * every step has the following options:
     *
     * mandatory:
     * 		"anchor" : existing anchor in the document to connect the popup window
     */
    var steps = [
        {
            anchor: '.navbar-header.chart',
            title: _('guide.step1.header'),
            text: _('guide.step1.text'),
            initStep: function() {
                Pages.navigateToChart();
            }
        }, {
            anchor: '[data-target="#map"]',
            title: _('guide.step2.header'),
            text: _('guide.step2.text'),
            arrow: true,
            initStep: function() {
                Pages.navigateToChart();
            }
        }, {
            anchor: '.navbar-header.map',
            title: _('guide.step3.header'),
            text: _('guide.step3.text'),
            initStep: function() {
                Pages.navigateToMap();
            }
        }, {
            anchor: '[data-action="provider"]',
            title: _('guide.step4.header'),
            text: _('guide.step4.text'),
            arrow: true,
            initStep: function() {
            }
        }, {
            anchor: '[data-action="locate"]',
            title: _('guide.step5.header'),
            text: _('guide.step5.text'),
            arrow: true,
            initStep: function() {
            }
        }, {
            anchor: '[data-action="listSelection"]',
            title: _('guide.step6.header'),
            text: _('guide.step6.text'),
            arrow: true,
            initStep: function() {
            }
        }, {
            anchor: '.navbar-header.map',
           title: _('guide.step7.header'),
            text: _('guide.step7.text'),
            next: false,
            initStep: function(context) {
                EventManager.subscribe("map:stationLoaded", $.proxy(stationLoaded, context));
            }
        }, {
            anchor: '.tsItem input',
            title: _('guide.step8.header'),
            text: _('guide.step8.text'),
            previous: false,
            next: false,
            arrow: true,
            initStep: function(context) {
                EventManager.subscribe("timeseries:data:loadfinished", $.proxy(timeseriesAdd, context));
            }
        }, {
            anchor: '.legend-entry',
            title: _('guide.step9.header'),
            text: _('guide.step9.text'),
            arrow: true,
            previous: false,
            initStep: function() {
                Pages.toggleLegend(true);
            }
        }, {
            anchor: '.navbar-header.chart',
            title: _('guide.step10.header'),
            text: _('guide.step10.text'),
            initStep: function() {
                Pages.toggleLegend(false);
            }
        }, {
            anchor: '.btn-group.timeSelection',
            title: _('guide.step11.header'),
            text: _('guide.step11.text'),
            arrow: true,
            initStep: function() {
            }
        }, {
            anchor: '[data-action="dataTable"]',
            title: _('guide.step12.header'),
            text: _('guide.step12.text'),
            arrow: true,
            initStep: function() {
            }
        }, {
            anchor: '[data-target="#favorites"]',
            title: _('guide.step13.header'),
            text: _('guide.step13.text'),
            arrow: true,
            initStep: function() {
            }
        }, {
            anchor: '.navbar-header.chart',
            title: _('guide.step14.header'),
            text: _('guide.step14.text'),
            initStep: function() {
            }
        }];

    var template = '<div class="popover guidedtour"><div class="popover-content"></div></div>';
    var arrowtemplate = '<div class="popover guidedtour"><div class="arrow"></div><div class="popover-content"></div></div>';

    return {
        init: function() {
            // initialize button
            $(document).ready(function() {
                $('[data-target="#tour"]').click(function() {
                    GuidedTourController.start();
                });
            });
            // start by permalink
            if (Permalink.getUrlParameter('tour') === "true") {
                GuidedTourController.start();
            }
            // TODO check if the client is loaded the first time, then start the
            // guidedtour
        },
        start: function() {
            this.closeLast();
            this.show(1);
            Status.reset();
        },
        showNext: function() {
            this.closeLast();
            this.show(this.idx + 1);
        },
        closeLast: function() {
            if (this.gtWindow) {
                this.gtWindow.popover('destroy');
            }
        },
        show: function(idx) {
            this.idx = idx;
            var step = steps[idx - 1];
            step.initStep(this);
            this.gtWindow = $(step.anchor + ':first').popover({
                html: true,
                template: step.arrow ? arrowtemplate : template,
                trigger: 'manual',
                content: Template.createHtml('guidedtour', {
                    title: step.title,
                    text: step.text,
                    previous: idx - 1 >= 1 && step.previous != false ? idx - 1 : null,
                    step: idx,
                    next: idx + 1 <= steps.length && step.next != false ? idx + 1 : null,
                    steps: steps.length
                }),
                placement: 'auto'
            });
            $(step.anchor).popover('show');
            $('.paging.guidedtour li a').on('click', $.proxy(function(target) {
                var idx = parseInt(target.currentTarget.dataset.step);
                if (!isNaN(idx)) {
                    this.closeLast();
                    this.show(idx);
                }
            }, this));
            $('.guidedtour .close').on('click', $.proxy(function() {
                this.closeLast();
            }, this));
            this.gtWindow.on('hidden.bs.popover', $.proxy(function() {
                this.closeLast();
            }, this));
        }
    };
})();/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var FavoriteController = {
    favorites: {},
    groupIdx: 0,
    favoriteGroups: {},
    init: function() {
        this.key = Storage.generateKey('favorites');
        this.favoriteButton = $('.favoriteButton');
        this.favoriteButton.show();
        this.favoriteButton.on('click', $.proxy(function(event) {
            /*
             * This is a bit hacky, as the page navigation
             * should be refactored to have a cleaner way
             * in extending it
             */
            var backLink = Pages.current();
            this.showFavoritesView();
            var favoritePageButton = $('#favoriteButton');
            favoritePageButton.on('click', $.proxy(function(event) {
                Pages.navigateToPage("#" + backLink);

            }));
        }, this));
        this.createFavoritesListView();
        this.activateImportExportHandlers();
        EventManager.subscribe('timeseries:add', $.proxy(this.addLegendStar, this));
        EventManager.subscribe('timeseries:changeStyle', $.proxy(this.addLegendStar, this));
        EventManager.subscribe('map:stationLoaded', $.proxy(this.addStationStar, this));
        EventManager.subscribe('settings:opened', $.proxy(function() {
            var permFavButton = $(Template.createHtml('favorite-settings-button'));
            $('#accordionSettings .permalink .panel-body').append(permFavButton);
            permFavButton.on('click', $.proxy(function() {
                if (Object.keys(TimeSeriesController.timeseries).length > 0) {
                    if (!this.isInFavoriteGroup(TimeSeriesController.timeseries)) {
                        var label = this.addFavoriteGroup(TimeSeriesController.timeseries);
                        this.saveFavorites();
                        NotifyController.notify(_('favorite.group.add').replace('{0}', label));
                    } else {
                        NotifyController.notify(_('favorite.group.exists'));
                    }
                } else {
                    NotifyController.notify(_('favorite.group.noTimeseries'));
                }
            }, this));
        }, this));
        this.loadFavorites();
    },
    navigateToFavoritesView: function() {
        Pages.navigateToPage('#favorite-page');
        Pages.toggleLegend(false);
        Pages.togglePhenomenon(false);
    },
    clearFavoritesView: function() {
        $('#favorites-list').empty();
    },
    updateFavoritesView: function() {
        this.clearFavoritesView();
        $.each(this.favorites, $.proxy(function(idx, item) {
            this.drawFavorite(item);
        }, this));
        $.each(this.favoriteGroups, $.proxy(function(idx, item) {
            this.drawFavoriteGroup(item, idx);
        }, this));
    },
    drawFavorite: function(favorite) {
        var ts = favorite.timeseries;
        var lastValue = ts.getLastValue();
        var elem = Template.createHtml('favorite-entry', {
            id: ts.getInternalId(),
            label: favorite.label,
            provider: ts.getServiceLabel(),
            lastValueTimeFormatted: lastValue ? moment(lastValue.timestamp).format(Settings.dateformat) : '',
            lastValue: lastValue.value || '',
            uom: ts.getUom() || ''
        });
        $('#favorites-list').append(elem);
        this.addFavoriteClickEvent(ts.getInternalId());
    },
    drawFavoriteGroup: function(favGroup, idx) {
        var elem = Template.createHtml('favorite-group-entry', {
            id: idx,
            label: favGroup.label,
            collection: $.map(favGroup.collection, function(ts) {
                var lastValue = ts.getLastValue();
                return {
                    label: ts.getLabel(),
                    lastValueTimeFormatted: lastValue ? moment(lastValue.timestamp).format(Settings.dateformat) : '',
                    lastValue: lastValue.value || '',
                    uom: ts.getUom() || ''
                };
            })
        });
        $('#favorites-list').append(elem);
        this.addGroupClickEvents(idx);
    },
    showFavoritesView: function() {
        this.navigateToFavoritesView();
    },
    addFavoriteClickEvent: function(id) {
        // delete
        this.addClickEvents(id, 'single-id', 'delete', $.proxy(function(evt) {
            this.removeFavorite(id);
//            delete this.favorites[id];
//            $('[data-single-id=' + id + ']').remove();
//            var star = $('.star', '[data-id=' + id + ']');
//            if (star) {
//                star.addClass('glyphicon-star-empty').removeClass('glyphicon-star');
//            }
            this.saveFavorites();
        }, this));
        // edit
        this.addClickEvents(id, 'single-id', 'edit', $.proxy(function(evt) {
            this.openEditWindow(this.favorites[id]);
        }, this));
        // add to diagram
        this.addClickEvents(id, 'single-id', 'addToDiagram', $.proxy(function(evt) {
            var ts = this.favorites[id];
            Pages.navigateToChart();
            TimeSeriesController.addTS(ts.timeseries);
        }, this));
    },
    addGroupClickEvents: function(id) {
        // delete
        this.addClickEvents(id, 'group-id', 'delete', $.proxy(function(evt) {
            delete this.favoriteGroups[id];
            $('[data-group-id=' + id + ']').remove();
            this.saveFavorites();
        }, this));
        // edit
        this.addClickEvents(id, 'group-id', 'edit', $.proxy(function(evt) {
            this.openEditWindow(this.favoriteGroups[id]);
        }, this));
        // add to diagram
        this.addClickEvents(id, 'group-id', 'addToDiagram', $.proxy(function(evt) {
            var group = this.favoriteGroups[id];
            Pages.navigateToChart();
            $.each(group.collection, function(idx, elem) {
                TimeSeriesController.addTS(elem);
            });
        }, this));
    },
    addClickEvents: function(id, typeId, action, todo) {
        $('[data-' + typeId + '=' + id + '] .' + action).on('click', todo);
    },
    openEditWindow: function(entry) {
        Modal.show("favorite-edit", {
            label: entry.label
        });
        // add click event for button...
        $('#confirmFavoritEdit').on('click', $.proxy(function(e) {
            entry.label = $('#favoriteLabel')[0].value;
            this.saveFavorites();
            this.updateFavoritesView();
        }, this));
    },
    createFavoritesListView: function() {
        var list = Template.createHtml('favorites-main');
        $('.swc-main').append(list);
        Pages.activateNavButtonsHandler();
    },
    activateImportExportHandlers: function() {
        var fileImport = $('#favorites-file-import');
        var fileExport = $('#favorites-file-export');
        fileImport.change($.proxy(this.importFavorites, this));
        fileExport.click($.proxy(this.exportFavorites, this));
    },
    createEmptyStar: function() {
        return $('<span class="glyphicon glyphicon-star-empty star"></span>');
    },
    createFilledStar: function() {
        return $('<span class="glyphicon glyphicon-star star"></span>');
    },
    addLegendStar: function(evt, ts) {
        var tsId = ts.getInternalId();
        $('.legendItem[data-id="' + tsId + '"]').find('.legendItemLabel .star').remove();
        var star;
        var onClick;
        if (this.favorites.hasOwnProperty(tsId)) {
            star = this.createFilledStar();
            onClick = $.proxy(function(event) {
                event.stopPropagation();
                var label = this.removeFavorite(ts);
                NotifyController.notify(_('favorite.single.remove').replace('{0}', label));
            }, this);
        } else {
            star = this.createEmptyStar();
            onClick = $.proxy(function(event) {
                event.stopPropagation();
                var label = this.addFavorite(ts);
                NotifyController.notify(_('favorite.single.add').replace('{0}', label));
            }, this);
        }
        $('.legendItem[data-id="' + tsId + '"]').find('.legendItemLabel').append(star);
        star.on('click', onClick);
    },
    addStationStar: function() {
        $.each($('.stationContent .tsItem'), $.proxy(function(idx, item) {
            var star;
            var onClick;
            var internalID = item.dataset.internalid;
            $(item).find('.checkbox .star').remove();
            if (this.favorites.hasOwnProperty(internalID)) {
                star = this.createFilledStar();
                onClick = $.proxy(function(event) {
                    event.stopPropagation();
                    var label = this.removeFavorite(internalID);
                    NotifyController.notify(_('favorite.single.remove').replace('{0}', label));
                    this.addStationStar();
                }, this);
            } else {
                star = this.createEmptyStar();
                onClick = $.proxy(function(event) {
                    event.stopPropagation();
                    var promise = Rest.timeseries(item.dataset.id, Status.get('provider').apiUrl);
                    promise.done($.proxy(function(ts) {
                        var label = this.addFavorite(ts);
                        NotifyController.notify(_('favorite.single.add').replace('{0}', label));
                        this.addStationStar();
                    }, this));
                }, this);
            }
            $(item).find('.checkbox label').after(star);
            star.on('click', onClick);
        }, this));
    },
    addFavorite: function(ts, label) {
        label = this.addFavoriteToList(ts, label);
        this.addLegendStar(null, ts);
        return label;
    },
    removeFavorite: function(ts) {
        if (!(ts instanceof TimeSeries)) {
            ts = this.favorites[ts].timeseries;
        }
        var id = ts.getInternalId();
        var label = this.favorites[id].label;
        delete this.favorites[id];
        $('[data-single-id=' + id + ']').remove();
        this.addLegendStar(null, ts);
        return label;
    },
    addFavoriteToList: function(ts, label) {
        label = label || ts.getLabel();
        this.favorites[ts.getInternalId()] = {
            label: label,
            timeseries: ts
        };
        this.saveFavorites();
        this.drawFavorite(this.favorites[ts.getInternalId()]);
        return label;
    },
    hasFavorites: function() {
        return Object.getOwnPropertyNames(this.favorites).length !== 0;
    },
    addFavoriteGroup: function(tsColl, label) {
        label = label || 'Status ' + this.groupIdx;
        this.favoriteGroups[this.groupIdx] = {
            label: label,
            collection: $.map(tsColl, function(elem, idx) {
                return elem;
            })
        };
        this.saveFavorites();
        this.drawFavoriteGroup(this.favoriteGroups[this.groupIdx], this.groupIdx);
        this.groupIdx++;
        return label;
    },
    isInFavoriteGroup: function(tsColl) {
        var isInside = false;
        $.each(this.favoriteGroups, function(idx, elem) {
            var equivalent = true;
            if (elem.collection.length === Object.keys(tsColl).length) {
                $.each(elem.collection, function(idx, elem) {
                    var bool = false;
                    $.each(tsColl, function(idx) {
                        if (idx === elem.getInternalId()) {
                            bool = true;
                        }
                    });
                    if (!bool)
                        equivalent = false;
                });
            } else {
                equivalent = false;
            }
            if (equivalent)
                isInside = true;
        });
        return isInside;
    },
    saveFavorites: function() {
        var favorites = this.serializeFavorites();
        Storage.saveObject(this.key, favorites);
    },
    loadFavorites: function() {
        var values = Storage.load(this.key);
        this.unserializeFavorites(values);
    },
    unserializeFavorites: function(values) {
        if (values) {
            $.each(values.single, $.proxy(function(idx, elem) {
                var ts = elem.timeseries;
                if (this.isSupported(ts)) {
                    var promise = Rest.timeseries(ts.tsId, ts.apiUrl);
                    var that = this;
                    promise.done(function (ts) {
                        that.addFavorite(ts, elem.label);
                    });
                } else {
                    NotifyController.notify(_('favorite.single.notSupported').replace('{0}', elem.label));
                }
            }, this));
            $.each(values.groups, $.proxy(function(idx, group) {
                var label = group.label;
                var deferreds = $.map(group.collection, $.proxy(function(ts) {
                    if (this.isSupported(ts)) {
                        var promise = Rest.timeseries(ts.tsId, ts.apiUrl);
                        return promise;
                    } else {
                        NotifyController.notify(_('favorite.group.notSupported').replace('{0}', label));
                    }
                }, this));
                $.when.apply(null, deferreds).done($.proxy(function() {
                    debugger
                    this.addFavoriteGroup(arguments, label);
                }, this));
            }, this));
        }
    },
    // checks if the provider of the timeseries is configured in the client
    isSupported: function(ts) {
        var supported = false;
        $.each(Settings.restApiUrls, function(idx,elem) {
            if (ts.apiUrl === idx) supported = true;
        });
        return supported;
    },
    serializeFavorites: function() {
        var favorites = {
            single: $.map(this.favorites, function(elem, idx) {
                return {
                    label: elem.label,
                    timeseries: elem.timeseries.persist()
                };
            }),
            groups: $.map(this.favoriteGroups, function(group, idx) {
                return {
                    label: group.label,
                    collection: $.map(group.collection, function(ts, idx) {
                        return ts.persist();
                    })
                };
            })
        };
        return favorites;
    },
    exportFavorites: function() {
        if (this.isFileAPISupported()) {
            var filename = 'favorites.json';
            var content = JSON.stringify(this.serializeFavorites());
            if (window.navigator.msSaveBlob) {
                // IE version >= 10
                var blob = new Blob([content], {
                    type: 'application/json;charset=utf-8;'
                });
                window.navigator.msSaveBlob(blob, filename);
            } else {
                // FF, Chrome ...
                var a = document.createElement('a');
                a.href = 'data:application/json,' + encodeURI(content);
                a.target = '_blank';
                a.download = filename;
                document.body.appendChild(a);
                a.click();
            }
        } else {
            Inform.warn('The File APIs are not fully supported in this browser.');
        }
    },
    importFavorites: function(event) {
        if (this.isFileAPISupported()) {
            var override = true;
            if (this.hasFavorites()) {
                override = confirm('Override favorites?');
            }
            if (override) {
                this.favorites = {};
                this.clearFavoritesView();
                var files = event.target.files;
                if (files && files.length > 0) {
                    var reader = new FileReader();
                    reader.readAsText(files[0]);
                    reader.onerror = function() {
                        Inform.error('Could not read file!');
                    };
                    var that = this;
                    reader.onload = function(e) {
                        var content = JSON.parse(e.target.result);
                        that.unserializeFavorites(content);
                        that.saveFavorites();
                    };
                }
            }
        } else {
            Inform.warn('The File APIs are not fully supported in this browser.');
        }
    },
    isFileAPISupported: function() {
        return window.File && window.FileReader && window.Blob;
    }

};/*
 * Copyright (C) 2014-2014 52°North Initiative for Geospatial Open Source
 * Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var NotifyController = {
    options : {
        position: 'bottom-left',
        fade_in_speed: 'medium',
        fade_out_speed: 2000,
        time: 4000
    },
    init: function() {
        $.extend($.gritter.options, this.options);
    },
    notify: function(text) {
        $.gritter.add({
            text: text
        });
    }
}