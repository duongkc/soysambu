$(document).ready(function () {
    $.getJSON('records', function (records) {

        function upperCaseStringParse(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function parseString(string) {
            return string.replace("_", " ").replace(/\w\S*/g, function (word) {
                return word.charAt(0) + word.slice(1).toLowerCase();
            });
        }

        function format(d) {
            return '<table cellpadding="1" cellspacing="0" border="1" style="padding-left:10px;font-size: 12px;">' +
                "<tr><td><strong>Activity</strong></td><td>" + upperCaseStringParse(parseString(d.activity)) + "</td>" +
                "<td><strong>Male adult</strong></td><td>" + d.male_adult + "</td></tr>" +
                "<tr><td><strong>Habitat</strong></td><td>" + upperCaseStringParse(parseString(d.habitatType)) + "</td>" +
                "<td><strong>Male subadult</strong></td><td>" + d.male_subadult + "</td></tr>" +
                "<tr><td><strong>Weather</strong></td><td>" + upperCaseStringParse(parseString(d.weather)) + "</td>" +
                "<td><strong>Female adult</strong></td><td>" + d.female_adult + "</td></tr>" +
                "<tr><td></td><td></td>" +
                "<td><strong>Female subadult</strong></td><td>" + d.female_subadult + "</td></tr>" +
                "<tr><td><strong>Latitude</strong></td><td>" + d.latitude + "</td>" +
                "<td><strong>Juvenile</strong></td><td>" + d.juvenile + "</td></tr>" +
                "<tr><td><strong>Longitude</strong></td><td>" + d.longitude + "</td>" +
                "<td><strong>Unidentified</strong></td><td>" + d.unidentified + "</td></tr>" +
                '</table>';
        }

        console.log(records);
        var table = $('#datatable1').DataTable({
            data: records,
            scrollY: "calc(100vh - 350px)",
            scrollCollapse: true,
            paging: false,
            searching: false,
            columns: [
                {
                    "className": 'details-control',
                    "orderable": false,
                    "data": null,
                    "defaultContent": ''
                },
                {data: "date"},
                {data: "time"},
                {data: "count"}
            ],
            "columnDefs": [
                {
                    "targets": [ 0 ],
                    "visible": false,
                    "searchable": false
                }
            ]

        });

        // Add event listener for opening and closing details
        $('#datatable1 tr').on('click', function () {
            var tr = $(this).closest('tr');
            var row = table.row(tr);

            if (row.child.isShown()) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                row.child(format(row.data())).show();
                tr.addClass('shown');
            }
        });
    });

});


// /**
//  * Old Datatable (Tabulator) functionality.
//  * Commented for reference, currently unused.
//  * Replaced by Datatables.net library
//  */
// $(document).ready(function () {
//     $.getJSON('records', function (records) {
//         var table = new Tabulator("#datatable", {
//             height: "calc(100vh - 275px)",
//             width: "250px",
//             layout: "fitDataFill",
//             responsiveLayout: "collapse",
//             responsiveLayoutCollapseStartOpen: false,
//             columns: [
//                 {title: "Date", field: "date", sortable: true, responsive: 0, width: 120},
//                 {title: "Time", field: "time", sortable: true, responsive: 0, width: 110},
//                 {title: "Count", field: "count", sortable: true, responsive: 0, width: 100},
//                 {title: "Activity", field: "activity", sortable: true, responsive: 3},
//                 {title: "Habitat Type", field: "habitatType", sortable: true, responsive: 3},
//                 {title: "Weather", field: "weather", sortable: true, responsive: 3},
//                 {title: "Latitude", field: "latitude", sortable: true, responsive: 3},
//                 {title: "Longitude", field: "longitude", sortable: true, responsive: 3},
//                 {title: "Male Adult", field: "male_adult", sortable: true, responsive: 3},
//                 {title: "Male Subadult", field: "male_subadult", sortable: true, responsive: 3},
//                 {title: "Female Adult", field: "female_adult", sortable: true, responsive: 3},
//                 {title: "Female Subadult", field: "female_subadult", sortable: true, responsive: 3},
//                 {title: "Juvenile", field: "juvenile", sortable: true, responsive: 3},
//                 {title: "Unidentified", field: "unidentified", sortable: true, responsive: 3},
//             ],
//
//             rowClick:function(e, row) {
//                 var display = $(row.getElement()).find(".tabulator-responsive-collapse");
//                 console.log(display);
//                 //console.log(row.getData());
//                 var data = row.getData();
//
//                 if(display.css("display") === "none") {
//                     display.css({"display":"initial"});
//                 } else if (display.css("display)") === "initial") {
//                     display.css({"display":"none"});
//                 } else {
//                     display.css({"display":"none"});
//                 }
//                 display[0].innerHTML = "<div class='row'><div class='col-lg-12'><table class=\"table table-responsive table-striped table-hover table-sm\" " +
//                     "style='font-size:13.5px;'><tbody>" +
//                     "<tr><td><strong>Activity</strong></td><td>" + data.activity + "</td>" +
//                     "<td><strong>Male adult</strong></td><td>" + data.male_adult + "</td></tr>" +
//                     "<tr><td><strong>Habitat</strong></td><td> " + data.habitatType + "</td>" +
//                     "<td><strong>Male subadult</strong></td><td>" + data.male_subadult + "</td></tr>" +
//                     "<tr><td><strong>Weather</strong></td><td> " + data.weather + "</td>" +
//                     "<td><strong>Female adult</strong></td><td>" + data.female_adult + "</td></tr>" +
//                     "<tr><td></td><td></td>" +
//                     "<td><strong>Female subadult</strong></td><td>" + data.female_subadult + "</td></tr>" +
//                     "<tr><td><strong>Latitude</strong></td><td> " + data.latitude + "</td>" +
//                     "<td><strong>Juvenile</strong></td><td>" + data.juvenile + "</td></tr>" +
//                     "<tr><td><strong>Longitude</strong></td><td> " + data.longitude + "</td>" +
//                     "<td><strong>Unidentified</strong></td><td>" + data.unidentified + "</td></tr>" +
//                     "</tbody></table></div></div>";
//                 table.scrollToRow(row.getIndex(), "nearest", true);
//             },
//
//
//         });
//         console.log(records);
//         table.setData(records);
//
//     });
// });