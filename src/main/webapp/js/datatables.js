$(document).ready(function () {
    $.getJSON('records', function (records) {
        var table = new Tabulator("#datatable", {
            height: "calc(100vh - 275px)",
            width: "380px",
            layout: "fitDataFill",
            responsiveLayout: "collapse",
            responsiveLayoutCollapseStartOpen: false,
            columns: [
                {
                    formatter: "responsiveCollapse",
                    width: 30,
                    minWidth: 30,
                    align: "center",
                    resizable: false,
                    headerSort: false
                },
                {title: "Date", field: "date", sortable: true, responsive: 0, width: 150},
                {title: "Time", field: "time", sortable: true, responsive: 0, width: 115},
                {title: "Count", field: "count", sortable: true, responsive: 0, width: 130},
                {title: "Activity", field: "activity", sortable: true, responsive: 3},
                {title: "Habitat Type", field: "habitatType", sortable: true, responsive: 3},
                {title: "Weather", field: "weather", sortable: true, responsive: 3},
                {title: "Latitude", field: "latitude", sortable: true, responsive: 3},
                {title: "Longitude", field: "longitude", sortable: true, responsive: 3},
                {title: "Male Adult", field: "male_adult", sortable: true, responsive: 3},
                {title: "Male Subadult", field: "male_subadult", sortable: true, responsive: 3},
                {title: "Female Adult", field: "female_subadult", sortable: true, responsive: 3},
                {title: "Juvenile", field: "juvenile", sortable: true, responsive: 3},
                {title: "Unidentified", field: "ungroup_identified", sortable: true, responsive: 3},
            ],
        });
        console.log(records);
        table.setData(records);
    });
});