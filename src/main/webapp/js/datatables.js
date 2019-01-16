// $.fn.dataTable.ext.search.push(
//     function( settings, records, dataIndex ) {
//         var min = $("#latitude-filter").data().from;
//         var max = $("#latitude-filter").data().to;
//         var count = records[8] || 0; //
//
//         if ( ( isNaN( min ) && isNaN( max ) ) ||
//             ( isNaN( min ) && count <= max ) ||
//             ( min <= count   && isNaN( max ) ) ||
//             ( min <= count   && count <= max ) )
//         {
//             return true;
//         }
//         return false;
//     }
// );
//
// $.fn.dataTable.ext.search.push(
//     function( settings, records, dataIndex ) {
//         var min = $("#longitude-filter").data().from;
//         var max = $("#longitude-filter").data().to;
//         var count = records[7] || 0; //
//
//         if ( ( isNaN( min ) && isNaN( max ) ) ||
//             ( isNaN( min ) && count <= max ) ||
//             ( min <= count   && isNaN( max ) ) ||
//             ( min <= count   && count <= max ) )
//         {
//             return true;
//         }
//         return false;
//     }
// );

$.fn.dataTable.ext.search.push(
    function( settings, records, dataIndex ) {
        var min = parseInt( $("#total-count").data().from, 10 );
        var max = parseInt( $("#total-count").data().to, 10 );
        var count = parseFloat( records[3] ) || 0; //

        if ( ( isNaN( min ) && isNaN( max ) ) ||
            ( isNaN( min ) && count <= max ) ||
            ( min <= count   && isNaN( max ) ) ||
            ( min <= count   && count <= max ) )
        {
            return true;
        }
        return false;
    }
);

$.fn.dataTable.ext.search.push(
    function( settings, records, dataIndex ) {
        var min = parseInt( $("#male-a-count").data().from, 10 );
        var max = parseInt( $("#male-a-count").data().to, 10 );
        var count = parseFloat( records[9] ) || 0; //

        if ( ( isNaN( min ) && isNaN( max ) ) ||
            ( isNaN( min ) && count <= max ) ||
            ( min <= count   && isNaN( max ) ) ||
            ( min <= count   && count <= max ) )
        {
            return true;
        }
        return false;
    }
);

$.fn.dataTable.ext.search.push(
    function( settings, records, dataIndex ) {
        var min = parseInt( $("#male-sa-count").data().from, 10 );
        var max = parseInt( $("#male-sa-count").data().to, 10 );
        var count = parseFloat( records[10] ) || 0; //

        if ( ( isNaN( min ) && isNaN( max ) ) ||
            ( isNaN( min ) && count <= max ) ||
            ( min <= count   && isNaN( max ) ) ||
            ( min <= count   && count <= max ) )
        {
            return true;
        }
        return false;
    }
);

$.fn.dataTable.ext.search.push(
    function( settings, records, dataIndex ) {
        var min = parseInt( $("#female-a-count").data().from, 10 );
        var max = parseInt( $("#female-a-count").data().to, 10 );
        var count = parseFloat( records[11] ) || 0; //

        if ( ( isNaN( min ) && isNaN( max ) ) ||
            ( isNaN( min ) && count <= max ) ||
            ( min <= count   && isNaN( max ) ) ||
            ( min <= count   && count <= max ) )
        {
            return true;
        }
        return false;
    }
);

$.fn.dataTable.ext.search.push(
    function( settings, records, dataIndex ) {
        var min = parseInt( $("#female-sa-count").data().from, 10 );
        var max = parseInt( $("#female-sa-count").data().to, 10 );
        var count = parseFloat( records[12] ) || 0; //

        if ( ( isNaN( min ) && isNaN( max ) ) ||
            ( isNaN( min ) && count <= max ) ||
            ( min <= count   && isNaN( max ) ) ||
            ( min <= count   && count <= max ) )
        {
            return true;
        }
        return false;
    }
);

$.fn.dataTable.ext.search.push(
    function( settings, records, dataIndex ) {
        var min = parseInt( $("#juv-count").data().from, 10 );
        var max = parseInt( $("#juv-count").data().to, 10 );
        var count = parseFloat( records[13] ) || 0; //

        if ( ( isNaN( min ) && isNaN( max ) ) ||
            ( isNaN( min ) && count <= max ) ||
            ( min <= count   && isNaN( max ) ) ||
            ( min <= count   && count <= max ) )
        {
            return true;
        }
        return false;
    }
);

$.fn.dataTable.ext.search.push(
    function( settings, records, dataIndex ) {
        var min = parseInt( $("#unidentified-count").data().from, 10 );
        var max = parseInt( $("#unidentified-count").data().to, 10 );
        var count = parseFloat( records[14] ) || 0; //

        if ( ( isNaN( min ) && isNaN( max ) ) ||
            ( isNaN( min ) && count <= max ) ||
            ( min <= count   && isNaN( max ) ) ||
            ( min <= count   && count <= max ) )
        {
            return true;
        }
        return false;
    }
);

$.fn.dataTable.ext.search.push(
    function( settings, records, dataIndex ) {
        var weatherOption = $('#weather-filter').val().toUpperCase().replace(" ", "_");
        var weather = records[6];

        if(weatherOption === weather) {
            return true;
        }
        else if(weatherOption === "_") {
            return true;
        }
        return false;
    }
);

