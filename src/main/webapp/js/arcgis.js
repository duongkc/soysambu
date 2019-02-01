$(document).ready(function () {
    /* dojo.require, used to load ArcGIS module dependencies */
    require([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/geometry/Point",
        "esri/widgets/LayerList"
    ], function (Map, MapView, FeatureLayer, Point, LayerList) {
        /*** MAP AND VIEW ***/
        let map = new Map({
            basemap: "topo"
        });

        let view = new MapView({
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
                    /* Disables the dock button from the popup. */
                    buttonEnabled: false,
                    breakpoint: false,
                    position: "bottom-left"
                }
            },
            highlightOptions: {
                color: "rgba(119, 139, 235,0.8)"
            }
        });

        /*** UI ***/
        /* Move zoom widget to top right. */
        view.ui.move("zoom", "top-right");

        /* Watch for .avatar divs to arrive into the DOM, resize Flickity carousel after all .avatar divs
           have been added. _.debounce makes sure the resizeGiraffeListCarousel function is only called once.
           The Flickity carousel will not or incorrectly display if this code is omitted or applied to a
           parent div. */
        let lazyFlickityResize = _.debounce(activateGiraffeListCarousel, 50);
        $(document).arrive(".avatar", lazyFlickityResize);


        /*** LAYERS ***/
        /* Generate layers when view is resolved. */
        view.when(function() {
            createGiraffeFeatures()
                .then(createGiraffeFeatureLayer)
                .then(createLayerList);
        });

        /** Constructs a widget listing all layers currently loaded on the map.
         *      Each layer gets its own panel which can be accessed through a button.
         *  listItemCreatedFunction executes for every layer in the LayerList, in this case it
         *  dynamically adds a legend to every layer's panel.
         */
        function createLayerList() {
            let layerList = new LayerList({
                view: view,
                listItemCreatedFunction: function (event) {
                    let item = event.item;
                    /* Add a generated legend for every individual layer. */
                    item.panel = {
                        content: "legend",
                        open: false
                    }
                }
            });

            /* Add LayerList to the view. */
            view.ui.add(layerList, "top-left");
        }


        /*** GIRAFFE FEATURELAYER ***/
        /** Creates graphics and fields to be used within a FeatureLayer for giraffe sightings.
         *      Returns a promise so that the database connection can close and all sightings
         * can be retrieved and turned into point graphics, without already rendering
         * layers asynchronously.
         *
         * @returns {promise} - a promise that waits for all sightings to be processed before resolving.
         */
        function createGiraffeFeatures() {
            /* Create a container to store coordinate point graphics. */
            let graphics = [];
            /* Declare fields for every sighting attribute, a requirement of FeatureLayers. */
            let fields = [{
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
                name: "unidentified",
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
            }, {
                name: "giraffes",
                alias: "List of identified giraffes within the group.",
                type: "xml"
            }];

            return new Promise(function (resolve) {
                /* Get sightings from database through records servlet. */
                $.getJSON("records", function (sightings) {
                    /* Generate a point feature for each sighting retrieved from the database. */
                    $.each(sightings, function (key, sighting) {
                        let point = {
                            geometry: {
                                type: "point",
                                longitude: sighting.longitude,
                                latitude: sighting.latitude
                            },
                            attributes: sighting
                        };

                        graphics.push(point);
                    });
                    /* Resolve promise when all sightings have been processed. */
                }).done(function() {resolve({graphics: graphics, fields: fields})})
            });
        }

        /** Creates a new FeatureLayer based on sighting features.
         *      Feature refers to the points located on the arcGIS map. These are distinguished from
         * graphic points because features must all be of the same graphics type (e.g. Point)
         * and contain attributes as defined in 'fields'.
         *      FeatureLayer allows for the use of different renderers, where as a graphics layer
         * does not.
         *
         * @param {object} giraffeFeatures - object containing the graphic points and fields of every sighting.
         */
        function createGiraffeFeatureLayer(giraffeFeatures) {
            /* Declare a renderer, defining every feature's style. */
            let renderer = {
                type: "simple",
                symbol: {
                    type: "simple-marker"
                },
                visualVariables: [{
                    /* Variable to adjust point color based on giraffe count. */
                    type: "color",
                    field: "count",
                    stops: [
                        { value: 1, color: "rgba(247, 215, 148,0.5)" },
                        { value: 25, color: "rgba(241, 144, 102,0.5)" },
                        { value: 50, color: "rgba(196, 69, 105,0.5)" }
                    ]
                }, {
                    /* Variable to adjust point size based on giraffe count. */
                    type: "size",
                    field: "count",
                    stops: [
                        { value: 1, size: 4 },
                        { value: 25, size: 23 },
                        { value: 50, size: 50 }
                    ]
                }]
            };

            let giraffeFeatureLayer = new FeatureLayer({
                title: "Giraffe Sightings",
                source: giraffeFeatures.graphics,
                fields: giraffeFeatures.fields,
                objectIdField: "id",
                renderer: renderer,
                popupTemplate: {
                    outFields: ["*"],
                    /* Generate popup title and content through internal features. */
                    title: getGiraffePopupTitle,
                    content: getGiraffePopupContent
                }
            });

            /* Add FeatureLayer to map. */
            map.add(giraffeFeatureLayer);
        }

        /** Generates the giraffeFeatureLayer's popup title.
         *      PopupTemplate title and contents are processed separately, so where as the
         *  generateGiraffePopupContent returns HTML elements because of its interaction with
         *  libraries Chart.js and Flickity, title can get away with just being a string that
         *  will be processed by the arcGIS API.
         *
         * @returns {string} HTML popup template title.
         */
        function getGiraffePopupTitle(feature) {
            /* Get attributes from selected feature. */
            let attributes = feature.graphic.attributes;

            /* Return a string containing the HTML popup template title. */
            return '<div class="d-flex flex-row flex-wrap popup-title-container">' +
                   '<div class="d-flex">Giraffe Sighting<small>(' + attributes.id + ')</small></div>' +
                   '<div class="d-flex">' + attributes.date + ' at ' +
                   timeFormat(attributes.time) + '</div></div>';
        }


        /** Generates the giraffeFeatureLayer's popup content.
         *      The giraffeFeatureLayer's popup content is comprised of three sections:
         *  1. A summary containing the sightings general attributes,
         *  2. A horizontal stacked bar chart visualizing the giraffe group composition,
         *  3. A list of all the known giraffes to have appeared in the group.
         *
         * @returns {HTMLElement} content - the giraffeFeatureLayer's popup content.
         */
        function getGiraffePopupContent(feature) {
            /* Get attributes from selected feature. */
            const attributes = feature.graphic.attributes;
            let content = document.createElement('div');
            /* Horizontal breaks. */
            let hr = document.createElement('HR');
            let hr2 = document.createElement('HR');

            /* Generate content rows and append them to content div. */
            content.append(getGiraffePopupSummary(attributes));
            content.append(hr);
            content.append(getGiraffePopupChart(attributes));
            content.append(hr2);
            content.append(getGiraffePopupList(attributes));

            return content;
        }

        /** Generates a summary of the giraffe sighting's attributes.
         *
         * @param {object} attributes - the feature's giraffe sighting attributes.
         * @returns {HTMLElement} row - the sighting's attribute summary as an HTML element.
         */
        function getGiraffePopupSummary(attributes) {
            /* Create HTML Layout of the summary. */
            let row = document.createElement('div');
            let col1 = document.createElement('div');
            let col2 = document.createElement('div');

            row.className = "row";
            col1.className = "col-6"; col2.className = "col-6";

            /* Fill columns with sighting attributes. */
            col1.innerHTML = "<span><b>Activity: </b>" + parseDatabaseString(attributes.activity) +
                  "</span><br><span><b>Habitat: </b>" + parseDatabaseString(attributes.habitatType) +
                  "</span><br><span><b>Weather: </b>" + parseDatabaseString(attributes.weather) +
                  "</span>";

            col2.innerHTML = "<span><b>Longitude: </b>" + attributes.longitude +
                  "</span><br><span><b>Latitude: </b>" + attributes.latitude +
                  "</span>";

            /* Add columns to row. */
            row.appendChild(col1); row.appendChild(col2);

            return row
        }

        /** Generates a stacked horizontal bar chart of the feature's giraffe group composition.
         *      Chart.js is used to create the chart, this required use of a canvas element. Chart.js
         *  contains responsive resizing, but in order to properly resize for mobile screens the canvas'
         *  parent container has responsive height through css media queries (see webapp.css).
         *
         * @param {object} attributes - the feature's giraffe sighting attributes.
         * @returns {HTMLElement} row - HTML containing chart title and canvas.
         */
        function getGiraffePopupChart(attributes) {
            /* Create row container and column for chart title and canvas. */
            let row = document.createElement('div');
            let col = document.createElement('div');
            /* Create canvas for chart */
            let canvas = document.createElement('canvas');

            row.className = "row justify-content-center";
            col.className = "col-lg-12 popup-chart-container";

            /* Create and add title to row as span element. */
            row.innerHTML = '<span><b>Group Composition</b> (' +
                attributes.count + ' Giraffes)<br>';

            /* Create chart using Chart.js and attributes values. */
            let chart = new Chart(canvas, {
                type: 'horizontalBar',
                data: {
                    labels: [""],
                    /* Add each giraffe type as an element of the stacked chart. */
                    datasets: [{
                        label: 'Male - A (' + attributes.male_adult + ')' ,
                        data: [attributes.male_adult],
                        backgroundColor: 'rgba(196, 69, 105,0.5)',
                        borderColor: 'rgba(196, 69, 105,1)',
                        borderWidth: 2
                    }, {
                        label: 'Male - SA (' + attributes.male_subadult + ')',
                        data: [attributes.male_subadult],
                        /* Use the patternomaly library to create patterned elements. */
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
                        label: 'Unidentified (' + attributes.unidentified + ')',
                        data: [attributes.unidentified],
                        backgroundColor: 'rgba(89, 98, 117,0.5)'
                    }]
                },
                options: {
                    /* Aspect ratio is handled with CSS media queries. */
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [{
                            ticks: {
                                /* Set min and max value of xAxis to min and max value of giraffe count. */
                                Min: 0,
                                Max: attributes.count,
                                stepSize: 1,
                                maxTicksLimit: 10},
                            stacked: true
                        }],
                        yAxes: [{
                            stacked: true
                        }]
                    },
                    tooltips: {
                        /* Sets tooltip for every stack element instead of the entire stack. */
                        mode: 'point'
                    }
                }
            });

            col.appendChild(canvas);
            row.appendChild(col);

            return row;
        }

        /** Generates a list of all identified giraffes within the sighting.
         *      The list is displayed as a carousel managed by Flickity, this allows for multiple avatars
         *  to be grouped and enables swiping for easier navigation on mobile phones.
         *      Important: the Flickity carousel is successfully initialized after this function is called but
         *  due to the carousel being hidden during initialization it will not display properly. Because of
         *  this a solution was made involving calling a re-size of the carousel after it is displayed. This
         *  solution is found under the UI section of this script.
         *
         * @param {object} attributes - the feature's giraffe sighting attributes.
         * @returns {HTMLElement} row - HTML containing a carousel of giraffe avatars.
         */
        function getGiraffePopupList(attributes) {
            let row = document.createElement('div');
            let col = document.createElement('div');

            row.className = "row justify-content-center";
            row.innerHTML = '<span><b>Identified Giraffes</b> (' + attributes.count + ' Giraffes)<br>';

            col.className = 'col-lg-11';
            col.id = "giraffe-list";

            /* Creates an avatar for each identified giraffe in the sighting. This is done through
               a promise so that all avatars are known and linked before the Flickity carousel is
               initiated.
             */
            let avatarsLoaded = new Promise(function(resolve) {
                let avatars = [];
                for (let i in attributes.giraffes) {
                    let giraffe = attributes.giraffes[i];
                    let avatar = document.createElement('div');

                    /* Set custom avatar class depending on the giraffe's age and gender. */
                    if (giraffe.age === "JUVENILE") {
                        avatar.className = "avatar JUVENILE"
                    } else {
                        avatar.className = "avatar " + giraffe.gender + giraffe.age;
                    }

                    /* Set avatar's inner HTML to the giraffe's avatar image,
                       webapp.css contains all the avatar styling (.avatar) */
                    avatar.innerHTML = '<img data-flickity-lazyload="assets/img/avatars/avatar-' + giraffe.giraffe_id + '.png"><br>'
                        +  '<span class="avatar-id">' + giraffe.giraffe_id + '</span><br>';

                    /* Add giraffe name below avatar if named, else add "-". */
                    avatar.innerHTML += giraffe.name ? giraffe.name : "-";

                    col.appendChild(avatar);
                }
                /* Resolve after for loop finishes */
                resolve(avatars);
            });

            /* Initiate the Flickity carousel once all avatars have been created and added to
               the col element. */
            function initiateCarousel() {
                $(col).flickity({
                    lazyLoad: 1,
                    groupCells: true,
                    cellAlign: 'left',
                    contain: true,
                    pageDots: false
                });
            }

            /* Execute initiateCarousel after avatarsLoaded promise resolves */
            avatarsLoaded.then(initiateCarousel);
            row.appendChild(col);

            return row
        }


        /*** UTILITIES ***/
        /** String parsing for displaying database records.
         *      1. Takes a string, replaces underscores with spaces.
         *      2. Makes the entire string lowercase.
         *      3. Makes the first letter uppercase.
         *
         * @param {string} string - the string to be processed.
         * @returns {string} returns either a successfully processed string or "-".
         */
        function parseDatabaseString(string) {
            if (string) {
                /* Turn string to lower case and replace underscores with spaces. */
                string = string.replace('_',' ').toLowerCase();
                /* Capitalize first character, then add rest of lowercase string. */
                string = string.charAt(0).toUpperCase() + string.slice(1);

                return string
            } else {
                /* When the given parameter is not a string, return "-". */
                return "-"
            }
        }

        /** Removes the seconds from the records' time attribute.
         *
         * @param {string} timeString - the sighting time attribute.
         * @returns {string} timeString - the records time attribute as a string with seconds removed.
         */
        function timeFormat(timeString) {
            if (timeString) {
                /* Remove ':00'  from time counter. */
                timeString = timeString.slice(0, -3);
                return timeString;
            } else {
                /* When the given parameter is not valid, return "-". */
                return "-"
            }
        }

        /** Activates any event listeners associated with the giraffe popup's giraffe-list carousel.
         *  Event listeners will only work after the element is placed within the DOM; this function
         *  is called as a response to a giraffe list entering the DOM.
         *      Important: Calls the resize function for the flickity carousel which fixes the flickity
         *  carousel improperly displaying after appearing from a hidden state.
         */
        function activateGiraffeListCarousel() {
            /* Get flickity carousel instance for the current giraffe list */
            let flickityInstance = $('#giraffe-list').data('flickity');
            flickityInstance.resize();
        }
    });
});
