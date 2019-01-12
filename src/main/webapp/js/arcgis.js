$(document).ready(function () {
    require([
        "esri/Map",
        "esri/views/MapView",
        "esri/Graphic",
        "js/lib/chart.bundle.min.js"
    ], function (
        Map, MapView, Graphic, Chart
    ) {
        /*** Define map and view ***/
        var map = new Map({
            basemap: "gray"
        });

        var view = new MapView({
            container: "map",
            map: map,
            zoom: 13,
            center: [36.155, -0.448],
            constraints: {
                minZoom: 12,
                maxZoom: 16,
                snapToZoom: true
            },
            popup: {
                dockEnabled: true,
                dockOptions: {
                    // Disables the dock button from the popup.
                    buttonEnabled: false,
                    // Ignore the default sizes that trigger responsive docking.
                    breakpoint: false,
                    position: "top-left"
                }
            }
        });

        /*** UI changes ***/
        view.ui.move("zoom", "top-right");

        /*** Create points for existing records ***/
            // Point styling.
        var markerSymbol = {
                type: "simple-marker",
                color: "rgba(243, 166, 131, 0.9)",
                size: 7,
                outline: {
                    color: [99, 110, 114],
                    width: 1
                }
            };

        // Get sightings from database.
        $.getJSON("records", function (records) {
            // Draw a point for each record in database.
            $.each(records, function (i, record) {
                var point = {
                    type: "point",
                    longitude: record.longitude,
                    latitude: record.latitude
                };

                var pointGraphic = new Graphic({
                    geometry: point,
                    symbol: markerSymbol,
                    attributes: record,

                    popupTemplate: {
                        title: 'Giraffe Sighting ' +
                            '<span class="float-right">' + record.date + ' at ' + timeFormat(record.time) + '</span>',
                        content: generateContent

                    }
                });

                view.graphics.add(pointGraphic);

                /** Generates popup template content.
                 * @returns {HTMLObjectElement} content - HTML popup template content
                 */
                function generateContent() {
                    // Content container.
                    var content = document.createElement('div');
                    // Horizontal breaks.
                    var hr = document.createElement('HR');
                    var hr2 = document.createElement('HR');

                    // Generate contents.
                    var attributes = generateAttributes(record);
                    var chart = generateChart(record);

                    content.append(attributes);
                    content.append(hr);
                    content.append(chart);

                    return content;
                }
            });

            /** Generates HTML containing the records' attributes.
             * @param {object} record - the sighting record.
             * @returns {HTMLObjectElement} row - HTML containing record attributes.
             */
            function generateAttributes(record) {
                // Create skeleton of HTML Layout.
                var row = document.createElement('div');
                var col1 = document.createElement('div');
                var col2 = document.createElement('div');
                row.className = "row";
                col1.className = "col-6";
                col2.className = "col-6";

                // Fill columns with attributes.
                col1.innerHTML = "<span><b>Activity: </b>" + capitalizeFirstLetter(record.activity) +
                    "</span><br><span><b>Habitat: </b>" + capitalizeFirstLetter(record.habitat) +
                    "</span><br><span><b>Weather: </b>" + capitalizeFirstLetter(record.weather) +
                    "</span>";

                col2.innerHTML = "<span><b>Longitude: </b>" + record.longitude +
                    "</span><br><span><b>Latitude: </b>" + record.latitude +
                    "</span>";

                row.appendChild(col1);
                row.appendChild(col2);

                return row
            }

            /** Generates a stacked horizontal bar chart of the giraffe group composition using Chart.js.
             * @param {object} record - the sighting record.
             * @returns {HTMLObjectElement} row - HTML containing chart title and canvas.
             */
            function generateChart(record) {
                // Create row container for chart title and canvas.
                var row = document.createElement('div');
                row.className = "row justify-content-center";
                // Create and add title to row as span element.
                row.innerHTML = '<span><b>Group Composition</b> ('
                    + record.count + ' Giraffes)<br>';

                // Create canvas for chart.
                var canvas = document.createElement('canvas');
                canvas.setAttribute('height', '100px');

                // Create chart using Chart.js and record values.
                var chart = new Chart(canvas, {
                    type: 'horizontalBar',
                    data: {
                        labels: [""],
                        datasets: [{
                            label: 'Male - A (' + record.male_adult + ')' ,
                            data: [record.male_adult],
                            backgroundColor: 'rgba(196, 69, 105,0.5)',
                            borderColor: 'rgba(196, 69, 105,1)',
                            borderWidth: 2
                        }, {
                            label: 'Male - SA (' + record.male_subadult + ')',
                            data: [record.male_subadult],
                            backgroundColor:  'rgba(207, 106, 135,0.5)'
                        }, {
                            label: 'Female - A (' + record.female_adult + ')',
                            data: [record.female_adult],
                            backgroundColor: 'rgba(245, 205, 121,0.5)',
                            borderColor: 'rgba(245, 205, 121,1)',
                            borderWidth: 2
                        }, {
                            label: 'Female - SA (' + record.female_subadult + ')',
                            data: [record.female_subadult],
                            backgroundColor: 'rgba(247, 215, 148,0.5)'
                        }, {
                            label: 'Juvenile (' + record.juvenile + ')',
                            data: [record.juvenile],
                            backgroundColor: 'rgba(119, 139, 235,0.5)'
                        }, {
                            label: 'Unidentified (' + record.ungroup_identified + ')',
                            data: [record.ungroup_identified],
                            backgroundColor: 'rgba(89, 98, 117,0.5)'
                        }]
                    },
                    options: {
                        scales: {
                            xAxes: [{
                                ticks: {
                                    Min: 0,
                                    Max: record.count,
                                    stepSize: 1,
                                    maxTicksLimit: 10},
                                stacked: true
                            }],
                            yAxes: [{
                                stacked: true
                            }]
                        }
                    }
                });

                row.appendChild(canvas);

                return row;
            }

            /** Takes a string, converts it to lower case and makes the first letter uppercase.
             * @param {string} string - the string to be processed.
             * @returns {string} returns either a successfully processed string or "-".
             */
            function capitalizeFirstLetter(string) {
                if (string) {
                    string = string.toLowerCase();
                    // Capitalize first character, then add rest of lowercase string.
                    string = string.charAt(0).toUpperCase() + string.slice(1);
                    return string
                } else {
                    // When the given parameter is not a string, return "-".
                    return "-"
                }
            }

            /** Removes the seconds from the records' time attribute.
             * @param {object} time - the sighting time attribute.
             * @returns {string} time - the records time attribute as a string with seconds removed.
             */
            function timeFormat(time) {
                if (time) {
                    // Remove ':00'  from time counter.
                    time = time.slice(0, -3);
                    return time
                } else {
                    // When the given parameter is not valid, return "-".
                    return "-"
                }
            }
        });
    });
});
