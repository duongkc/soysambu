$(document).ready(function () {
    require([
        "esri/Map",
        "esri/views/MapView",
        "esri/Graphic"
    ], function(
        Map, MapView, Graphic
    ) {
        /***
         Define map and view
         ***/
        var map = new Map({
            basemap: "topo"
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
            }
        });

        /***
         UI changes.
         ***/
        view.ui.move("zoom", "top-right");

        /***
         Create points for existing records
         ***/
            // Point styling.
        var markerSymbol = {
            type: "simple-marker",
            color: [255,184,184],
            size: 7,
            outline: {
                color: [99,110,114],
                width: 1
            }
        };

        // Get sightings from database.
        $.getJSON('records', function(records) {
            // Draw a point for each record in database.
            $.each(records, function(i, record) {
                var point = {
                    type: "point",
                    longitude: 36.155,
                    latitude: -0.448
                };

                var pointGraphic = new Graphic({
                    geometry: point,
                    symbol: markerSymbol
                });

                view.graphics.add(pointGraphic)
            });
        });
    });
});