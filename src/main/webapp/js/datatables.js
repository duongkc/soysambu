$(document).ready(function () {
    $.getJSON('records', function (records) {
        var table = new Tabulator("#datatable", {
            height: "calc(100vh - 275px)",
            width: "380px",
            layout: "fitDataFill",
            responsiveLayout: "collapse",
            responsiveLayoutCollapseStartOpen: false,
            scrollToRowPosition: "center",
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
                {title: "Unidentified", field: "unidentified", sortable: true, responsive: 3},
            ],

            rowClick:function(e, row) {
                console.log(row.getData());
                table.scrollToRow(row.getIndex(), "center", true);
            },


        });
        console.log(records);
        table.setData(records);

        $(".tabulator-row").click(function() {
            var display = $(this).find(".tabulator-responsive-collapse");
            var toggleOpen = $(this).find(".tabulator-responsive-collapse-toggle-open");
            if(display.css("display") === "none") {
                toggleOpen.replaceWith("<span class=\"tabulator-responsive-collapse-toggle-open\">-</span>");
                display.css({"display":"initial"});
            } else if (display.css("display)") === "initial") {
                toggleOpen.replaceWith("<span class=\"tabulator-responsive-collapse-toggle-open\">+</span>");
                display.css({"display":"none"});
            } else {
                toggleOpen.replaceWith("<span class=\"tabulator-responsive-collapse-toggle-open\">+</span>");
                display.css({"display":"none"});
            }
        });


    });
});