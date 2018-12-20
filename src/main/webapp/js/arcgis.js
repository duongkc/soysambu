$(document).ready(function () {
    require([
        "esri/Map",
        "esri/views/MapView"
    ], function (Map, MapView, UI) {
        var map = new Map({
            basemap: "topo",
            sliderOrientation: "top-right"
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

        view.ui.move("zoom", "top-right");
    });
});