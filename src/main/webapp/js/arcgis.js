$(document).ready(function () {
    require([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/geometry/Point",
        "js/lib/chart.bundle.min.js"
    ], function (
        Map, MapView, FeatureLayer, Point, Chart
    ) {
        /*** Define map and view ***/
        var map = new Map({
            basemap: "gray"
        });

        var view = new MapView({
            container: "map",
            map: map,
            zoom: 13,
            center: [36.135, -0.45],
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
                    position: "bottom-left"
                }
            }
        });

        /*** UI changes ***/
        view.ui.move("zoom", "top-right");

        /*** Generate Layers when view is resolved. ***/
        view.when(function() {
            createGiraffeFeatures()
                .then(createGiraffeLayer);
        });

        /*** GIRAFFE FeatureLayer ***/
        /** Creates graphics and fields to be used within a FeatureLayer for giraffe sightings.
         * @returns {promise} - a promise that waits for all sightings to be processed before resolving.
         */
        function createGiraffeFeatures() {
            // Create a container to store point graphics.
            var graphics = [];
            // Declare fields for every sighting attribute.
            var fields = [{
                name: "id",
                alias: "Sighting ID",
                type: "oid"
            }, {
                name: "group_id",
                alias: "Giraffe group ID",
                type: "integer"
            }, {
                name: "count",
                alias: "Giraffe group size",
                type: "integer"
            }, {
                name: "activity",
                alias: "Average activity of group",
                type: "string"
            }, {
                name: "male_adult",
                alias: "Amount of male adults giraffes in group.",
                type: "integer"
            }, {
                name: "male_subadult",
                alias: "Amount of male sub-adults giraffes in group.",
                type: "integer"
            }, {
                name: "female_adult",
                alias: "Amount of female adults giraffes in group.",
                type: "integer"
            }, {
                name: "female_subadult",
                alias: "Amount of female sub-adults giraffes in group.",
                type: "integer"
            }, {
                name: "juvenile",
                alias: "Amount of juvenile giraffes in group.",
                type: "integer"
            }, {
                name: "ungroup_identified",
                alias: "Amount of unidentified giraffes in group.",
                type: "integer"
            }, {
                name: "date",
                alias: "Date of sighting.",
                type: "string"
            }, {
                name: "time",
                alias: "Time of sighting",
                type: "string"
            }, {
                name: "longitude",
                alias: "Longitude coordinate of sighting.",
                type: "double"
            }, {
                name: "latitude",
                alias: "Latitude coordinate of sighting.",
                type: "double"
            }, {
                name: "weather",
                alias: "Weather at the time of sighting.",
                type: "string"
            }, {
                name: "habitatType",
                alias: "Environment of sighting location.",
                type: "string"
            }];

            return new Promise(function (resolve) {
                // Get sightings from database.
                $.getJSON("records", function (sightings) {
                    // Generate a point feature based on each sighting in the database.
                    $.each(sightings, function (key, sighting) {
                        var point = {
                            geometry: {
                                type: "point",
                                longitude: sighting.longitude,
                                latitude: sighting.latitude
                            },
                            attributes: sighting
                        };

                        graphics.push(point);
                    });
                    // Resolve promise when all sightings have been processed.
                }).done(function() {resolve({graphics: graphics, fields: fields})})
            });
        }

        /** Creates a new FeatureLayer based on sighting features.
         * @param {object} giraffeFeatures - object containing the graphics and fields of every sighting.
         */
        function createGiraffeLayer(giraffeFeatures) {
            // Declare a renderer, defining every feature's style.
            var renderer = {
                type: "simple",
                symbol: {
                    type: "simple-marker",
                    size: 6,
                    color: "gray"
                }
            };

            var giraffeLayer = new FeatureLayer({
                source: giraffeFeatures.graphics,
                fields: giraffeFeatures.fields,
                objectIdField: "id",
                renderer: renderer,
                outFields: ["*"],
                popupTemplate: {title: 'Giraffe Sighting',
                    content: generateContent}
            });

            // Add FeatureLayer to map.
            map.add(giraffeLayer);
        }


        /** Generates popup template content.
         * @returns {HTMLObjectElement} content - HTML popup template content
         */
        function generateContent(feature) {
            var attributes = feature.graphic.attributes;

            // Content container.
            var content = document.createElement('div');
            // Horizontal breaks.
            var hr = document.createElement('HR');
            var hr2 = document.createElement('HR');

            // Generate contents.
            var summary = generateAttributes(attributes);
            var chart = generateChart(attributes);

            content.append(summary);
            content.append(hr);
            content.append(chart);

            return content;
        }

        /** Generates HTML containing the records' attributes.
         * @param {object} attributes - the sighting attributes.
         * @returns {HTMLObjectElement} row - HTML containing attributes attributes.
         */
        function generateAttributes(attributes) {
            // Create skeleton of HTML Layout.
            var row = document.createElement('div');
            var col1 = document.createElement('div');
            var col2 = document.createElement('div');
            row.className = "row";
            col1.className = "col-6";
            col2.className = "col-6";
            // Fill columns with attributes.
            col1.innerHTML = "<span><b>Activity: </b>" + capitalizeFirstLetter(attributes.activity) +
                "</span><br><span><b>Habitat: </b>" + capitalizeFirstLetter(attributes.habitat) +
                "</span><br><span><b>Weather: </b>" + capitalizeFirstLetter(attributes.weather) +
                "</span>";

            col2.innerHTML = "<span><b>Longitude: </b>" + attributes.longitude +
                "</span><br><span><b>Latitude: </b>" + attributes.latitude +
                "</span>";

            row.appendChild(col1);
            row.appendChild(col2);

            return row
        }

        /** Generates a stacked horizontal bar chart of the giraffe group composition using Chart.js.
         * @param {object} attributes - the sighting attributes.
         * @returns {HTMLObjectElement} row - HTML containing chart title and canvas.
         */
        function generateChart(attributes) {
            // Create row container for chart title and canvas.
            var row = document.createElement('div');
            row.className = "row justify-content-center";
            // Create and add title to row as span element.
            row.innerHTML = '<span><b>Group Composition</b> ('
                + attributes.count + ' Giraffes)<br>';

            // Create canvas for chart.
            var canvas = document.createElement('canvas');
            canvas.setAttribute('height', '100px');

            // Create chart using Chart.js and attributes values.
            var chart = new Chart(canvas, {
                type: 'horizontalBar',
                data: {
                    labels: [""],
                    datasets: [{
                        label: 'Male - A (' + attributes.male_adult + ')' ,
                        data: [attributes.male_adult],
                        backgroundColor: 'rgba(196, 69, 105,0.5)',
                        borderColor: 'rgba(196, 69, 105,1)',
                        borderWidth: 2
                    }, {
                        label: 'Male - SA (' + attributes.male_subadult + ')',
                        data: [attributes.male_subadult],
                        backgroundColor: pattern.draw('dash', 'rgba(207, 106, 135,0.5)')
                    }, {
                        label: 'Female - A (' + attributes.female_adult + ')',
                        data: [attributes.female_adult],
                        backgroundColor: 'rgba(245, 205, 121,0.5)',
                        borderColor: 'rgba(245, 205, 121,1)',
                        borderWidth: 2
                    }, {
                        label: 'Female - SA (' + attributes.female_subadult + ')',
                        data: [attributes.female_subadult],
                        backgroundColor: pattern.draw('dash', 'rgba(247, 215, 148,0.5)')
                    }, {
                        label: 'Juvenile (' + attributes.juvenile + ')',
                        data: [attributes.juvenile],
                        backgroundColor: 'rgba(119, 139, 235,0.5)'
                    }, {
                        label: 'Unidentified (' + attributes.ungroup_identified + ')',
                        data: [attributes.ungroup_identified],
                        backgroundColor: 'rgba(89, 98, 117,0.5)'
                    }]
                },
                options: {
                    scales: {
                        xAxes: [{
                            ticks: {
                                Min: 0,
                                Max: attributes.count,
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