$.fn.dataTable.ext.search.push(
    function( settings, records, dataIndex ) {
        var habitatOption = $('#habitat-filter').val().toUpperCase().replace(" ", "_");
        var habitat = records[4];

        if(habitatOption === habitat) {
            return true;
        }
        else if(habitatOption === "_") {
            return true;
        }
        return false;
    }
);

$.fn.dataTable.ext.search.push(
    function( settings, records, dataIndex ) {
        var activityOption = $('#activity-filter').val().toUpperCase().replace(" ", "_");
        var activity = records[5];

        if(activityOption === activity) {
            return true;
        }
        else if(activityOption === "_") {
            return true;
        }
        return false;
    }
);

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
            columns: [ //Number indicates column index
                {
                    "className": 'details-control',
                    "orderable": false,
                    "data": null,
                    "defaultContent": ''
                }, //0
                {data: "date"}, //1
                {data: "time"}, //2
                {data: "count"}, //3
                {data: "habitatType"}, //4
                {data: "activity"}, //5
                {data: "weather"}, //6
                {data: "longitude"}, //7
                {data: "latitude"}, //8
                {data: "male_adult"}, //9
                {data: "male_subadult"}, //10
                {data: "female_adult"}, //11
                {data: "female_subadult"}, //12
                {data: "juvenile"}, //13
                {data: "unidentified"} //14
            ],
            "columnDefs": [
                {
                    "targets": [ 0 ],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [ 4 ],
                    "visible": false,
                    "searchable": true
                },
                {
                    "targets": [ 5 ],
                    "visible": false,
                    "searchable": true
                },
                {
                    "targets": [ 6 ],
                    "visible": false,
                    "searchable": true
                },
                {
                    "targets": [ 7 ],
                    "visible": false,
                    "searchable": true
                },
                {
                    "targets": [ 8 ],
                    "visible": false,
                    "searchable": true
                },
                {
                    "targets": [ 9 ],
                    "visible": false,
                    "searchable": true
                },
                {
                    "targets": [ 10 ],
                    "visible": false,
                    "searchable": true
                },
                {
                    "targets": [ 11 ],
                    "visible": false,
                    "searchable": true
                },
                {
                    "targets": [ 12 ],
                    "visible": false,
                    "searchable": true
                },
                {
                    "targets": [ 13 ],
                    "visible": false,
                    "searchable": true
                },
                {
                    "targets": [ 14 ],
                    "visible": false,
                    "searchable": true
                }
            ]

        });

        // Add event listener for opening and closing details
        $('#datatable1 tr').on('click', function () {
            var tr = $(this).closest('tr');
            var row = table.row(tr);

            if (row.child.isShown()) {
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                row.child(format(row.data())).show();
                tr.addClass('shown');
            }
        });

        $('#weather-filter').change( function() {
            table.draw();
        });

        $('#habitat-filter').change( function() {
            table.draw();
        });

        $('#activity-filter').change( function() {
            table.draw();
        });

        // $("#latitude-filter").ionRangeSlider({
        //     type: "double",
        //     min: -0.5119,
        //     max: -0.22335,
        //     from: -0.5119,
        //     to: -0.22335,
        //     step: 0.015,
        //     grid: true,
        //     onChange: function (data) {
        //         table.draw();
        //     }
        // });
        //
        // $("#longitude-filter").ionRangeSlider({
        //     type: "double",
        //     min: 35.8,
        //     max: 36.9,
        //     from: 36.0917,
        //     to: 36.7257,
        //     step: 0.0317,
        //     grid: true,
        //     onChange: function (data) {
        //         table.draw();
        //     }
        // });

        $("#juv-count").ionRangeSlider({
            type: "double",
            min: 0,
            max: 20,
            from: 0,
            to: 20,
            grid: true,
            onChange: function (data) {
                table.draw();
            }
        });

        $("#male-a-count").ionRangeSlider({
            type: "double",
            min: 0,
            max: 20,
            from: 0,
            to: 20,
            grid: true,
            onChange: function (data) {
                table.draw();
            }
        });

        $("#male-sa-count").ionRangeSlider({
            type: "double",
            min: 0,
            max: 20,
            from: 0,
            to: 20,
            grid: true,
            onChange: function (data) {
                table.draw();
            }
        });

        $("#female-a-count").ionRangeSlider({
            type: "double",
            min: 0,
            max: 20,
            from: 0,
            to: 20,
            grid: true,
            onChange: function (data) {
                table.draw();
            }
        });

        $("#female-sa-count").ionRangeSlider({
            type: "double",
            min: 0,
            max: 20,
            from: 0,
            to: 20,
            grid: true,
            onChange: function (data) {
                table.draw();
            }
        });

        $("#total-count").ionRangeSlider({
            type: "double",
            min: 0,
            max: 50,
            from: 0,
            to: 50,
            grid: true,
            onChange: function (data) {
                table.draw();
            }
        });

        $("#unidentified-count").ionRangeSlider({
            type: "double",
            min: 0,
            max: 50,
            from: 0,
            to: 50,
            grid: true,
            onChange: function (data) {
                table.draw();
            }
        });

        $('#latitude-filter').keyup( function() {
            table.draw();
        } );

    });


});
