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
    var lang = Permalink.getUrlParameter('lang') || Permalink.getUrlParameter('locale') || navigator.language || navigator.userLanguage;
    if(lang.indexOf('-') > -1) {
        return lang.substring(0, lang.indexOf('-'));
    }
    return lang;
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
        if (code.indexOf('_') === -1 && currentLanguage().indexOf(code) !== 0) {
            var item = $("<li />", {
                role: "menuitem"
            })
                    .append(readI18n(code, 'fullName'))
                    .append(createFlagImage(code))
                    .on("click", function() {
                        var ok = window.confirm(_("settings.requiresRestart"));
                        if (ok) {
                            Settings.additionalParameters.locale = code;
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
        favoriteView: 'Favorites',
        settings: 'Settings',
        stationSelection: 'Select a station',
        chartView: 'Chart view',
        allPhenomena: 'All Phenomena',
        phenomenon: 'Phenomenon',
        favoritesList: 'Favorites',
        importFavorites: 'Import',
        exportFavorites: 'Export',
        importExportHelp: 'To import a file, please choose a file you exported before.',
        noFileSelected: 'No file selected'
    },
    chart: {
        noTimeseriesSelected: 'You have selected no timeseries, the selected timeseries have no values in the given time range or the timeseries are hidden.',
        outsideOfDataRange: 'Outside of data range!',
        annotation: 'Data without warranty!',
        monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    table: {
        time: 'Time'
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
            provider: 'Provider',
            jumpBackToChart: 'back to chart'
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
    export: {
        label: 'Data as CSV (Zip Archive)'
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
        chooseLanguage: 'Switch language',
        requiresRestart: 'Needs Restart!',
        permalink: {
            create: 'Create a permalink as',
            inWindow: 'link in a new window',
            inMail: 'link in an email',
            inClipboard: 'link for the clipboard',
            clipboardInfo: 'Please copy the following link by yourself to clipboard:',
            inQrCode: 'as QR-Code',
            favorite: 'Save working environment as favorite entry'
        },
        clusterMarker: 'cluster marker',
        markerWithLastInfo: {
            header: 'marker with last value information',
            label: 'attention - some data provider are very slow'
        },
        saveStatus: {
            header: 'Save environment',
            label: 'All timeseries, the selected timespan and the settings are saved continuous.'
        },
        resetStatus: 'Reset environment',
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
        start: {
            request: 'When you start this guide, the the current state will be reset.'
        },
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
        label: 'favorite',
        edit: {
            header: 'Edit favorite'
        },
        group: {
            add: 'The status &#39;{0}&#39; is added to the favorite list.',
            exists: 'This status still exists.',
            noTimeseries: 'Currently no timeseries are selected.',
            notSupported: 'The provider of an entry of the status &#39;{0}&#39; isn&#39;t supported and can&#39;t be loaded.'
        },
        single: {
            add: 'A new favorite &#39;{0}&#39; is added to the list.',
            remove: 'The favorite &#39;{0}&#39; is removed.',
            exists: 'This favorite still exists.',
            notSupported: 'The provider of the favorite &#39;{0}&#39; isn&#39;t supported and can&#39;t be loaded.'
        },
        import: {
            override: 'Do you want to override your current favorites?',
            wrongFile: 'Could not read the file',
            noValidJson: 'The JSON file is not valid!',
            header: 'Import favorites',
            text: 'Here you can import your exported favorites. Just paste the JSON in this text field:'
        },
        export: {
            header: 'Export favorites',
            text: 'Here you can export your favorites. Just copy the JSON out of this textbox and save it in a file to import it later:'
        },
        error: {
            fileApiNotSupported: 'The File APIs are not fully supported in this browser.'
        }
    },
    inform: {
        error: 'An error occured: ',
        warn: 'Please remember that: '
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
        favoritesList: 'Favourites',
        favoriteView: 'Favourites'
    },
    settings: {
        permalink: {
            favorite: 'Save working environment as favourite entry'
        }
    },
    guide: {
        step13: {
            header: 'Favourite management',
            text: 'The legend entries/timeseries could be saved as favourites. In this view all favourites are listed and could be maintained.'
        }
    },
    favorite: {
        label: 'favourite',
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
    favoriteView: 'Favoriten',
    settings: 'Einstellungen',
    stationSelection: 'Wähle eine Station aus',
    chartView: 'Diagrammansicht',
    allPhenomena: 'Alle Phänomene',
    phenomenon: 'Phänomen',
    favoritesList: 'Favoriten',
    importFavorites: 'Importieren',
    exportFavorites: 'Exportieren',
    importExportHelp: 'Zum Import wählen sie eine zuvor exportierten JSON-Datei.',
    noFileSelected: 'Keine Datei ausgewählt'
  },
  chart: {
    noTimeseriesSelected: 'Sie haben keine Zeitreihe ausgewählt, die gewählten Zeitreihen haben keine Werte in dem derzeitigen Zeitraum oder die Zeitreihen sind unsichtbar.',
    outsideOfDataRange: 'Außerhalb des Datenbereichs!',
    annotation: 'Daten ohne Gewähr!',
    monthNames: [ 'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez' ]
  },
  table: {
    time: 'Zeit'
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
      provider: 'Datenanbieter',
      jumpBackToChart: 'zurück zum Diagramm'
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
  export: {
    label: 'Daten als CSV (Zip-Archiv)'
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
    chooseLanguage: 'Sprache wechseln',
    requiresRestart: 'Erfordert Neustart!',
    permalink: {
      create: 'Erstelle Permalink',
      inWindow: 'öffnen im neuen Fenster',
      inMail: 'öffnen in leerer Mail',
            inClipboard: 'Link für die Zwischenablage',
            clipboardInfo: 'Bitte kopiere den folgenden Link selbstständig in die Zwischenablage:',
      inQrCode: 'als QR-Code',
      favorite: 'Arbeitsumgebung als Favorit speichern'
    },
    clusterMarker: 'Marker gruppieren',
    markerWithLastInfo: {
      header: 'Marker mit Wert der letzten Messung',
      label: 'Achtung - dies kann bei einigen Providern zu langen Abfragen führen'
    },
    saveStatus: {
      header: 'Arbeitsumgebung abspeichern',
      label: 'Alle Zeitreihen, der ausgewählte Zeitraum und die Einstellungen werden kontinuierlich abgespeichert.'
    },
    resetStatus: 'Arbeitsumgebung zurücksetzen',
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
    start: {
      request: 'Wenn du den Guide startest wird der aktuellen Zustand zurückgesetzt.'
    },
    step1: {
      header: 'JavaScript Client - Geführte Tour',
      text: 'Die Tour gibt in ein paar Schritten einen Überblick über den Client. Zuerst fügen wir eine Zeitreihe von der Karte hinzu.'
    },
    step2: {
      header: 'Zur Karte',
      text: 'Hier kann man zur Kartenansicht wechseln.'
    },
    step3: {
      header: 'Kartenansicht',
      text: 'In der Karte siehst du die Stationen als Marker oder Markergruppen.'
    },
    step4: {
      header: 'Datenanbieter',
      text: 'Hier kannst du aus einer Liste von Datenanbieter auswählen.'
    },
    step5: {
      header: 'Eigene Position',
      text: 'Hier kannst du dich lokalisieren lassen.'
    },
    step6: {
      header: 'Listenauswahl',
      text: 'Hier ist eine Zeitreihenauswahl durch geordnete Listen möglich.'
    },
    step7: {
      header: 'Auswahl einer Station',
      text: 'Bitte wähle eine Station auf der Karte aus.'
    },
    step8: {
      header: 'Zeitreihe auswählen',
      text: 'Wähle eine Zeitreihe durch Anklicken der Checkbox. Liegt an dieser Station nur eine Zeitreihe vor, ist diese direkt angewählt. Durch klicken des OK-Buttons wird die Zeitreihe eingeladen.'
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
      text: 'Super!<br> Dieser Client ist ein Produkt von der <a href="http://52north.org" target="_blank">52&deg;North GmbH</a>. Auf <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a> findest du den aktuellen Entwicklungsstand.'
    }
  },
  favorite: {
    firstValueAt: 'Erster Wert bei',
    lastValueAt: 'Letzter Wert bei',
    label: 'Favorit',
    edit: {
      header: 'Favorit editieren'
    },
    group: {
      add: 'Der Status wird mit dem Name &#39;{0}&#39; in den Favoriten abgelegt.',
      exists: 'Dieser Status existiert bereits.',
      noTimeseries: 'Derzeit sind keine Zeitreihen ausgewählt.',
      notSupported: 'Der Datenanbieter eines Eintrag aus &#39;{0}&#39; wird nicht unterstützt und kann deswegen nicht eingeladen werden.'
    },
    single: {
      add: 'Einer neuer Favorit mit dem Name &#39;{0}&#39; ist abgelegt worden.',
      remove: 'Der Favorit &#39;{0}&#39; ist entfernt worden.',
      exists: 'Dieser Favorit existiert bereits.',
      notSupported: 'Der Datenanbieter des Favoriten &#39;{0}&#39; wird nicht unterstützt und kann deswegen nicht eingeladen werden.'
    },
    import: {
      override: 'Wollen Sie die aktuellen Favoriten überschreiben?',
      wrongFile: 'Die Datei kann nicht gelesen werden.',
      noValidJson: 'Die JSON Datei ist nicht valide.',
      header: 'Importiere Favoriten',
      text: 'Hier können Sie ihre Favoriten importieren. Einfach das JSON in das Textfeld einfügen:'
    },
    export: {
      header: 'Exportiere Favortien',
      text: 'Hier können Sie ihre Favoriten exportieren. Einfah das JSON aus dem Textfeld kopieren und speichern, um es später wieder zu importieren:'
    },
    error: {
      fileApiNotSupported: 'Die File-API wird in diesem Browser nicht unterstüzt.'
    }
  },
  inform: {
    error: 'Ein Fehler ist aufgetreten: ',
    warn: 'Bitte beachten Sie: '
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
i18n.bg = {
  fullName: 'български',
  ok: 'Добре',
  main: {
    legend: 'Легенда',
    diagram: 'Диаграма',
    mapView: 'Екран на картата',
    favoriteView: 'Бележник',
    settings: 'Settings',
    stationSelection: 'Изберете станция',
    chartView: 'Преглед на диаграмата',
    allPhenomena: 'Всички явления',
    phenomenon: 'Феномен',
    favoritesList: 'Бележник',
    importFavorites: 'Внос',
    exportFavorites: 'Износ',
    importExportHelp: 'За да импортирате файл, моля изберете файла, който изнася преди.',
    noFileSelected: 'Няма избран файл'
  },
  chart: {
    noTimeseriesSelected: 'Не сте избрали timeseries, избраните timeseries нямат никакви ценности в даден момент обсег или timeseries са скрити.',
    outsideOfDataRange: 'Извън обхвата на данните!',
    annotation: 'Data без гаранция!',
    monthNames: [ 'Jan', 'Февруари', 'Развалям', 'Април', 'Май', 'Юни', 'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември' ]
  },
  table: {
    time: 'Време'
  },
  map: {
    userLocation: 'Тук е текущото ви местоположение',
    stationSelection: {
      station: 'Станция',
      selectAllTimeseries: 'изберете всички timeseries'
    },
    stationLocation: {
      station: 'Станция',
      timeseries: 'Timeseries',
      provider: 'Доставчик',
      jumpBackToChart: 'обратно към графиката'
    },
    providerList: {
      provider: 'Доставчик',
      stations: 'Станции',
      timeseries: 'Timeseries',
      phenomena: 'Феномени'
    },
    search: {
      label: 'Търсенето на адреса ...',
      noResult: 'Съжаляваме, че адресът не може да бъде намерен.'
    }
  },
  listSelection: {
    header: 'Изберете timeseries по списък',
    headers: {
      category: 'Категория',
      station: 'Станция',
      phenomenon: 'Феномен',
      procedure: 'Sensor'
    },
    warning: {
      moreThanOneTimeseries: 'намерено повече от едно timeseries'
    }
  },
  legend: {
    entry: {
      noData: 'няма информация',
      jumpToLastValue: 'скочи до последния стойност',
      firstValueAt: 'Първо стойност към',
      lastValueAt: 'Last стойност към'
    }
  },
  export: {
    label: 'Data като CSV (Zip архив)'
  },
  timeSelection: {
    header: 'Time Range',
    presetsHeader: 'пресети',
    presets: {
      lastHour: 'последния час',
      today: 'днес',
      yesterday: 'вчера',
      todayYesterday: 'днес и вчера',
      thisWeek: 'тази седмица',
      lastWeek: 'миналата седмица',
      thisMonth: 'този месец',
      lastMonth: 'миналия месец',
      thisYear: 'тази година',
      lastYear: 'миналата година'
    },
    custom: {
      header: 'обичай',
      start: 'Начална дата',
      end: 'Крайна дата'
    },
    warning: {
      startBeforeEnd: 'Началната дата не може да бъде по-голяма след крайната дата',
      maxTimeRange: 'Диапазонът на времето не може да бъде по-голям от една година'
    }
  },
  styleChange: {
    header: 'Промяна на стила',
    currentColor: 'Current цвят',
    selectColor: 'Изберете нов цвят',
    selectBarInterval: 'Изберете интервала бар',
    barChartInterval: {
      hour: 'Час',
      day: 'Ден',
      week: 'Седмица',
      month: 'Месец'
    },
    zeroScaled: 'нулеви мащабирани ордината',
    groupedAxis: 'групирани ос'
  },
  settings: {
    header: 'Settings',
    chooseLanguage: 'Switch език',
    requiresRestart: 'Има нужда от рестартиране!',
    permalink: {
      create: 'Създаване на Permalink като',
      inWindow: 'връзка в нов прозорец',
      inMail: 'връзка в имейл',
      inClipboard: 'Линк към клипборда',
      clipboardInfo: 'Линк към клипборда:',
      inQrCode: 'като QR-Code',
      favorite: 'Спестете работна среда като любим влизане'
    },
    clusterMarker: 'клъстер маркер',
    markerWithLastInfo: {
      header: 'маркер с информация миналата стойност',
      label: 'внимание - някои доставчик на данни са много бавен'
    },
    saveStatus: {
      header: 'Save среда',
      label: 'Всички timeseries, избрания времеви период и настройките се съхраняват непрекъснато.'
    },
    resetStatus: 'Reset среда',
    generalizeData: 'обобщим данните',
    imprint: {
      header: 'Отпечатък',
      github: 'Намерете този проект в <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a>',
      text: '<p> <a href="http://52north.org" target="_blank">52 ° север GmbH</a> е отговорен за този сайт. </p><p> 52 ° север Инициатива за геопространствена Open Source Software GmbH <br> Martin-Luther-King-Weg 24 <br> 48155 Мюнстер, Германия </p>'
    }
  },
  permalink: {
    noMatchingTimeseriesFound: 'Няма съвпадащи timeseries се намират.'
  },
  guide: {
    start: {
      request: 'Когато стартирате това ръководство, за сегашното състояние ще бъде сменена с нова.'
    },
    step1: {
      header: 'JavaScript Client - Guided Tour',
      text: 'Това турне дава в няколко стъпки преглед как да използвате този клиент. Първо добавяме timeseries от картата.'
    },
    step2: {
      header: 'Отидете на картата',
      text: 'Тук превключите на мнение да получи карта.'
    },
    step3: {
      header: 'Екран на картата',
      text: 'Това е фрагмент от картата. В сайта можете да видите маркери или markergroups.'
    },
    step4: {
      header: 'Промени Provider',
      text: 'Тук можете да изберете друг timeseries доставчик.'
    },
    step5: {
      header: 'Покажи населено място',
      text: 'И тук можете да намерите вашето устройство на картата.'
    },
    step6: {
      header: 'Избор на списък',
      text: 'Тук можете да изберете timeseries от подредени списъци.'
    },
    step7: {
      header: 'Изберете станция',
      text: 'Моля изберете сега станция на картата.'
    },
    step8: {
      header: 'Изберете timeseries',
      text: 'Изберете тази опция. Ако има само един timeseries за тази станция, отметката вече е проверена. Сега можете да продължа с &quot;OK&quot; бутона, за да заредите timeseries.'
    },
    step9: {
      header: 'Влизане Legend',
      text: 'Тук можете да видите на продълженията серия. Можете да изтриете или намерете динамичния ред, или промяна на цвета.'
    },
    step10: {
      header: 'Диаграма',
      text: 'Това е графиката на избрания времеви ред.'
    },
    step11: {
      header: 'Промяна на времето',
      text: 'Тук можете да промените времето степента за Вашия избран времеви редове.'
    },
    step12: {
      header: 'Таблица View',
      text: 'Тук можете да получите една маса на суровини стойностите на данните в избрания времеви редове.'
    },
    step13: {
      header: 'Любими управление',
      text: 'Вписванията легенда / timeseries може да се запишат като любими. От тази гледна точка всички фаворити са изброени и могат да бъдат поддържани.'
    },
    step14: {
      header: 'Завършен',
      text: 'Браво! <br> Този клиент е продукт на <a href="http://52north.org" target="_blank">52 ° север GmbH</a> . Можете да намерите изходния код на <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a> .'
    }
  },
  favorite: {
    firstValueAt: 'Първо стойност към',
    lastValueAt: 'Last стойност към',
    label: 'любим',
    edit: {
      header: 'Edit любимата'
    },
    group: {
      add: 'Статутът &quot;{0}&quot; се добавя към списъка с предпочитани.',
      exists: 'Този статут все още съществува.',
      noTimeseries: 'В момента са избрани не timeseries.',
      notSupported: 'Доставчикът на запис на състоянието &quot;{0}&quot; не се поддържа и не може да се зареди.'
    },
    single: {
      add: 'Нов любим &quot;{0}&quot; е прибавена в списъка.',
      remove: 'Фаворитът &quot;{0}&quot; е отстранена.',
      exists: 'Това любимо все още съществува.',
      notSupported: 'Доставчикът на фаворита &quot;{0}&quot; не се поддържа и не може да се зареди.'
    },
    import: {
      override: 'Искате ли да се преодолеят настоящите си любими?',
      wrongFile: 'Не може да се прочете файла',
      noValidJson: 'Файлът с JSON не е валидна!',
      header: 'Вносните любими',
      text: 'Тук можете да импортирате изнесени любими. Просто поставете JSON в това текстово поле:'
    },
    export: {
      header: 'Експортните любими',
      text: 'Тук можете да експортирате вашите любими. Просто копирате JSON от тази кутия и да го запишете във файл, за да го внесе по-късно:'
    },
    error: {
      fileApiNotSupported: 'APIs файла не се поддържат напълно в този браузър.'
    }
  },
  inform: {
    error: 'Възникна грешка:',
    warn: 'Моля, не забравяйте, че:'
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
i18n.cz = {
  fullName: 'čeština',
  ok: 'OK',
  main: {
    legend: 'Legenda',
    diagram: 'Diagram',
    mapView: 'Zobrazení mapy',
    favoriteView: 'Oblíbené',
    settings: 'Nastavení',
    stationSelection: 'Vyberte stanici',
    chartView: 'Pohled Chart',
    allPhenomena: 'Všechny jevy',
    phenomenon: 'Jev',
    favoritesList: 'Oblíbené',
    importFavorites: 'Import',
    exportFavorites: 'Export',
    importExportHelp: 'Chcete-li importovat soubor, vyberte soubor, který jste exportovali dříve.',
    noFileSelected: 'Nebyl vybrán žádný soubor'
  },
  chart: {
    noTimeseriesSelected: 'Vybrali jste žádné TimeSeries, vybrané TimeSeries nemají hodnoty v daném časovém rozmezí nebo TimeSeries jsou skryté.',
    outsideOfDataRange: 'Mimo oblast dat!',
    annotation: 'Údaje bez záruky!',
    monthNames: [ 'Leden', 'Únor', 'Kazit', 'Dubna', 'Květen', 'Června', 'Července', 'Srpna', 'Sep', 'Říjen', 'Listopad', 'Prosince' ]
  },
  table: {
    time: 'Čas'
  },
  map: {
    userLocation: 'Tady je vaše aktuální poloha',
    stationSelection: {
      station: 'Stanice',
      selectAllTimeseries: 'vybrat všechny TimeSeries'
    },
    stationLocation: {
      station: 'Stanice',
      timeseries: 'TimeSeries',
      provider: 'Poskytovatel',
      jumpBackToChart: 'zpět do grafu'
    },
    providerList: {
      provider: 'Poskytovatel',
      stations: 'Stanice',
      timeseries: 'TimeSeries',
      phenomena: 'Jevy'
    },
    search: {
      label: 'hledat adresu ...',
      noResult: 'Je nám líto, že adresa nebyla nalezena.'
    }
  },
  listSelection: {
    header: 'Vyberte TimeSeries podle seznamu',
    headers: {
      category: 'Kategorie',
      station: 'Stanice',
      phenomenon: 'Jev',
      procedure: 'Senzor'
    },
    warning: {
      moreThanOneTimeseries: 'nalezeno více než jeden TimeSeries'
    }
  },
  legend: {
    entry: {
      noData: 'k dispozici žádné údaje',
      jumpToLastValue: 'skok na poslední hodnotě',
      firstValueAt: 'První hodnota v',
      lastValueAt: 'Poslední hodnota při'
    }
  },
  export: {
    label: 'Data ve formátu CSV (Zip archiv)'
  },
  timeSelection: {
    header: 'Časový rozsah',
    presetsHeader: 'Předvolby',
    presets: {
      lastHour: 'Poslední hodina',
      today: 'dnes',
      yesterday: 'včera',
      todayYesterday: 'dnes a včera',
      thisWeek: 'tento týden',
      lastWeek: 'minulý týden',
      thisMonth: 'tento měsíc',
      lastMonth: 'minulý měsíc',
      thisYear: 'tento rok',
      lastYear: 'loni'
    },
    custom: {
      header: 'zvyk',
      start: 'Datum zahájení',
      end: 'Datum ukončení'
    },
    warning: {
      startBeforeEnd: 'Datum zahájení nemůže být větší, než je datum ukončení',
      maxTimeRange: 'Časový rozsah nemůže být větší než jeden rok'
    }
  },
  styleChange: {
    header: 'Změnit styl',
    currentColor: 'Aktuální barva',
    selectColor: 'Vyberte nové barvy',
    selectBarInterval: 'Vyberte bar interval',
    barChartInterval: {
      hour: 'Hodina',
      day: 'Den',
      week: 'Týden',
      month: 'Měsíc'
    },
    zeroScaled: 'nula šupinatý osa y',
    groupedAxis: 'seskupené osa'
  },
  settings: {
    header: 'Nastavení',
    chooseLanguage: 'Přepnout jazyk',
    requiresRestart: 'Potřebuje Restart!',
    permalink: {
      create: 'Vytvořit Permalink jako',
      inWindow: 'odkaz v novém okně',
      inMail: 'odkaz v e-mailu',
      inClipboard: 'Odkaz do schránky',
      clipboardInfo: 'Kopírovat do schránky:',
      inQrCode: 'as QR-Code',
      favorite: 'Uložit pracovní prostředí jako oblíbené položky'
    },
    clusterMarker: 'klastr značka',
    markerWithLastInfo: {
      header: 'značkovač s informacemi poslední hodnotu',
      label: 'pozor - některé poskytovatele dat je velmi pomalé'
    },
    saveStatus: {
      header: 'Save prostředí',
      label: 'Všechny TimeSeries, vybraný OBDOBÍ a nastavení jsou uloženy kontinuální.'
    },
    resetStatus: 'Obnovit prostředí',
    generalizeData: 'zobecnit dat',
    imprint: {
      header: 'Otisk',
      github: 'Najít tento projekt na <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a>',
      text: '<p> <a href="http://52north.org" target="_blank">52 ° severní GmbH</a> je zodpovědný za tuto webovou stránku. </p><p> 52 ° severní Initiative for Geospatial Open Source Software GmbH <br> Martin-Luther-King-Weg 24 <br> 48155 Münster, Německo </p>'
    }
  },
  permalink: {
    noMatchingTimeseriesFound: 'Bez odpovídající TimeSeries je nalezen.'
  },
  guide: {
    start: {
      request: 'Při spuštění tohoto průvodce, bude současný stav obnovit.'
    },
    step1: {
      header: 'JavaScript Client - Komentovaná prohlídka',
      text: 'Tato prohlídka poskytuje v několika krocích přehled, jak používat tuto klienta. Nejprve přidáme TimeSeries z mapy.'
    },
    step2: {
      header: 'Přejít na mapu',
      text: 'Zde se přepnout zobrazení získat mapy.'
    },
    step3: {
      header: 'Zobrazení mapy',
      text: 'To je zobrazení mapy. V mapě si můžete prohlédnout značky nebo markergroups.'
    },
    step4: {
      header: 'Změna dodavatele',
      text: 'Zde si můžete vybrat jiný TimeSeries provozovatele.'
    },
    step5: {
      header: 'Show umístění',
      text: 'A zde si můžete najít svůj přístroj na mapě.'
    },
    step6: {
      header: 'Výběr Seznam',
      text: 'Zde si můžete vybrat TimeSeries z objednaných seznamů.'
    },
    step7: {
      header: 'Vyberte stanici',
      text: 'Vyberte nyní stanici na mapě.'
    },
    step8: {
      header: 'Vybrat TimeSeries',
      text: 'Zaškrtněte toto políčko. Pokud je pouze jeden TimeSeries na této stanici, políčko je již kontrolována. Nyní můžete jít na tlačítkem &quot;OK&quot; načíst TimeSeries.'
    },
    step9: {
      header: 'Vstup Legend',
      text: 'Zde vidíte přidané časové řady. Můžete odstranit nebo najít časovou řadu, nebo změnit barvu.'
    },
    step10: {
      header: 'Graf',
      text: 'To je schéma vybrané časové řady.'
    },
    step11: {
      header: 'Změnit čas',
      text: 'Zde si můžete změnit rozsah času pro zvolené časové řady.'
    },
    step12: {
      header: 'Table View',
      text: 'Zde máte tabulku surových datových hodnot k vybranému časové řady.'
    },
    step13: {
      header: 'Oblíbený řízení',
      text: 'Položky Legenda / TimeSeries mohou být uloženy jako oblíbené. V tomto pohledu jsou všechny oblíbené uvedeny a může být zachována.'
    },
    step14: {
      header: 'Dokončeno',
      text: 'Výborně! <br> Tento klient je produkt <a href="http://52north.org" target="_blank">52 ° severní GmbH</a> . Zde můžete najít zdrojový kód na <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a> .'
    }
  },
  favorite: {
    firstValueAt: 'První hodnota v',
    lastValueAt: 'Poslední hodnota při',
    label: 'oblíbený',
    edit: {
      header: 'Upravit oblíbené'
    },
    group: {
      add: 'Stav &#39;{0}&#39; je přidán do seznamu oblíbených.',
      exists: 'Tento stav stále existuje.',
      noTimeseries: 'V současné době jsou vybrány žádné TimeSeries.',
      notSupported: 'Poskytovatel zápisu stavu &#39;{0}&#39; není podporováno a nelze načíst.'
    },
    single: {
      add: 'Nový oblíbený &#39;{0}&#39; je přidán do seznamu.',
      remove: 'Oblíbené &#39;{0}&#39; se odstraní.',
      exists: 'Tento oblíbený stále existuje.',
      notSupported: 'Poskytovatel favorita &#39;{0}&#39; není podporováno a nelze načíst.'
    },
    import: {
      override: 'Chcete přepsat aktuální oblíbené?',
      wrongFile: 'Nelze přečíst soubor',
      noValidJson: 'Soubor JSON není platný!',
      header: 'Importovat oblíbené',
      text: 'Zde si můžete importovat exportované oblíbené. Stačí vložit JSON v tomto textovém poli:'
    },
    export: {
      header: 'Export oblíbené',
      text: 'Zde si můžete exportovat své oblíbené. Stačí pouze zkopírovat JSON z tohoto textového pole a uložit do souboru, aby ji později importovat:'
    },
    error: {
      fileApiNotSupported: 'API souborů nejsou plně podporovány v tomto prohlížeči.'
    }
  },
  inform: {
    error: 'Došlo k chybě:',
    warn: 'Mějte prosím na paměti, že:'
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
i18n.dk = {
  fullName: 'Dansk',
  ok: 'OK',
  main: {
    legend: 'Legend',
    diagram: 'Diagram',
    mapView: 'Kortvisning',
    favoriteView: 'Foretrukne',
    settings: 'Indstillinger',
    stationSelection: 'Vælg en station',
    chartView: 'Kortvisning',
    allPhenomena: 'Alle fænomener',
    phenomenon: 'Phenomenon',
    favoritesList: 'Foretrukne',
    importFavorites: 'Import',
    exportFavorites: 'Eksport',
    importExportHelp: 'For at importere en fil, skal du vælge en fil, du eksporterede før.',
    noFileSelected: 'Ingen fil er valgt'
  },
  chart: {
    noTimeseriesSelected: 'Du har valgt ikke Timeseries, de valgte Timeseries har ingen værdier i det givne tidsinterval eller Timeseries er skjult.',
    outsideOfDataRange: 'Uden for dataområde!',
    annotation: 'Data uden garanti!',
    monthNames: [ 'Jan', 'Februar', 'Mar', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December' ]
  },
  table: {
    time: 'Tid'
  },
  map: {
    userLocation: 'Her er din aktuelle placering',
    stationSelection: {
      station: 'Station',
      selectAllTimeseries: 'vælge alle Timeseries'
    },
    stationLocation: {
      station: 'Station',
      timeseries: 'Timeseries',
      provider: 'Provider',
      jumpBackToChart: 'Tilbage til diagram'
    },
    providerList: {
      provider: 'Provider',
      stations: 'Stationer',
      timeseries: 'Timeseries',
      phenomena: 'Phenomena'
    },
    search: {
      label: 'søge efter adresse ...',
      noResult: 'Beklager, kunne denne adresse ikke findes.'
    }
  },
  listSelection: {
    header: 'Vælg Timeseries ved liste',
    headers: {
      category: 'Kategori',
      station: 'Station',
      phenomenon: 'Phenomenon',
      procedure: 'Sensor'
    },
    warning: {
      moreThanOneTimeseries: 'fundet mere end én Timeseries'
    }
  },
  legend: {
    entry: {
      noData: 'Ingen data til rådighed',
      jumpToLastValue: 'springe til sidste værdi',
      firstValueAt: 'Første værdi på',
      lastValueAt: 'Sidste værdi på'
    }
  },
  export: {
    label: 'Data, som CSV (zip arkiv)'
  },
  timeSelection: {
    header: 'Time Range',
    presetsHeader: 'forudindstillinger',
    presets: {
      lastHour: 'sidste time',
      today: 'i dag',
      yesterday: 'i går',
      todayYesterday: 'i dag &amp; i går',
      thisWeek: 'denne uge',
      lastWeek: 'sidste uge',
      thisMonth: 'denne måned',
      lastMonth: 'sidste måned',
      thisYear: 'år',
      lastYear: 'sidste år'
    },
    custom: {
      header: 'skik',
      start: 'Startdato',
      end: 'Slutdato'
    },
    warning: {
      startBeforeEnd: 'Startdatoen kan ikke være større end slutdatoen',
      maxTimeRange: 'Tidsintervallet kan ikke være større end et år'
    }
  },
  styleChange: {
    header: 'Skift stil',
    currentColor: 'Nuværende farve',
    selectColor: 'Vælg en ny farve',
    selectBarInterval: 'Vælg bar interval',
    barChartInterval: {
      hour: 'Time',
      day: 'Dag',
      week: 'Uge',
      month: 'Måned'
    },
    zeroScaled: 'nul skaleret Y-akse',
    groupedAxis: 'grupperede akse'
  },
  settings: {
    header: 'Indstillinger',
    chooseLanguage: 'Skift sprog',
    requiresRestart: 'Behov Genstart!',
    permalink: {
      create: 'Opret en permalink som',
      inWindow: 'link i et nyt vindue',
      inMail: 'link i en e-mail',
      inClipboard: 'Link til udklipsholder',
      clipboardInfo: 'Kopier til udklipsholder:',
      inQrCode: 'som QR-kode',
      favorite: 'Gem arbejdsmiljø som favorit post'
    },
    clusterMarker: 'klynge markør',
    markerWithLastInfo: {
      header: 'markør med sidste værdi information',
      label: 'opmærksomhed - nogle dataleverandør er meget langsom'
    },
    saveStatus: {
      header: 'Gem miljø',
      label: 'Alle Timeseries, den valgte timespan og indstillingerne gemmes kontinuerligt.'
    },
    resetStatus: 'Reset miljø',
    generalizeData: 'generalisere data',
    imprint: {
      header: 'Imprint',
      github: 'Find dette projekt på <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a>',
      text: '<p> <a href="http://52north.org" target="_blank">52 ° North GmbH</a> er ansvarlig for dette websted. </p><p> 52 ° North initiativ for Geospatial Open Source Software GmbH <br> Martin-Luther-King-Weg 24 <br> 48155 Muenster, Tyskland </p>'
    }
  },
  permalink: {
    noMatchingTimeseriesFound: 'Ingen matchende Timeseries er fundet.'
  },
  guide: {
    start: {
      request: 'Når du starter denne vejledning, vil den aktuelle tilstand nulstilles.'
    },
    step1: {
      header: 'JavaScript klient - Guided Tour',
      text: 'Denne tur giver i et par skridt overblik, hvordan du bruger denne klient. Først tilføjer vi en Timeseries fra kortet.'
    },
    step2: {
      header: 'Gå til kortet',
      text: 'Her skifter vi udsigten til at få et kort.'
    },
    step3: {
      header: 'Kortvisning',
      text: 'Dette er kortet. I kortet kan du se markører eller markergroups.'
    },
    step4: {
      header: 'Skift Provider',
      text: 'Her kan du vælge en anden Timeseries udbyder.'
    },
    step5: {
      header: 'Vis beliggenhed',
      text: 'Og her kan du finde din enhed på kortet.'
    },
    step6: {
      header: 'Valgliste',
      text: 'Her kan du vælge en Timeseries ud af ordnede lister.'
    },
    step7: {
      header: 'Vælg en station',
      text: 'Vælg nu en station på kortet.'
    },
    step8: {
      header: 'Vælg Timeseries',
      text: 'Marker dette afkrydsningsfelt. Hvis der kun er én Timeseries til denne station, er afkrydsningsfeltet allerede er markeret. Nu kan du gå videre med &quot;OK&quot; -knappen for at indlæse Timeseries.'
    },
    step9: {
      header: 'Legend post',
      text: 'Her ses serien den ekstra tid. Du kan slette eller finde tidsserien eller ændre farven.'
    },
    step10: {
      header: 'Chart',
      text: 'Dette er diagram af serien den valgte tid.'
    },
    step11: {
      header: 'Skift tid',
      text: 'Her kan du ændre tidspunktet omfang til serie valgte tid.'
    },
    step12: {
      header: 'Table View',
      text: 'Her får du en oversigt over de rå dataværdier til serie valgte tid.'
    },
    step13: {
      header: 'Favorit ledelse',
      text: 'Legenden indgange / Timeseries kunne gemmes som favoritter. I denne visning alle favoritter er opført og kunne opretholdes.'
    },
    step14: {
      header: 'Færdig',
      text: 'Godt gået! <br> Denne klient er et produkt af <a href="http://52north.org" target="_blank">52 ° North GmbH</a> . Du kan finde kildekoden på <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a> .'
    }
  },
  favorite: {
    firstValueAt: 'Første værdi på',
    lastValueAt: 'Sidste værdi på',
    label: 'favorit',
    edit: {
      header: 'Rediger favorit'
    },
    group: {
      add: 'Status &#39;{0}&#39; føjes til favoritlisten.',
      exists: 'Denne status stadig eksisterer.',
      noTimeseries: 'I øjeblikket ingen Timeseries er valgt.',
      notSupported: 'Udbyderen af ​​en post af status &#39;{0}&#39; er ikke understøttet og kan ikke indlæses.'
    },
    single: {
      add: 'En ny favorit &#39;{0}&#39; er føjet til listen.',
      remove: 'Den foretrukne &#39;{0}&#39; er fjernet.',
      exists: 'Denne favorit eksisterer stadig.',
      notSupported: 'Udbyderen af ​​foretrukne &#39;{0}&#39; er ikke understøttet og kan ikke indlæses.'
    },
    import: {
      override: 'Har du lyst til at tilsidesætte dine nuværende favoritter?',
      wrongFile: 'Kunne ikke læse filen',
      noValidJson: 'Den JSON fil er ikke gyldig!',
      header: 'Importer favoritter',
      text: 'Her kan du importere dine eksporterede favoritter. Bare indsæt JSON i dette tekstfelt:'
    },
    export: {
      header: 'Eksport favoritter',
      text: 'Her kan du eksportere dine favoritter. Bare kopiere JSON ud af dette tekstfelt og gemme det i en fil til at importere det senere:'
    },
    error: {
      fileApiNotSupported: 'Filen API&#39;er er ikke fuldt understøttet i denne browser.'
    }
  },
  inform: {
    error: 'Der opstod en fejl:',
    warn: 'Husk, at:'
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
i18n.gr = {
  fullName: 'ελληνικά',
  ok: 'OK',
  main: {
    legend: 'Θρύλος',
    diagram: 'Διάγραμμα',
    mapView: 'Προβολή χάρτη',
    favoriteView: 'Αγαπημένα',
    settings: 'Ρυθμίσεις',
    stationSelection: 'Επιλέξτε ένα σταθμό',
    chartView: 'Προβολή γραφήματος',
    allPhenomena: 'Όλα τα Φαινόμενα',
    phenomenon: 'Φαινόμενο',
    favoritesList: 'Αγαπημένα',
    importFavorites: 'Εισαγωγή',
    exportFavorites: 'Εξαγωγή',
    importExportHelp: 'Για να εισαγάγετε ένα αρχείο, επιλέξτε ένα αρχείο που εξάγονται πριν.',
    noFileSelected: 'Δεν έχει επιλεγεί αρχείο'
  },
  chart: {
    noTimeseriesSelected: 'Έχετε επιλέξει δεν χρονοσειρών, οι επιλεγμένες χρονοσειρών δεν έχουν τιμές στο δεδομένο χρονικό διάστημα ή οι χρονοσειρές είναι κρυφό.',
    outsideOfDataRange: 'Έξω από την περιοχή δεδομένων!',
    annotation: 'Τα στοιχεία χωρίς εγγύηση!',
    monthNames: [ 'Ιαν', 'Φεβρουάριος', 'Mar', 'Απρίλιος', 'Μάιος', 'Ιούνιος', 'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριο', 'Νοέμβριος', 'Δεκέμβριος' ]
  },
  table: {
    time: 'Ώρα'
  },
  map: {
    userLocation: 'Εδώ είναι η τρέχουσα τοποθεσία σας',
    stationSelection: {
      station: 'Σταθμός',
      selectAllTimeseries: 'επιλέξετε όλες τις χρονοσειρές'
    },
    stationLocation: {
      station: 'Σταθμός',
      timeseries: 'Χρονοσειρά',
      provider: 'Προμηθευτής',
      jumpBackToChart: 'πίσω στο διάγραμμα'
    },
    providerList: {
      provider: 'Προμηθευτής',
      stations: 'Σταθμοί',
      timeseries: 'Χρονοσειρά',
      phenomena: 'Φαινόμενα'
    },
    search: {
      label: 'αναζήτηση διεύθυνσης ...',
      noResult: 'Λυπούμαστε, αλλά αυτή η διεύθυνση δεν θα μπορούσε να βρεθεί.'
    }
  },
  listSelection: {
    header: 'Επιλέξτε χρονοσειρές από λίστα',
    headers: {
      category: 'Κατηγορία',
      station: 'Σταθμός',
      phenomenon: 'Φαινόμενο',
      procedure: 'Αισθητήρας'
    },
    warning: {
      moreThanOneTimeseries: 'βρέθηκαν περισσότερες από μία χρονοσειρά'
    }
  },
  legend: {
    entry: {
      noData: 'Δεν υπάρχουν διαθέσιμα στοιχεία',
      jumpToLastValue: 'άλμα στην τελευταία τιμή',
      firstValueAt: 'Πρώτη αξία σε',
      lastValueAt: 'Τελευταία αξία σε'
    }
  },
  export: {
    label: 'Τα δεδομένα ως CSV (Zip Αρχείο)'
  },
  timeSelection: {
    header: 'Χρονικό διάστημα',
    presetsHeader: 'προεπιλογές',
    presets: {
      lastHour: 'τελευταία ώρα',
      today: 'σήμερα',
      yesterday: 'εχθές',
      todayYesterday: 'σήμερα και χθες',
      thisWeek: 'αυτή την εβδομάδα',
      lastWeek: 'την περασμένη εβδομάδα',
      thisMonth: 'Αυτό το μήνα',
      lastMonth: 'τον περασμένο μήνα',
      thisYear: 'φέτος',
      lastYear: 'πέρυσι'
    },
    custom: {
      header: 'έθιμο',
      start: 'Ημερομηνία έναρξης',
      end: 'Ημερομηνία λήξης'
    },
    warning: {
      startBeforeEnd: 'Η ημερομηνία έναρξης δεν μπορεί να είναι μεγαλύτερη από την ημερομηνία λήξης',
      maxTimeRange: 'Το εύρος του χρόνου δεν μπορεί να είναι μεγαλύτερη του ενός έτους'
    }
  },
  styleChange: {
    header: 'Αλλαγή στυλ',
    currentColor: 'Τρέχουσα χρώμα',
    selectColor: 'Επιλέξτε ένα νέο χρώμα',
    selectBarInterval: 'Επιλέξτε το διάστημα μπαρ',
    barChartInterval: {
      hour: 'Ώρα',
      day: 'Ημέρα',
      week: 'Εβδομάδα',
      month: 'Μήνας'
    },
    zeroScaled: 'μηδέν κλίμακα Y-άξονα',
    groupedAxis: 'ομαδοποιούνται άξονα'
  },
  settings: {
    header: 'Ρυθμίσεις',
    chooseLanguage: 'Αλλαγή γλώσσας',
    requiresRestart: 'Ανάγκες Επανεκκίνηση!',
    permalink: {
      create: 'Δημιουργήστε ένα permalink ως',
      inWindow: 'σύνδεσμο σε νέο παράθυρο',
      inMail: 'σύνδεσμο σε ένα μήνυμα ηλεκτρονικού ταχυδρομείου',
      inClipboard: 'Σύνδεση στο πρόχειρο',
      clipboardInfo: 'Αντιγραφή στο πρόχειρο:',
      inQrCode: 'ως QR-Code',
      favorite: 'Αποθήκευση εργασιακό περιβάλλον ως αγαπημένο είσοδο'
    },
    clusterMarker: 'σύμπλεγμα δείκτη',
    markerWithLastInfo: {
      header: 'δείκτη με πληροφορίες τελευταία τιμή',
      label: 'προσοχή - κάποια υπηρεσία παροχής δεδομένων είναι πολύ αργή'
    },
    saveStatus: {
      header: 'Αποθήκευση περιβάλλον',
      label: 'Όλες οι χρονοσειρές, η επιλεγμένη χρονικού διαστήματος και οι ρυθμίσεις που έχουν αποθηκευτεί συνεχής.'
    },
    resetStatus: 'Επαναφορά περιβάλλον',
    generalizeData: 'γενίκευση των δεδομένων',
    imprint: {
      header: 'Αποτύπωμα',
      github: 'Βρείτε αυτό το έργο στο <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a>',
      text: '<p> <a href="http://52north.org" target="_blank">52 ° Βόρεια GmbH</a> είναι υπεύθυνη για αυτή την ιστοσελίδα. </p><p> 52 ° Βόρεια Πρωτοβουλία για Γεωχωρικών Λογισμικό Ανοικτού Κώδικα GmbH <br> Martin-Luther-King-Weg 24 <br> 48155 Μούνστερ, Γερμανία </p>'
    }
  },
  permalink: {
    noMatchingTimeseriesFound: 'Δεν ταιριάζουν χρονοσειρά βρίσκεται.'
  },
  guide: {
    start: {
      request: 'Όταν ξεκινάτε αυτόν τον οδηγό, η η σημερινή κατάσταση θα μηδενιστεί.'
    },
    step1: {
      header: 'JavaScript Πελάτης - Ξενάγηση',
      text: 'Αυτή η περιήγηση δίνει σε λίγα βήματα μια επισκόπηση πώς να χρησιμοποιήσετε αυτόν τον πελάτη. Πρώτα προσθέτουμε ένα χρονοσειρές από το χάρτη.'
    },
    step2: {
      header: 'Μετάβαση στο χάρτη',
      text: 'Εδώ αλλάξετε την προβολή για να πάρετε ένα χάρτη.'
    },
    step3: {
      header: 'Προβολή χάρτη',
      text: 'Αυτή είναι η προβολή χάρτη. Στο χάρτη μπορείτε να δείτε δείκτες ή markergroups.'
    },
    step4: {
      header: 'Αλλαγή Provider',
      text: 'Εδώ μπορείτε να επιλέξετε έναν άλλο πάροχο χρονοσειρών.'
    },
    step5: {
      header: 'Παρουσιάστε την τοποθεσία',
      text: 'Και εδώ μπορείτε να εντοπίσετε τη συσκευή σας στο χάρτη.'
    },
    step6: {
      header: 'Λίστα επιλογής',
      text: 'Εδώ μπορείτε να επιλέξετε μια χρονοσειρά από ταξινομημένες λίστες.'
    },
    step7: {
      header: 'Επιλέξτε ένα σταθμό',
      text: 'Επιλέξτε τώρα ένα σταθμό στο χάρτη.'
    },
    step8: {
      header: 'Επιλέξτε χρονοσειρά',
      text: 'Επιλέξτε αυτό το πλαίσιο ελέγχου. Εάν υπάρχει μόνο μία χρονοσειρά για το σταθμό αυτό, το πλαίσιο ελέγχου είναι ήδη επιλεγμένο. Τώρα μπορείτε να πάτε με το πλήκτρο &quot;OK&quot; για να φορτώσετε τις χρονοσειρές.'
    },
    step9: {
      header: 'Καταχώρηση Υπόμνημα',
      text: 'Εδώ μπορείτε να δείτε την προστιθέμενη χρονοσειρές. Μπορείτε να διαγράψετε ή να εντοπίσετε τις χρονοσειρές ή να αλλάξετε το χρώμα.'
    },
    step10: {
      header: 'Διάγραμμα',
      text: 'Αυτό είναι το διάγραμμα του επιλεγμένου χρονοσειρών.'
    },
    step11: {
      header: 'Αλλαγή του χρόνου',
      text: 'Εδώ μπορείτε να αλλάξετε την ώρα έκταση για την επιλεγμένη σειρά το χρόνο σας.'
    },
    step12: {
      header: 'Πίνακας Προβολή',
      text: 'Εδώ μπορείτε να πάρετε έναν πίνακα των πρώτων τιμών δεδομένων για την επιλεγμένη σειρά το χρόνο σας.'
    },
    step13: {
      header: 'Αγαπημένη διαχείριση',
      text: 'Οι καταχωρήσεις θρύλος / χρονοσειρά θα μπορούσαν να αποθηκευτούν ως αγαπημένα. Σε αυτή την άποψη όλα τα αγαπημένα που αναφέρονται και θα μπορούσε να διατηρηθεί.'
    },
    step14: {
      header: 'Ολοκληρώθηκε',
      text: 'Μπράβο! <br> Ο πελάτης είναι ένα προϊόν <a href="http://52north.org" target="_blank">52 ° North GmbH</a> . Μπορείτε να βρείτε τον πηγαίο κώδικα για <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a> .'
    }
  },
  favorite: {
    firstValueAt: 'Πρώτη αξία σε',
    lastValueAt: 'Τελευταία αξία σε',
    label: 'αγαπημένο',
    edit: {
      header: 'Επεξεργασία αγαπημένο'
    },
    group: {
      add: 'Η ιδιότητα &#39;{0}&#39; προστέθηκε στη λίστα αγαπημένων.',
      exists: 'Αυτή η κατάσταση εξακολουθεί να υπάρχει.',
      noTimeseries: 'Προς το παρόν δεν υπάρχουν χρονοσειρές επιλεγεί.',
      notSupported: 'Ο πάροχος της εισόδου του καθεστώτος &#39;{0}&#39; δεν υποστηρίζεται και δεν μπορεί να φορτωθεί.'
    },
    single: {
      add: 'Ένα νέο αγαπημένο &#39;{0}&#39;, προστίθεται στη λίστα.',
      remove: 'Το αγαπημένο &#39;{0}&#39; έχει αφαιρεθεί.',
      exists: 'Αυτό το αγαπημένο εξακολουθεί να υφίσταται.',
      notSupported: 'Ο πάροχος της αγαπημένο &#39;{0}&#39; δεν υποστηρίζεται και δεν μπορεί να φορτωθεί.'
    },
    import: {
      override: 'Θέλετε να παρακάμψετε την τρέχουσα αγαπημένα σας;',
      wrongFile: 'Δεν ήταν δυνατή η ανάγνωση του αρχείου',
      noValidJson: 'Το αρχείο JSON δεν είναι έγκυρο!',
      header: 'Εισαγωγή αγαπημένα',
      text: 'Εδώ μπορείτε να εισάγετε εξάγονται τα αγαπημένα σας. Απλά επικολλήστε το JSON σε αυτό το πεδίο κειμένου:'
    },
    export: {
      header: 'Εξαγωγή αγαπημένα',
      text: 'Εδώ μπορείτε να εξάγετε τα αγαπημένα σας. Απλά αντιγράψτε το JSON έξω από αυτό το πλαίσιο κειμένου και να το αποθηκεύσετε σε ένα αρχείο για να το εισάγετε αργότερα:'
    },
    error: {
      fileApiNotSupported: 'Τα APIs αρχείων δεν υποστηρίζονται πλήρως σε αυτό το πρόγραμμα περιήγησης.'
    }
  },
  inform: {
    error: 'Προέκυψε σφάλμα:',
    warn: 'Να θυμάστε ότι:'
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
i18n.es = {
  fullName: 'Español',
  ok: 'OKAY',
  main: {
    legend: 'Leyenda',
    diagram: 'Diagrama',
    mapView: 'Ver mapa',
    favoriteView: 'Favoritos',
    settings: 'Ajustes',
    stationSelection: 'Seleccione una estación',
    chartView: 'Vista de gráfico',
    allPhenomena: 'Todos los fenómenos',
    phenomenon: 'Fenómeno',
    favoritesList: 'Favoritos',
    importFavorites: 'Importación',
    exportFavorites: 'Exportación',
    importExportHelp: 'Para importar un archivo, elija un archivo que exportó antes.',
    noFileSelected: 'No archivo seleccionado'
  },
  chart: {
    noTimeseriesSelected: 'Ha seleccionado no hay series de tiempo, las series de tiempo seleccionados tienen ningún valor en el intervalo de tiempo dado o las series de tiempo están ocultas.',
    outsideOfDataRange: 'Fuera del rango de datos!',
    annotation: 'Datos sin garantía!',
    monthNames: [ 'Jan', 'Febrero', 'Mar', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ]
  },
  table: {
    time: 'Tiempo'
  },
  map: {
    userLocation: 'Aquí está su ubicación actual',
    stationSelection: {
      station: 'Estación',
      selectAllTimeseries: 'seleccionar todas las series de tiempo'
    },
    stationLocation: {
      station: 'Estación',
      timeseries: 'Timeseries',
      provider: 'Proveedor',
      jumpBackToChart: 'Vuelta al gráfico'
    },
    providerList: {
      provider: 'Proveedor',
      stations: 'Estaciones',
      timeseries: 'Timeseries',
      phenomena: 'Fenómenos'
    },
    search: {
      label: 'buscar dirección ...',
      noResult: 'Lo sentimos, esa dirección no se pudo encontrar.'
    }
  },
  listSelection: {
    header: 'Seleccione timeseries por lista',
    headers: {
      category: 'Categoría',
      station: 'Estación',
      phenomenon: 'Fenómeno',
      procedure: 'Sensor'
    },
    warning: {
      moreThanOneTimeseries: 'encontrado más de un timeseries'
    }
  },
  legend: {
    entry: {
      noData: 'No hay datos disponibles',
      jumpToLastValue: 'saltar al último valor',
      firstValueAt: 'Primer valor en',
      lastValueAt: 'Del último valor en'
    }
  },
  export: {
    label: 'Datos como CSV (archivo Zip)'
  },
  timeSelection: {
    header: 'Intervalo de tiempo',
    presetsHeader: 'presets',
    presets: {
      lastHour: 'última hora',
      today: 'hoy',
      yesterday: 'ayer',
      todayYesterday: 'hoy y de ayer',
      thisWeek: 'esta semana',
      lastWeek: 'la semana pasada',
      thisMonth: 'este mes',
      lastMonth: 'mes pasado',
      thisYear: 'este año',
      lastYear: 'el año pasado'
    },
    custom: {
      header: 'costumbre',
      start: 'Fecha de inicio',
      end: 'Fecha de finalización'
    },
    warning: {
      startBeforeEnd: 'La fecha de inicio no puede ser mayor que la fecha de finalización',
      maxTimeRange: 'El rango de tiempo no puede ser mayor que un año'
    }
  },
  styleChange: {
    header: 'Cambiar estilo',
    currentColor: 'El color actual',
    selectColor: 'Seleccione un nuevo color',
    selectBarInterval: 'Seleccione el intervalo de bar',
    barChartInterval: {
      hour: 'Hora',
      day: 'Día',
      week: 'Semana',
      month: 'Mes'
    },
    zeroScaled: 'Y-eje escala de cero',
    groupedAxis: 'eje agrupados'
  },
  settings: {
    header: 'Ajustes',
    chooseLanguage: 'Cambiar idioma',
    requiresRestart: 'Necesidades Reiniciar!',
    permalink: {
      create: 'Crear un enlace permanente como',
      inWindow: 'enlace en una nueva ventana',
      inMail: 'enlace en un correo electrónico',
      inClipboard: 'Vincular al portapapeles',
      clipboardInfo: 'Copiar al portapapeles:',
      inQrCode: 'como QR-Code',
      favorite: 'Guardar entorno de trabajo como entrada favorita'
    },
    clusterMarker: 'marcador de racimo',
    markerWithLastInfo: {
      header: 'marcador con la última información sobre el valor',
      label: 'atención - algunos proveedor de datos son muy lentos'
    },
    saveStatus: {
      header: 'Guardar ambiente',
      label: 'Todas las series de tiempo, el intervalo de tiempo seleccionado y los ajustes se guardan continua.'
    },
    resetStatus: 'Restablecer ambiente',
    generalizeData: 'generalizar los datos',
    imprint: {
      header: 'Pie de imprenta',
      github: 'Encuentra este proyecto en <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a>',
      text: '<p> <a href="http://52north.org" target="_blank">52 ° norte GmbH</a> es responsable de este sitio web. </p><p> 52 ° Iniciativa del Norte para Geoespacial de Código Abierto Software GmbH <br> Martin-Luther-King-Weg 24 <br> 48155 Münster, Alemania </p>'
    }
  },
  permalink: {
    noMatchingTimeseriesFound: 'No hay timeseries juego se encuentra.'
  },
  guide: {
    start: {
      request: 'Al iniciar esta guía, el estado actual se restablecerá.'
    },
    step1: {
      header: 'JavaScript Client - Visita Guiada',
      text: 'Este tour da en pocos pasos una visión general de cómo utilizar este cliente. Primero añadimos unas series de tiempo desde el mapa.'
    },
    step2: {
      header: 'Ir al mapa',
      text: 'Aquí se pasa el fin de obtener un mapa.'
    },
    step3: {
      header: 'Ver mapa',
      text: 'Esta es la vista del mapa. En el mapa se puede ver marcadores o markergroups.'
    },
    step4: {
      header: 'Cambio de Proveedores',
      text: 'Aquí puede seleccionar otro proveedor de series de tiempo.'
    },
    step5: {
      header: 'Mostrar ubicación',
      text: 'Y aquí se puede localizar el dispositivo en el mapa.'
    },
    step6: {
      header: 'Selección de listas',
      text: 'Aquí puede seleccionar un timeseries de listas ordenadas.'
    },
    step7: {
      header: 'Seleccione una estación',
      text: 'Favor, seleccione una estación en el mapa.'
    },
    step8: {
      header: 'Seleccione timeseries',
      text: 'Seleccione esta casilla de verificación. Si sólo hay una series de tiempo para esta estación, la casilla ya está marcada. Ahora puede seguir con el botón &quot;OK&quot; para cargar las series de tiempo.'
    },
    step9: {
      header: 'Entrada de la leyenda',
      text: 'Aquí puedes ver la serie de tiempo añadido. Puede eliminar o localizar las series de tiempo o cambiar el color.'
    },
    step10: {
      header: 'Tabla',
      text: 'Este es el gráfico de la serie de tiempo seleccionado.'
    },
    step11: {
      header: 'Cambiar tiempo',
      text: 'Aquí puede cambiar la medida en la hora de su serie de tiempo seleccionado.'
    },
    step12: {
      header: 'Vista de tabla',
      text: 'Aquí puede obtener una tabla de los valores de los datos en bruto para su serie de tiempo seleccionado.'
    },
    step13: {
      header: 'Gestión favorita',
      text: 'Las entradas de leyenda / timeseries podrían ser guardados como favoritos. En este punto de vista todos los favoritos se enumeran y se podrían mantener.'
    },
    step14: {
      header: 'Terminado',
      text: 'Bien hecho! <br> Este cliente es un producto de <a href="http://52north.org" target="_blank">52 ° norte GmbH</a> . Usted puede encontrar el código fuente en <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a> .'
    }
  },
  favorite: {
    firstValueAt: 'Primer valor en',
    lastValueAt: 'Del último valor en',
    label: 'favorito',
    edit: {
      header: 'Editar favorito'
    },
    group: {
      add: 'El estado &#39;{0}&#39; se añade a la lista de favoritos.',
      exists: 'Todavía existe este estado.',
      noTimeseries: 'Actualmente no se han seleccionado series de tiempo.',
      notSupported: 'El proveedor de una entrada de la situación &#39;{0}&#39; no es compatible y no se puede cargar.'
    },
    single: {
      add: 'Un nuevo favorito &#39;{0}&#39; se añade a la lista.',
      remove: 'Se retira el favorito &#39;{0}&#39;.',
      exists: 'Todavía existe este favorito.',
      notSupported: 'El proveedor de los favoritos &#39;{0}&#39; no es compatible y no se puede cargar.'
    },
    import: {
      override: '¿Quieres anular sus favoritos?',
      wrongFile: 'No se pudo leer el archivo',
      noValidJson: 'El archivo JSON no es válida!',
      header: 'Importar favoritos',
      text: 'Aquí puedes importar tus favoritos exportados. Sólo tienes que pegar el JSON en este campo de texto:'
    },
    export: {
      header: 'Exportar favoritos',
      text: 'Aquí usted puede exportar sus favoritos. Sólo tienes que copiar el JSON salir de este cuadro de texto y guardarlo en un archivo para importarlo más tarde:'
    },
    error: {
      fileApiNotSupported: 'Las API de archivos no son totalmente compatibles con este navegador.'
    }
  },
  inform: {
    error: 'Se produjo un error:',
    warn: 'Por favor, recuerde que:'
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
i18n.ee = {
  fullName: 'eesti',
  ok: 'Korras',
  main: {
    legend: 'Legend',
    diagram: 'Skeem',
    mapView: 'Kaart vaade',
    favoriteView: 'Lemmikud',
    settings: 'Seaded',
    stationSelection: 'Valige jaama',
    chartView: 'Graafiku vaade',
    allPhenomena: 'Kõik Nähtused',
    phenomenon: 'Nähtus',
    favoritesList: 'Lemmikud',
    importFavorites: 'Import',
    exportFavorites: 'Eksport',
    importExportHelp: 'Faili importimiseks, palun vali fail, mida eksporditakse varem.',
    noFileSelected: 'Faili pole valitud'
  },
  chart: {
    noTimeseriesSelected: 'Oled valinud ei timeseries, valitud timeseries pole väärtused antud aja piires või timeseries on peidetud.',
    outsideOfDataRange: 'Väljaspool andmete valikut!',
    annotation: 'Andmed ilma garantii!',
    monthNames: [ 'Jan', 'Veebruar', 'Moonutama', 'Aprill', 'Mai', 'Juuni', 'Juuli', 'August', 'September', 'Oktoober', 'November', 'Detsember' ]
  },
  table: {
    time: 'Aeg'
  },
  map: {
    userLocation: 'Siin on teie praegune asukoht',
    stationSelection: {
      station: 'Jaam',
      selectAllTimeseries: 'vali kõik timeseries'
    },
    stationLocation: {
      station: 'Jaam',
      timeseries: 'Timeseries',
      provider: 'Tarnija',
      jumpBackToChart: 'tagasi skeem'
    },
    providerList: {
      provider: 'Tarnija',
      stations: 'Jaamad',
      timeseries: 'Timeseries',
      phenomena: 'Nähtused'
    },
    search: {
      label: 'otsi aadress ...',
      noResult: 'Vabandame, et aadress ei leitud.'
    }
  },
  listSelection: {
    header: 'Vali timeseries nimekirja järgi',
    headers: {
      category: 'Kategooria',
      station: 'Jaam',
      phenomenon: 'Nähtus',
      procedure: 'Andur'
    },
    warning: {
      moreThanOneTimeseries: 'leidis rohkem kui üks timeseries'
    }
  },
  legend: {
    entry: {
      noData: 'andmed ei ole kättesaadavad',
      jumpToLastValue: 'Viimasele väärtus',
      firstValueAt: 'Esiteks väärtus',
      lastValueAt: 'Viimati väärtus'
    }
  },
  export: {
    label: 'Andmed CSV (Zip Archive)'
  },
  timeSelection: {
    header: 'Ajavahemik',
    presetsHeader: 'presets',
    presets: {
      lastHour: 'Viimase tunni jooksul',
      today: 'täna',
      yesterday: 'eile',
      todayYesterday: 'täna ja eile',
      thisWeek: 'Sel nädalal',
      lastWeek: 'Eelmisel nädalal',
      thisMonth: 'sel kuul',
      lastMonth: 'viimase kuu jooksul',
      thisYear: 'Sel aastal',
      lastYear: 'mullu'
    },
    custom: {
      header: 'tava',
      start: 'Alguskuupäev',
      end: 'Lõppkuupäev'
    },
    warning: {
      startBeforeEnd: 'Alguskuupäev ei tohi olla suurem kui lõppkuupäev',
      maxTimeRange: 'Ajavahemik ei tohi olla suurem kui üks aasta'
    }
  },
  styleChange: {
    header: 'Muuda stiili',
    currentColor: 'Praegune värv',
    selectColor: 'Vali uus värv',
    selectBarInterval: 'Vali baar intervalli',
    barChartInterval: {
      hour: 'Tund',
      day: 'Päev',
      week: 'Nädal',
      month: 'Kuu'
    },
    zeroScaled: 'null korrastatakse Y-telg',
    groupedAxis: 'grupeeritud telje'
  },
  settings: {
    header: 'Seaded',
    chooseLanguage: 'Vaheta keelt',
    requiresRestart: 'Vajab Restart!',
    permalink: {
      create: 'Loo permalink kui',
      inWindow: 'link uues aknas',
      inMail: 'link e-posti',
      inClipboard: 'Link lõikelauale',
      clipboardInfo: 'Kopeeri lõikelauale:',
      inQrCode: 'nagu QR-kood',
      favorite: 'Säästa töökeskkonda lemmiktöö'
    },
    clusterMarker: 'klastri marker',
    markerWithLastInfo: {
      header: 'marker eelmise väärtuse kohta',
      label: 'tähelepanu - mõned andmed pakkuja on väga aeglane'
    },
    saveStatus: {
      header: 'Save keskkond',
      label: 'Kõik timeseries, valitud ajavahemiku ja sätted salvestatakse pidevalt.'
    },
    resetStatus: 'Taasta keskkond',
    generalizeData: 'üldistada andmed',
    imprint: {
      header: 'Jälg',
      github: 'Leia selle projekti juures <a href="https://github.com/52North/js-sensorweb-client" target="_blank">github</a>',
      text: '<p> <a href="http://52north.org" target="_blank">52 ° North GmbH</a> vastutab sellel veebilehel. </p><p> 52 ° North algatus Geospatial Open Source Software GmbH <br> Martin-Luther-King-Weg 24 <br> 48155 Münster, Saksamaa </p>'
    }
  },
  permalink: {
    noMatchingTimeseriesFound: 'Vastavaid timeseries leitakse.'
  },
  guide: {
    start: {
      request: 'Kui hakkad seda juhendit, hetkeseisu nullitakse.'
    },
    step1: {
      header: 'JavaScript Klient - tutvustust',
      text: 'See ekskursioon annab mõne sammu ülevaate, kuidas kasutada seda kliendile. Esiteks lisame timeseries kaardilt.'
    },
    step2: {
      header: 'Mine kaart',
      text: 'Siin me vahetada, et saada kaart.'
    },
    step3: {
      header: 'Kaart vaade',
      text: 'See on kaardi vaade. Kaardil näed markerid või markergroups.'
    },
    step4: {
      header: 'Muuda Provider',
      text: 'Siin saab valida mõne muu timeseries poole.'
    },
    step5: {
      header: 'Näita asukohta',
      text: 'Ja siin võite leida oma seadme kaardil.'
    },
    step6: {
      header: 'Eesti valik',
      text: 'Siin saab valida timeseries välja tellitud nimekirja.'
    },
    step7: {
      header: 'Valige jaama',
      text: 'Palun valige nüüd jaam kaardil.'
    },
    step8: {
      header: 'Vali timeseries',
      text: 'Valige see märkeruut. Kui on ainult üks timeseries selle jaama kast on märkimata. Nüüd võite minna koos &quot;OK&quot; nuppu, et laadida timeseries.'
    },
    step9: {
      header: 'Legend kirje',
      text: 'Siin on näha lisatud aegread. Saate kustutada või leida aegrea või muuta värvi.'
    },
    step10: {
      header: 'Skeem',
      text: 'See on skeem, mis on valitud aegread.'
    },
    step11: {
      header: 'Muuda aeg',
      text: 'Siin saab muuta aega määral Valitud aegread.'
    },
    step12: {
      header: 'Table View',
      text: 'Siin saad tabel algandmed väärtused valitud aegread.'
    },
    step13: {
      header: 'Lemmik juhtimine',
      text: 'Legend sissekanded / timeseries saab salvestada lemmikuid. Seda silmas pidades kõik lemmikutesse loetletud ja mida saab säilitada.'
    },
    step14: {
      header: 'Lõpetas',
      text: 'Hästi tehtud! <br> See klient on toode <a href="http://52north.org" target="_blank">52 ° North GmbH</a> . Leiate lähtekoodi <a href="https://github.com/52North/js-sensorweb-client" target="_blank">github</a> .'
    }
  },
  favorite: {
    firstValueAt: 'Esiteks väärtus',
    lastValueAt: 'Viimati väärtus',
    label: 'lemmik',
    edit: {
      header: 'Edit lemmik'
    },
    group: {
      add: 'Status &#39;{0}&#39; on lisatud lemmikute nimekirja.',
      exists: 'See seisund on endiselt olemas.',
      noTimeseries: 'Praegu ei ole timeseries on valitud.',
      notSupported: 'Pakkuja kandmise staatuse &quot;{0}&quot; ei toetata ja ei saa laadida.'
    },
    single: {
      add: 'Uus lemmik &quot;{0}&quot; on loendisse lisatud.',
      remove: 'Lemmik &#39;{0}&#39; on eemaldatud.',
      exists: 'See lemmik on endiselt olemas.',
      notSupported: 'Pakkuja lemmik &quot;{0}&quot; ei toetata ja ei saa laadida.'
    },
    import: {
      override: 'Kas soovite tühistada oma praeguse nimekirja?',
      wrongFile: 'Ei saa lugeda faili',
      noValidJson: 'JSON faili ei kehti!',
      header: 'Import nimekirja',
      text: 'Siin saate importida oma eksporditud lemmikud. Just kleebi JSON selles tekstiväli:'
    },
    export: {
      header: 'Ekspordi lemmikud',
      text: 'Siin saate eksportida oma lemmikuks. Lihtsalt kopeeri JSON läbi selle tekstikasti ja salvestage see fail importida seda hiljem:'
    },
    error: {
      fileApiNotSupported: 'Faili API ei ole täielikult toetatud selles brauserit.'
    }
  },
  inform: {
    error: 'Tekkis viga:',
    warn: 'Pidage meeles, et:'
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
i18n.fi = {
  fullName: 'Suomi',
  ok: 'Kunnossa',
  main: {
    legend: 'Legenda',
    diagram: 'Kaavio',
    mapView: 'Kartta näkymä',
    favoriteView: 'Suosikit',
    settings: 'Asetukset',
    stationSelection: 'Valitse asema',
    chartView: 'Kuvionäyttöä',
    allPhenomena: 'Kaikki ilmiöt',
    phenomenon: 'Ilmiö',
    favoritesList: 'Suosikit',
    importFavorites: 'Tuonti',
    exportFavorites: 'Vienti',
    importExportHelp: 'Jos haluat tuoda tiedoston, valitse tiedosto viedä ennen.',
    noFileSelected: 'Ei tiedostoa valittuna'
  },
  chart: {
    noTimeseriesSelected: 'Et ole valinnut Palkat, valittu Palkat ei ole arvoja tietyn ajan alue tai Palkat ovat piilossa.',
    outsideOfDataRange: 'Ulkopuolella tietojen valikoima!',
    annotation: 'Tiedot ilman takuuta!',
    monthNames: [ 'Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Toukokuu', 'Kesäkuu', 'Heinäkuu', 'Elokuu', 'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu' ]
  },
  table: {
    time: 'Aika'
  },
  map: {
    userLocation: 'Tässä on nykyinen sijainti',
    stationSelection: {
      station: 'Asema',
      selectAllTimeseries: 'Valitse kaikki Palkat'
    },
    stationLocation: {
      station: 'Asema',
      timeseries: 'Palkat',
      provider: 'Toimittaja',
      jumpBackToChart: 'takaisin kaavioon'
    },
    providerList: {
      provider: 'Toimittaja',
      stations: 'Asemat',
      timeseries: 'Palkat',
      phenomena: 'Ilmiöt'
    },
    search: {
      label: 'etsi osoite ...',
      noResult: 'Anteeksi, että osoitetta ei löytynyt.'
    }
  },
  listSelection: {
    header: 'Valitse Palkat mukaan lista',
    headers: {
      category: 'Luokka',
      station: 'Asema',
      phenomenon: 'Ilmiö',
      procedure: 'Anturi'
    },
    warning: {
      moreThanOneTimeseries: 'havaittu useampi kuin yksi Palkat'
    }
  },
  legend: {
    entry: {
      noData: 'tietoja ei ole käytettävissä',
      jumpToLastValue: 'Siirry viimeiselle arvo',
      firstValueAt: 'Ensimmäinen arvo',
      lastValueAt: 'Viimeinen arvo'
    }
  },
  export: {
    label: 'Data CSV (Zip-arkisto)'
  },
  timeSelection: {
    header: 'Aikaväli',
    presetsHeader: 'esiasetukset',
    presets: {
      lastHour: 'viimeisen tunnin',
      today: 'tänään',
      yesterday: 'eilen',
      todayYesterday: 'tänään &amp; eilen',
      thisWeek: 'tällä viikolla',
      lastWeek: 'viime viikolla',
      thisMonth: 'tässä kuussa',
      lastMonth: 'viime kuussa',
      thisYear: 'tänä vuonna',
      lastYear: 'viime vuonna'
    },
    custom: {
      header: 'asiakassuhde',
      start: 'Aloituspäivä',
      end: 'Päättymispäivä'
    },
    warning: {
      startBeforeEnd: 'Alkamispäivä ei voi olla suurempi silloin lopetuspäivä',
      maxTimeRange: 'Aikaväli ei voi olla suurempi silloin yksi vuosi'
    }
  },
  styleChange: {
    header: 'Muuta tyyliä',
    currentColor: 'Nykyinen väri',
    selectColor: 'Valitse uusi väri',
    selectBarInterval: 'Valitse bar aikaväli',
    barChartInterval: {
      hour: 'Tunti',
      day: 'Päivä',
      week: 'Viikko',
      month: 'Kuukausi'
    },
    zeroScaled: 'nolla skaalata Y-akselilla',
    groupedAxis: 'ryhmitelty akseli'
  },
  settings: {
    header: 'Asetukset',
    chooseLanguage: 'Vaihda kieltä',
    requiresRestart: 'Tarvitsee Restart!',
    permalink: {
      create: 'Luo permalink kuin',
      inWindow: 'linkki uuteen ikkunaan',
      inMail: 'linkki sähköpostitse',
      inClipboard: 'Linkki leikepöydälle',
      clipboardInfo: 'Kopioi leikepöydälle:',
      inQrCode: 'kuten QR-koodi',
      favorite: 'Säästä työympäristöä suosikkikohdetta'
    },
    clusterMarker: 'klusterin merkki',
    markerWithLastInfo: {
      header: 'markkeri viime arvotiedon',
      label: 'huomiota - joidenkin tietojen toimittaja ovat hyvin hitaita'
    },
    saveStatus: {
      header: 'Tallenna ympäristö',
      label: 'Kaikki Palkat, valittu aikajänne ja asetukset tallennetaan jatkuvasti.'
    },
    resetStatus: 'Nollaa ympäristö',
    generalizeData: 'yleistää Data',
    imprint: {
      header: 'Jälki',
      github: 'Etsi tätä hanketta <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a>',
      text: '<p> <a href="http://52north.org" target="_blank">52 ° North GmbH</a> vastaa tällä sivustolla. </p><p> 52 ° North aloitteen Geospatiaalinen Open Source Software GmbH <br> Martin-Luther-King-Weg 24 <br> 48155 Münster, Saksa </p>'
    }
  },
  permalink: {
    noMatchingTimeseriesFound: 'Ei vastaavia Palkat löytyy.'
  },
  guide: {
    start: {
      request: 'Kun käynnistät tämän oppaan, nykytilaa nollataan.'
    },
    step1: {
      header: 'JavaScript Client - Opastettu kierros',
      text: 'Tämä kiertue tarjoaa muutaman askeleen yleiskuvan miten käyttää tätä asiakkaalle. Ensin lisätään Palkat kartalta.'
    },
    step2: {
      header: 'Siirry kartalla',
      text: 'Täällä vaihtaa näkymän saada kartan.'
    },
    step3: {
      header: 'Kartta näkymä',
      text: 'Tämä on karttanäkymässä. Vuonna karttaa näet markkereita tai markergroups.'
    },
    step4: {
      header: 'Muuta Provider',
      text: 'Täällä voit valita toisen Palkat tarjoaja.'
    },
    step5: {
      header: 'Näytä sijainti',
      text: 'Ja täällä voit paikantaa laitteen kartalta.'
    },
    step6: {
      header: 'Luettelo valinta',
      text: 'Täällä voit valita Palkat ulos tilata luetteloita.'
    },
    step7: {
      header: 'Valitse asema',
      text: 'Valitse nyt asema kartalla.'
    },
    step8: {
      header: 'Valitse Palkat',
      text: 'Valitse tämä valintaruutu. Jos on vain yksi Palkat tämän aseman, valintaruutu on jo valittuna. Nyt voit mennä &quot;OK&quot; -painiketta ladataksesi Palkat.'
    },
    step9: {
      header: 'Legend merkintä',
      text: 'Täällä näet lisätty aikasarjoja. Voit poistaa tai paikantaa aikasarjan tai muuttaa väriä.'
    },
    step10: {
      header: 'Kaavio',
      text: 'Tämä on kaavio aikasarjaotoksen.'
    },
    step11: {
      header: 'Muuta aikaa',
      text: 'Täällä voit muuttaa aikaa määrin valitsemallesi aikasarjoja.'
    },
    step12: {
      header: 'Table View',
      text: 'Täältä saat taulukko raakadatan arvoja valitsemasi aikasarjoja.'
    },
    step13: {
      header: 'Suosikki hallinta',
      text: 'Legenda merkinnät / Palkat voitaisiin suosikeiksi. Tässä näkymässä kaikki suosikit on lueteltu ja voidaan säilyttää.'
    },
    step14: {
      header: 'Valmiit',
      text: 'Hyvin tehty! <br> Tämä asiakas on tuotteen <a href="http://52north.org" target="_blank">52 ° North GmbH</a> . Löydät lähdekoodia <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a> .'
    }
  },
  favorite: {
    firstValueAt: 'Ensimmäinen arvo',
    lastValueAt: 'Viimeinen arvo',
    label: 'suosikki',
    edit: {
      header: 'Muokkaa suosikki'
    },
    group: {
      add: 'Tila &quot;{0}&quot; lisätään suosikkilistan.',
      exists: 'Tämä asema on edelleen olemassa.',
      noTimeseries: 'Tällä hetkellä ei ole Palkat valitaan.',
      notSupported: 'Tarjoajan tulon tila &quot;{0}&quot; ei tueta, eikä sitä voi ladata.'
    },
    single: {
      add: 'Uusi suosikki &quot;{0}&quot; on lisätty luetteloon.',
      remove: 'Suosikki &quot;{0}&quot; on poistettu.',
      exists: 'Tämä suosikki on edelleen olemassa.',
      notSupported: 'Tarjoaja suosikki &quot;{0}&quot; ei tueta, eikä sitä voi ladata.'
    },
    import: {
      override: 'Haluatko ohittaa nykyisen suosikkeja?',
      wrongFile: 'Ei voitu lukea tiedostoa',
      noValidJson: 'JSON-tiedosto ei kelpaa!',
      header: 'Tuo suosikit',
      text: 'Täällä voit tuoda viedä suosikkeja. Vain liitä JSON tällä tekstikenttään:'
    },
    export: {
      header: 'Vie suosikit',
      text: 'Täällä voit viedä suosikkisi. Kopioi JSON pois tässä kentässä ja tallentaa sen tiedostoon tuoda sen myöhemmin:'
    },
    error: {
      fileApiNotSupported: 'File API eivät täysin tue tätä selainta.'
    }
  },
  inform: {
    error: 'Virhe:',
    warn: 'Muista, että:'
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
i18n.fr = {
  fullName: 'Français',
  ok: 'D&#39;ACCORD',
  main: {
    legend: 'Légende',
    diagram: 'Diagramme',
    mapView: 'Voir la carte',
    favoriteView: 'Favoris',
    settings: 'Paramètres',
    stationSelection: 'Sélectionnez une station',
    chartView: 'vue graphique',
    allPhenomena: 'Tous les phénomènes',
    phenomenon: 'Phénomène',
    favoritesList: 'Favoris',
    importFavorites: 'Importation',
    exportFavorites: 'Exportation',
    importExportHelp: 'Pour importer un fichier, se il vous plaît choisir un fichier que vous avez exporté auparavant.',
    noFileSelected: 'Aucun fichier sélectionné'
  },
  chart: {
    noTimeseriesSelected: 'Vous avez sélectionné aucun timeseries, les séries chronologiques sélectionnées ne ont pas de valeurs dans l&#39;intervalle de temps donné ou les séries chronologiques sont cachés.',
    outsideOfDataRange: 'En dehors de la plage de données!',
    annotation: 'Données sans garantie!',
    monthNames: [ 'Jan', 'Février', 'Mar', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre' ]
  },
  table: {
    time: 'Temps'
  },
  map: {
    userLocation: 'Voici votre position actuelle',
    stationSelection: {
      station: 'Station',
      selectAllTimeseries: 'sélectionner toutes les séries chronologiques'
    },
    stationLocation: {
      station: 'Station',
      timeseries: 'Timeseries',
      provider: 'Fournisseur',
      jumpBackToChart: 'Retour au tableau'
    },
    providerList: {
      provider: 'Fournisseur',
      stations: 'Stations',
      timeseries: 'Timeseries',
      phenomena: 'Phénomènes'
    },
    search: {
      label: 'Recherche d&#39;adresse ...',
      noResult: 'Désolé, cette adresse n&#39;a pu être trouvée.'
    }
  },
  listSelection: {
    header: 'Sélectionnez timeseries par liste',
    headers: {
      category: 'Catégorie',
      station: 'Station',
      phenomenon: 'Phénomène',
      procedure: 'Capteur'
    },
    warning: {
      moreThanOneTimeseries: 'trouvé plus d&#39;un timeseries'
    }
  },
  legend: {
    entry: {
      noData: 'Aucune donnée disponible',
      jumpToLastValue: 'sauter à la dernière valeur',
      firstValueAt: 'Première valeur à',
      lastValueAt: 'Dernière valeur au'
    }
  },
  export: {
    label: 'Les données au format CSV (Archive Zip)'
  },
  timeSelection: {
    header: 'Plage de temps',
    presetsHeader: 'presets',
    presets: {
      lastHour: 'dernière heure',
      today: 'aujourd&#39;hui',
      yesterday: 'hier',
      todayYesterday: 'aujourd&#39;hui et hier',
      thisWeek: 'cette semaine',
      lastWeek: 'la semaine dernière',
      thisMonth: 'ce mois-ci',
      lastMonth: 'mois dernier',
      thisYear: 'cette année',
      lastYear: 'l&#39;année dernière'
    },
    custom: {
      header: 'coutume',
      start: 'Date de début',
      end: 'Date de fin'
    },
    warning: {
      startBeforeEnd: 'La date de début ne peut pas être supérieur à la date de fin',
      maxTimeRange: 'La plage de temps ne peut pas être supérieur à un année'
    }
  },
  styleChange: {
    header: 'Changer le style',
    currentColor: 'Couleur actuelle',
    selectColor: 'Sélectionnez une nouvelle couleur',
    selectBarInterval: 'Sélectionnez l&#39;intervalle de bar',
    barChartInterval: {
      hour: 'Heure',
      day: 'Jour',
      week: 'Semaine',
      month: 'Mois'
    },
    zeroScaled: 'zéro axe Y mises à l&#39;échelle',
    groupedAxis: 'axe regroupés'
  },
  settings: {
    header: 'Paramètres',
    chooseLanguage: 'Changer de langue',
    requiresRestart: 'Redémarrer besoins!',
    permalink: {
      create: 'Créez un permalien que',
      inWindow: 'lien dans une nouvelle fenêtre',
      inMail: 'lien dans un email',
      inClipboard: 'Lien vers le presse-papiers',
      clipboardInfo: 'Copier dans le presse-papiers:',
      inQrCode: 'que QR-Code',
      favorite: 'Enregistrer environnement de travail que l&#39;entrée préférée'
    },
    clusterMarker: 'marqueur pôle',
    markerWithLastInfo: {
      header: 'marqueur des informations de dernière valeur',
      label: 'attention - certains fournisseurs de données sont très lents'
    },
    saveStatus: {
      header: 'Sauvegarder l&#39;environnement',
      label: 'Toutes les séries chronologiques, le laps de temps sélectionné et les paramètres sont enregistrés en continu.'
    },
    resetStatus: 'Réinitialiser environnement',
    generalizeData: 'généraliser données',
    imprint: {
      header: 'Empreinte',
      github: 'Trouvez ce projet à <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a>',
      text: '<p> <a href="http://52north.org" target="_blank">52 ° Nord GmbH</a> est responsable de ce site. </p><p> 52 ° Initiative du Nord pour Geospatial Open Source Software GmbH <br> Martin-Luther-King-Weg 24 <br> 48155 Münster, Allemagne </p>'
    }
  },
  permalink: {
    noMatchingTimeseriesFound: 'Pas de séries chronologiques est trouvé.'
  },
  guide: {
    start: {
      request: 'Lorsque vous démarrez ce guide, le l&#39;état actuel sera réinitialisé.'
    },
    step1: {
      header: 'JavaScript client - Visite guidée',
      text: 'Cette visite donne en quelques étapes un aperçu comment utiliser ce client. D&#39;abord, nous ajoutons un timeseries de la carte.'
    },
    step2: {
      header: 'Accéder à la carte',
      text: 'Ici, nous passons la vue pour obtenir une carte.'
    },
    step3: {
      header: 'Voir la carte',
      text: 'Ce est la vue de la carte. Dans la carte vous pouvez voir des marqueurs ou markergroups.'
    },
    step4: {
      header: 'Changer de fournisseur',
      text: 'Ici vous pouvez choisir un autre fournisseur de séries chronologiques.'
    },
    step5: {
      header: 'Montrer emplacement',
      text: 'Et là, vous pouvez localiser votre appareil sur la carte.'
    },
    step6: {
      header: 'Sélection d&#39;une liste',
      text: 'Ici vous pouvez sélectionner un timeseries sur les listes ordonnées.'
    },
    step7: {
      header: 'Sélectionnez une station',
      text: 'Se il vous plaît sélectionnez maintenant une station sur la carte.'
    },
    step8: {
      header: 'Sélectionnez timeseries',
      text: 'Cochez cette case. Se il ya seulement une séries chronologiques pour cette station, la case est déjà cochée. Maintenant vous pouvez aller avec le bouton &quot;OK&quot; pour charger les séries chronologiques.'
    },
    step9: {
      header: 'Légende entrée',
      text: 'Ici, vous voyez la série de temps additionnel. Vous pouvez supprimer ou de localiser la série de temps ou de modifier la couleur.'
    },
    step10: {
      header: 'Graphique',
      text: 'Ce est le tableau de la série de temps sélectionné.'
    },
    step11: {
      header: 'Changer temps',
      text: 'Ici vous pouvez changer la mesure de temps pour votre série de temps sélectionné.'
    },
    step12: {
      header: 'Table View',
      text: 'Ici, vous obtenez un tableau des valeurs de données brutes à votre série de temps sélectionné.'
    },
    step13: {
      header: 'Gestion des Signets',
      text: 'Les entrées de légende / séries chronologiques pourraient être enregistrés comme favoris. Dans ce point de vue tous les favoris sont répertoriés et peuvent être maintenues.'
    },
    step14: {
      header: 'Fini',
      text: 'Bravo! <br> Ce client est un produit de <a href="http://52north.org" target="_blank">52 ° Nord GmbH</a> . Vous pouvez trouver le code source sur <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a> .'
    }
  },
  favorite: {
    firstValueAt: 'Première valeur à',
    lastValueAt: 'Dernière valeur au',
    label: 'favori',
    edit: {
      header: 'Modifier préférée'
    },
    group: {
      add: 'Le statut &#39;{0}&#39; est ajouté à la liste des favoris.',
      exists: 'Ce statut existe toujours.',
      noTimeseries: 'Actuellement aucun timeseries sont sélectionnés.',
      notSupported: 'Le fournisseur d&#39;une entrée de l&#39;état &#39;{0}&#39; ne est pas supporté et ne peut pas être chargé.'
    },
    single: {
      add: 'Un nouveau favori &#39;{0}&#39; est ajouté à la liste.',
      remove: 'Le favori &#39;{0}&#39; est retiré.',
      exists: 'Ce favori existe toujours.',
      notSupported: 'Le fournisseur de la favorite &#39;{0}&#39; ne est pas supporté et ne peut pas être chargé.'
    },
    import: {
      override: 'Voulez-vous remplacer vos favoris actuels?',
      wrongFile: 'Impossible de lire le fichier',
      noValidJson: 'Le fichier JSON est pas valide!',
      header: 'favoris d&#39;importation',
      text: 'Ici vous pouvez importer vos favoris exportés. Il suffit de coller l&#39;JSON dans ce champ de texte:'
    },
    export: {
      header: 'Exporter les favoris',
      text: 'Ici vous pouvez exporter vos favoris. Il suffit de copier le JSON sortir de cette zone de texte et l&#39;enregistrer dans un fichier à importer plus tard:'
    },
    error: {
      fileApiNotSupported: 'Les API de fichiers ne sont pas entièrement pris en charge dans ce navigateur.'
    }
  },
  inform: {
    error: 'Une erreur est survenue:',
    warn: 'Se il vous plaît ne oubliez pas que:'
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
i18n.ga = {
  fullName: 'Gaeilge',
  ok: 'OK',
  main: {
    legend: 'Finscéal',
    diagram: 'Léaráid',
    mapView: 'Léarscáil dearcadh',
    favoriteView: 'Favorites',
    settings: 'Socruithe',
    stationSelection: 'Roghnaigh stáisiún',
    chartView: 'Dearcadh Cairt',
    allPhenomena: 'Gach feiniméin',
    phenomenon: 'Feiniméan',
    favoritesList: 'Favorites',
    importFavorites: 'Iompórtáil',
    exportFavorites: 'Easpórtáil',
    importExportHelp: 'A allmhairiú comhad, le do thoil a roghnú comhad a onnmhairíodh tú roimh.',
    noFileSelected: 'Níl comhad roghnaithe'
  },
  chart: {
    noTimeseriesSelected: 'Tá tú a roghnaigh aon timeseries, tá na timeseries roghnaithe bith luachanna sa réimse am ar leith nó na timeseries bhfolach.',
    outsideOfDataRange: 'Taobh amuigh de raon sonraí!',
    annotation: 'Sonraí gan bharántas!',
    monthNames: [ 'Jan', 'Feabhra', 'Mar', 'Aibreán', 'Bealtaine', 'Meitheamh', 'Iúil', 'Lúnasa', 'Meán Fómhair', 'Deireadh Fómhair', 'Samhain', 'Nollaig' ]
  },
  table: {
    time: 'Am'
  },
  map: {
    userLocation: 'Seo é do suíomh reatha',
    stationSelection: {
      station: 'Stáisiún',
      selectAllTimeseries: 'roghnú go léir timeseries'
    },
    stationLocation: {
      station: 'Stáisiún',
      timeseries: 'Timeseries',
      provider: 'Soláthraí',
      jumpBackToChart: 'ar ais go dtí chairt'
    },
    providerList: {
      provider: 'Soláthraí',
      stations: 'Stáisiúin',
      timeseries: 'Timeseries',
      phenomena: 'Feiniméin'
    },
    search: {
      label: 'cuardach a dhéanamh ar seoladh ...',
      noResult: 'Tá brón orainn, ní fhéadfadh an seoladh sin a fháil.'
    }
  },
  listSelection: {
    header: 'Roghnaigh timeseries le liosta',
    headers: {
      category: 'Catagóir',
      station: 'Stáisiún',
      phenomenon: 'Feiniméan',
      procedure: 'Braiteoir'
    },
    warning: {
      moreThanOneTimeseries: 'Fuair ​​timeseries níos mó ná aon'
    }
  },
  legend: {
    entry: {
      noData: 'Níl aon sonraí ar fáil',
      jumpToLastValue: 'léim go luach deiridh',
      firstValueAt: 'An chéad luach ag',
      lastValueAt: 'Luach Last ag'
    }
  },
  export: {
    label: 'Sonraí mar CSV (Zip Cartlann)'
  },
  timeSelection: {
    header: 'Am Raon',
    presetsHeader: 'réamhshocruithe',
    presets: {
      lastHour: 'uair dheireanach',
      today: 'lá atá inniu ann',
      yesterday: 'inné',
      todayYesterday: 'lá atá inniu ann agus an lae inné',
      thisWeek: 'an tseachtain seo',
      lastWeek: 'an tseachtain seo caite',
      thisMonth: 'an mhí seo',
      lastMonth: 'an mhí seo caite',
      thisYear: 'i mbliana',
      lastYear: 'na bliana seo caite'
    },
    custom: {
      header: 'saincheaptha',
      start: 'Dáta tosaithe',
      end: 'Dáta deiridh'
    },
    warning: {
      startBeforeEnd: 'Ní féidir leis an dáta tosaigh a bheith níos mó ansin an dáta deiridh',
      maxTimeRange: 'Ní féidir leis an raon ama a bheith níos mó ansin aon bhliain amháin'
    }
  },
  styleChange: {
    header: 'Athraigh stíl',
    currentColor: 'Dath atá ann faoi láthair',
    selectColor: 'Roghnaigh dath nua',
    selectBarInterval: 'Roghnaigh an t-eatramh barra',
    barChartInterval: {
      hour: 'Uair',
      day: 'Lá',
      week: 'Seachtain',
      month: 'Month'
    },
    zeroScaled: 'náid scála Y-ais',
    groupedAxis: 'ais grúpáilte'
  },
  settings: {
    header: 'Socruithe',
    chooseLanguage: 'Teanga Athraigh',
    requiresRestart: 'Atosaigh Riachtanais!',
    permalink: {
      create: 'Cruthaigh permalink mar',
      inWindow: 'nasc i bhfuinneog nua',
      inMail: 'nasc sa ríomhphost',
      inClipboard: 'Nasc a gearrthaisce',
      clipboardInfo: 'Cóipeáil go gearrthaisce:',
      inQrCode: 'mar QR-Cód',
      favorite: 'Timpeallacht oibre mar iontráil is fearr leat Sábháil'
    },
    clusterMarker: 'marcóir braisle',
    markerWithLastInfo: {
      header: 'marcóir le faisnéis luach deiridh',
      label: 'aird - tá roinnt soláthraí sonraí an-mhall'
    },
    saveStatus: {
      header: 'Sábháil timpeallacht',
      label: 'Gach timeseries, an méid ama maidir roghnaithe agus na socruithe a shábháil leanúnach.'
    },
    resetStatus: 'Timpeallacht Athshocraigh',
    generalizeData: 'ghinearálú Sonraí',
    imprint: {
      header: 'Imprint',
      github: 'Faigh an tionscadal seo ag <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a>',
      text: '<p> <a href="http://52north.org" target="_blank">52 ° GmbH Thuaidh</a> freagrach as an suíomh gréasáin seo. </p><p> 52 ° Tionscnamh Thuaidh do geospáis Foinse Oscailte Bogearraí GmbH <br> Martin Luther--King-Weg 24 <br> 48,155 MUENSTER, An Ghearmáin </p>'
    }
  },
  permalink: {
    noMatchingTimeseriesFound: 'Níl timeseries meaitseáil fáil.'
  },
  guide: {
    start: {
      request: 'Nuair a thosaíonn tú an treoir, beidh an staid reatha a athshocrú.'
    },
    step1: {
      header: 'JavaScript Cliant - Treoraithe Turas',
      text: 'Tugann an turas seo i roinnt céimeanna forbhreathnú conas é a úsáid seo a cliant. An Chéad muid add timeseries ón léarscáil.'
    },
    step2: {
      header: 'Téigh go dtí an léarscáil',
      text: 'Anseo táimid ag aistriú an dearcadh a fháil ar léarscáil.'
    },
    step3: {
      header: 'Léarscáil dearcadh',
      text: 'Is é seo an dearcadh léarscáil. Sa an léarscáil is féidir leat a fheiceáil marcóirí nó markergroups.'
    },
    step4: {
      header: 'Athraigh Soláthraí',
      text: 'Anseo is féidir leat a roghnú soláthraí eile timeseries.'
    },
    step5: {
      header: 'Taispeáin suíomh',
      text: 'Agus is anseo is féidir leat a aimsiú do gléas ar an léarscáil.'
    },
    step6: {
      header: 'Liosta roghnú',
      text: 'Anseo is féidir leat a roghnú timeseries as liostaí ordaigh.'
    },
    step7: {
      header: 'Roghnaigh stáisiún',
      text: 'Roghnaigh le do thoil anois stáisiún ar an léarscáil.'
    },
    step8: {
      header: 'Roghnaigh timeseries',
      text: 'Roghnaigh an ticbhosca seo. Mura bhfuil ach aon timeseries don stáisiún, tá an ticbhosca sheiceáil cheana féin. Anois is féidir leat dul ar aghaidh leis an cnaipe &quot;OK&quot; a luchtú an timeseries.'
    },
    step9: {
      header: 'Iontráil finscéal',
      text: 'Anseo a fheiceann tú ar an tsraith ama leis. Is féidir leat a scriosadh nó a lonnú ar an tsraith ama nó a athrú ar an dath.'
    },
    step10: {
      header: 'Cairt',
      text: 'Is é seo an chairt ar an tsraith ama roghnaithe.'
    },
    step11: {
      header: 'Athraigh am',
      text: 'Anseo is féidir leat athrú ar an méid ama do do chuid shraith ama roghnaithe.'
    },
    step12: {
      header: 'Radharc an Tábla',
      text: 'Anseo gheobhaidh tú tábla na luachanna sonraí amh le do shraith ama roghnaithe.'
    },
    step13: {
      header: 'Bainistíocht Favorite',
      text: 'D&#39;fhéadfadh na hiontrálacha finscéal / timeseries a shábháil mar Favorites. Sa dearcadh seo go léir Favorites liostaithe agus d&#39;fhéadfadh a chothabháil.'
    },
    step14: {
      header: 'Críochnaithe',
      text: 'Maith thú! <br> Is é seo an cliant a táirge de <a href="http://52north.org" target="_blank">52 ° GmbH Thuaidh</a> . Is féidir leat teacht ar an cód foinse ar <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a> .'
    }
  },
  favorite: {
    firstValueAt: 'An chéad luach ag',
    lastValueAt: 'Luach Last ag',
    label: 'is fearr leat',
    edit: {
      header: 'Cuir fearr leat'
    },
    group: {
      add: 'Stádas &#39;{0}&#39; a chur leis an liosta is fearr leat.',
      exists: 'Seo an stádas ann go fóill.',
      noTimeseries: 'Faoi láthair níl aon timeseries a roghnú.',
      notSupported: 'An soláthraí iontráil ar stádas &#39;{0}&#39; Níl tacaíocht agus ní féidir iad a luchtú.'
    },
    single: {
      add: 'A is fearr leat nua &#39;{0}&#39; a chur leis an liosta.',
      remove: 'Is é an fearr leat &#39;{0}&#39; bhaint.',
      exists: 'Seo is fearr leat ann go fóill.',
      notSupported: 'An soláthraí an fearr leat &#39;{0}&#39; Níl tacaíocht agus ní féidir iad a luchtú.'
    },
    import: {
      override: 'Ar mhaith leat a shárú do Favorites reatha?',
      wrongFile: 'Níorbh fhéidir an comhad a léamh',
      noValidJson: 'Níl an comhad JSON bailí!',
      header: 'Favorites Iompórtáil',
      text: 'Anseo is féidir leat a allmhairiú do Favorites a onnmhairíodh. Just a ghreamú ar an JSON sa réimse téacs:'
    },
    export: {
      header: 'Favorites Easpórtáil',
      text: 'Anseo is féidir leat a onnmhairiú do rogha pearsanta. Just a chóipeáil an JSON as an textbox agus é a shábháil i gcomhad a allmhairiú níos déanaí:'
    },
    error: {
      fileApiNotSupported: 'Níl na APIs Comhad tacaíocht iomlán sa bhrabhsálaí.'
    }
  },
  inform: {
    error: 'Tharla earráid:',
    warn: 'Cuimhnigh go:'
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
i18n.hr = {
  fullName: 'Hrvatski',
  ok: 'OK',
  main: {
    legend: 'Legenda',
    diagram: 'Dijagram',
    mapView: 'Prikaz karte',
    favoriteView: 'Omiljene',
    settings: 'Postavke',
    stationSelection: 'Odaberite stanicu',
    chartView: 'Prikaz grafikona',
    allPhenomena: 'Sve pojave',
    phenomenon: 'Pojava',
    favoritesList: 'Omiljene',
    importFavorites: 'Uvoz',
    exportFavorites: 'Izvoz',
    importExportHelp: 'Za uvoz datoteke, odaberite datoteku koju izvozi prije.',
    noFileSelected: 'Ne odabrane datoteke'
  },
  chart: {
    noTimeseriesSelected: 'Odabrali ste ne timeseries, odabrani timeseries nemaju vrijednosti u određenom vremenskom rasponu ili timeseries su skriveni.',
    outsideOfDataRange: 'Izvan raspona podataka!',
    annotation: 'Podaci bez jamstva!',
    monthNames: [ 'Jan', 'Veljače', 'Pokvariti', 'Travnja', 'Svibanj', 'Lipnja', 'Srpnja', 'Kolovoz', 'Rujna', 'Listopada', 'Studeni', 'Prosinca' ]
  },
  table: {
    time: 'Vrijeme'
  },
  map: {
    userLocation: 'Ovdje je vaš trenutni položaj',
    stationSelection: {
      station: 'Stanica',
      selectAllTimeseries: 'odaberite sve timeseries'
    },
    stationLocation: {
      station: 'Stanica',
      timeseries: 'Timeseries',
      provider: 'Davatelj',
      jumpBackToChart: 'Povratak na grafikonu'
    },
    providerList: {
      provider: 'Davatelj',
      stations: 'Postaje',
      timeseries: 'Timeseries',
      phenomena: 'Fenomeni'
    },
    search: {
      label: 'tražiti adrese ...',
      noResult: 'Žao nam je, da je adresa se ne može naći.'
    }
  },
  listSelection: {
    header: 'Odaberite timeseries po popisu',
    headers: {
      category: 'Kategorija',
      station: 'Stanica',
      phenomenon: 'Pojava',
      procedure: 'Senzor'
    },
    warning: {
      moreThanOneTimeseries: 'naći više od jednog timeseries'
    }
  },
  legend: {
    entry: {
      noData: 'nema raspoloživih podataka',
      jumpToLastValue: 'skočiti na posljednjem vrijednost',
      firstValueAt: 'Prvo vrijednost na',
      lastValueAt: 'Zadnja vrijednost na'
    }
  },
  export: {
    label: 'Podaci kao CSV (Zip arhiva)'
  },
  timeSelection: {
    header: 'Vrijeme Raspon',
    presetsHeader: 'Zadane postavke',
    presets: {
      lastHour: 'posljednji čas',
      today: 'danas',
      yesterday: 'jučer',
      todayYesterday: 'Danas i jučer',
      thisWeek: 'ovaj tjedan',
      lastWeek: 'prošlog tjedna',
      thisMonth: 'ovaj mjesec',
      lastMonth: 'prošli mjesec',
      thisYear: 'Ove godine',
      lastYear: 'prošle godine'
    },
    custom: {
      header: 'običaj',
      start: 'Datum početka',
      end: 'Datum završetka'
    },
    warning: {
      startBeforeEnd: 'Datum početka ne može biti veći od datuma završetka',
      maxTimeRange: 'Vremensko razdoblje ne može biti veći od jedne godine'
    }
  },
  styleChange: {
    header: 'Promjena stila',
    currentColor: 'Trenutna boja',
    selectColor: 'Odaberite novu boju',
    selectBarInterval: 'Odaberite bar interval',
    barChartInterval: {
      hour: 'Sat',
      day: 'Dan',
      week: 'Tjedan',
      month: 'Mjesec'
    },
    zeroScaled: 'nula krljuštima Y-os',
    groupedAxis: 'grupirani os'
  },
  settings: {
    header: 'Postavke',
    chooseLanguage: 'Prebacivanje jezika',
    requiresRestart: 'Potrebno Restart!',
    permalink: {
      create: 'Napravite Permalink kao',
      inWindow: 'karika u novom prozoru',
      inMail: 'Veza na e-mail',
      inClipboard: 'Veza u međuspremnik',
      clipboardInfo: 'Kopiraj u međuspremnik:',
      inQrCode: 'kao QR-Code',
      favorite: 'Spremite radnu okolinu kao omiljeni stupanja'
    },
    clusterMarker: 'cluster marker',
    markerWithLastInfo: {
      header: 'marker s prošlom informacije vrijednosti',
      label: 'pozornost - neki pružatelj podaci su vrlo sporo'
    },
    saveStatus: {
      header: 'Spremi okoliš',
      label: 'Svi timeseries, odabranog razdoblja i postavke se spremaju kontinuirano.'
    },
    resetStatus: 'Reset okoliš',
    generalizeData: 'generalizirati podataka',
    imprint: {
      header: 'Otisak',
      github: 'Nađi ovaj projekt na <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a>',
      text: '<p> <a href="http://52north.org" target="_blank">52 ° North GmbH</a> je odgovorna za ove web stranice. </p><p> 52 ° North Inicijativa geoprostornih Open Source Software GmbH <br> Martin Luther--kralj-Weg 24 <br> 48155 Münster, Njemačka </p>'
    }
  },
  permalink: {
    noMatchingTimeseriesFound: 'Nema podudaranje timeseries pronađen.'
  },
  guide: {
    start: {
      request: 'Kada pokrenete ovaj vodič, trenutno stanje će se vratiti.'
    },
    step1: {
      header: 'JavaScript Klijent - vodič',
      text: 'Ovaj izlet daje u nekoliko koraka pregled kako koristiti ovu stranku. Prvo ćemo dodati timeseries s karte.'
    },
    step2: {
      header: 'Idi na karti',
      text: 'Ovdje smo se prebacili u pogledu dobiti kartu.'
    },
    step3: {
      header: 'Prikaz karte',
      text: 'Ovo je prikaz karte. U karti možete vidjeti markere ili markergroups.'
    },
    step4: {
      header: 'Promjena usluga',
      text: 'Ovdje možete odabrati drugi timeseries usluga.'
    },
    step5: {
      header: 'Pokaži položaj',
      text: 'I ovdje možete pronaći svoj uređaj na karti.'
    },
    step6: {
      header: 'Izbor popis',
      text: 'Ovdje možete odabrati timeseries od naručenih liste.'
    },
    step7: {
      header: 'Odaberite stanicu',
      text: 'Odaberite sada postaju na karti.'
    },
    step8: {
      header: 'Odaberite timeseries',
      text: 'Odaberite ovaj okvir. Ako postoji samo jedna timeseries za ovu stanicu, okvir je već provjerio. Sada možete nastaviti s &quot;OK&quot; gumb za učitavanje timeseries.'
    },
    step9: {
      header: 'Unos Legenda',
      text: 'Ovdje možete vidjeti dodanu vremenske serije. Možete brisati ili pronaći vremenske serije ili promijeniti boju.'
    },
    step10: {
      header: 'Grafikon',
      text: 'To je shema odabranom vremenskom nizu.'
    },
    step11: {
      header: 'Promjena vremena',
      text: 'Ovdje možete promijeniti vremensku mjeru za vaše odabrane vremenske serije.'
    },
    step12: {
      header: 'Tablica Pogledaj',
      text: 'Ovdje možete dobiti stol od sirovih vrijednosti podataka o odabranom vremenskom nizu.'
    },
    step13: {
      header: 'Omiljeni upravljanje',
      text: 'Legenda unosi / timeseries mogu se spremiti kao favorite. U tom pogledu svi favoriti su navedeni i mogu se održavati.'
    },
    step14: {
      header: 'Gotovi',
      text: 'Bravo! <br> Ovaj klijent je produkt <a href="http://52north.org" target="_blank">52 ° sjeverne GmbH</a> . Možete pronaći izvorni kod na <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a> .'
    }
  },
  favorite: {
    firstValueAt: 'Prvo vrijednost na',
    lastValueAt: 'Zadnja vrijednost na',
    label: 'omiljen',
    edit: {
      header: 'Uredi omiljene'
    },
    group: {
      add: 'Status &#39;{0}&#39; je dodana na popis omiljenih.',
      exists: 'Ovaj status i dalje postoji.',
      noTimeseries: 'Trenutno nema timeseries su izabrani.',
      notSupported: 'Pružatelj upis statusa &#39;{0}&#39; nije podržana i ne može se učitati.'
    },
    single: {
      add: 'Nova omiljena &#39;{0}&#39; je dodan na popis.',
      remove: 'Omiljena &#39;{0}&#39; je uklonjen.',
      exists: 'Ova omiljena i dalje postoji.',
      notSupported: 'Pružatelj favorita &#39;{0}&#39; nije podržana i ne može se učitati.'
    },
    import: {
      override: 'Želite li poništiti svoje trenutne favorite?',
      wrongFile: 'Ne mogu pročitati datoteku',
      noValidJson: 'JSON datoteka nije valjana!',
      header: 'Uvoz favoriti',
      text: 'Ovdje možete uvesti svoje favorite izvozi. Samo zalijepite JSON u ovom tekstnom polju:'
    },
    export: {
      header: 'Izvoz favoriti',
      text: 'Ovdje možete izvoziti svoje favorite. Samo kopirajte JSON iz ove tekstom i spremite ga u datoteku to uvesti kasnije:'
    },
    error: {
      fileApiNotSupported: 'API-ja datoteke nisu u potpunosti podržan u ovom pregledniku.'
    }
  },
  inform: {
    error: 'Došlo je do pogreške:',
    warn: 'Imajte na umu da:'
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
i18n.hu = {
  fullName: 'Magyar',
  ok: 'Rendben',
  main: {
    legend: 'Legenda',
    diagram: 'Diagram',
    mapView: 'Térkép nézet',
    favoriteView: 'Kedvencek',
    settings: 'Beállítások',
    stationSelection: 'Válasszon ki egy állomást',
    chartView: 'Diagram nézet',
    allPhenomena: 'Minden jelenség',
    phenomenon: 'Jelenség',
    favoritesList: 'Kedvencek',
    importFavorites: 'Import',
    exportFavorites: 'Export',
    importExportHelp: 'Fájl importálásához, válasszon egy exportált fájlt előtt.',
    noFileSelected: 'Nincs fájl kiválasztva'
  },
  chart: {
    noTimeseriesSelected: 'Nem választott ki előre definiált, a kiválasztott előre definiált nincs értékeket az adott időben tartomány vagy a előre definiált rejtett.',
    outsideOfDataRange: 'Kívül adatok körét!',
    annotation: 'Az adatok garancia nélkül!',
    monthNames: [ 'Január', 'Február', 'Elront', 'Április', 'Május', 'Június', 'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December' ]
  },
  table: {
    time: 'Idő'
  },
  map: {
    userLocation: 'Itt az aktuális tartózkodási helyét',
    stationSelection: {
      station: 'Állomás',
      selectAllTimeseries: 'jelölje ki az összes előre definiált'
    },
    stationLocation: {
      station: 'Állomás',
      timeseries: 'Előre definiált',
      provider: 'Ellátó',
      jumpBackToChart: 'Vissza a chart'
    },
    providerList: {
      provider: 'Ellátó',
      stations: 'Állomások',
      timeseries: 'Előre definiált',
      phenomena: 'Jelenségek'
    },
    search: {
      label: 'címkereséshez ...',
      noResult: 'Sajnáljuk, hogy címet nem található.'
    }
  },
  listSelection: {
    header: 'Válassza ki az előre definiált tömbök által lista',
    headers: {
      category: 'Kategória',
      station: 'Állomás',
      phenomenon: 'Jelenség',
      procedure: 'Érzékelő'
    },
    warning: {
      moreThanOneTimeseries: 'találtak több mint egy előre definiált'
    }
  },
  legend: {
    entry: {
      noData: 'nincs adat',
      jumpToLastValue: 'utolsó értéket',
      firstValueAt: 'Első érték',
      lastValueAt: 'Utolsó érték'
    }
  },
  export: {
    label: 'Az adatok CSV (Zip archívum)'
  },
  timeSelection: {
    header: 'Idő Tartomány',
    presetsHeader: 'előre beállított',
    presets: {
      lastHour: 'az elmúlt órában',
      today: 'ma',
      yesterday: 'tegnap',
      todayYesterday: 'Ma &amp; tegnap',
      thisWeek: 'ezen a héten',
      lastWeek: 'a múlt héten',
      thisMonth: 'ebben a hónapban',
      lastMonth: 'az utolsó hónapban',
      thisYear: 'ebben az évben',
      lastYear: 'tavaly'
    },
    custom: {
      header: 'szokás',
      start: 'Kezdési időpont',
      end: 'A befejezés dátuma'
    },
    warning: {
      startBeforeEnd: 'A kezdő dátum nem lehet nagyobb, mint a befejezés dátumát',
      maxTimeRange: 'Az idő tartomány nem lehet nagyobb, mint egy év'
    }
  },
  styleChange: {
    header: 'Stílus',
    currentColor: 'Jelenlegi színe',
    selectColor: 'Válasszon egy új színt',
    selectBarInterval: 'Válassza ki a vonalat intervallum',
    barChartInterval: {
      hour: 'Óra',
      day: 'Nap',
      week: 'Hét',
      month: 'Hónap'
    },
    zeroScaled: 'zéró pikkelyes Y-tengely',
    groupedAxis: 'csoportosítva tengely'
  },
  settings: {
    header: 'Beállítások',
    chooseLanguage: 'Switch nyelven',
    requiresRestart: 'Újra kell indítani!',
    permalink: {
      create: 'Hozzon létre egy permalink mint',
      inWindow: 'Link új ablakban',
      inMail: 'linkre egy e-mailt',
      inClipboard: 'Hivatkoznak a vágólapra',
      clipboardInfo: 'Másolás a vágólapra:',
      inQrCode: 'mint QR-kód',
      favorite: 'Mentsd munkakörnyezet kedvencként bejegyzés'
    },
    clusterMarker: 'cluster marker',
    markerWithLastInfo: {
      header: 'marker utolsó értéket információk',
      label: 'Figyelem - néhány adatszolgáltató nagyon lassúak'
    },
    saveStatus: {
      header: 'Save környezet',
      label: 'Minden előre definiált, a kiválasztott időtávot és a beállítások mentése folyamatos.'
    },
    resetStatus: 'Reset környezet',
    generalizeData: 'általánosítani adatok',
    imprint: {
      header: 'Impresszum',
      github: 'Keresd meg ezt a projektet <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a>',
      text: '<p> <a href="http://52north.org" target="_blank">52 ° North GmbH</a> felelős ezen a weboldalon. </p><p> 52 ° North Initiative for térinformatikai nyílt forráskódú szoftver GmbH <br> Martin-Luther-King-Weg 24 <br> 48155 Münster, Németország </p>'
    }
  },
  permalink: {
    noMatchingTimeseriesFound: 'Nem illő előre definiált található.'
  },
  guide: {
    start: {
      request: 'Amikor elindítja ezt az útmutatót, az a jelenlegi állapot visszaáll.'
    },
    step1: {
      header: 'JavaScript Client - Tárlatvezetés',
      text: 'Ez a túra ad néhány lépésben áttekintést, hogyan kell használni ezt a kliens. Először adjunk hozzá egy előre definiált a térképről.'
    },
    step2: {
      header: 'Menj a térképen',
      text: 'Itt váltani a nézetet, hogy a térképet.'
    },
    step3: {
      header: 'Térkép nézet',
      text: 'Ez a térkép nézet. A térképen látható markerek vagy markergroups.'
    },
    step4: {
      header: 'Change Provider',
      text: 'Itt választhatunk más előre definiált szolgáltatót.'
    },
    step5: {
      header: 'Show location',
      text: 'És itt keresse meg a készülék a térképen.'
    },
    step6: {
      header: 'Lista kiválasztása',
      text: 'Itt lehet kiválasztani a előre definiált ki rendezett listák.'
    },
    step7: {
      header: 'Válasszon ki egy állomást',
      text: 'Kérjük, válasszon most egy állomás a térképen.'
    },
    step8: {
      header: 'Válassza ki az előre definiált tömbök',
      text: 'Válassza ki ezt a jelölőnégyzetet. Ha csak egy előre definiált ennek az állomásnak, a négyzetet bejelölve. Most lehet menni az &quot;OK&quot; gombot betölteni az előre definiált.'
    },
    step9: {
      header: 'Legend bejegyzés',
      text: 'Itt láthatja a hozzá idősorok. Törölheti, vagy keresse az idősor, vagy változtatni a színét.'
    },
    step10: {
      header: 'Táblázat',
      text: 'Ez az ábra a kiválasztott idősorok.'
    },
    step11: {
      header: 'Váltási idő',
      text: 'Itt lehet megváltoztatni az időt mértékben az Ön által választott idősorok.'
    },
    step12: {
      header: 'Táblázat megtekintése',
      text: 'Most itt van egy táblázat a nyers adatok értékeket a kiválasztott idősorok.'
    },
    step13: {
      header: 'Kedvenc menedzsment',
      text: 'A legenda bejegyzések / előre definiált meg lehetne menteni a kedvencek. Ebben a nézetben az összes kedvenc vannak felsorolva, és fenn lehet tartani.'
    },
    step14: {
      header: 'Kész',
      text: 'Szép munka! <br> Ez a kliens egy olyan termék a <a href="http://52north.org" target="_blank">52 ° North GmbH</a> . Megtalálható a forráskódot <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a> .'
    }
  },
  favorite: {
    firstValueAt: 'Első érték',
    lastValueAt: 'Utolsó érték',
    label: 'kedvenc',
    edit: {
      header: 'Kedvenc szerkesztése'
    },
    group: {
      add: 'A status &#39;{0}&#39; hozzáadódik a kedvenceid közé.',
      exists: 'Ez az állapot továbbra is fennáll.',
      noTimeseries: 'Jelenleg nincs előre definiált kerülnek kiválasztásra.',
      notSupported: 'A szolgáltató a bejegyzést a status &#39;{0}&#39; nem támogatott és nem lehet betölteni.'
    },
    single: {
      add: 'Egy új kedvenc &quot;{0}&quot; hozzáadódik a listához.',
      remove: 'A kedvenc &#39;{0}&#39; eltávolítása.',
      exists: 'Ez a kedvenc még mindig létezik.',
      notSupported: 'A szolgáltató a kedvenc &#39;{0}&#39; nem támogatott és nem lehet betölteni.'
    },
    import: {
      override: 'Szeretné, hogy felülbírálja az aktuális kedvencek?',
      wrongFile: 'Nem sikerült beolvasni a fájlt',
      noValidJson: 'A JSON fájl nem érvényes!',
      header: 'Import kedvencekhez',
      text: 'Itt lehet importálni az exportált kedvenceket. Csak illessze be a JSON ezen a beviteli mezőbe:'
    },
    export: {
      header: 'Export kedvencekhez',
      text: 'Itt tudja exportálni a kedvenceit. Csak másolja a JSON ki ezt a szövegdobozba, és mentse el egy fájlba importálni később:'
    },
    error: {
      fileApiNotSupported: 'A File API-k nem támogatják maradéktalanul ezt a böngészőt.'
    }
  },
  inform: {
    error: 'Hiba történt:',
    warn: 'Kérjük, ne feledje, hogy:'
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
i18n.it = {
  fullName: 'Italiano',
  ok: 'OK',
  main: {
    legend: 'Leggenda',
    diagram: 'Diagramma',
    mapView: 'Guarda la mappa',
    favoriteView: 'Preferiti',
    settings: 'Impostazioni',
    stationSelection: 'Selezionare una stazione',
    chartView: 'Vista Mappa',
    allPhenomena: 'Tutti i fenomeni',
    phenomenon: 'Fenomeno',
    favoritesList: 'Preferiti',
    importFavorites: 'Importazione',
    exportFavorites: 'Esportazione',
    importExportHelp: 'Per importare un file, si prega di scegliere un file esportato prima.',
    noFileSelected: 'Nessun file selezionato'
  },
  chart: {
    noTimeseriesSelected: 'Hai selezionato non timeseries, le serie storica selezionati non hanno valori nella determinato intervallo di tempo o le serie temporali sono nascosti.',
    outsideOfDataRange: 'Al di fuori del campo di dati!',
    annotation: 'Dati senza garanzia!',
    monthNames: [ 'Jan', 'Febbraio', 'Mar', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre' ]
  },
  table: {
    time: 'Tempo'
  },
  map: {
    userLocation: 'Ecco la posizione corrente',
    stationSelection: {
      station: 'Stazione',
      selectAllTimeseries: 'selezionare tutte le serie temporali'
    },
    stationLocation: {
      station: 'Stazione',
      timeseries: 'TimeSeries',
      provider: 'Provider',
      jumpBackToChart: 'Torna alla lista'
    },
    providerList: {
      provider: 'Provider',
      stations: 'Stazioni',
      timeseries: 'TimeSeries',
      phenomena: 'Fenomeni'
    },
    search: {
      label: 'cercare l&#39;indirizzo ...',
      noResult: 'Siamo spiacenti, questo indirizzo non è stato trovato.'
    }
  },
  listSelection: {
    header: 'Selezionare timeseries elenco',
    headers: {
      category: 'Categoria',
      station: 'Stazione',
      phenomenon: 'Fenomeno',
      procedure: 'Sensor'
    },
    warning: {
      moreThanOneTimeseries: 'trovato più di una serie storica'
    }
  },
  legend: {
    entry: {
      noData: 'Non sono disponibili dati',
      jumpToLastValue: 'Continua all&#39;ultimo valore',
      firstValueAt: 'Primo valore',
      lastValueAt: 'Ultimo valore'
    }
  },
  export: {
    label: 'I dati in formato CSV (Zip Archive)'
  },
  timeSelection: {
    header: 'Intervallo di tempo',
    presetsHeader: 'preset',
    presets: {
      lastHour: 'ultima ora',
      today: 'oggi',
      yesterday: 'ieri',
      todayYesterday: 'oggi e ieri',
      thisWeek: 'questa settimana',
      lastWeek: 'la settimana scorsa',
      thisMonth: 'questo mese',
      lastMonth: 'il mese scorso',
      thisYear: 'quest&#39;anno',
      lastYear: 'l&#39;anno scorso'
    },
    custom: {
      header: 'abitudine',
      start: 'Data di inizio',
      end: 'Data di fine'
    },
    warning: {
      startBeforeEnd: 'La data di inizio non può essere superiore alla data di fine',
      maxTimeRange: 'L&#39;intervallo di tempo non può essere maggiore di uno anno'
    }
  },
  styleChange: {
    header: 'Cambia stile',
    currentColor: 'Colore corrente',
    selectColor: 'Selezionare un nuovo colore',
    selectBarInterval: 'Selezionare l&#39;intervallo bar',
    barChartInterval: {
      hour: 'Ora',
      day: 'Giorno',
      week: 'Settimana',
      month: 'Mese'
    },
    zeroScaled: 'a zero in scala dell&#39;asse Y',
    groupedAxis: 'Asse raggruppati'
  },
  settings: {
    header: 'Impostazioni',
    chooseLanguage: 'Cambia lingua',
    requiresRestart: 'Needs Restart!',
    permalink: {
      create: 'Creare un permalink come',
      inWindow: 'link in una nuova finestra',
      inMail: 'link in una e-mail',
      inClipboard: 'Collegare negli appunti',
      clipboardInfo: 'Copia nella clipboard:',
      inQrCode: 'come QR-Code',
      favorite: 'Salva ambiente di lavoro come voce dei preferiti'
    },
    clusterMarker: 'indicatore di cluster',
    markerWithLastInfo: {
      header: 'marcatore con l&#39;ultimo valore informazioni',
      label: 'attenzione - alcuni provider di dati sono molto lenti'
    },
    saveStatus: {
      header: 'Salva l&#39;ambiente',
      label: 'Tutte le serie storica, il periodo scelto e le impostazioni vengono salvate continuo.'
    },
    resetStatus: 'Ambiente di ripristino',
    generalizeData: 'generalizzare dati',
    imprint: {
      header: 'Impronta',
      github: 'Trova questo progetto <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a>',
      text: '<p> <a href="http://52north.org" target="_blank">52 ° Nord GmbH</a> è responsabile di questo sito. </p><p> 52 ° Nord Initiative for Open Source Geospatial Software GmbH <br> Martin-Luther-King-Weg 24 <br> 48155 Muenster, Germania </p>'
    }
  },
  permalink: {
    noMatchingTimeseriesFound: 'Nessun timeseries viene trovato.'
  },
  guide: {
    start: {
      request: 'Quando si avvia questa guida, lo stato attuale viene azzerato.'
    },
    step1: {
      header: 'JavaScript Client - Visita guidata',
      text: 'Questo tour dà in pochi passi una panoramica sull&#39;utilizzo di questo client. Prima aggiungiamo un timeseries dalla mappa.'
    },
    step2: {
      header: 'Vai alla mappa',
      text: 'Qui si passa il fine di ottenere una mappa.'
    },
    step3: {
      header: 'Guarda la mappa',
      text: 'Questa è la visualizzazione della mappa. Nella mappa è possibile vedere i marcatori o markergroups.'
    },
    step4: {
      header: 'Cambio Provider',
      text: 'Qui è possibile selezionare un altro provider timeseries.'
    },
    step5: {
      header: 'Mostra localizzazione',
      text: 'E qui è possibile individuare il dispositivo sulla mappa.'
    },
    step6: {
      header: 'Selezione List',
      text: 'Qui è possibile selezionare una serie storica su liste ordinate.'
    },
    step7: {
      header: 'Selezionare una stazione',
      text: 'Seleziona ora una stazione sulla mappa.'
    },
    step8: {
      header: 'Seleziona timeseries',
      text: 'Seleziona questa casella. Se vi è un solo timeseries per questa stazione, la casella è già selezionata. Ora si può andare avanti con il tasto &quot;OK&quot; per caricare le serie temporali.'
    },
    step9: {
      header: 'Ingresso leggenda',
      text: 'Qui si vede la serie storica aggiunto. È possibile eliminare o individuare la serie storica o cambiare il colore.'
    },
    step10: {
      header: 'Grafico',
      text: 'Questo è il grafico della serie storica selezionata.'
    },
    step11: {
      header: 'Cambia il tempo',
      text: 'Qui è possibile modificare il tempo di misura per la serie del tempo selezionato.'
    },
    step12: {
      header: 'Table View',
      text: 'Qui si ottiene una tabella con i valori dei dati grezzi per la vostra serie tempo selezionato.'
    },
    step13: {
      header: 'Gestione Favorite',
      text: 'Le voci di legenda / timeseries potrebbero essere salvati come preferiti. In quest&#39;ottica tutti i favoriti sono elencati e possono essere mantenute.'
    },
    step14: {
      header: 'Finito',
      text: 'Ben fatto! <br> Questo client è un prodotto di <a href="http://52north.org" target="_blank">52 ° Nord GmbH</a> . È possibile trovare il codice sorgente su <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a> .'
    }
  },
  favorite: {
    firstValueAt: 'Primo valore',
    lastValueAt: 'Ultimo valore',
    label: 'favorito',
    edit: {
      header: 'Modifica preferito'
    },
    group: {
      add: 'Lo stato &#39;{0}&#39; è aggiunto all&#39;elenco dei preferiti.',
      exists: 'Questo stato esiste ancora.',
      noTimeseries: 'Attualmente non sono selezionate timeseries.',
      notSupported: 'Il fornitore di una voce dello stato di &#39;{0}&#39; non è supportata e non può essere caricato.'
    },
    single: {
      add: 'Un nuovo preferito &#39;{0}&#39; viene aggiunto alla lista.',
      remove: 'Il favorito &#39;{0}&#39; è stato rimosso.',
      exists: 'Questo preferito esiste ancora.',
      notSupported: 'Il fornitore del favorito &#39;{0}&#39; non è supportata e non può essere caricato.'
    },
    import: {
      override: 'Vuoi sostituire i tuoi preferiti?',
      wrongFile: 'Impossibile leggere il file',
      noValidJson: 'Il file JSON non è valido!',
      header: 'Importa preferiti',
      text: 'Qui è possibile importare i preferiti esportate. Basta incollare il JSON in questo campo di testo:'
    },
    export: {
      header: 'Favoriti Export',
      text: 'Qui è possibile esportare i preferiti. Basta copiare il JSON di questo campo testo e salvarlo in un file da importare in un secondo momento:'
    },
    error: {
      fileApiNotSupported: 'Le API di file non sono completamente supportate in questo browser.'
    }
  },
  inform: {
    error: 'Errore:',
    warn: 'Si ricorda che:'
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
i18n.lt = {
  fullName: 'Lietuvos',
  ok: 'Gerai',
  main: {
    legend: 'Legenda',
    diagram: 'Diagrama',
    mapView: 'Žemėlapis vaizdas',
    favoriteView: 'Mėgstami',
    settings: 'Nustatymai',
    stationSelection: 'Pasirinkite stotį',
    chartView: 'Diagrama vaizdas',
    allPhenomena: 'Visi reiškiniai',
    phenomenon: 'Reiškinys',
    favoritesList: 'Mėgstami',
    importFavorites: 'Importas',
    exportFavorites: 'Eksportas',
    importExportHelp: 'Jei norite importuoti failą, pasirinkite failą galite eksportavo anksčiau.',
    noFileSelected: 'Nėra failų pasirinktas'
  },
  chart: {
    noTimeseriesSelected: 'Jūs nepasirinkote jokių timeseries, pasirinkti timeseries neturi reikšmes nurodytą laikotarpį arba timeseries yra paslėptas.',
    outsideOfDataRange: 'Už duomenų diapazone!',
    annotation: 'Duomenų be garantija!',
    monthNames: [ 'Sau', 'Vasaris', 'Sugadinti', 'Balandis', 'Gegužė', 'Birželis', 'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis' ]
  },
  table: {
    time: 'Laikas'
  },
  map: {
    userLocation: 'Čia yra jūsų dabartinė vieta',
    stationSelection: {
      station: 'Stotis',
      selectAllTimeseries: 'Atrinkti visus timeseries'
    },
    stationLocation: {
      station: 'Stotis',
      timeseries: 'Timeseries',
      provider: 'Tiekėjas',
      jumpBackToChart: 'atgal į diagramą'
    },
    providerList: {
      provider: 'Tiekėjas',
      stations: 'Stotys',
      timeseries: 'Timeseries',
      phenomena: 'Reiškiniai'
    },
    search: {
      label: 'ieškoti adresu ...',
      noResult: 'Atsiprašome, kad adresas nerastas.'
    }
  },
  listSelection: {
    header: 'Pasirinkite timeseries pagal sąrašą',
    headers: {
      category: 'Kategorija',
      station: 'Stotis',
      phenomenon: 'Reiškinys',
      procedure: 'Jutiklio'
    },
    warning: {
      moreThanOneTimeseries: 'rašo daugiau nei vieną timeseries'
    }
  },
  legend: {
    entry: {
      noData: 'Nėra duomenų',
      jumpToLastValue: 'peršokti į paskutinę vertės',
      firstValueAt: 'Pirma vertė',
      lastValueAt: 'Paskutinis vertė'
    }
  },
  export: {
    label: 'Duomenų CSV (Pašto archyvas)'
  },
  timeSelection: {
    header: 'Laikas klasės',
    presetsHeader: 'presents',
    presets: {
      lastHour: 'Paskutinė valanda',
      today: 'šiandien',
      yesterday: 'vakar',
      todayYesterday: 'šiandien ir vakar',
      thisWeek: 'Šią savaitę',
      lastWeek: 'praėjusią savaitę',
      thisMonth: 'šį mėnesį',
      lastMonth: 'praėjusį mėnesį',
      thisYear: 'šiemet',
      lastYear: 'pernai'
    },
    custom: {
      header: 'paprotys',
      start: 'Pradžios data',
      end: 'Pabaigos data'
    },
    warning: {
      startBeforeEnd: 'Pradžios data negali būti didesnis tada pabaigos datą',
      maxTimeRange: 'Laiko intervalas gali būti ne didesnis tada vienerius metus'
    }
  },
  styleChange: {
    header: 'Keisti stilių',
    currentColor: 'Dabartinis spalva',
    selectColor: 'Pasirinkite naują spalvą',
    selectBarInterval: 'Pasirinkite baras intervalą',
    barChartInterval: {
      hour: 'Valanda',
      day: 'Diena',
      week: 'Savaitė',
      month: 'Mėnuo'
    },
    zeroScaled: 'nulis pailgintus Y ašis',
    groupedAxis: 'sugrupuoti ašis'
  },
  settings: {
    header: 'Nustatymai',
    chooseLanguage: 'Perjungti kalba',
    requiresRestart: 'Reikia naujo paleiskite!',
    permalink: {
      create: 'Sukurti Permalink kaip',
      inWindow: 'nuorodą naujame lange',
      inMail: 'nuorodą elektroniniu paštu',
      inClipboard: 'Nuoroda į iškarpinę',
      clipboardInfo: 'Kopijuoti į iškarpinę:',
      inQrCode: 'kaip QR kodą',
      favorite: 'Išsaugoti darbo aplinką kaip mėgstamą įrašą'
    },
    clusterMarker: 'klasteris žymeklis',
    markerWithLastInfo: {
      header: 'žymeklis su praėjusiais vertės informaciją',
      label: 'dėmesio - kai duomenų teikėjas yra labai lėtas'
    },
    saveStatus: {
      header: 'Išsaugoti aplinka',
      label: 'Visi timeseries, pasirinkta atkarpa ir parametrai išsaugomi nuolat.'
    },
    resetStatus: 'Atstatyti aplinka',
    generalizeData: 'apibendrinti duomenys',
    imprint: {
      header: 'Atspaudas',
      github: 'Surasti šį projektas <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a>',
      text: '<p> <a href="http://52north.org" target="_blank">52 ° šiaurės GmbH</a> yra atsakingas už šioje svetainėje. </p><p> 52 ° šiaurės iniciatyva Geospatial Open Source Software GmbH <br> Martin-Luther-King Weg 24 <br> 48155 Miunsteris, Vokietija </p>'
    }
  },
  permalink: {
    noMatchingTimeseriesFound: 'Nėra atitinkančių timeseries nerasta.'
  },
  guide: {
    start: {
      request: 'Paleidus šį vadovą, dabartinė bus atstatytas.'
    },
    step1: {
      header: 'JavaScript Klientas - Ekskursija',
      text: 'Ši kelionė suteikia per keletą žingsnių apžvalga, kaip naudotis šia klientui. Pirmiausia mes pridėti timeseries iš žemėlapio.'
    },
    step2: {
      header: 'Eiti į žemėlapį',
      text: 'Čia mes pereiti nuomonės gauti žemėlapį.'
    },
    step3: {
      header: 'Žemėlapis vaizdas',
      text: 'Tai žemėlapio vaizdas. Be žemėlapyje galite matyti žymekliai ar markergroups.'
    },
    step4: {
      header: 'Pakeisti teikėjas',
      text: 'Čia galite pasirinkti kitą timeseries teikėją.'
    },
    step5: {
      header: 'Rodyti vietą',
      text: 'Ir čia jūs galite rasti savo prietaisą žemėlapyje.'
    },
    step6: {
      header: 'Sąrašas pasirinkimas',
      text: 'Čia galite pasirinkti timeseries iš užsakomų sąrašus.'
    },
    step7: {
      header: 'Pasirinkite stotį',
      text: 'Prašome pasirinkti dabar žemėlapyje stotį.'
    },
    step8: {
      header: 'Pasirinkite timeseries',
      text: 'Pasirinkite šį langelį. Jei yra tik vienas timeseries dėl šios stoties, langelis jau patikrintas. Dabar galite eiti su &quot;OK&quot; mygtuką, norėdami įkelti timeseries.'
    },
    step9: {
      header: 'Legenda įrašas',
      text: 'Čia jūs matote pridėtinę laiko eilutes. Jūs galite ištrinti arba suraskite laiko eilučių, arba pakeisti spalvą.'
    },
    step10: {
      header: 'Diagrama',
      text: 'Tai pasirinkto laiko eilučių lentelė.'
    },
    step11: {
      header: 'Pakeisti laikas',
      text: 'Čia galite pakeisti laiko, kiek Pasirinkto laiko eilučių.'
    },
    step12: {
      header: 'Stalo Peržiūrėti',
      text: 'Čia galite gauti žaliavų duomenų verčių lentelę į pasirinktą laiko eilučių.'
    },
    step13: {
      header: 'Mėgstamiausia valdymas',
      text: 'Legendos įrašai / timeseries gali būti išsaugotas kaip pasirinkimą. Šiuo požiūriu visi pasirinkimą, yra išvardytos ir gali būti pratęstas.'
    },
    step14: {
      header: 'Baigta',
      text: 'Well done! <br> Šis klientas yra produktas <a href="http://52north.org" target="_blank">52 ° North GmbH</a> . Jūs galite rasti išeities kodą <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a> .'
    }
  },
  favorite: {
    firstValueAt: 'Pirma vertė',
    lastValueAt: 'Paskutinis vertė',
    label: 'mėgstamas',
    edit: {
      header: 'Redaguoti mėgstamiausia'
    },
    group: {
      add: 'Statusas &quot;{0}&quot; yra įtraukta į mėgstamiausių sąrašą.',
      exists: 'Šis būsenos vis dar egzistuoja.',
      noTimeseries: 'Šiuo metu nėra jokių timeseries yra pasirinktas.',
      notSupported: 'Be to, kuriant statuso įrašą teikėjas &quot;{0}&quot; nepalaiko ir negali būti įkeltas.'
    },
    single: {
      add: 'Nauja mėgstamiausia &quot;{0}&quot; yra įtraukta į sąrašą.',
      remove: 'Mėgstamiausia &quot;{0}&quot; yra pašalinamas.',
      exists: 'Tai mėgstamiausia vis dar egzistuoja.',
      notSupported: 'Iš mėgstamiausių teikėjas &quot;{0}&quot; nepalaiko ir negali būti įkeltas.'
    },
    import: {
      override: 'Ar norite perrašyti esamus favoritus?',
      wrongFile: 'Nepavyko perskaityti failo',
      noValidJson: 'JSON failas yra negalioja!',
      header: 'Importo pasirinkimą',
      text: 'Čia galite importuoti savo eksportuotų pasirinkimą. Tiesiog įklijuokite šioje teksto lauke JSON:'
    },
    export: {
      header: 'Eksporto pasirinkimą',
      text: 'Čia galite eksportuoti savo pasirinkimą. Tiesiog nukopijuokite JSON iš šio laukelį ir įrašykite jį į failą importuoti jį vėliau:'
    },
    error: {
      fileApiNotSupported: 'Failas API nėra pilnai palaikoma šioje naršyklėje.'
    }
  },
  inform: {
    error: 'Error occured:',
    warn: 'Atminkite, kad:'
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
i18n.lv = {
  fullName: 'Latvijas',
  ok: 'Labi',
  main: {
    legend: 'Leģenda',
    diagram: 'Diagramma',
    mapView: 'Kartes skats',
    favoriteView: 'Favorīti',
    settings: 'Settings',
    stationSelection: 'Izvēlieties staciju',
    chartView: 'View Chart',
    allPhenomena: 'Visas parādības',
    phenomenon: 'Parādība',
    favoritesList: 'Favorīti',
    importFavorites: 'Imports',
    exportFavorites: 'Eksports',
    importExportHelp: 'Importēt failu, lūdzu, izvēlieties failu eksportēto pirms tam.',
    noFileSelected: 'Izvēlēts neviens fails'
  },
  chart: {
    noTimeseriesSelected: 'Jūs esat izvēlējies neviens timeseries, izvēlētie timeseries nav vērtības, kas dotajā laika intervālā vai timeseries ir slēpta.',
    outsideOfDataRange: 'Ārpus datu klāsts!',
    annotation: 'Datu bez garantijas!',
    monthNames: [ 'Jan', 'Februāris', 'Sagandēt', 'Aprīlis', 'Maijs', 'Jūnijs', 'Jūlijs', 'Augusts', 'Septembris', 'Oktobris', 'Novembris', 'Decembris' ]
  },
  table: {
    time: 'Laiks'
  },
  map: {
    userLocation: 'Šeit ir jūsu pašreizējā atrašanās vieta',
    stationSelection: {
      station: 'Stacija',
      selectAllTimeseries: 'izvēlētos visus timeseries'
    },
    stationLocation: {
      station: 'Stacija',
      timeseries: 'Timeseries',
      provider: 'Sniedzējs',
      jumpBackToChart: 'atpakaļ uz diagrammas'
    },
    providerList: {
      provider: 'Sniedzējs',
      stations: 'Stacijas',
      timeseries: 'Timeseries',
      phenomena: 'Parādības'
    },
    search: {
      label: 'meklēt adresi ...',
      noResult: 'Žēl, ka adrese nav atrodama.'
    }
  },
  listSelection: {
    header: 'Izvēlieties timeseries ar sarakstu',
    headers: {
      category: 'Kategorija',
      station: 'Stacija',
      phenomenon: 'Parādība',
      procedure: 'Devējs'
    },
    warning: {
      moreThanOneTimeseries: 'atrada vairāk nekā vienu timeseries'
    }
  },
  legend: {
    entry: {
      noData: 'nav pieejami dati',
      jumpToLastValue: 'lēkt uz pēdējo vērtību',
      firstValueAt: 'Pirmā vērtība',
      lastValueAt: 'Pēdējā vērtība'
    }
  },
  export: {
    label: 'Dati uz CSV (Zip arhīva)'
  },
  timeSelection: {
    header: 'Time Range',
    presetsHeader: 'presets',
    presets: {
      lastHour: 'pēdējā stunda',
      today: 'šodien',
      yesterday: 'vakar',
      todayYesterday: 'šodien &amp; vakar',
      thisWeek: 'šonedēļ',
      lastWeek: 'pagājušajā nedēļā',
      thisMonth: 'šajā mēnesī',
      lastMonth: 'pagājušajā mēnesī',
      thisYear: 'šogad',
      lastYear: 'pagājušajā gadā'
    },
    custom: {
      header: 'paraža',
      start: 'Sākuma datums',
      end: 'Beigu datums'
    },
    warning: {
      startBeforeEnd: 'Sākuma datums nevar būt lielāks, tad beigu datuma',
      maxTimeRange: 'Laika diapazons nevar būt lielāks, tad vienu gadu'
    }
  },
  styleChange: {
    header: 'Mainīt stilu',
    currentColor: 'Pašreizējā krāsa',
    selectColor: 'Izvēlieties jaunu krāsu',
    selectBarInterval: 'Izvēlieties bar intervālu',
    barChartInterval: {
      hour: 'Stunda',
      day: 'Diena',
      week: 'Nedēļa',
      month: 'Mēnesis'
    },
    zeroScaled: 'nulles samazināti Y-asi',
    groupedAxis: 'grupēt ass'
  },
  settings: {
    header: 'Settings',
    chooseLanguage: 'Slēdzis valoda',
    requiresRestart: 'Needs Restart!',
    permalink: {
      create: 'Izveidot Permalink kā',
      inWindow: 'saiti jaunā logā',
      inMail: 'saite e-pastu',
      inClipboard: 'Saite uz starpliktuvi',
      clipboardInfo: 'Kopēt uz starpliktuvi:',
      inQrCode: 'kā QR-Code',
      favorite: 'Saglabājiet darba vidi, kā iecienītāko ierakstu'
    },
    clusterMarker: 'klastera marķieris',
    markerWithLastInfo: {
      header: 'marķieris informāciju pēdējo vērtību',
      label: 'uzmanību - daži datu sniedzējs ir ļoti lēns'
    },
    saveStatus: {
      header: 'Saglabāt vidi',
      label: 'Visiem timeseries, izvēlētais pētīt un uzstādījumi tiek saglabāti nepārtraukti.'
    },
    resetStatus: 'Reset vide',
    generalizeData: 'vispārināt datus',
    imprint: {
      header: 'Nospiedums',
      github: 'Atrast šo projektu <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a>',
      text: '<p> <a href="http://52north.org" target="_blank">52 ° North GmbH</a> ir atbildīga par šo vietni. </p><p> 52 ° North iniciatīva Ģeotelpiskās Open Source Software GmbH <br> Martin-Luther-King-Weg 24 <br> 48155 Muenster, Vācija </p>'
    }
  },
  permalink: {
    noMatchingTimeseriesFound: 'Nē atbilst timeseries ir atrasts.'
  },
  guide: {
    start: {
      request: 'Kad jūs sākat šo rokasgrāmatu, pašreizējais stāvoklis būs reset.'
    },
    step1: {
      header: 'JavaScript Client - ekskursija',
      text: 'Šis ceļojums dod dažos soļos pārskatu, kā izmantot šo klientu. Vispirms mēs pievienojam timeseries no pasaules kartes.'
    },
    step2: {
      header: 'Iet uz karti',
      text: 'Šeit mēs pārslēgtos uz iegūt karti.'
    },
    step3: {
      header: 'Kartes skats',
      text: 'Tas ir kartes skatu. Kartē var redzēt marķieri vai markergroups.'
    },
    step4: {
      header: 'Mainīt sniedzējs',
      text: 'Šeit jūs varat izvēlēties citu timeseries sniedzēju.'
    },
    step5: {
      header: 'Rādīt atrašanās vietu',
      text: 'Un šeit jūs varat atrast savu ierīci kartē.'
    },
    step6: {
      header: 'Latviešu atlase',
      text: 'Šeit jūs varat izvēlēties timeseries no pasūtītajām sarakstus.'
    },
    step7: {
      header: 'Izvēlieties staciju',
      text: 'Lūdzu, izvēlieties tagad radiostaciju kartē.'
    },
    step8: {
      header: 'Izvēlieties timeseries',
      text: 'Izvēlieties šo rūtiņu. Ja ir tikai viens timeseries par šīs stacijas, rūtiņa jau ir pārbaudīts. Tagad jūs varat doties ar &quot;OK&quot; pogu, lai ielādētu timeseries.'
    },
    step9: {
      header: 'Legend ieraksts',
      text: 'Šeit Jūs redzat pievienoto laikrindas. Jūs varat dzēst vai atrast šīs rindas vai mainīt krāsu.'
    },
    step10: {
      header: 'Diagramma',
      text: 'Tas ir shēma izvēlētā laikrindas.'
    },
    step11: {
      header: 'Mainīt laiku',
      text: 'Šeit jūs varat mainīt laika apjomu par jūsu izvēlēto laika rindās.'
    },
    step12: {
      header: 'Galds View',
      text: 'Šeit jums tabulu ar pamatdatiem vērtībām jūsu izvēlēto laika rindām.'
    },
    step13: {
      header: 'Mīļākā vadība',
      text: 'Leģenda ieraksti / timeseries varētu tikt saglabāts kā favorītiem. Šajā skatā visi favorīti ir uzskaitīti, un var saglabāt.'
    },
    step14: {
      header: 'Pabeigts',
      text: 'Labi darīts! <br> Šis klients ir produkts <a href="http://52north.org" target="_blank">52 ° North GmbH</a> . Jūs varat atrast pirmkodu par <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a> .'
    }
  },
  favorite: {
    firstValueAt: 'Pirmā vērtība',
    lastValueAt: 'Pēdējā vērtība',
    label: 'favorīts',
    edit: {
      header: 'Rediģēt favorīts'
    },
    group: {
      add: 'Statuss &#39;{0}&#39; tiek pievienots favorītu sarakstā.',
      exists: 'Šis statuss joprojām pastāv.',
      noTimeseries: 'Pagaidām nav timeseries tiek atlasīti.',
      notSupported: 'Ierakstam statusa sniedzējs &quot;{0} &#39;nav atbalstīts, un to nevar ielādēt.'
    },
    single: {
      add: 'Jaunais mīļākie &#39;{0}&#39; tiek pievienots sarakstam.',
      remove: 'Mīļākie &#39;{0}&#39; tiek noņemts.',
      exists: 'Tas favorīts joprojām pastāv.',
      notSupported: 'No mīļākie sniedzējs &quot;{0} &#39;nav atbalstīts, un to nevar ielādēt.'
    },
    import: {
      override: 'Vai jūs vēlaties, lai ignorēt savu pašreizējo izlasi?',
      wrongFile: 'Neizdevās nolasīt failu',
      noValidJson: 'JSON fails nav derīgs!',
      header: 'Importa favorīti',
      text: 'Šeit Jūs varat importēt eksportēti izlasi. Vienkārši ielīmējiet JSON šajā teksta laukā:'
    },
    export: {
      header: 'Eksporta favorīti',
      text: 'Šeit jūs varat eksportēt savu izlasi. Vienkārši nokopējiet JSON no šajā lauciņā, un saglabājiet to failu importēt to vēlāk:'
    },
    error: {
      fileApiNotSupported: 'Fails API nav pilnībā atbalstīta šajā pārlūkprogrammā.'
    }
  },
  inform: {
    error: 'Kļūda:',
    warn: 'Lūdzu, atcerieties, ka:'
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
i18n.mt = {
  fullName: 'Malti',
  ok: 'OK',
  main: {
    legend: 'Leġġenda',
    diagram: 'Dijagramma',
    mapView: 'Fehma Map',
    favoriteView: 'Favorites',
    settings: 'Settings',
    stationSelection: 'Agħżel stazzjon',
    chartView: 'Fehma Chart',
    allPhenomena: 'Kollha fenomeni',
    phenomenon: 'Phenomenon',
    favoritesList: 'Favorites',
    importFavorites: 'Importazzjoni',
    exportFavorites: 'Esportazzjoni',
    importExportHelp: 'Għall-importazzjoni fajl, jekk jogħġbok agħżel fajl inti esportata qabel.',
    noFileSelected: 'Nru fajl magħżul'
  },
  chart: {
    noTimeseriesSelected: 'Inti għazilt ebda timeseries, il timeseries magħżula jkollhom l-ebda valuri fil-firxa ta &#39;żmien partikolari jew il-timeseries huma moħbija.',
    outsideOfDataRange: 'Barra mill-firxa data!',
    annotation: 'Data mingħajr garanzija!',
    monthNames: [ 'Jan', 'Frar', 'Mar', 'April', 'Mejju', 'Ġunju', 'Lulju', 'Awissu', 'Settembru', 'Ottubru', 'Novembru', 'Diċembru' ]
  },
  table: {
    time: 'Ħin'
  },
  map: {
    userLocation: 'Hawnhekk huwa post attwali tiegħek',
    stationSelection: {
      station: 'Station',
      selectAllTimeseries: 'tagħżel timeseries kollha'
    },
    stationLocation: {
      station: 'Station',
      timeseries: 'Timeseries',
      provider: 'Provider',
      jumpBackToChart: 'lura għall chart'
    },
    providerList: {
      provider: 'Provider',
      stations: 'Stazzjonijiet',
      timeseries: 'Timeseries',
      phenomena: 'Fenomeni'
    },
    search: {
      label: 'tfittxija għal indirizz ...',
      noResult: 'Jiddispjacini, dak l-indirizz ma setgħux jiġu misjuba.'
    }
  },
  listSelection: {
    header: 'Timeseries Agħżel minn lista',
    headers: {
      category: 'Kategorija',
      station: 'Station',
      phenomenon: 'Phenomenon',
      procedure: 'Sensor'
    },
    warning: {
      moreThanOneTimeseries: 'misjuba timeseries aktar minn wieħed'
    }
  },
  legend: {
    entry: {
      noData: 'ebda dejta disponibbli',
      jumpToLastValue: 'jaqbżu l-valur l-aħħar',
      firstValueAt: 'Ewwel valur fi',
      lastValueAt: 'Aħħar valur fil'
    }
  },
  export: {
    label: 'Data kif CSV (Zip Archive)'
  },
  timeSelection: {
    header: 'Ħin Medda',
    presetsHeader: 'presets',
    presets: {
      lastHour: 'aħħar siegħa',
      today: 'illum',
      yesterday: 'bieraħ',
      todayYesterday: 'illum &amp; bieraħ',
      thisWeek: 'din il-ġimgħa',
      lastWeek: 'ġimgħa li għaddiet',
      thisMonth: 'dan ix-xahar',
      lastMonth: 'aħħar xahar',
      thisYear: 'din is-sena',
      lastYear: 'sena li għaddiet'
    },
    custom: {
      header: 'custom',
      start: 'Data Ibda',
      end: 'Data tat-tmiem'
    },
    warning: {
      startBeforeEnd: 'Id-data tal-bidu ma tistax tkun akbar allura l-data tat-tmiem',
      maxTimeRange: 'Il-firxa ta &#39;żmien ma tistax tkun akbar imbagħad sena'
    }
  },
  styleChange: {
    header: 'Stil Bidla',
    currentColor: 'Kulur Kurrenti',
    selectColor: 'Agħżel kulur ġdid',
    selectBarInterval: 'Agħżel il-intervall bar',
    barChartInterval: {
      hour: 'Hour',
      day: 'Jum',
      week: 'Ġimgħa',
      month: 'Xahar'
    },
    zeroScaled: 'żero Y-assi skalat',
    groupedAxis: 'assi miġbura'
  },
  settings: {
    header: 'Settings',
    chooseLanguage: 'Lingwa Switch',
    requiresRestart: 'Bżonnijiet Nerġgħu!',
    permalink: {
      create: 'Oħloq Permalink bħala',
      inWindow: 'link fil-tieqa ġdida',
      inMail: 'link fl-email',
      inClipboard: 'Link għall clipboard',
      clipboardInfo: 'Kopja għall clipboard:',
      inQrCode: 'kif QR-Kodiċi',
      favorite: 'Save ambjent tax-xogħol bħala dħul favoriti'
    },
    clusterMarker: 'markatur cluster',
    markerWithLastInfo: {
      header: 'markatur bl-aħħar informazzjoni valur',
      label: 'Attenzjoni - uħud provveditur tad-dejta huma bil-mod ħafna'
    },
    saveStatus: {
      header: 'Save ambjent',
      label: 'Timeseries kollha, il-timespan magħżula u l-settings huma salvati kontinwu.'
    },
    resetStatus: 'Ambjent Irrisettja',
    generalizeData: 'jiġġeneralizza Data',
    imprint: {
      header: 'Imprint',
      github: 'Sib dan il-proġett fuq <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a>',
      text: '<p> <a href="http://52north.org" target="_blank">52 ° Tramuntana GmbH</a> hija responsabbli għal din il-websajt. </p><p> 52 ° Inizjattiva North għat ġeospazjali Open Source Software GmbH <br> Martin Luther King-Weg 24 <br> 48155 Muenster, il-Ġermanja </p>'
    }
  },
  permalink: {
    noMatchingTimeseriesFound: 'Ebda timeseries tqabbil jinstab.'
  },
  guide: {
    start: {
      request: 'Meta inti tibda din il-gwida, il--istat attwali se tkun reset.'
    },
    step1: {
      header: 'JavaScript Klijent - Iggwidata Tour',
      text: 'Dan tour jagħti fi ftit passi ħarsa ġenerali kif tuża dan il-klijent. L-ewwel għandna żid timeseries mill-mappa.'
    },
    step2: {
      header: 'Mur fil-mappa',
      text: 'Hawnhekk aħna jaqilbu l-ħsieb li tikseb mappa.'
    },
    step3: {
      header: 'Fehma Map',
      text: 'Dan huwa l-fehma mappa. Fil-mappa tista &#39;tara għodod li jimmarkaw jew markergroups.'
    },
    step4: {
      header: 'Bidla Provider',
      text: 'Hawnhekk inti tista &#39;tagħżel fornitur ieħor timeseries.'
    },
    step5: {
      header: 'Lokazzjoni Show',
      text: 'U hawn inti tista &#39;lokalizzar tagħmir tiegħek fuq il-mappa.'
    },
    step6: {
      header: 'Għażla Lista',
      text: 'Hawnhekk inti tista &#39;tagħżel timeseries out ta&#39; listi ordnati.'
    },
    step7: {
      header: 'Agħżel stazzjon',
      text: 'Jekk jogħġbok agħżel issa stazzjon fuq il-mappa.'
    },
    step8: {
      header: 'Timeseries Agħżel',
      text: 'Agħżel dan Checkbox. Jekk ikun hemm wieħed biss timeseries għal dan l-istazzjon, il-Checkbox hija diġà ċċekkjati. Issa inti tista &#39;tmur fuq ma&#39; l- &quot;OK&quot; buttuna biex jgħabbi l-timeseries.'
    },
    step9: {
      header: 'Dħul Legend',
      text: 'Hawnhekk inti tara l-serje tal-ħin miżjud. Inti tista &#39;tħassar jew jillokalizza l-serje tal-ħin jew jibdlu l-kulur.'
    },
    step10: {
      header: 'Ċart',
      text: 'Dan huwa l-chart tal-serje tal-ħin magħżul.'
    },
    step11: {
      header: 'Time Bidla',
      text: 'Hawnhekk inti tista &#39;tibdel l-estent ħin għas-serje tiegħek ħin magħżul.'
    },
    step12: {
      header: 'Tabella View',
      text: 'Hawnhekk ikollok tabella tal-valuri tad-data prima lejn serje tiegħek ħin magħżul.'
    },
    step13: {
      header: 'Ġestjoni Favorite',
      text: 'L-entrati leġġenda / timeseries jistgħu jiġu ffrankati bħala Favourites. F&#39;din il-fehma Favourites kollha huma elenkati u tista &#39;tinżamm.'
    },
    step14: {
      header: 'Lest',
      text: 'Prosit! <br> Dan klijent huwa prodott ta &#39; <a href="http://52north.org" target="_blank">52 ° Tramuntana GmbH</a> . Tista &#39;ssib l-kodiċi sors fuq <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a> .'
    }
  },
  favorite: {
    firstValueAt: 'Ewwel valur fi',
    lastValueAt: 'Aħħar valur fil',
    label: 'favoriti',
    edit: {
      header: 'Favorit Edit'
    },
    group: {
      add: 'L-istatus &quot;{0}&quot; hija miżjuda mal-lista favoriti.',
      exists: 'Dan l-istatus għadha teżisti.',
      noTimeseries: 'Bħalissa l-ebda timeseries huma magħżula.',
      notSupported: 'Il-fornitur ta &#39;dħul fl-istatus &quot;{0}&quot; mhijiex appoġġjata u li ma jistgħux jiġu mgħobbija.'
    },
    single: {
      add: 'A favoriti ġdida &quot;{0}&quot; hija miżjuda mal-lista.',
      remove: 'Il-favoriti &quot;{0}&quot; jitneħħa.',
      exists: 'Dan favoriti għadha teżisti.',
      notSupported: 'Il-fornitur tas-favoriti &quot;{0}&quot; mhijiex appoġġjata u li ma jistgħux jiġu mgħobbija.'
    },
    import: {
      override: 'Do inti tixtieq li jiskarta Favourites attwali tiegħek?',
      wrongFile: 'Ma kellekx jaqra l-fajl',
      noValidJson: 'Il-fajl JSON mhuwiex validu!',
      header: 'Favourites Importazzjoni',
      text: 'Hawnhekk inti tista &#39;importazzjoni Favourites esportati tiegħek. Just paste tal-JSON f&#39;dan il-qasam test:'
    },
    export: {
      header: 'Favourites Esportazzjoni',
      text: 'Hawnhekk inti tista &#39;esportazzjoni Favourites tieghek. Just kopja l-JSON minn dan kaxxa u ħlief fil-fajl li jimportah aktar tard:'
    },
    error: {
      fileApiNotSupported: 'Il APIs File mhumiex appoġġjati bis-sħiħ dan il-browser.'
    }
  },
  inform: {
    error: 'Ġara żball:',
    warn: 'Jekk jogħġbok ftakar li:'
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
i18n.nl = {
  fullName: 'Nederlands',
  ok: 'OK',
  main: {
    legend: 'Legende',
    diagram: 'Diagram',
    mapView: 'Kaartweergave',
    favoriteView: 'Favorieten',
    settings: 'Instellingen',
    stationSelection: 'Selecteer een zender',
    chartView: 'Kaartweergave',
    allPhenomena: 'Alle Phenomena',
    phenomenon: 'Fenomeen',
    favoritesList: 'Favorieten',
    importFavorites: 'Import',
    exportFavorites: 'Export',
    importExportHelp: 'Om een ​​bestand te importeren, kies dan een bestand dat u eerder geëxporteerd.',
    noFileSelected: 'Geen bestand geselecteerd'
  },
  chart: {
    noTimeseriesSelected: 'Je hebt geen tijdreeks geselecteerd, worden de geselecteerde tijdreeksen hebben geen waarden in de gegeven tijd bereik of de tijdreeksen zijn verborgen.',
    outsideOfDataRange: 'Buitenkant van data range!',
    annotation: 'Gegevens zonder garantie!',
    monthNames: [ 'Jan', 'Februari', 'Ontsieren', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December' ]
  },
  table: {
    time: 'Tijd'
  },
  map: {
    userLocation: 'Hier is uw huidige locatie',
    stationSelection: {
      station: 'Station',
      selectAllTimeseries: 'Alles selecteren tijdreeks'
    },
    stationLocation: {
      station: 'Station',
      timeseries: 'Tijdreeks',
      provider: 'Leverancier',
      jumpBackToChart: 'terug naar overzicht'
    },
    providerList: {
      provider: 'Leverancier',
      stations: 'Stations',
      timeseries: 'Tijdreeks',
      phenomena: 'Fenomenen'
    },
    search: {
      label: 'zoeken naar het adres ...',
      noResult: 'Sorry, dat adres kon niet worden gevonden.'
    }
  },
  listSelection: {
    header: 'Kies een tijdreeks door lijst',
    headers: {
      category: 'Categorie',
      station: 'Station',
      phenomenon: 'Fenomeen',
      procedure: 'Sensor'
    },
    warning: {
      moreThanOneTimeseries: 'Er voldeden meer dan één tijdreeks'
    }
  },
  legend: {
    entry: {
      noData: 'geen gegevens beschikbaar',
      jumpToLastValue: 'Ga naar de laatste waarde',
      firstValueAt: 'Eerste waarde',
      lastValueAt: 'Laatste waarde bij'
    }
  },
  export: {
    label: 'Gegevens als CSV (zip-archief)'
  },
  timeSelection: {
    header: 'Time Range',
    presetsHeader: 'presets',
    presets: {
      lastHour: 'afgelopen uur',
      today: 'vandaag',
      yesterday: 'gisteren',
      todayYesterday: 'vandaag en gisteren',
      thisWeek: 'deze week',
      lastWeek: 'vorige week',
      thisMonth: 'deze maand',
      lastMonth: 'vorige maand',
      thisYear: 'dit jaar',
      lastYear: 'vorig jaar'
    },
    custom: {
      header: 'gewoonte',
      start: 'Startdatum',
      end: 'Einddatum'
    },
    warning: {
      startBeforeEnd: 'De startdatum kan niet groter zijn dan de einddatum',
      maxTimeRange: 'De tijd bereik kan niet groter zijn dan één jaar'
    }
  },
  styleChange: {
    header: 'Stijl wijzigen',
    currentColor: 'Huidige kleur',
    selectColor: 'Selecteer een nieuwe kleur',
    selectBarInterval: 'Selecteer de bar interval',
    barChartInterval: {
      hour: 'Uur',
      day: 'Dag',
      week: 'Week',
      month: 'Maand'
    },
    zeroScaled: 'zero geschaald Y-as',
    groupedAxis: 'gegroepeerd as'
  },
  settings: {
    header: 'Instellingen',
    chooseLanguage: 'Andere talen',
    requiresRestart: 'Moet Restart!',
    permalink: {
      create: 'Maak een permalink als',
      inWindow: 'link in een nieuw venster',
      inMail: 'link in een e-mail',
      inClipboard: 'Link naar het klembord',
      clipboardInfo: 'Kopiëren naar het klembord:',
      inQrCode: 'als QR-Code',
      favorite: 'Opslaan werkomgeving als favoriet binnenkomst'
    },
    clusterMarker: 'cluster marker',
    markerWithLastInfo: {
      header: 'marker met de laatste waarde informatie',
      label: 'aandacht - enkele data provider zijn erg traag'
    },
    saveStatus: {
      header: 'Opslaan milieu',
      label: 'Alle tijdreeks, in de geselecteerde periode en de instellingen worden continu opgeslagen.'
    },
    resetStatus: 'Reset milieu',
    generalizeData: 'generaliseren Gegevens',
    imprint: {
      header: 'Afdruk',
      github: 'Vind dit project op <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a>',
      text: '<p> <a href="http://52north.org" target="_blank">52 ° Noord GmbH</a> is verantwoordelijk voor deze website. </p><p> 52 ° Noord initiatief voor Geospatial Open Source Software GmbH <br> Martin-Luther-King-Weg 24 <br> 48155 Münster, Duitsland </p>'
    }
  },
  permalink: {
    noMatchingTimeseriesFound: 'Geen bijpassende tijdreeksen wordt gevonden.'
  },
  guide: {
    start: {
      request: 'Wanneer je deze handleiding beginnen, zal de de huidige stand gereset.'
    },
    step1: {
      header: 'JavaScript Client - Guided Tour',
      text: 'Deze tour geeft in een paar stappen een overzicht hoe u deze client gebruiken. Eerste voegen we een tijdreeks van de kaart.'
    },
    step2: {
      header: 'Ga naar de kaart',
      text: 'Hier wisselen we het oog op een kaart te krijgen.'
    },
    step3: {
      header: 'Kaartweergave',
      text: 'Dit is de kaartweergave. In de kaart kunt u markeringen of markergroups zien.'
    },
    step4: {
      header: 'Verandering Provider',
      text: 'Hier kunt u een andere tijdreeksen provider te kiezen.'
    },
    step5: {
      header: 'Toon locatie',
      text: 'En hier kunt u uw apparaat op de kaart.'
    },
    step6: {
      header: 'Lijst selectie',
      text: 'Hier kunt u een tijdreeks kiezen uit geordende lijsten.'
    },
    step7: {
      header: 'Selecteer een zender',
      text: 'Selecteer nu een zender op de kaart.'
    },
    step8: {
      header: 'Kies een tijdreeks',
      text: 'Schakel dit vakje. Als er slechts één tijdreeks voor dit station, wordt het selectievakje is ingeschakeld. Nu kun je verder gaan met de &quot;OK&quot; knop om de tijdreeksen te laden.'
    },
    step9: {
      header: 'Legende binnenkomst',
      text: 'Hier zie je de toegevoegde tijdreeksen. U kunt verwijderen of zoek de tijdreeks of de kleur.'
    },
    step10: {
      header: 'Tabel',
      text: 'Dit is de grafiek van de geselecteerde tijdreeksen.'
    },
    step11: {
      header: 'Tijd wijzigen',
      text: 'Hier kunt u de tijd die mate veranderen voor uw geselecteerde tijdreeksen.'
    },
    step12: {
      header: 'Table View',
      text: 'Hier krijg je een tabel van de ruwe data waarden aan uw geselecteerde tijdreeksen.'
    },
    step13: {
      header: 'Favoriete beheer',
      text: 'De legende inzendingen / tijdreeks kan worden opgeslagen als favorieten. In deze visie alle favorieten zijn opgenomen en kon worden gehandhaafd.'
    },
    step14: {
      header: 'Afgewerkt',
      text: 'Goed gedaan! <br> Deze opdrachtgever is een product van <a href="http://52north.org" target="_blank">52 ° Noord GmbH</a> . U kunt de broncode op zoek <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a> .'
    }
  },
  favorite: {
    firstValueAt: 'Eerste waarde',
    lastValueAt: 'Laatste waarde bij',
    label: 'favoriet',
    edit: {
      header: 'Favoriet bewerken'
    },
    group: {
      add: 'De status &#39;{0}&#39; wordt toegevoegd aan de lijst met favorieten.',
      exists: 'Deze status bestaat nog steeds.',
      noTimeseries: 'Geen tijdreeksen worden geselecteerd.',
      notSupported: 'De aanbieder van een vermelding van de status &#39;{0}&#39; wordt niet ondersteund en kan niet worden geladen.'
    },
    single: {
      add: 'Een nieuwe favoriet &#39;{0}&#39; wordt toegevoegd aan de lijst.',
      remove: 'De favoriete &#39;{0}&#39; is verwijderd.',
      exists: 'Deze favoriete bestaat nog steeds.',
      notSupported: 'De aanbieder van de favoriete &#39;{0}&#39; wordt niet ondersteund en kan niet worden geladen.'
    },
    import: {
      override: 'Wilt u uw huidige favorieten overschrijven?',
      wrongFile: 'Kon het bestand niet lezen',
      noValidJson: 'De JSON-bestand is niet geldig!',
      header: 'Favorieten import',
      text: 'Hier kunt u uw geëxporteerde favorieten importeren. Net plak de JSON in dit tekstveld:'
    },
    export: {
      header: 'Favorieten export',
      text: 'Hier kunt u uw favorieten exporteren. Kopieer de JSON uit dit tekstvak en opslaan in een bestand om het later te importeren:'
    },
    error: {
      fileApiNotSupported: 'De File API&#39;s worden niet volledig ondersteund in deze browser.'
    }
  },
  inform: {
    error: 'Er is een fout opgetreden:',
    warn: 'Vergeet niet dat:'
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
i18n.pl = {
  fullName: 'Polski',
  ok: 'W porządku',
  main: {
    legend: 'Legenda',
    diagram: 'Schemat',
    mapView: 'Widok mapy',
    favoriteView: 'Ulubione',
    settings: 'Ustawienia',
    stationSelection: 'Wybierz stację',
    chartView: 'Widok Wykres',
    allPhenomena: 'Wszystkie zjawiska',
    phenomenon: 'Zjawisko',
    favoritesList: 'Ulubione',
    importFavorites: 'Import',
    exportFavorites: 'Eksport',
    importExportHelp: 'Aby zaimportować plik, wybierz plik wyeksportowany wcześniej.',
    noFileSelected: 'Nie wybrano pliku'
  },
  chart: {
    noTimeseriesSelected: 'Wybrałeś nie timeseries, wybrane timeseries nie mają wartości w danym przedziale czasowym lub timeseries są ukryte.',
    outsideOfDataRange: 'Poza zakresem danych!',
    annotation: 'Dane bez gwarancji!',
    monthNames: [ 'Jan', 'Lutego', 'Zniszczyć', 'Kwietnia', 'Maj', 'Czerwca', 'Lipca', 'Sierpień', 'Września', 'Październik', 'Listopada', 'Grudzień' ]
  },
  table: {
    time: 'Czas'
  },
  map: {
    userLocation: 'Oto aktualna lokalizacja',
    stationSelection: {
      station: 'Stacja',
      selectAllTimeseries: 'wybierz wszystkie timeseries'
    },
    stationLocation: {
      station: 'Stacja',
      timeseries: 'Timeseries',
      provider: 'Dostawca',
      jumpBackToChart: 'powrót do tabeli'
    },
    providerList: {
      provider: 'Dostawca',
      stations: 'Stacje',
      timeseries: 'Timeseries',
      phenomena: 'Zjawiska'
    },
    search: {
      label: 'szukaj adresu ...',
      noResult: 'Przykro nam, że adres nie został znaleziony.'
    }
  },
  listSelection: {
    header: 'Wybierz timeseries według listy',
    headers: {
      category: 'Kategoria',
      station: 'Stacja',
      phenomenon: 'Zjawisko',
      procedure: 'Czujnik'
    },
    warning: {
      moreThanOneTimeseries: 'Znaleziono więcej niż jedną timeseries'
    }
  },
  legend: {
    entry: {
      noData: 'Brak danych',
      jumpToLastValue: 'przejść do ostatniej wartości',
      firstValueAt: 'Pierwsza wartość w',
      lastValueAt: 'Ostatnia wartość w'
    }
  },
  export: {
    label: 'Dane w formacie CSV (Kod Archiwum)'
  },
  timeSelection: {
    header: 'Zakres czasu',
    presetsHeader: 'presetów',
    presets: {
      lastHour: 'ostatnia godzina',
      today: 'dzisiaj',
      yesterday: 'wczoraj',
      todayYesterday: 'Wczoraj i dziś',
      thisWeek: 'w tym tygodniu',
      lastWeek: 'w zeszłym tygodniu',
      thisMonth: 'w tym miesiącu',
      lastMonth: 'w zeszłym miesiącu',
      thisYear: 'w tym roku',
      lastYear: 'w ubiegłym roku'
    },
    custom: {
      header: 'zwyczaj',
      start: 'Data rozpoczęcia',
      end: 'Data zakończenia'
    },
    warning: {
      startBeforeEnd: 'Data rozpoczęcia nie może być większa niż daty zakończenia',
      maxTimeRange: 'Zakres czasu nie może być większa niż jeden rok'
    }
  },
  styleChange: {
    header: 'Zmień styl',
    currentColor: 'Obecny kolor',
    selectColor: 'Wybierz nowy kolor',
    selectBarInterval: 'Wybierz przedział bar',
    barChartInterval: {
      hour: 'Godzina',
      day: 'Dzień',
      week: 'Tydzień',
      month: 'Miesiąc'
    },
    zeroScaled: 'zerowe skalowane osi Y',
    groupedAxis: 'Oś zgrupowane'
  },
  settings: {
    header: 'Ustawienia',
    chooseLanguage: 'Przełącznik języka',
    requiresRestart: 'Wymaga ponownego uruchomienia!',
    permalink: {
      create: 'Tworzenie odnośnika jako',
      inWindow: 'Link w nowym oknie',
      inMail: 'Link w e-mailu',
      inClipboard: 'Link do schowka',
      clipboardInfo: 'Skopiuj do schowka:',
      inQrCode: 'QR-Code, jak',
      favorite: 'Zapisz środowiska pracy jako ulubionej pozycji'
    },
    clusterMarker: 'Znacznik klaster',
    markerWithLastInfo: {
      header: 'Marker z ostatniej informacji wartości',
      label: 'uwaga - niektóre dostawca danych jest bardzo powolny'
    },
    saveStatus: {
      header: 'Zapisz środowiska',
      label: 'Wszystkie timeseries, skumulowanie i wybrane ustawienia są zapisywane w sposób ciągły.'
    },
    resetStatus: 'Resetowanie środowiska',
    generalizeData: 'uogólnienie danych',
    imprint: {
      header: 'Odcisk',
      github: 'Znajdź projekt na <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a>',
      text: '<p> <a href="http://52north.org" target="_blank">52 ° Północna GmbH</a> jest odpowiedzialny za tę stronę. </p><p> 52 ° Północna Inicjatywa na rzecz Open Source Geospatial Software GmbH <br> Martin-Luther-King-Weg 24 <br> 48155 Muenster, Niemcy </p>'
    }
  },
  permalink: {
    noMatchingTimeseriesFound: 'Brak dopasowania timeseries znajduje.'
  },
  guide: {
    start: {
      request: 'Po uruchomieniu tej instrukcji, obecny stan zostanie zresetowany.'
    },
    step1: {
      header: 'JavaScript Klient - wycieczka z przewodnikiem',
      text: 'Ta wycieczka daje w kilku krokach przegląd jak używać tego klienta. Najpierw musimy dodać timeseries z mapy.'
    },
    step2: {
      header: 'Przejdź do mapy',
      text: 'Tutaj możemy przełączyć widok, aby uzyskać mapę.'
    },
    step3: {
      header: 'Widok mapy',
      text: 'To jest mapa. Na mapie widać markery lub markergroups.'
    },
    step4: {
      header: 'Zmiana dostawcy',
      text: 'Tutaj można wybrać innego usługodawcy timeseries.'
    },
    step5: {
      header: 'Pokaż lokalizację',
      text: 'I tu można zlokalizować urządzenie na mapie.'
    },
    step6: {
      header: 'Wybór listy',
      text: 'Tutaj możesz wybrać timeseries z zamówionych list.'
    },
    step7: {
      header: 'Wybierz stację',
      text: 'Wybierz teraz stację na mapie.'
    },
    step8: {
      header: 'Wybierz timeseries',
      text: 'Zaznacz to pole wyboru. Jeśli jest tylko jeden timeseries dla tej stacji, pole wyboru jest już zaznaczone. Teraz można przejść za pomocą przycisku &quot;OK&quot;, aby załadować timeseries.'
    },
    step9: {
      header: 'Wpis Legenda',
      text: 'Tu zobaczysz dodatkową szeregów czasowych. Możesz usunąć lub zlokalizować szereg czasowy lub zmienić kolor.'
    },
    step10: {
      header: 'Wykres',
      text: 'Jest to wykres wybranego cyklu czasowego.'
    },
    step11: {
      header: 'Zmiana czasu',
      text: 'Tutaj możesz zmienić zakres czasowy dla wybranego szeregu czasowego.'
    },
    step12: {
      header: 'Tabela Zobacz',
      text: 'Tutaj masz stolik surowych wartości danych do wybranego szeregu czasowego.'
    },
    step13: {
      header: 'Ulubiona zarządzanie',
      text: 'Wpisy legendy / timeseries można zapisać jako ulubione. Z tego punktu widzenia wszystkie ulubione są wymienione i mogą być utrzymane.'
    },
    step14: {
      header: 'Ukończony',
      text: 'Well done! <br> Ten klient jest produktem <a href="http://52north.org" target="_blank">52 ° Północnej GmbH</a> . Można znaleźć kod źródłowy na <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a> .'
    }
  },
  favorite: {
    firstValueAt: 'Pierwsza wartość w',
    lastValueAt: 'Ostatnia wartość w',
    label: 'ulubiony',
    edit: {
      header: 'Edycja ulubiona'
    },
    group: {
      add: 'Stan &#39;{0}&#39; jest dodawany do listy ulubionych.',
      exists: 'Status ten nadal istnieje.',
      noTimeseries: 'Obecnie nie ma timeseries wybiera.',
      notSupported: 'Dostawcą wpisu statusu &#39;{0}&#39; nie jest obsługiwany i nie może być załadowany.'
    },
    single: {
      add: 'Nowy ulubiony &#39;{0}&#39; jest dodawane do listy.',
      remove: 'Ulubiona &#39;{0}&#39; jest usuwana.',
      exists: 'To ulubiona nadal istnieje.',
      notSupported: 'Udzielający ulubionych &#39;{0}&#39; nie jest obsługiwany i nie może być załadowany.'
    },
    import: {
      override: 'Czy chcesz zastąpić bieżące ulubione?',
      wrongFile: 'Nie można odczytać pliku',
      noValidJson: 'Plik JSON nie jest ważny!',
      header: 'Importowanie ulubionych',
      text: 'Tutaj można importować wyeksportowane ulubionych. Wystarczy wkleić JSON w polu tekstowym:'
    },
    export: {
      header: 'Eksport ulubionych',
      text: 'Tutaj można eksportować swoje ulubione. Wystarczy skopiować JSON z tego pola tekstowego i zapisać go w pliku, aby go importować później:'
    },
    error: {
      fileApiNotSupported: 'API plików nie są w pełni obsługiwane w tej przeglądarce.'
    }
  },
  inform: {
    error: 'Wystąpił błąd:',
    warn: 'Proszę pamiętać, że:'
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
i18n.pt = {
  fullName: 'Português',
  ok: 'ESTÁ BEM',
  main: {
    legend: 'Lenda',
    diagram: 'Diagrama',
    mapView: 'Ver o mapa',
    favoriteView: 'Favoritos',
    settings: 'Definições',
    stationSelection: 'Selecione uma estação',
    chartView: 'Vista Gráfico',
    allPhenomena: 'Todos os Fenômenos',
    phenomenon: 'Fenómeno',
    favoritesList: 'Favoritos',
    importFavorites: 'Importação',
    exportFavorites: 'Exportação',
    importExportHelp: 'Para importar um arquivo, por favor, escolha um arquivo exportado antes.',
    noFileSelected: 'No arquivo selecionado'
  },
  chart: {
    noTimeseriesSelected: 'Você selecionou nenhum timeseries, os timeseries selecionados têm nenhum valor no intervalo de tempo determinado ou os timeseries estão ocultas.',
    outsideOfDataRange: 'Fora do intervalo de dados!',
    annotation: 'Dados sem garantia!',
    monthNames: [ 'Jan', 'Fevereiro', 'Estragar', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro' ]
  },
  table: {
    time: 'Tempo'
  },
  map: {
    userLocation: 'Aqui está a sua localização actual',
    stationSelection: {
      station: 'Estação',
      selectAllTimeseries: 'selecionar todos os timeseries'
    },
    stationLocation: {
      station: 'Estação',
      timeseries: 'Timeseries',
      provider: 'Provedor',
      jumpBackToChart: 'de volta ao gráfico'
    },
    providerList: {
      provider: 'Provedor',
      stations: 'Estações',
      timeseries: 'Timeseries',
      phenomena: 'Fenómenos'
    },
    search: {
      label: 'procurar endereço ...',
      noResult: 'Desculpe, o endereço não pôde ser encontrado.'
    }
  },
  listSelection: {
    header: 'Selecione timeseries por lista',
    headers: {
      category: 'Categoria',
      station: 'Estação',
      phenomenon: 'Fenómeno',
      procedure: 'Sensor'
    },
    warning: {
      moreThanOneTimeseries: 'encontrado mais de um timeseries'
    }
  },
  legend: {
    entry: {
      noData: 'Não há dados disponíveis',
      jumpToLastValue: 'Ir para o último valor',
      firstValueAt: 'Primeiro valor em',
      lastValueAt: 'Última valor em'
    }
  },
  export: {
    label: 'Dados como CSV (arquivo ZIP)'
  },
  timeSelection: {
    header: 'Intervalo de tempo',
    presetsHeader: 'presets',
    presets: {
      lastHour: 'última hora',
      today: 'hoje',
      yesterday: 'ontem',
      todayYesterday: 'hoje e ontem',
      thisWeek: 'esta semana',
      lastWeek: 'semana passada',
      thisMonth: 'este mês',
      lastMonth: 'mês passado',
      thisYear: 'este ano',
      lastYear: 'ano passado'
    },
    custom: {
      header: 'personalizado',
      start: 'Data de início',
      end: 'A data de término'
    },
    warning: {
      startBeforeEnd: 'A data de início não pode ser maior que a data final',
      maxTimeRange: 'O intervalo de tempo não pode ser maior que um ano'
    }
  },
  styleChange: {
    header: 'Mude o estilo',
    currentColor: 'Cor atual',
    selectColor: 'Selecione uma nova cor',
    selectBarInterval: 'Selecione o intervalo de bar',
    barChartInterval: {
      hour: 'Hora',
      day: 'Dia',
      week: 'Semana',
      month: 'Mês'
    },
    zeroScaled: 'eixo Y em escala de zero',
    groupedAxis: 'eixo agrupados'
  },
  settings: {
    header: 'Definições',
    chooseLanguage: 'Switch language',
    requiresRestart: 'Necessidades Restart!',
    permalink: {
      create: 'Criar um permalink como',
      inWindow: 'link em uma nova janela',
      inMail: 'link em um e-mail',
      inClipboard: 'Link para a área de transferência',
      clipboardInfo: 'Copiar para a área de transferência:',
      inQrCode: 'como QR-Code',
      favorite: 'Salve ambiente de trabalho como entrada favorito'
    },
    clusterMarker: 'marcador de cluster',
    markerWithLastInfo: {
      header: 'marcador com informações último valor',
      label: 'atenção - alguns provedor de dados são muito lentos'
    },
    saveStatus: {
      header: 'Salvar ambiente',
      label: 'Todos os timeseries, o período de tempo selecionado e as configurações são salvas contínua.'
    },
    resetStatus: 'Ambiente de redefinição',
    generalizeData: 'generalizar dados',
    imprint: {
      header: 'Cunho',
      github: 'Encontre este projeto no <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a>',
      text: '<p> <a href="http://52north.org" target="_blank">52 ° Norte GmbH</a> é responsável por este site. </p><p> 52 ° Iniciativa do Norte para a Open Source Geospatial Software GmbH <br> Martin-Luther-King-Weg 24 <br> 48155 Muenster, Alemanha </p>'
    }
  },
  permalink: {
    noMatchingTimeseriesFound: 'Nenhum timeseries correspondente for encontrado.'
  },
  guide: {
    start: {
      request: 'Quando você iniciar este guia, o estado atual será reiniciado.'
    },
    step1: {
      header: 'JavaScript Cliente - Visita Guiada',
      text: 'Esse passeio dá em poucos passos uma visão geral como usar este cliente. Primeiro vamos adicionar timeseries do mapa.'
    },
    step2: {
      header: 'Ir para o mapa',
      text: 'Aqui vamos alterar a vista para obter um mapa.'
    },
    step3: {
      header: 'Ver o mapa',
      text: 'Esta é a visualização do mapa. No mapa você pode ver marcadores ou markergroups.'
    },
    step4: {
      header: 'Mudança Provider',
      text: 'Aqui você pode selecionar outro provedor timeseries.'
    },
    step5: {
      header: 'Mostrar localização',
      text: 'E aqui você pode localizar o seu dispositivo no mapa.'
    },
    step6: {
      header: 'Lista seleção',
      text: 'Aqui você pode selecionar um timeseries fora de listas ordenadas.'
    },
    step7: {
      header: 'Selecione uma estação',
      text: 'Por favor, selecione agora uma estação no mapa.'
    },
    step8: {
      header: 'Select timeseries',
      text: 'Selecione esta caixa de seleção. Se houver apenas um timeseries para esta estação, a caixa de seleção já está marcada. Agora você pode ir em frente com o botão &quot;OK&quot; para carregar os timeseries.'
    },
    step9: {
      header: 'Entrada Legend',
      text: 'Aqui você vê a série temporal acrescentou. Você pode excluir ou localizar a série de tempo ou mudar a cor.'
    },
    step10: {
      header: 'Gráfico',
      text: 'Este é o gráfico da série de tempo selecionado.'
    },
    step11: {
      header: 'Alterar o tempo',
      text: 'Aqui você pode alterar a extensão do tempo para a sua série de tempo selecionado.'
    },
    step12: {
      header: 'Table View',
      text: 'Aqui você tem uma tabela com os valores de dados brutos para sua série de tempo selecionado.'
    },
    step13: {
      header: 'Gestão Favorita',
      text: 'As entradas de legenda / timeseries poderiam ser salvos como favoritos. Neste ponto de vista todos os favoritos são listados e poderia ser mantida.'
    },
    step14: {
      header: 'Terminado',
      text: 'Bem feito! <br> Este cliente é um produto de <a href="http://52north.org" target="_blank">52 ° Norte GmbH</a> . Você pode encontrar o código fonte no <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a> .'
    }
  },
  favorite: {
    firstValueAt: 'Primeiro valor em',
    lastValueAt: 'Última valor em',
    label: 'favorito',
    edit: {
      header: 'Editar favorito'
    },
    group: {
      add: 'O status &#39;{0}&#39; é adicionado à lista de favoritos.',
      exists: 'Esse status ainda existe.',
      noTimeseries: 'Atualmente não há timeseries são selecionados.',
      notSupported: 'O provedor de uma entrada do status &#39;{0}&#39; não é suportada e não pode ser carregado.'
    },
    single: {
      add: 'Um novo favorito &#39;{0}&#39; é adicionado à lista.',
      remove: 'O favorito &#39;{0}&#39; é removido.',
      exists: 'Este favorito ainda existe.',
      notSupported: 'O provedor do favorito &#39;{0}&#39; não é suportado e não pode ser carregado.'
    },
    import: {
      override: 'Você quer substituir seus favoritos atuais?',
      wrongFile: 'Não foi possível ler o arquivo',
      noValidJson: 'O arquivo JSON não é válido!',
      header: 'Importar favoritos',
      text: 'Aqui você pode importar seus favoritos exportados. Basta colar o JSON neste campo de texto:'
    },
    export: {
      header: 'Exportar favoritos',
      text: 'Aqui você pode exportar seus favoritos. Basta copiar o JSON fora desta caixa de texto e salvá-lo em um arquivo para importá-lo mais tarde:'
    },
    error: {
      fileApiNotSupported: 'As APIs de arquivos não são totalmente suportados neste browser.'
    }
  },
  inform: {
    error: 'Ocorreu um erro:',
    warn: 'Lembre-se que:'
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
i18n.ro = {
  fullName: 'Român',
  ok: 'BINE',
  main: {
    legend: 'Legendă',
    diagram: 'Diagramă',
    mapView: 'Vizualizare hartă',
    favoriteView: 'Favorite',
    settings: 'Setări',
    stationSelection: 'Selectați o stație',
    chartView: 'Vizualizare Grafic',
    allPhenomena: 'Toate fenomenele',
    phenomenon: 'Fenomen',
    favoritesList: 'Favorite',
    importFavorites: 'Import',
    exportFavorites: 'Export',
    importExportHelp: 'Pentru a importa un fișier, vă rugăm să alegeți un fișier exportat înainte.',
    noFileSelected: 'Nici un fișier selectat'
  },
  chart: {
    noTimeseriesSelected: 'Ați selectat nici timeseries, de timeseries selectate nu au valori în intervalul de timp dat sau timeseries sunt ascunse.',
    outsideOfDataRange: 'În afara din gama de date!',
    annotation: 'Datele fără garanție!',
    monthNames: [ 'Jan', 'Februarie', 'Strica', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie' ]
  },
  table: {
    time: 'Timp'
  },
  map: {
    userLocation: 'Iată locația curentă',
    stationSelection: {
      station: 'Stație',
      selectAllTimeseries: 'selecteaza toate timeseries'
    },
    stationLocation: {
      station: 'Stație',
      timeseries: 'Timeseries',
      provider: 'Furnizor',
      jumpBackToChart: 'înapoi la diagramă'
    },
    providerList: {
      provider: 'Furnizor',
      stations: 'Stații',
      timeseries: 'Timeseries',
      phenomena: 'Fenomene'
    },
    search: {
      label: 'caută adresa ...',
      noResult: 'Ne pare rău, că adresa nu a putut fi găsit.'
    }
  },
  listSelection: {
    header: 'Selectați timeseries de listă',
    headers: {
      category: 'Categorie',
      station: 'Stație',
      phenomenon: 'Fenomen',
      procedure: 'Senzor'
    },
    warning: {
      moreThanOneTimeseries: 'a găsit mai mult de un timeseries'
    }
  },
  legend: {
    entry: {
      noData: 'Nu sunt date disponibile',
      jumpToLastValue: 'sări la ultima valoare',
      firstValueAt: 'Primul valoare la',
      lastValueAt: 'Ultima valoare la'
    }
  },
  export: {
    label: 'Datele în format CSV (arhivă)'
  },
  timeSelection: {
    header: 'Intervalul de timp',
    presetsHeader: 'presetări',
    presets: {
      lastHour: 'Ultima oră',
      today: 'astăzi',
      yesterday: 'ieri',
      todayYesterday: 'azi &amp; ieri',
      thisWeek: 'în această săptămână',
      lastWeek: 'săptămâna trecută',
      thisMonth: 'în această lună',
      lastMonth: 'în ultima lună',
      thisYear: 'anul acesta',
      lastYear: 'anul trecut'
    },
    custom: {
      header: 'obicei',
      start: 'Data de început',
      end: 'Data de încheiere'
    },
    warning: {
      startBeforeEnd: 'Data de începere nu poate fi mai mare decât data de sfârșit',
      maxTimeRange: 'Intervalul de timp nu poate fi mai mare decât o ani'
    }
  },
  styleChange: {
    header: 'Schimbarea de stil',
    currentColor: 'Culoare actual',
    selectColor: 'Selectați o culoare nouă',
    selectBarInterval: 'Selectați intervalul de bare',
    barChartInterval: {
      hour: 'Oră',
      day: 'Zi',
      week: 'Săptămână',
      month: 'Lună'
    },
    zeroScaled: 'scalate axa Y la zero',
    groupedAxis: 'Axa grupate'
  },
  settings: {
    header: 'Setări',
    chooseLanguage: 'Schimbă limba',
    requiresRestart: 'Are nevoie de Restart!',
    permalink: {
      create: 'Creați un permalink ca',
      inWindow: 'legătură într-o fereastră nouă',
      inMail: 'link dintr-un e-mail',
      inClipboard: 'Link la clipboard',
      clipboardInfo: 'Copiere în clipboard:',
      inQrCode: 'ca QR-Code',
      favorite: 'Salvați mediul de lucru ca intrare favorit'
    },
    clusterMarker: 'îi trimită grup',
    markerWithLastInfo: {
      header: 'îi trimită cu ultimul informații valoare',
      label: 'atenție - unii furnizor de date sunt foarte lente'
    },
    saveStatus: {
      header: 'Salvați mediu',
      label: 'Toate timeseries, durata de timp selectată și setările sunt salvate continuu.'
    },
    resetStatus: 'Mediu Reset',
    generalizeData: 'generală de date',
    imprint: {
      header: 'Imprima',
      github: 'Găsiți acest proiect la <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a>',
      text: '<p> <a href="http://52north.org" target="_blank">52 ° nord GmbH</a> este responsabil pentru acest site. </p><p> 52 ° Inițiativa nord de geospațiale Open Source Software GmbH <br> Martin Luther--King-Weg 24 <br> 48155 Muenster, Germania </p>'
    }
  },
  permalink: {
    noMatchingTimeseriesFound: 'Nu timeseries potrivite este găsit.'
  },
  guide: {
    start: {
      request: 'Când porniți acest ghid, starea actuală va fi resetat.'
    },
    step1: {
      header: 'JavaScript client - Tur',
      text: 'Acest turneu oferă în câțiva pași o imagine de ansamblu modul de utilizare a acestui client. În primul rând vom adăuga o timeseries de pe harta.'
    },
    step2: {
      header: 'Du-te la harta',
      text: 'Aici vom trece vizualizarea pentru a obține o hartă.'
    },
    step3: {
      header: 'Vizualizare hartă',
      text: 'Acesta este punctul de vedere hartă. In harta puteti vedea markere sau markergroups.'
    },
    step4: {
      header: 'Schimbarea Furnizor',
      text: 'Aici puteți selecta un alt furnizor timeseries.'
    },
    step5: {
      header: 'Afișare locație',
      text: 'Și aici puteți localiza dispozitivul pe hartă.'
    },
    step6: {
      header: 'Selecție Listă',
      text: 'Aici puteți selecta un timeseries din liste ordonate.'
    },
    step7: {
      header: 'Selectați o stație',
      text: 'Vă rugăm să selectați acum o stație de pe hartă.'
    },
    step8: {
      header: 'Selectați timeseries',
      text: 'Selectați această casetă. Dacă există un singur timeseries pentru acest post, pe caseta este deja bifată. Acum poti merge mai departe cu butonul &quot;OK&quot; pentru a încărca timeseries.'
    },
    step9: {
      header: 'Intrare Legenda',
      text: 'Aici veți vedea seriile de timp adăugat. Puteți șterge sau localiza seriile de timp sau schimba culoarea.'
    },
    step10: {
      header: 'Diagramă',
      text: 'Aceasta este graficul de seriilor de timp selectat.'
    },
    step11: {
      header: 'Schimbarea timp',
      text: 'Aici puteți schimba măsura de timp pentru seriile de timp selectat.'
    },
    step12: {
      header: 'Tabelul Vezi',
      text: 'Aici veti gasi un tabel de valori de date brute pentru seriile de timp selectat.'
    },
    step13: {
      header: 'Management preferate',
      text: 'Intrările Legenda / timeseries ar putea fi salvate ca favorite. În acest punct de vedere toate favorite sunt listate și ar putea fi menținute.'
    },
    step14: {
      header: 'A terminat pe locul',
      text: 'Bine făcut! <br> Acest client este un produs de <a href="http://52north.org" target="_blank">52 ° nord GmbH</a> . Puteți găsi codul sursă pe <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a> .'
    }
  },
  favorite: {
    firstValueAt: 'Primul valoare la',
    lastValueAt: 'Ultima valoare la',
    label: 'favorit',
    edit: {
      header: 'Editați favorit'
    },
    group: {
      add: 'Statutul &quot;{0}&quot; se adaugă la lista de favorite.',
      exists: 'Acest statut încă mai există.',
      noTimeseries: 'În prezent, nu sunt selectate timeseries.',
      notSupported: 'Furnizorul de o intrare a statutului &quot;{0}&quot; nu este acceptată și nu poate fi încărcat.'
    },
    single: {
      add: 'Un nou favorit &quot;{0}&quot; se adaugă la lista.',
      remove: 'Favoritul &quot;{0}&quot; este eliminat.',
      exists: 'Acest favorit încă mai există.',
      notSupported: 'Furnizorul de favorit &quot;{0}&quot; nu este acceptată și nu poate fi încărcat.'
    },
    import: {
      override: 'Vrei să suprascrie favorite curente?',
      wrongFile: 'Nu se poate citi fișierul',
      noValidJson: 'Fișierul JSON nu este valid!',
      header: 'Import favorite',
      text: 'Aici puteți importa favorite exportate. Doar paste JSON în acest domeniu de text:'
    },
    export: {
      header: 'Export favorite',
      text: 'Aici puteți exporta favorite. Doar copiați JSON din aceasta casuta și salvați-o într-un fișier pentru al importa mai târziu:'
    },
    error: {
      fileApiNotSupported: 'API-urile de fișiere nu sunt pe deplin susținute în acest browser.'
    }
  },
  inform: {
    error: 'A apărut o eroare:',
    warn: 'Vă rugăm să rețineți că:'
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
i18n.sk = {
  fullName: 'Slovenčina',
  ok: 'OK',
  main: {
    legend: 'Legenda',
    diagram: 'Diagram',
    mapView: 'Zobrazenie mapy',
    favoriteView: 'Obľúbené',
    settings: 'Nastavenie',
    stationSelection: 'Vyberte stanicu',
    chartView: 'Pohľad Chart',
    allPhenomena: 'Všetky javy',
    phenomenon: 'Jav',
    favoritesList: 'Obľúbené',
    importFavorites: 'Import',
    exportFavorites: 'Export',
    importExportHelp: 'Ak chcete importovať súbor, vyberte súbor, ktorý ste exportovali skôr.',
    noFileSelected: 'Nebol vybraný žiadny súbor'
  },
  chart: {
    noTimeseriesSelected: 'Vybrali ste žiadne TimeSeries, vybrané TimeSeries nemajú hodnoty v danom časovom rozmedzí alebo TimeSeries sú skryté.',
    outsideOfDataRange: 'Mimo oblasť dát!',
    annotation: 'Údaje bez záruky!',
    monthNames: [ 'Január', 'Február', 'Kaziť', 'Apríla', 'Máj', 'Júna', 'Júla', 'Augusta', 'Septembra', 'Október', 'November', 'Decembra' ]
  },
  table: {
    time: 'Čas'
  },
  map: {
    userLocation: 'Tu je vaša aktuálna poloha',
    stationSelection: {
      station: 'Stanice',
      selectAllTimeseries: 'vybrať všetky TimeSeries'
    },
    stationLocation: {
      station: 'Stanice',
      timeseries: 'TimeSeries',
      provider: 'Poskytovateľ',
      jumpBackToChart: 'späť do grafu'
    },
    providerList: {
      provider: 'Poskytovateľ',
      stations: 'Stanice',
      timeseries: 'TimeSeries',
      phenomena: 'Javy'
    },
    search: {
      label: 'hľadať adresu ...',
      noResult: 'Je nám ľúto, že adresa nebola nájdená.'
    }
  },
  listSelection: {
    header: 'Vyberte TimeSeries podľa zoznamu',
    headers: {
      category: 'Kategórie',
      station: 'Stanice',
      phenomenon: 'Jav',
      procedure: 'Senzor'
    },
    warning: {
      moreThanOneTimeseries: 'nájdených viac ako jeden TimeSeries'
    }
  },
  legend: {
    entry: {
      noData: 'k dispozícii žiadne údaje',
      jumpToLastValue: 'skok na poslednej hodnote',
      firstValueAt: 'Prvá hodnota v',
      lastValueAt: 'Posledná hodnota pri'
    }
  },
  export: {
    label: 'Dáta vo formáte CSV (Zip archív)'
  },
  timeSelection: {
    header: 'Časový rozsah',
    presetsHeader: 'Predvoľby',
    presets: {
      lastHour: 'Posledná hodina',
      today: 'dnes',
      yesterday: 'včera',
      todayYesterday: 'dnes a včera',
      thisWeek: 'tento týždeň',
      lastWeek: 'minulý týždeň',
      thisMonth: 'tento mesiac',
      lastMonth: 'minulý mesiac',
      thisYear: 'tento rok',
      lastYear: 'vlani'
    },
    custom: {
      header: 'zvyk',
      start: 'Dátum začatia',
      end: 'Dátum ukončenia'
    },
    warning: {
      startBeforeEnd: 'Dátum začatia nemôže byť väčšia, ako je dátum ukončenia',
      maxTimeRange: 'Časový rozsah nemôže byť väčšia ako jeden rok'
    }
  },
  styleChange: {
    header: 'Zmeniť štýl',
    currentColor: 'Aktuálna farba',
    selectColor: 'Vyberte nové farby',
    selectBarInterval: 'Vyberte bar interval',
    barChartInterval: {
      hour: 'Hodina',
      day: 'Deň',
      week: 'Týždeň',
      month: 'Mesiac'
    },
    zeroScaled: 'nula šupinatý os y',
    groupedAxis: 'zoskupené os'
  },
  settings: {
    header: 'Nastavenie',
    chooseLanguage: 'Prepnúť jazyk',
    requiresRestart: 'Potrebuje Restart!',
    permalink: {
      create: 'Vytvoriť Permalink ako',
      inWindow: 'odkaz v novom okne',
      inMail: 'odkaz v e-maile',
      inClipboard: 'Odkaz do schránky',
      clipboardInfo: 'Kopírovať do schránky:',
      inQrCode: 'as QR-Code',
      favorite: 'Uložiť pracovné prostredie ako obľúbené položky'
    },
    clusterMarker: 'klaster značka',
    markerWithLastInfo: {
      header: 'značkovač s informáciami poslednú hodnotu',
      label: 'pozor - niektoré poskytovateľa dát je veľmi pomalé'
    },
    saveStatus: {
      header: 'Save prostredie',
      label: 'Všetky TimeSeries, vybraný OBDOBIE a nastavenia sú uložené kontinuálne.'
    },
    resetStatus: 'Obnoviť prostredie',
    generalizeData: 'zovšeobecniť dát',
    imprint: {
      header: 'Odtlačok',
      github: 'Nájsť tento projekt na <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a>',
      text: '<p> <a href="http://52north.org" target="_blank">52 ° severnej GmbH</a> je zodpovedný za túto webovú stránku. </p><p> 52 ° severnej Initiative for Geospatial Open Source Software GmbH <br> Martin-Luther-King-Weg 24 <br> 48155 Münster, Nemecko </p>'
    }
  },
  permalink: {
    noMatchingTimeseriesFound: 'Bez zodpovedajúcej TimeSeries je nájdený.'
  },
  guide: {
    start: {
      request: 'Pri spustení tohto sprievodcu, bude súčasný stav obnoviť.'
    },
    step1: {
      header: 'JavaScript Client - Komentovaná prehliadka',
      text: 'Táto prehliadka poskytuje v niekoľkých krokoch prehľad, ako používať túto klienta. Najprv pridáme TimeSeries z mapy.'
    },
    step2: {
      header: 'Prejsť na mapu',
      text: 'Tu sa prepnúť zobrazenie získať mapy.'
    },
    step3: {
      header: 'Zobrazenie mapy',
      text: 'To je zobrazenie mapy. V mape si môžete prezrieť značky alebo markergroups.'
    },
    step4: {
      header: 'Zmena dodávateľa',
      text: 'Tu si môžete vybrať iný TimeSeries prevádzkovateľa.'
    },
    step5: {
      header: 'Show umiestnenie',
      text: 'A tu si môžete nájsť svoj prístroj na mape.'
    },
    step6: {
      header: 'Výber Zoznam',
      text: 'Tu si môžete vybrať TimeSeries z objednaných zoznamov.'
    },
    step7: {
      header: 'Vyberte stanicu',
      text: 'Vyberte teraz stanicu na mape.'
    },
    step8: {
      header: 'Vybrať TimeSeries',
      text: 'Začiarknite toto políčko. Ak je len jeden TimeSeries na tejto stanici, políčko je už kontrolovaná. Teraz môžete ísť na tlačidlom &quot;OK&quot; načítať TimeSeries.'
    },
    step9: {
      header: 'Vstup Legend',
      text: 'Tu vidíte pridanej časové rady. Môžete odstrániť alebo nájsť časový rad, alebo zmeniť farbu.'
    },
    step10: {
      header: 'Graf',
      text: 'To je schéma vybranej časové rady.'
    },
    step11: {
      header: 'Zmeniť čas',
      text: 'Tu si môžete zmeniť rozsah času pre zvolené časové rady.'
    },
    step12: {
      header: 'Table View',
      text: 'Tu máte tabuľku surových dátových hodnôt k vybranému časové rady.'
    },
    step13: {
      header: 'Obľúbený riadenie',
      text: 'Položky Legenda / TimeSeries môžu byť uložené ako obľúbené. V tomto pohľade sú všetky obľúbené uvedené a môže byť zachovaná.'
    },
    step14: {
      header: 'Dokončené',
      text: 'Výborne! <br> Tento klient je produkt <a href="http://52north.org" target="_blank">52 ° severnej GmbH</a> . Tu môžete nájsť zdrojový kód na <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a> .'
    }
  },
  favorite: {
    firstValueAt: 'Prvá hodnota v',
    lastValueAt: 'Posledná hodnota pri',
    label: 'obľúbený',
    edit: {
      header: 'Upraviť obľúbené'
    },
    group: {
      add: 'Stav &#39;{0}&#39; je pridaný do zoznamu obľúbených.',
      exists: 'Tento stav stále existuje.',
      noTimeseries: 'V súčasnej dobe sú vybrané žiadne TimeSeries.',
      notSupported: 'Poskytovateľ zápisu stavu &#39;{0}&#39; nie je podporované a nemožno načítať.'
    },
    single: {
      add: 'Nový obľúbený &#39;{0}&#39; je pridaný do zoznamu.',
      remove: 'Obľúbené &#39;{0}&#39; sa odstráni.',
      exists: 'Tento obľúbený stále existuje.',
      notSupported: 'Poskytovateľ favorita &#39;{0}&#39; nie je podporované a nemožno načítať.'
    },
    import: {
      override: 'Chcete prepísať aktuálne obľúbené?',
      wrongFile: 'Nemožno prečítať súbor',
      noValidJson: 'Súbor JSON nie je platný!',
      header: 'Importovať obľúbené',
      text: 'Tu si môžete importovať exportované obľúbené. Stačí vložiť JSON v tomto textovom poli:'
    },
    export: {
      header: 'Export obľúbené',
      text: 'Tu si môžete exportovať svoje obľúbené. Stačí len skopírovať JSON z tohto textového poľa a uložiť do súboru, aby ju neskôr importovať:'
    },
    error: {
      fileApiNotSupported: 'API súborov nie sú plne podporované v tomto prehliadači.'
    }
  },
  inform: {
    error: 'Došlo k chybe:',
    warn: 'Majte prosím na pamäti, že:'
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
i18n.si = {
  fullName: 'Slovenščina',
  ok: 'OK',
  main: {
    legend: 'Legend',
    diagram: 'Diagram',
    mapView: 'Pogled na zemljevidu',
    favoriteView: 'Priljubljene',
    settings: 'Nastavitve',
    stationSelection: 'Izberite postajo',
    chartView: 'Pogled na grafikon',
    allPhenomena: 'Vse Phenomena',
    phenomenon: 'Fenomen',
    favoritesList: 'Priljubljene',
    importFavorites: 'Uvoz',
    exportFavorites: 'Izvoz',
    importExportHelp: 'Če želite uvoziti datoteko, izberite datoteko, ki jo izvozili prej.',
    noFileSelected: 'Nobena datoteka ni izbrana'
  },
  chart: {
    noTimeseriesSelected: 'Ki ste jo izbrali nobenega timeseries, izbrane timeseries nimajo vrednosti v določenem časovnem obdobju ali timeseries so skrite.',
    outsideOfDataRange: 'Zunaj obsega podatkov!',
    annotation: 'Podatki brez garancije!',
    monthNames: [ 'Jan', 'Februar', 'Mar', 'April', 'Maj', 'Junij', 'Julij', 'Avgust', 'September', 'Oktober', 'November', 'December' ]
  },
  table: {
    time: 'Čas'
  },
  map: {
    userLocation: 'Tukaj je vaša trenutna lokacija',
    stationSelection: {
      station: 'Station',
      selectAllTimeseries: 'izberite vse timeseries'
    },
    stationLocation: {
      station: 'Station',
      timeseries: 'Timeseries',
      provider: 'Ponudnik',
      jumpBackToChart: 'nazaj na grafikonu'
    },
    providerList: {
      provider: 'Ponudnik',
      stations: 'Postaje',
      timeseries: 'Timeseries',
      phenomena: 'Phenomena'
    },
    search: {
      label: 'iskanje za naslov ...',
      noResult: 'Žal mi je, da naslov ni bilo mogoče najti.'
    }
  },
  listSelection: {
    header: 'Izberite timeseries s seznama',
    headers: {
      category: 'Kategorija',
      station: 'Station',
      phenomenon: 'Fenomen',
      procedure: 'Senzor'
    },
    warning: {
      moreThanOneTimeseries: 'je našel več kot eno timeseries'
    }
  },
  legend: {
    entry: {
      noData: 'ni razpoložljivih podatkov',
      jumpToLastValue: 'skočiti na zadnji vrednosti',
      firstValueAt: 'Prva vrednost na',
      lastValueAt: 'Zadnja vrednost na'
    }
  },
  export: {
    label: 'Podatkov, kot CSV (Zip arhiv)'
  },
  timeSelection: {
    header: 'Časovni razpon',
    presetsHeader: 'prednastavitve',
    presets: {
      lastHour: 'zadnja ura',
      today: 'danes',
      yesterday: 'včeraj',
      todayYesterday: 'Danes in včeraj',
      thisWeek: 'ta teden',
      lastWeek: 'zadnji teden',
      thisMonth: 'ta mesec',
      lastMonth: 'Prejšnji mesec',
      thisYear: 'letos',
      lastYear: 'lani'
    },
    custom: {
      header: 'po meri',
      start: 'Datum začetka',
      end: 'Končni datum'
    },
    warning: {
      startBeforeEnd: 'Začetni datum ne more biti večji od končnega datuma',
      maxTimeRange: 'Časovno obdobje ne more biti več kot eno leto'
    }
  },
  styleChange: {
    header: 'Spremeni slog',
    currentColor: 'Trenutna barva',
    selectColor: 'Izberite novo barvo',
    selectBarInterval: 'Izberite interval bar',
    barChartInterval: {
      hour: 'Ura',
      day: 'Dan',
      week: 'Teden',
      month: 'Mesec'
    },
    zeroScaled: 'nič raztegljive Y-os',
    groupedAxis: 'združene os'
  },
  settings: {
    header: 'Nastavitve',
    chooseLanguage: 'Stikalo jezik',
    requiresRestart: 'Potrebuje Restart!',
    permalink: {
      create: 'Ustvarite permalink kot',
      inWindow: 'povezavo v novem oknu',
      inMail: 'povezava v e-pošti',
      inClipboard: 'Povezava na odložišče',
      clipboardInfo: 'Kopiraj v odložišče:',
      inQrCode: 'kot QR-Code',
      favorite: 'Shranite delovno okolje kot priljubljeno vstopu'
    },
    clusterMarker: 'cluster marker',
    markerWithLastInfo: {
      header: 'dvojno podajo z zadnje informacije vrednosti',
      label: 'pozornost - nekateri ponudnik podatkov zelo počasen'
    },
    saveStatus: {
      header: 'Shrani okolje',
      label: 'Vse timeseries, v izbranem obdobju in nastavitve so shranjene neprekinjeno.'
    },
    resetStatus: 'Reset okolje',
    generalizeData: 'posploševati podatkov',
    imprint: {
      header: 'Imprint',
      github: 'Išči projekta na <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a>',
      text: '<p> <a href="http://52north.org" target="_blank">52 ° North GmbH</a> je odgovoren za to spletno stran. </p><p> 52 ° North Pobuda za GEOPROSTORSKEGA Open Source Software GmbH <br> Martin-Luther-King-Weg 24 <br> 48155 Münster, Nemčija </p>'
    }
  },
  permalink: {
    noMatchingTimeseriesFound: 'Se ni bilo mogoče najti timeseries.'
  },
  guide: {
    start: {
      request: 'Ko začnete ta navodila, se bo sedanje stanje resetirati.'
    },
    step1: {
      header: 'JavaScript Client - Vodstvo',
      text: 'Ta turneja daje v nekaj korakih pregled, kako uporabljati to stranko. Najprej moramo dodati timeseries iz zemljevida.'
    },
    step2: {
      header: 'Pojdi na zemljevidu',
      text: 'Tukaj smo preklopite pogled, da bi dobili zemljevid.'
    },
    step3: {
      header: 'Pogled na zemljevidu',
      text: 'To je pogled zemljevida. Na zemljevidu lahko vidite označevalci ali markergroups.'
    },
    step4: {
      header: 'Spremeni ponudnika',
      text: 'Tu lahko izberete drugega ponudnika timeseries.'
    },
    step5: {
      header: 'Prikaži lokacijo',
      text: 'In tu lahko poiščete svojo napravo na zemljevidu.'
    },
    step6: {
      header: 'Izbira seznam',
      text: 'Tu lahko izberete timeseries od naročenih seznamov.'
    },
    step7: {
      header: 'Izberite postajo',
      text: 'Prosimo, izberite zdaj postajo na zemljevidu.'
    },
    step8: {
      header: 'Izberite timeseries',
      text: 'Izberite to potrditveno polje. Če obstaja samo ena timeseries za to postajo, je polje že preverili. Sedaj lahko greš naprej z &quot;OK&quot; gumb za nalaganje timeseries.'
    },
    step9: {
      header: 'Vnos Legend',
      text: 'Tukaj lahko vidite dodano časovne vrste. Lahko izbrišete ali poiskati časovno vrsto ali spremenite barvo.'
    },
    step10: {
      header: 'Graf',
      text: 'To je shema izbranem časovnem nizu.'
    },
    step11: {
      header: 'Spremeni čas',
      text: 'Tukaj lahko spremenite časovni obseg za izbrano časovno vrsto.'
    },
    step12: {
      header: 'Table View',
      text: 'Tukaj dobiš tabelo surovin podatkovnih vrednosti za izbrano časovno vrsto.'
    },
    step13: {
      header: 'Priljubljeno upravljanje',
      text: 'Vpisi legenda / timeseries se lahko shranijo kot priljubljene. V tem pogledu so vsi favoriti na seznamu in bi bilo treba ohraniti.'
    },
    step14: {
      header: 'Končano',
      text: 'Dobro opravljeno! <br> Ta stranka je produkt <a href="http://52north.org" target="_blank">52 ° severne GmbH</a> . Najdete izvorno kodo na <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a> .'
    }
  },
  favorite: {
    firstValueAt: 'Prva vrednost na',
    lastValueAt: 'Zadnja vrednost na',
    label: 'najljubši',
    edit: {
      header: 'Uredi najljubši'
    },
    group: {
      add: 'Status &quot;{0}&quot; se doda na seznam priljubljenih.',
      exists: 'To stanje še vedno obstaja.',
      noTimeseries: 'Trenutno so izbrali nobenega timeseries.',
      notSupported: 'Ponudnik vpis statusa &#39;{0}&#39; ni podprt in ga ni mogoče naložiti.'
    },
    single: {
      add: 'Nov izbira &quot;{0}&quot; se doda na seznam.',
      remove: 'Najljubši &#39;{0}&#39; je odstranjena.',
      exists: 'To priljubljeno še vedno obstaja.',
      notSupported: 'Ponudnik favorita &#39;{0}&#39; ni podprt in ga ni mogoče naložiti.'
    },
    import: {
      override: 'Ali želite, da povozi vaše trenutne priljubljene?',
      wrongFile: 'Ne morem prebrati datoteke',
      noValidJson: 'Datoteka JSON ni veljavna!',
      header: 'Uvozna priljubljene',
      text: 'Tukaj lahko uvozite izvoženi priljubljene. Samo prilepite JSON v tem besedilnem polju:'
    },
    export: {
      header: 'Izvozna priljubljene',
      text: 'Tukaj lahko izvozite svoje favorite. Samo kopiranje JSON iz tega učbenik in ga shranite v datoteko uvoziti pozneje:'
    },
    error: {
      fileApiNotSupported: 'API datotek niso v celoti podprt v tem brskalniku.'
    }
  },
  inform: {
    error: 'Prišlo je do napake:',
    warn: 'Prosimo, upoštevajte, da:'
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
i18n.se = {
  fullName: 'Svenska',
  ok: 'OK',
  main: {
    legend: 'Legend',
    diagram: 'Diagram',
    mapView: 'Kart vy',
    favoriteView: 'Favoriter',
    settings: 'Inställningar',
    stationSelection: 'Välj en station',
    chartView: 'Diagram vy',
    allPhenomena: 'Alla Phenomena',
    phenomenon: 'Fenomen',
    favoritesList: 'Favoriter',
    importFavorites: 'Import',
    exportFavorites: 'Export',
    importExportHelp: 'Om du vill importera en fil, välj en fil du exporterade tidigare.',
    noFileSelected: 'Ingen fil valts'
  },
  chart: {
    noTimeseriesSelected: 'Du har valt några Visa, de utvalda Visa har inga värden i given tidsintervall eller Visa är dolda.',
    outsideOfDataRange: 'Utanför dataområdet!',
    annotation: 'Data utan garanti!',
    monthNames: [ 'Jan', 'Februari', 'Mar', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December' ]
  },
  table: {
    time: 'Tid'
  },
  map: {
    userLocation: 'Här är din aktuella position',
    stationSelection: {
      station: 'Station',
      selectAllTimeseries: 'markera alla Visa'
    },
    stationLocation: {
      station: 'Station',
      timeseries: 'Visa',
      provider: 'Provider',
      jumpBackToChart: 'tillbaka till diagrammet'
    },
    providerList: {
      provider: 'Provider',
      stations: 'Stationer',
      timeseries: 'Visa',
      phenomena: 'Fenomen'
    },
    search: {
      label: 'Sök efter adress ...',
      noResult: 'Tyvärr, kunde den adressen inte hittas.'
    }
  },
  listSelection: {
    header: 'Välj Visa från listan',
    headers: {
      category: 'Kategori',
      station: 'Station',
      phenomenon: 'Fenomen',
      procedure: 'Sensor'
    },
    warning: {
      moreThanOneTimeseries: 'hittade mer än en Visa'
    }
  },
  legend: {
    entry: {
      noData: 'inga tillgängliga data',
      jumpToLastValue: 'hoppa till sista värdet',
      firstValueAt: 'Första värde vid',
      lastValueAt: 'Senaste värde vid'
    }
  },
  export: {
    label: 'Data som CSV (Zip Arkiv)'
  },
  timeSelection: {
    header: 'Tidsintervall',
    presetsHeader: 'förinställningar',
    presets: {
      lastHour: 'senaste timmen',
      today: 'i dag',
      yesterday: 'i går',
      todayYesterday: 'idag &amp; igår',
      thisWeek: 'den här veckan',
      lastWeek: 'förra veckan',
      thisMonth: 'denna månad',
      lastMonth: 'förra månaden',
      thisYear: 'i år',
      lastYear: 'förra året'
    },
    custom: {
      header: 'beställnings',
      start: 'Startdatum',
      end: 'Slutdatum'
    },
    warning: {
      startBeforeEnd: 'Startdatumet kan inte vara större då slutdatum',
      maxTimeRange: 'Tidsintervallet kan inte vara större än ett år'
    }
  },
  styleChange: {
    header: 'Ändra stil',
    currentColor: 'Nuvarande färg',
    selectColor: 'Välj en ny färg',
    selectBarInterval: 'Välj baren intervallet',
    barChartInterval: {
      hour: 'Timme',
      day: 'Dag',
      week: 'Vecka',
      month: 'Månad'
    },
    zeroScaled: 'noll skalade Y-axeln',
    groupedAxis: 'grupperade axel'
  },
  settings: {
    header: 'Inställningar',
    chooseLanguage: 'Byt språk',
    requiresRestart: 'Behöver omstart!',
    permalink: {
      create: 'Skapa en permalänk som',
      inWindow: 'länken i ett nytt fönster',
      inMail: 'länken i ett e-postmeddelande',
      inClipboard: 'Länk till Windows urklipp',
      clipboardInfo: 'Kopiera till urklipp:',
      inQrCode: 'som QR-kod',
      favorite: 'Spara arbetsmiljö som favorit posten'
    },
    clusterMarker: 'kluster markör',
    markerWithLastInfo: {
      header: 'markör med sista värdet Information',
      label: 'uppmärksamhet - vissa dataleverantör är mycket långsam'
    },
    saveStatus: {
      header: 'Spara miljö',
      label: 'Alla Visa, vald tidsperiod och inställningarna sparas kontinuerligt.'
    },
    resetStatus: 'Återställ miljö',
    generalizeData: 'generalisera Data',
    imprint: {
      header: 'Imprint',
      github: 'Hitta det här projektet på <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a>',
      text: '<p> <a href="http://52north.org" target="_blank">52 ° North GmbH</a> ansvarar för denna webbplats. </p><p> 52 ° North initiativet för Geospatial Open Source Software GmbH <br> Martin-Luther-King-Weg 24 <br> 48155 Münster, Tyskland </p>'
    }
  },
  permalink: {
    noMatchingTimeseriesFound: 'Inga matchande Visa hittas.'
  },
  guide: {
    start: {
      request: 'När du startar den här guiden kommer det aktuella tillståndet återställas.'
    },
    step1: {
      header: 'JavaScript Client - guidad tur',
      text: 'Denna tur ger i några få steg en överblick hur man använder denna klient. Först lägger vi en Visa från kartan.'
    },
    step2: {
      header: 'Gå till kartan',
      text: 'Här byter vi utsikten att få en karta.'
    },
    step3: {
      header: 'Kart vy',
      text: 'Detta är kartvyn. I kartan kan du se markörer eller markergroups.'
    },
    step4: {
      header: 'Ändra Provider',
      text: 'Här kan du välja en annan Visa leverantör.'
    },
    step5: {
      header: 'Visa plats',
      text: 'Och här kan du hitta din enhet på kartan.'
    },
    step6: {
      header: 'Lista val',
      text: 'Här kan du välja en Visa ur beställda listor.'
    },
    step7: {
      header: 'Välj en station',
      text: 'Välj nu en station på kartan.'
    },
    step8: {
      header: 'Välj Visa',
      text: 'Markera den här kryssrutan. Om det bara finns en Visa för denna station, är kryssrutan redan är markerad. Nu kan du gå vidare med &quot;OK&quot; för att ladda Visa.'
    },
    step9: {
      header: 'Legend inträde',
      text: 'Här ser du den extra tidsserien. Du kan ta bort eller lokalisera tidsserier eller ändra färg.'
    },
    step10: {
      header: 'Diagram',
      text: 'Detta är ett schema över den valda tidsserie.'
    },
    step11: {
      header: 'Ändra tid',
      text: 'Här kan du ändra tids utsträckning för din valda tidsserier.'
    },
    step12: {
      header: 'Table View',
      text: 'Här får du en tabell över de råa datavärden till din valda tidsserier.'
    },
    step13: {
      header: 'Favorit förvaltning',
      text: 'De legend poster / Visa kunde sparas som favoriter. I den här vyn alla favoriter är listade och kunde bibehållas.'
    },
    step14: {
      header: 'Färdiga',
      text: 'Bra gjort! <br> Denna klient är en produkt av <a href="http://52north.org" target="_blank">52 ° North GmbH</a> . Du kan hitta källkoden på <a href="https://github.com/52North/js-sensorweb-client" target="_blank">GitHub</a> .'
    }
  },
  favorite: {
    firstValueAt: 'Första värde vid',
    lastValueAt: 'Senaste värde vid',
    label: 'favorit',
    edit: {
      header: 'Redigera favorit'
    },
    group: {
      add: 'Statusen &quot;{0}&quot; läggs till i favoritlistan.',
      exists: 'Denna status fortfarande existerar.',
      noTimeseries: 'För tillfället finns inga Visa väljs.',
      notSupported: 'Leverantören av en post av statusen &quot;{0}&quot; stöds inte och kan inte laddas.'
    },
    single: {
      add: 'En ny favorit &quot;{0}&quot; läggs till i listan.',
      remove: 'Favoriten &quot;{0}&quot; har tagits bort.',
      exists: 'Denna favorit fortfarande existerar.',
      notSupported: 'Leverantören av favoriten &quot;{0}&quot; stöds inte och kan inte laddas.'
    },
    import: {
      override: 'Vill du åsidosätta dina nuvarande favoriter?',
      wrongFile: 'Kunde inte läsa filen',
      noValidJson: 'JSON-filen är inte giltigt!',
      header: 'Importera favoriter',
      text: 'Här kan du importera dina exporterade favoriter. Bara klistra in JSON i det här textfältet:'
    },
    export: {
      header: 'Export favoriter',
      text: 'Här kan du exportera dina favoriter. Bara kopiera JSON ur denna textruta och spara den i en fil för att importera den senare:'
    },
    error: {
      fileApiNotSupported: 'Filen API är inte fullt stöd i den här webbläsaren.'
    }
  },
  inform: {
    error: 'Ett fel inträffade:',
    warn: 'Kom ihåg att:'
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
function TimeSeries(tsId, meta, apiUrl) {

    var internalId = tsHelper.createInternalId(tsId, apiUrl);
    var values = [];
    var refValues = {};
    var synced = false;
    var hidden = false;
    var selected = false;
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

    this.setStyle = function(newStyle) {
        style = newStyle;
    };

    this.isHidden = function() {
        return hidden;
    };

    this.setHidden = function(bool) {
        hidden = bool;
    };

    this.isSelected = function() {
        return selected;
    };

    this.setSelected = function(bool) {
        selected = bool;
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
        return this.getLastValue() !== null && moment().subtract(Settings.ignoreAfterDuration).isBefore(moment(this.getLastValue().timestamp));
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
        if (meta.parameters.category && (meta.parameters.phenomenon.label !== meta.parameters.category.label)) {
            return meta.parameters.category.label;
        }
        return "";
    };

    this.getStatusIntervals = function() {
        return meta.statusIntervals;
    };

    this.hasData = function() {
        return values.length !== 0;
    };

    this.getRefValuesForId = function(id) {
        if (refValues.hasOwnProperty(id)) {
            return refValues[id];
        }
        return [];
    };

    this.getRefValues = function() {
        return refValues;
    };

    this.toJSON = function() {
        return {
            style: style,
            apiUrl: apiUrl,
            tsId: tsId
        }
    };

    this.fetchData = function(timespan, complete) {
        var from = moment(timespan.from).subtract(timeBuffer);
        var till = moment(timespan.till).add(timeBuffer);
        timespan = Time.getRequestTimespan(from, till);
        this.promise = Rest.tsData(tsId, apiUrl, timespan, internalId);
        this.promise.done($.proxy(this.fetchedDataFinished, {context: this, complete: complete}));
        this.promise.fail($.proxy(this.fetchedDataError, {context: this, complete: complete}));
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

    this.fetchedDataError = function(data, bla) {
        synced = true;
        this.complete(this.context);
    };

    this.createTimeBuffer = function(data) {
        if (data.length >= 2) {
            timeBuffer = moment.duration(data[1][0] - data[0][0]);
        }
    };

    this.clone = function() {
        var clone = new TimeSeries(tsId, meta, apiUrl);
        clone.setStyle(this.getStyle().clone());
        return clone;
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

    this.setSelected = function(s) {
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
    this.chartType = chartType || "line";
    this.width = width || Settings.commonLineWidth;
    this.color = color || "#000000";
    this.lineType = lineType || "solid";

    this.zeroScaled = Settings.defaultZeroScale;
    this.groupedAxis = Settings.defaultGroupedAxis;

    createInterval = function (interval) {
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

    this.interval = createInterval(intervalString);

    this.getColor = function () {
        return this.color;
    };

    this.setColor = function (setcolor) {
        this.color = setcolor;
    };

    this.getChartType = function () {
        return this.chartType;
    };

    this.setChartType = function (ct) {
        this.chartType = ct;
    };

    this.isBarChart = function () {
        return this.chartType === "bar";
    };

    this.isLineChart = function () {
        return this.chartType === "line";
    };

    this.getIntervalByHours = function () {
        return this.interval;
    };

    this.getLineType = function () {
        return this.lineType;
    };

    this.getWidth = function () {
        return this.width;
    };

    this.isZeroScaled = function() {
        return this.zeroScaled;
    };

    this.setZeroScaled = function(bool) {
        this.zeroScaled = bool;
    };

    this.isGroupedAxis = function(){
        return this.groupedAxis;
    };

    this.setGroupedAxis = function(bool) {
        this.groupedAxis = bool;
    };

    this.toJSON = function(){
        return {
            width: this.width,
            chartType: this.chartType,
            color: this.color,
            lineType: this.lineType,
            zeroScaled: this.zeroScaled,
            groupedAxis: this.groupedAxis,
            interval: this.interval
        };
    };

    this.setIntervalByHours = function (inter) {
        this.interval = inter;
    };

    this.clone = function () {
        return $.extend(new TimeseriesStyle(), this);
    };
}
;
/* create a default timeseries style constructor */
TimeseriesStyle.createDefault = function (id) {
    var chartType = "line";
    var width = Settings.commonLineWidth;
    var color = Color.stringToColor(id);
    var interval = "byHour";
    var lineType = "solid";
    return new TimeseriesStyle(chartType, width, color, interval, lineType);
};

TimeseriesStyle.createStyleOfPersisted = function (style) {
    var tsStyle = $.extend(new TimeseriesStyle(),style);
    return tsStyle;
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
        'http://geo.irceline.be/sos/api/v1/': 'irceline2',
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
    // map options of leaflet
    mapOptions: {},
    // zoom level in the map, used for user location and station position
    zoom: 13,
    // how long a station popup to visualize the location should be visible on the map (in msec)
    stationPopupDuration: 10000,
    // date/time format which is used on several places
    dateformat: 'DD.MM.YY HH:mm [h]',
    shortDateformat: 'DD.MM.YY',
    // duration after which latest values shall be ignored when rendering marker in the map
    ignoreAfterDuration: moment.duration(1, 'y'),
    // default color for circled marker, when last value is older than 'ignoreAfterDuration' or the timeseries has no last value
    defaultMarkerColor: '#123456',
    // duration buffer for time series request
    timeseriesDataBuffer: moment.duration(2, 'h'),
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
                    from: moment().subtract(1, 'hours'),
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
                    from: moment().subtract(1, 'days').startOf('day'),
                    till: moment().subtract(1, 'days').endOf('day'),
                    mode: 'day'
                }
            },
            {
                name: 'todayYesterday',
                label: _('timeSelection.presets.todayYesterday'),
                interval: {
                    from: moment().subtract(1, 'days').startOf('day'),
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
                    from: moment().subtract(1, 'weeks').startOf('week'),
                    till: moment().subtract(1, 'weeks').endOf('week'),
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
                    from: moment().subtract(1, 'months').startOf('month'),
                    till: moment().subtract(1, 'months').endOf('month'),
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
                    from: moment().subtract(1, 'years').startOf('year'),
                    till: moment().subtract(1, 'years').endOf('year'),
                    mode: 'year'
                }
            }
        ]
    },
    notifyOptions: {
        position: 'bottom-left',
        fade_in_speed: 1000,
        fade_out_speed: 1000,
        time: 2000
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
    },
    removeOverlappingValues: function(values) {
        // remove values before start
        var start = TimeController.getCurrentStartAsMillis();
        var count = 0;
        while (values[count][0] < start) count++;
        values.splice(0, count);
        // remove values after the end
        var idx = values.length-1;
        var end = TimeController.getCurrentEndAsMillis();
        count = 0;
        while (values[idx][0] > end) {
            count++;
            idx--;
        }
        values.splice(++idx, count);
        return values;
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
        data.force_latest_values = true;
        data.status_intervals = true;
        data.rendering_hints = true;
        return Rest.request(apiUrl + "timeseries/"
                + this._createIdString(id), data, function (promise, result) {
            if ($.isArray(result)) {
                var timeseriesList = $.map(result, function (elem) {
                    return new TimeSeries(elem.id, elem, apiUrl);
                });
                promise.resolve(timeseriesList);
            } else {
                promise.resolve(new TimeSeries(result.id, result, apiUrl));
            }
        }, function (promise, error) {
            promise.reject();
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
        ChartController.visible = false;
        Pages.navigateToPage("#map-page");
        location.href = "#map";
        Pages.toggleLegend(false);
    },
    navigateToChart: function() {
        ChartController.showChart();
        TableController.closeTable();
        Pages.navigateToPage("#chart-page");
        location.href = "#chart";
        Pages.togglePhenomenon(false);
    },
    navigateToFavoritesView: function() {
        ChartController.visible = false;
        Pages.navigateToPage('#favorites-page');
        location.href = "#favorites";
        Pages.toggleLegend(false);
        Pages.togglePhenomenon(false);
    },
    toggleLegend: function(active) {
        if (active) {
            $('.legend').toggleClass('active');
            if ($('.legend').hasClass('active')) {
                $('[data-toggle="legend"]').text("X");
                $('[data-toggle="legend"]').show();
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
        if (hash.indexOf('?') !== -1) {
            hash = hash.substring(hash.indexOf('#'), hash.indexOf('?'));
        }

        Pages._routeToPage(hash);
    },
    _routeToPage: function(hash) {
        switch (hash) {
            case "#map":
                Pages.navigateToMap();
                break;
            case "#chart":
                Pages.navigateToChart();
                break;
            case "#favorites":
                Pages.navigateToFavoritesView();
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
            if (this.current[key] === undefined) {
                return this.defaultValues[key];
            }
            return this.current[key];
        },
        addTimeseries: function(ts) {
            this.current.timeseries[ts.getInternalId()] = ts.toJSON();
            this.save();
        },
        addTimeseriesById: function(id) {
            var ids = id.split("__");
            var apiUrl = null;
            $.each(Settings.restApiUrls, function(url, id) {
                if (id === ids[1]) {
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
        Settings.additionalParameters.locale = currentLanguage();

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
        };
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
            if ((services.length === features.length) &&
                    (services.length === offerings.length) &&
                    (services.length === procedures.length) &&
                    (services.length === phenomena.length)) {
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
        var array = this.getParameter(param);
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
                    EventManager.publish('triggerConcentrationMarker');
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
        EventManager.subscribe("timeseries:changeStyle", $.proxy(this.updateTS, this));
        EventManager.subscribe("timeseries:zeroScaled", $.proxy(this.updateTS, this));
        this.loadSavedTimeseries();
    },
    loadSavedTimeseries: function() {
        $.each(Status.getTimeseries(), $.proxy(function(internalId, elem) {
            var promise = Rest.timeseries(elem.tsId, elem.apiUrl);
            var that = this;
            promise.done(function(ts) {
                if (elem.style !== undefined) {
                    ts.setStyle(TimeseriesStyle.createStyleOfPersisted(elem.style));
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
    updateTS: function(evt, ts) {
        Status.addTimeseries(ts);
    },
    loadTsData: function(ts, timespan) {
        EventManager.publish("timeseries:data:load", [ts]);
        ts.fetchData(timespan, $.proxy(this.finishedGetData, this));
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
    getTimeseries: function(id) {
        return this.timeseries[id];
    },
    hasTimeseries: function() {
        return Object.keys(TimeSeriesController.getTimeseriesCollection()).length > 0;
    },
    deselectAllTs: function() {
        $.each(this.getTimeseriesCollection(), $.proxy(function(idx, elem){
            elem.setSelected(false);
        }, this));
    },
    getMaxTimeExtent: function() {
        var earliestStart;
        var latestEnd;
        $.each(this.timeseries, $.proxy(function(index,elem) {
            if (elem.getFirstValue()) {
                var start = moment(elem.getFirstValue().timestamp);
                if ( !earliestStart || start.isBefore(earliestStart)) {
                    earliestStart = start;
                }
            }
            if (elem.getLastValue()) {
                var end = moment(elem.getLastValue().timestamp);
                if ( !latestEnd || end.isAfter(latestEnd)) {
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
    momentFormat: 'YYYY-MM-DD HH:mm',
    internalFormat: 'yyyy-mm-dd hh:ii',
    init: function () {
        // get last save timespan
        this.currentTimespan = Status.get('timespan');
        this.updateTimeExtent();
        $(document).ready($.proxy(function () {
            $('[data-action=before]').click($.proxy(this.prevPeriode, this));
            $('[data-action=after]').click($.proxy(this.nextPeriode, this));
            $('[data-action=timeextent]').click($.proxy(this.openTimeSettings, this));
        }, this));
        this.setLabel();
        EventManager.subscribe("timeseries:data:load", $.proxy(this.disableButtons, this));
        EventManager.subscribe("timeseries:synced", $.proxy(this.enableButtons, this));
        EventManager.subscribe("time:start:change", $.proxy(this.startChanged, this));
        EventManager.subscribe("time:end:change", $.proxy(this.endChanged, this));
        EventManager.subscribe("timeseries:update:complete", $.proxy(this.updateTimeExtent, this));
    },
    openTimeSettings: function () {
        Modal.show("time-range-settings", this.timeRangeData);
        var from = moment(this.currentTimespan.from);
        var till = moment(this.currentTimespan.till);
        $('#startPicker').text(from.format(Settings.dateformat));
        $('#endPicker').text(till.format(Settings.dateformat));
        $('#startPicker').data('date', from.format(this.momentFormat));
        $('#endPicker').data('date', till.format(this.momentFormat));
        $('#alertTimeExtent').hide();
        var options = {
            pickerPosition: 'top-right',
            autoclose: true,
            format: this.internalFormat,
            weekStart: 1,
            language: currentLanguage()
        };
        $('#startPicker').datetimepicker(options).on('changeDate', this.evaluateDate);
        $('#endPicker').datetimepicker(options).on('changeDate', this.evaluateDate);
        $('#confirmTimeExtent').click($.proxy(function (event) {
            var from = moment($('#startPicker').data('date'));
            var till = moment($('#endPicker').data('date'));
            this.currentTimespan = {
                from: from,
                till: till,
                mode: "range"
            };
            this.updateTimeExtent();
            this.closeTimeSettings();
        }, this));
        $('.preset-btn').click($.proxy(function (event) {
            var btn = $(event.currentTarget);
            this.setPreset(btn.data('preset-value'));
            this.closeTimeSettings();
        }, this));
    },
    closeTimeSettings: function () {
        $('#startPicker').datetimepicker('remove');
        $('#endPicker').datetimepicker('remove');
    },
    startChanged: function (event, start) {
        var diff = this.getCurrentDiff();
        this.currentTimespan.from = moment(start).startOf('day');
        this.currentTimespan.till = moment(start).add(diff).add(1, 's').startOf('day').subtract(1, 'ms');
        this.updateTimeExtent();
    },
    endChanged: function (event, end) {
        var diff = this.getCurrentDiff();
        this.currentTimespan.from = moment(end).subtract(diff).endOf('day').add(1, 'ms');
        this.currentTimespan.till = moment(end).endOf('day');
        this.updateTimeExtent();
    },
    getCurrentDiff: function () {
        var from = moment(this.currentTimespan.from);
        var till = moment(this.currentTimespan.till);
        return till.diff(from);
    },
    getCurrentStartAsMillis: function () {
        return moment(this.currentTimespan.from).unix() * 1000;
    },
    getCurrentEndAsMillis: function () {
        return moment(this.currentTimespan.till).unix() * 1000;
    },
    updateTimeExtent: function () {
        var maxExtent = TimeSeriesController.getMaxTimeExtent();

        var insideDataInterval = true;
        if (maxExtent.from && maxExtent.till) {
            var earliestStart = moment(maxExtent.from);
            var latestEnd = moment(maxExtent.till);
            var startBetweenMax = moment(this.currentTimespan.from).isBetween(earliestStart, latestEnd);
            var endBetweenMax = moment(this.currentTimespan.till).isBetween(earliestStart, latestEnd);
            insideDataInterval = (startBetweenMax || endBetweenMax);
        }

        if (!insideDataInterval) {
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
    disableButtons: function () {
        $('[data-action="before"]').addClass('disabled');
        $('[data-action="after"]').addClass('disabled');
        $('[data-action="timeextent"]').addClass('disabled');
    },
    enableButtons: function () {
        $('[data-action="before"]').removeClass('disabled');
        $('[data-action="after"]').removeClass('disabled');
        $('[data-action="timeextent"]').removeClass('disabled');
    },
    setLabel: function () {
        var label = moment(this.currentTimespan.from).format(Settings.shortDateformat) + " - " + moment(this.currentTimespan.till).format(Settings.shortDateformat);
        $('[data-action=timeextent]').text(label);
    },
    prevPeriode: function () {
        this.getNearbyPeriode('subtract');
        this.updateTimeExtent();
    },
    nextPeriode: function () {
        this.getNearbyPeriode('add');
        this.updateTimeExtent();
    },
    setPreset: function (name) {
        var interval;
        $.each(this.timeRangeData.presets, function (idx, elem) {
            if (elem.name === name) {
                interval = this.interval;
                return false;
            }
        });
        this.currentTimespan = Time.isoTimespan(interval);
        this.updateTimeExtent();
        Modal.hide();
    },
    setFlexibleTimeExtent: function (from, till) {
        this.currentTimespan = {
            'from': from,
            'till': till,
            'mode': 'range'
        };
        this.updateTimeExtent();
    },
    evaluateDate: function (ev) {
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
        $(id).datetimepicker('hide');
    },
    getNearbyPeriode: function (method) {
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
        EventManager.subscribe("triggerConcentrationMarker", $.proxy(this.triggerPhenomenaEntry, this));
    },
    createMap: function() {
        if ($("#map").length > 0) {
            this.map = L.map('map',Settings.mapOptions);
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
                        marker = new L.circleMarker([geom[1], geom[0]], {
                            id: elem.getStationId(),
                            fillColor: Settings.defaultMarkerColor,
                            color: "#000",
                            opacity: 1,
                            weight: 2,
                            fillOpacity: 0.2
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
                if (interval.upper === null) {
                    interval.upper = Number.MAX_VALUE;
                }
                if (interval.lower === null) {
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
                if (Map.selectedPhenomenon === null || Map.selectedPhenomenon === phenomID) {
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
            $('.tsItem :checkbox').on('click', function(evt) {
                if(!$(evt.target).is(':checked')) {
                    $('.selectAllOption').find(':checkbox').prop('checked',false);
                }
            });
            $.each(phenomena, function(id, elem) {
                $.each(elem.timeseries, function(id, elem) {
                    if (Map.timeseriesCache[elem.internalId] === undefined) {
                        Rest.timeseries(elem.id, url).done(function(timeseries) {
                            Map.updateTsEntry(timeseries);
                        }).fail(function(){
                            Map.removeTsEntry(elem.id);
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
    removeTsEntry: function(id) {
        $('[data-id=' + id + ']').remove();
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
                        this.createStationMarker(result, Status.get('clusterStations'));
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
    triggerPhenomenaEntry: function () {
        $('.phenomena-entry [data-id=' + this.selectedPhenomenon + ']').click();
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
                if (black.serviceID === elem.id && black.apiUrl === apiUrl) {
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
                    "selected": currProv.serviceID === elem.id && currProv.apiUrl === apiUrl,
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
            if (marker.options.id === ts.getStationId()) {
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
        popup.setLatLng(pos);
        Map.map.openPopup(popup);
        popup.on('close', function () {
            if (station) {
                station.unbindPopup();
            }
        });
        $('.backToChart').on('click', function(){
            Pages.navigateToChart();
        });
        setTimeout($.proxy(function(){
            Map.map.closePopup(popup);
        }, this), Settings.stationPopupDuration);
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
        this.loading(tab, index, true);
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
                // open collapse
                $('#' + tab + ' #' + entry.collapse).collapse('show');
                // onclick
                $('#' + tab + ' #' + entry.collapse + ' .panel-body div').on('click', $.proxy(function(e) {
                    var label = $.trim(e.target.innerHTML);
                    $('#' + tab + ' [href=#' + entry.collapse + ']').text(entry.heading + ' - ' + label);
                    $('#' + tab + ' #' + entry.collapse).collapse('hide');
                    data = this.tidyData(data, tab, index);
                    data[entry.type] = $(e.target).data('id');
                    this.startRequest(tab, index + 1, data);
                }, this));
                this.loading(tab, index, false);
            }, this));
        } else {
            // load ts
            Rest.timeseries(null, apiUrl, data).done(function(result) {
                if (result.length === 1) {
                    TimeSeriesController.addTS(result[0]);
                    Modal.hide();
                    Pages.navigateToChart();
                } else {
                    Inform.warn(_('listSelection.warning.moreThanOneTimeseries'));
                }
            });
        }
    },
    loading: function(tab, idx, loading) {
        var entry = this.entries[tab][idx];
        if (entry) {
            var elem = $('#' + tab + ' .panel-heading').has(' [href=#' + entry.collapse + ']').find('.loading');
            if (loading) {
                elem.removeClass('loaded');
            } else {
                elem.addClass('loaded');
            }
        }
    },
    tidyData: function(data, tab, index){
        var tabEntries = this.entries[tab];
        for (i = 3; i > index; i--) {
            $('#' + tab + ' [href=#' + tabEntries[i].collapse + ']').text(tabEntries[i].heading);
            $('#' + tab + ' #' + tabEntries[i].collapse + ' .in').collapse('hide');
            $('#' + tab + ' #' + tabEntries[i].collapse + ' .panel-body').empty();
            delete data[tabEntries[i].type];
        }
        return data;
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
            timezone: "browser",
            monthNames: _("chart.monthNames")
//            timeformat: "%Y/%m/%d",
                    //use these the following two lines to have small ticks at the bottom ob the diagram
//            tickLength: 5,
//            tickColor: "#000"
        },
        yaxis: {
            show: true,
            additionalWidth: 17,
            panRange: false,
            min: null
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
        this.options = $.extend(true, this.defaultOptions, Settings.chartOptions);
        EventManager.subscribe("timeseries:data:load", $.proxy(this.loadDataForChart, this));
        EventManager.subscribe("timeseries:data:loadfinished", $.proxy(this.loadDataFinished, this));
        EventManager.subscribe("timeseries:synced", $.proxy(this.plotChart, this));
        EventManager.subscribe("timeseries:add:referenceValue", $.proxy(this.showReferenceValue, this));
        EventManager.subscribe("timeseries:remove:referenceValue", $.proxy(this.removeReferenceValue, this));
        EventManager.subscribe("timeseries:remove", $.proxy(this.removeTS, this));
        EventManager.subscribe("timeseries:removeAll", $.proxy(this.clearChart, this));
        EventManager.subscribe("timeseries:selectionChanged", $.proxy(this.selectionChanged, this));
        EventManager.subscribe("timeseries:hide", $.proxy(this.hideData, this));
        EventManager.subscribe("timeseries:show", $.proxy(this.showData, this));
        EventManager.subscribe("table:open", $.proxy(this.hideChart, this));
        EventManager.subscribe("table:close", $.proxy(this.showChart, this));
        EventManager.subscribe("timeseries:changeStyle", $.proxy(this.changeStyle, this));
        EventManager.subscribe("timeseries:zeroScaled", $.proxy(this.zeroScaled, this));

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
        var ts = TimeSeriesController.getTimeseriesCollection()[id];
        $.each(ts.getRefValues(), $.proxy(function(idx, refValue) {
            if(refValue.isSelected()) {
                this.removeData(idx);
            }
        }, this));
        this.removeData(id);
        this.plotChart();
    },
    showData: function(event, id) {
        var ts = TimeSeriesController.getTimeseriesCollection()[id];
        $.each(ts.getRefValues(), $.proxy(function(idx, refValue) {
            if(refValue.isSelected()) {
                this.showReferenceValue(null, {
                    "tsId": ts.getInternalId(),
                    "refId": idx
                });
            }
        }, this));
        this.loadDataFinished(null, ts);
        this.plotChart();
        this.selectionChanged();
    },
    selectTs: function(id, selected) {
        if (this.plot) {
            $.each(this.plot.getData(), function(idx, ts) {
                if (ts.id === id) {
                    ts.selected = selected;
                    if(selected) {
                        ts.lines.lineWidth = ChartController.selectedLineWidth;
                        ts.bars.lineWidth = ChartController.selectedLineWidth;
                        $.each($('.axisTarget'), function(idx, axis) {
                            if (ts.yaxis.n === $(axis).data('axis.n')) {
                                $(axis).addClass('selected');
                            }
                        });
                    } else {
                        ts.lines.lineWidth = ChartController.commonLineWidth;
                        ts.bars.lineWidth = ChartController.commonLineWidth;
                    }
                }
            });
            $.each(this.data, function(index, elem) {
                if (elem.id === id) {
                    elem.selected = selected;
                }
            });
        }
    },
    selectionChanged: function() {
        $('.axisTarget').removeClass('selected');
        $.each(TimeSeriesController.getTimeseriesCollection(), $.proxy(function(idx, ts) {
            this.selectTs(ts.getInternalId(), ts.isSelected());
        }, this));
        this.plot.draw();
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
            this.plot.draw();
        }
    },
    loadDataForChart: function(event, ts) {
        if (this.plot) this.plot.unbindPanZoomEvents();
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
        // get regarding yaxis
        var yaxis;
        $.each(this.data, function(idx, elem) {
            if(elem.id === ts.getInternalId()){
                yaxis = elem.yaxis;
            }
        });
        // update data of timeseries
        $.each(this.data, function(idx, elem) {
            if (elem.yaxis === yaxis) {
                elem.zeroScaled = ts.getStyle().isZeroScaled();
                TimeSeriesController.getTimeseries(elem.id).getStyle().setZeroScaled(ts.getStyle().isZeroScaled());
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
        if (ts.hasData() && !ts.isHidden()) {
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
        data.zeroScaled = style.isZeroScaled();
        data.groupedAxis = style.isGroupedAxis();
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
                var endInterval = moment(entry[0]).add(style.getIntervalByHours(), 'hours');
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
                            .click($.proxy(function (event) {
                                var target = $(event.currentTarget);
                                var selected = false;
                                $.each($('.axisTarget'), function (index, elem) {
                                    elem = $(elem);
                                    if (target.data('axis.n') === elem.data('axis.n')) {
                                        selected = elem.hasClass("selected");
                                        return false; // break loop
                                    }
                                });
                                $.each(this.plot.getData(), function (index, elem) {
                                    if (target.data('axis.n') === elem.yaxis.n) {
                                        TimeSeriesController.getTimeseries(elem.id).setSelected(!selected);
                                    } else {
                                        TimeSeriesController.getTimeseries(elem.id).setSelected(false);
                                    }
                                });
                                EventManager.publish("timeseries:selectionChanged");
                                if (!selected) {
                                    target.addClass("selected");
                                }
                            }, this));
                    var yaxisLabel = $("<div class='axisLabel yaxisLabel' style=left:" + box.left + "px;></div>").text(axis.options.uom).appendTo('#placeholder');
                    $.each(axis.options.tsColors, function (idx, color) {
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
        $.each(axesList, $.proxy(function(idx, elem) {
            axes.splice(elem.id - 1, 0, {
                uom: elem.uom,
                tsColors: elem.tsColors,
                min: elem.zeroScaled ? 0 : this.options.yaxis.min
            });
        },this));
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
            if (id === elem.id) {
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
        EventManager.subscribe("timeseries:selectionChanged", $.proxy(this.selectionChanged, this));
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
                TimeSeriesController.deselectAllTs();
                ts.setSelected(true);
            } else {
                ts.setSelected(false);
            }
            EventManager.publish("timeseries:selectionChanged");
        }, this));
        $('[data-id=' + ts.getInternalId() + '] .hideDiagram').click($.proxy(function(event) {
            target = $(event.currentTarget);
            if (target.hasClass('glyphicon-eye-close')) {
                ts.setHidden(true);
                EventManager.publish("timeseries:hide", ts.getInternalId());
            } else {
                ts.setHidden(false);
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
            var refId = target.attr('refid');
            target.toggleClass('selected');
            var ev;
            if (target.hasClass('selected')) {
                ev = "timeseries:add:referenceValue";
                ts.getRefValuesForId(refId).setSelected(true);
            } else {
                ev = "timeseries:remove:referenceValue";
                ts.getRefValuesForId(refId).setSelected(false);
            }
            if (!ts.isHidden()) {
                EventManager.publish(ev, {
                    "tsId": ts.getInternalId(),
                    "refId": refId
                });
            }
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
    selectionChanged: function() {
        $.each(TimeSeriesController.getTimeseriesCollection(), $.proxy(function(idx, ts) {
            this.selectTS(ts.getInternalId(), ts.isSelected());
        }, this));
    },
    selectTS: function(id, selected) {
        var target = $('.legend-entry').find('[data-id=' + id + ']');
        if (selected) {
            target.addClass('selected');
        } else {
            target.removeClass('selected');
        }
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
        if (noData && ChartController.visible) {
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
            zeroScaled: style.isZeroScaled(),
            groupedAxis: style.isGroupedAxis()
        };
        if (style.isBarChart()) {
            data.bar = true;
            data.interval = this.intervalList;
        }
        ;
        Modal.show("style-change", data);
        $('.colorButton').on('click', function(e) {
            var color = $(e.target).data('color');
            if (style.getColor() !== color) {
                style.setColor(color);
                EventManager.publish("timeseries:changeStyle", ts);
            }
        });
        $('.intervalButton').on('click', function(e) {
            var interval = $(e.target).data('interval');
            if (style.getIntervalByHours() !== interval) {
                style.setIntervalByHours(interval);
                EventManager.publish("timeseries:changeStyle", ts);
            };
        });
        $('.zeroScaled').on('click', function(e) {
            var zeroScaled = Button.switchToggleButton(e.target);
            ts.getStyle().setZeroScaled(zeroScaled);
            EventManager.publish("timeseries:zeroScaled", ts);
        });
        $('.groupedAxis').on('click', function(e) {
            var groupedAxis = Button.switchToggleButton(e.target);
            ts.getStyle().setGroupedAxis(groupedAxis);
            EventManager.publish("timeseries:changeStyle", ts);
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
    init: function () {
        this.tableButton = $('[data-action="dataTable"]');
        this.legendButton = $('[data-toggle="legend"]');
        this.tableView = $('#tableView');
        this.tableButton.show();
        this.tableButton.on('click', $.proxy(function (event) {
            if (this.isVisible === false) {
                this.openTable();
            } else {
                this.closeTable();
            }
        }, this));
        EventManager.subscribe("table:open", $.proxy(this.createTable, this));
        EventManager.subscribe("timeseries:synced", $.proxy(this.createTable, this));
        EventManager.subscribe("timeseries:remove", $.proxy(this.createTable, this));
        EventManager.subscribe("timeseries:changeStyle", $.proxy(this.updateTable, this));
    },
    openTable: function () {
        if (!this.isVisible) {
            this.isVisible = true;
            this.tableView.show();
            Button.setNewIcon(this.tableButton, 'glyphicon-stats');
            this.legendButton.hide();
            EventManager.publish("table:open", "table");
        }
    },
    closeTable: function () {
        if (this.isVisible) {
            this.isVisible = false;
            this.tableView.hide();
            this.legendButton.show();
            Button.removeNewIcon(this.tableButton, 'glyphicon-stats');
            EventManager.publish("table:close", "table");
        }
    },
    createTable: function () {
        if (this.isVisible) {
            this.tableView.empty();
            if (TimeSeriesController.hasTimeseries()) {
                this.sortingFunc = null;
                this.pageStart = 0;
                this.createHtmlTableHeader();
                this.tableView.append(this.htmltable);
                this.updateTable();
                this.createHeaderClickHandler();
            } else {
                this.tableView.append(Template.createHtml('chart-empty'));
            }
        }
    },
    updateTable: function () {
        if (this.isVisible) {
            var array = this.createValueArray();
            if (!this.sortingFunc) {
                this.sortingFunc = this.upsort(0);
                var firstTh = $('.table th:first');
                firstTh.addClass('sortedUp');
                this.changeSortLabel(firstTh, true);
            }
            array.sort(this.sortingFunc);
            if (array.length > 0) {
                var colorArray = this.createColorArray();
                this.createHtmlTable(array, colorArray);
            }
            this.createPaging(array.length, this.pageSize, this.pageStart);
        }
    },
    createHeaderClickHandler: function () {
        $('.table th').on('click', $.proxy(function (event) {
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
    changeSortLabel: function (target, up) {
        $('#sorting').remove();
        var span = $('<span>').attr('id', 'sorting');
        if (up) {
            span.html('&nbsp;&#x25BE;');
        } else {
            span.html('&nbsp;&#x25B4;');
        }
        target.append(span);
    },
    createPagingClickHandler: function (length) {
        $('.pagination li a').on('click', $.proxy(function (event) {
            var start = $(event.target).data('start');
            if (typeof (start) !== "undefined" && start >= 0 && start <= length) {
                this.pageStart = start;
                this.updateTable();
            }
        }, this));
    },
    createPaging: function (arraylength, pagesize, pagestart) {
        if (arraylength > pagesize) {
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
            this.createPagingClickHandler(arraylength);
        }
    },
    pageButton: function (label, start) {
        var elem = $('<li></li>'),
                a = $('<a>' + label + '</a>');
        a.data('start', start);
        elem.append(a);
        return elem;
    },
    createColorArray: function () {
        var array = [];
        $.each(TimeSeriesController.getTimeseriesCollection(), function (index, ts) {
            array.push(ts.getStyle().getColor());
        });
        return array;
    },
    createValueArray: function () {
        var array = [];
        var map = {};
        var tscount = Object.keys(TimeSeriesController.getTimeseriesCollection()).length;
        var count = 0;
        $.each(TimeSeriesController.getTimeseriesCollection(), $.proxy(function (index, ts) {
            if (ts.getValues().length > 0) {
                var values = Time.removeOverlappingValues(ts.getValues());
                $.each(values, $.proxy(function (valueIdx, pair) {
                    var time = pair[0];
                    var value = pair[1];
                    if (!map[time]) {
                        map[time] = new Array(tscount);
                    }
                    map[time][count] = value;
                }, this));
            }
            count++;
        }, this));
        var i = 0;
        Object.keys(map).map(function (value) {
            var temp = [];
            temp[0] = parseInt(value);
            $.each(map[value], $.proxy(function (idx, value) {
                temp[idx + 1] = value;
            }, this));
            array[i++] = temp;
        });
        return array;
    },
    upsort: function (id) {
        return function (a, b) {
            if (isNaN(a[id]) && isNaN(b[id]))
                return 0;
            if (isNaN(a[id]))
                return -1;
            if (isNaN(b[id]))
                return 1;
            return a[id] - b[id];
        };
    },
    downsort: function (id) {
        return function (a, b) {
            if (isNaN(a[id]) && isNaN(b[id]))
                return 0;
            if (isNaN(a[id]))
                return 1;
            if (isNaN(b[id]))
                return -1;
            return b[id] - a[id];
        };
    },
    createHtmlTableHeader: function () {
        this.htmltable = $('<table></table>').addClass('table').addClass('table-condensed');
        var header = $('<thead></thead>');
        var headerrow = $('<tr></tr>');
        headerrow.append($('<th></th>').data('index', 0).text(_('table.time')));
        var index = 1;
        $.each(TimeSeriesController.getTimeseriesCollection(), function (id, elem) {
            var title = $('<div></div>').text(elem.getStationLabel());
            var phenomenonLabel = $('<span></span>').text(elem.getPhenomenonLabel() + " (" + elem.getUom() + ")");
            var categoryLabel = $('<div></div>').text(elem.getCategoryLabel());
            headerrow.append($('<th></th>').data('index', index++).append(title).append(phenomenonLabel).append(categoryLabel));
        });
        this.htmltable.append(header.append(headerrow));
    },
    createHtmlTable: function (array, colorArray) {
        this.htmltable.find('tbody tr').remove();
        var cArray = colorArray;
        $.each(array, $.proxy(function (tsIndex, elem) {
            if (tsIndex < this.pageStart || tsIndex >= (this.pageStart + this.pageSize)) {
                return;
            }
            var row = $('<tr></tr>');
            $.each(elem, function (index, value) {
                if (index === 0) {
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
        EventManager.subscribe('timeseries:add', $.proxy(this.loadTimeseries, this));
    },
    loadTimeseries: function(event, ts) {
        tsId = ts.getInternalId();
        var button = $('<div class="additionalLegendEntry"><span class="glyphicon glyphicon-download"></span><span> ' + _('export.label') + '</span></div>');
        $('.legendItem[data-id="' + tsId + '"]').find('.collapseLegendEntry').append(button);
        button.on('click', $.proxy(function() {
            window.open(this.createCsvDownloadLink(ts));
        }, this));
    },
    createCsvDownloadLink: function(ts) {
        var from = TimeController.currentTimespan.from;
        var till = TimeController.currentTimespan.till;
        var timespan = moment(from).format() + "/" + moment(till).format();

        var kvp = "?generalize=" + Settings.generalizeData;
        kvp = kvp + "&timespan=" + encodeURIComponent(timespan);
        kvp = kvp + "&locale=" + currentLanguage();
        kvp = kvp + "&zip=true";
        kvp = kvp + "&bom=true";

        var tsId = ts.getTsId();
        var apiUrl = ts.getApiUrl();
        return apiUrl + "/timeseries/" + tsId + "/getData.zip" + kvp;
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
        }, this), 500);
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
            previous: false,
            initStep: function() {
                Pages.navigateToChart();
            }
        }, {
            anchor: '.swc-page-current [data-target="#map"]',
            title: _('guide.step2.header'),
            text: _('guide.step2.text'),
            previous: false,
            arrow: true,
            initStep: function() {
                Pages.navigateToChart();
            }
        }, {
            anchor: '.navbar-header.map',
            title: _('guide.step3.header'),
            text: _('guide.step3.text'),
            previous: false,
            initStep: function() {
                Pages.navigateToMap();
            }
        }, {
            anchor: '[data-action="provider"]',
            title: _('guide.step4.header'),
            text: _('guide.step4.text'),
            previous: false,
            arrow: true,
            initStep: function() {
                Pages.navigateToMap();
            }
        }, {
            anchor: '[data-action="locate"]',
            title: _('guide.step5.header'),
            text: _('guide.step5.text'),
            previous: false,
            arrow: true,
            initStep: function() {
                Pages.navigateToMap();
            }
        }, {
            anchor: '[data-action="listSelection"]',
            title: _('guide.step6.header'),
            text: _('guide.step6.text'),
            previous: false,
            arrow: true,
            initStep: function() {
                Pages.navigateToMap();
            }
        }, {
            anchor: '.navbar-header.map',
            title: _('guide.step7.header'),
            text: _('guide.step7.text'),
            previous: false,
            next: false,
            initStep: function(context) {
                EventManager.subscribe("map:stationLoaded", $.proxy(stationLoaded, context));
            }
        }, {
            anchor: '.tsItem',
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
            previous: false,
            initStep: function() {
                Pages.toggleLegend(false);
            }
        }, {
            anchor: '.btn-group.timeSelection',
            title: _('guide.step11.header'),
            text: _('guide.step11.text'),
            previous: false,
            arrow: true,
            initStep: function() {
            }
        }, {
            anchor: '[data-action="dataTable"]',
            title: _('guide.step12.header'),
            text: _('guide.step12.text'),
            previous: false,
            arrow: true,
            initStep: function() {
            }
        }, {
            anchor: '.swc-page-current [data-target="#favorites"]',
            title: _('guide.step13.header'),
            text: _('guide.step13.text'),
            previous: false,
            arrow: true,
            initStep: function() {
            }
        }, {
            anchor: '.navbar-header.chart',
            title: _('guide.step14.header'),
            text: _('guide.step14.text'),
            previous: false,
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
            if (confirm(_('guide.start.request'))) {
                this.closeLast();
                this.show(1);
                Status.reset();
            }
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
                    previous: idx - 1 >= 1 && step.previous !== false ? idx - 1 : null,
                    step: idx,
                    next: idx + 1 <= steps.length && step.next !== false ? idx + 1 : null,
                    steps: steps.length
                }),
                placement: 'auto'
            });
            $(step.anchor).popover('show');
            $('.paging.guidedtour li a').on('click', $.proxy(function(target) {
                var idx = parseInt($(target.currentTarget).data('step'));
                if (!isNaN(idx)) {
                    this.closeLast();
                    this.show(idx);
                }
            }, this));
            $('.guidedtour .close').on('click', $.proxy(function() {
                EventManager.unsubscribe("timeseries:data:loadfinished", timeseriesAdd);
                EventManager.unsubscribe("map:stationLoaded", stationLoaded);
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
 * limitations under the License.sta
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
//            /*
//             * This is a bit hacky, as the page navigation
//             * should be refactored to have a cleaner way
//             * in extending it
//             */
//            var backLink = Pages.current();
            this.showFavoritesView();
//            var favoritePageButton = $('#favoriteButton');
//            favoritePageButton.on('click', $.proxy(function(event) {
//                Pages.navigateToPage("#" + backLink);
//
//            }));
        }, this));
//        this.createFavoritesListView();
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
        Pages.navigateToFavoritesView();
    },
    addFavoriteClickEvent: function(id) {
        // delete
        this.addClickEvents(id, 'single-id', 'delete', $.proxy(function(evt) {
            this.removeFavorite(id);
            this.saveFavorites();
        }, this));
        // edit
        this.addClickEvents(id, 'single-id', 'edit', $.proxy(function(evt) {
            this.openEditWindow(this.favorites[id]);
        }, this));
        // add to diagram
        this.addClickEvents(id, 'single-id', 'addToDiagram', $.proxy(function(evt) {
            TimeSeriesController.removeAllTS();
            var ts = this.favorites[id];
            Pages.navigateToChart();
            TimeSeriesController.addTS(ts.timeseries.clone());
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
            TimeSeriesController.removeAllTS();
            var group = this.favoriteGroups[id];
            Pages.navigateToChart();
            $.each(group.collection, function(idx, elem) {
                TimeSeriesController.addTS(elem);
            });
        }, this));
    },
    addClickEvents: function(id, typeId, action, cb) {
        $('[data-' + typeId + '=' + id + '] .' + action).on('click', cb);
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
            var internalID = $(item).data('internalid');
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
                    star.off('click', onClick);
                    event.stopPropagation();
                    var promise = Rest.timeseries($(item).data('id'), Status.get('provider').apiUrl);
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
        label = this.addFavoriteToList(ts.clone(), label);
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
        label = label || _('favorite.label') + ' ' + this.groupIdx;
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
                    this.drawLoadingSpinner(ts.tsId, elem.label);
                    var promise = Rest.timeseries(ts.tsId, ts.apiUrl);
                    promise.done($.proxy(function (loadedTs) {
                        loadedTs.setStyle(TimeseriesStyle.createStyleOfPersisted(ts.style));
                        this.addFavorite(loadedTs, elem.label);
                    }, this));
                    promise.always($.proxy(function () {
                        this.removeLoadingSpinner(ts.tsId);
                    }, this));
                } else {
                    NotifyController.notify(_('favorite.single.notSupported').replace('{0}', elem.label));
                }
            }, this));
            $.each(values.groups, $.proxy(function(idx, group) {
                var label = group.label;
                this.drawLoadingSpinner("grp" + idx, label);
                var deferreds = $.map(group.collection, $.proxy(function(ts) {
                    if (this.isSupported(ts)) {
                        var promise = Rest.timeseries(ts.tsId, ts.apiUrl);
                        promise.done(function (loadedTs) {
                            loadedTs.setStyle(TimeseriesStyle.createStyleOfPersisted(ts.style));
                        });
                        return promise;
                    } else {
                        NotifyController.notify(_('favorite.group.notSupported').replace('{0}', label));
                    }
                }, this));
                $.when.apply(null, deferreds).done($.proxy(function() {
                    this.removeLoadingSpinner("grp" + idx);
                    this.addFavoriteGroup(arguments, label);
                }, this));
            }, this));
        }
    },
    drawLoadingSpinner: function(id, label) {
        var elem = Template.createHtml("data-loading-entry", {
                id: id,
                label: label
            });
        $('#favorites-list').append(elem);
    },
    removeLoadingSpinner: function(id) {
        $('#favorites-list').find('[data-id=' + id + ']').remove();
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
                    timeseries: elem.timeseries.toJSON()
                };
            }),
            groups: $.map(this.favoriteGroups, function(group, idx) {
                return {
                    label: group.label,
                    collection: $.map(group.collection, function(ts, idx) {
                        return ts.toJSON();
                    })
                };
            })
        };
        return favorites;
    },
    activateImportExportHandlers: function() {
        var fileImport = $('#favorites-file-import');
        var fileExport = $('#favorites-file-export');
        if(this.isFileAPISupported()){
            fileImport.change($.proxy(this.importFavorites, this));
        } else {
            fileImport.parent().on('click', ($.proxy(this.importByText, this)));
            fileImport.remove();
        }
        fileExport.click($.proxy(this.exportFavorites, this));
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
                a.href = 'data:application/json,' + encodeURIComponent(content);
                a.target = '_blank';
                a.download = filename;
                document.body.appendChild(a);
                a.click();
            }
        } else {
            this.exportByText();
        }
    },
    importFavorites: function(event) {
        if (this.isFileAPISupported()) {
            var override = true;
            if (this.hasFavorites()) {
                override = confirm(_('favorite.import.override'));
            }
            if (override) {
                this.favorites = {};
                this.favoriteGroups = {};
                this.clearFavoritesView();
                var files = event.target.files;
                if (files && files.length > 0) {
                    var reader = new FileReader();
                    reader.readAsText(files[0]);
                    reader.onerror = function() {
                        Inform.error(_('favorite.import.wrongFile'));
                    };
                    reader.onload = $.proxy(function(e) {
                        this.importJson(e.target.result);
                    }, this);
                }
            }
        } else {
            this.importByText();
        }
    },
    importJson: function(json) {
        try {
            var content = JSON.parse(json);
            this.unserializeFavorites(content);
            this.saveFavorites();
        } catch (exception) {
            Inform.error(_('favorite.import.noValidJson'));
        }
    },
    isFileAPISupported: function() {
        var isIOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) !== null;
        return (window.File && window.FileReader && window.Blob) && !isIOS;
    },
    exportByText: function(){
        var data = {
            header: _('favorite.export.header'),
            text: _('favorite.export.text'),
            content: JSON.stringify(this.serializeFavorites(), undefined, 1)
        };
        Modal.show("import-export", data);
        $('#confirmImportExport').off('click');
    },
    importByText: function(){
        var override = true;
        if (this.hasFavorites()) {
            override = confirm(_('favorite.import.override'));
        }
        if (override) {
            this.favorites = {};
            this.favoriteGroups = {};
            this.clearFavoritesView();
            var data = {
                header: _('favorite.import.header'),
                text: _('favorite.import.text'),
                content: ""
            };
            Modal.show("import-export", data);
            $('#confirmImportExport').on('click', $.proxy(function () {
                $('#confirmImportExport').off('click');
                var json = $('#importContent').val();
                this.importJson(json);
            }, this));
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
var NotifyController = {
    init: function() {
        $.extend($.gritter.options, Settings.notifyOptions);
    },
    notify: function(text) {
        $.gritter.add({
            text: text
        });
    }
};
