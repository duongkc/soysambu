function convertDate() {
    // Regex will match either '-' or '/'.
    var d = $(this).val().split(/[-\/]/);

    if (d.length == 3 && !d.some(isNaN)) {
        var year = d[0];
        var month = d[1];
        var day = d[2];

        // Add zero if month or day is in the single digits.
        if (month.length < 2 && month != 0) month = '0' + month;
        if (day.length < 2 && day != 0) day = '0' + day;

        d = year + '-' + month +  '-' + day;
        $(this).val(d);
    }

    // Check validation with JQuery validator after date is converted.
    //$('#date').valid();
}


$.fn.dataTable.ext.search.push(
    function(settings, records) {
        var minDate = Date.parse($('#date-filter-from').val());
        var maxDate = Date.parse($('#date-filter-to').val());
        var date = Date.parse(records[1]);

        if(minDate && !isNaN(minDate)) {
            if(date < minDate) {
                return false;
            }
        }
        if(maxDate && !isNaN(maxDate)) {
            if(date > maxDate) {
                return false;
            }
        }
        return true;
    }
);

$.fn.dataTable.ext.search.push(
    function(settings, records) {
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
    function(settings, records) {
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
    function(settings, records) {
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
    function(settings, records) {
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
    function(settings, records) {
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
    function(settings, records) {
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
    function(settings, records) {
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
    function(settings, records) {
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
    function(settings, records) {
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
    function(settings, records) {
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

function getMax(dataList, attribute) {
    var max;
    for (var i=0 ; i<dataList.length ; i++) {
        if (!max || parseInt(dataList[i][attribute]) > parseInt(max[attribute]))
            max = dataList[i];
    }
    return max;
}

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

        $("#juv-count").ionRangeSlider({
            type: "double",
            min: 0,
            max: getMax(records, "juvenile").juvenile,
            from: 0,
            to: getMax(records, "juvenile").juvenile,
            grid: true,
            onChange: function (data) {
                table.draw();
            }
        });

        $("#male-a-count").ionRangeSlider({
            type: "double",
            min: 0,
            max: getMax(records, "male_adult").male_adult,
            from: 0,
            to: getMax(records, "male_adult").male_adult,
            grid: true,
            onChange: function (data) {
                table.draw();
            }
        });

        $("#male-sa-count").ionRangeSlider({
            type: "double",
            min: 0,
            max: getMax(records, "male_subadult").male_subadult,
            from: 0,
            to: getMax(records, "male_subadult").male_subadult,
            grid: true,
            onChange: function (data) {
                table.draw();
            }
        });

        $("#female-a-count").ionRangeSlider({
            type: "double",
            min: 0,
            max: getMax(records, "female_adult").female_adult,
            from: 0,
            to: getMax(records, "female_adult").female_adult,
            grid: true,
            onChange: function (data) {
                table.draw();
            }
        });

        $("#female-sa-count").ionRangeSlider({
            type: "double",
            min: 0,
            max: getMax(records, "female_subadult").female_subadult,
            from: 0,
            to: getMax(records, "female_subadult").female_subadult,
            grid: true,
            onChange: function (data) {
                table.draw();
            }
        });

        var a = $("#total-count").ionRangeSlider({
            type: "double",
            min: 0,
            max: getMax(records, "count").count,
            from: 0,
            to: getMax(records, "count").count,
            grid: true,
            onChange: function (data) {
                table.draw();
            }
        });

        $("#unidentified-count").ionRangeSlider({
            type: "double",
            min: 0,
            max: getMax(records, "unidentified").unidentified,
            from: 0,
            to: getMax(records, "unidentified").unidentified,
            grid: true,
            onChange: function (data) {
                table.draw();
            }
        });

        $("#datepicker-from").datepicker({
            format: 'yyyy-mm-dd',
            endDate: '0d',
            forceparse: true,
            todayHighlight: true,
            autoclose: true,
            showOnFocus: false,
            todayBtn: "linked"
        }).on("change", function() {
            table.draw();
        });
        $('#datepicker-from').datepicker('setDate', '2017-10-02');
        $('#datepicker-from').change(convertDate);
        $('#calendar-from').click( function () {
            $(this).tooltip('hide')
        });


        $("#datepicker-to").datepicker({
            format: 'yyyy-mm-dd',
            endDate: '0d',
            forceparse: true,
            todayHighlight: true,
            autoclose: true,
            showOnFocus: false,
            todayBtn: "linked"
        }).on("change", function() {
            table.draw();
        });
        $('#datepicker-to').change(convertDate);
        $('#datepicker-to').datepicker('setDate', 'now');
        $('#calendar-to').click( function () {
            $(this).tooltip('hide')
        });

        $('#reset-btn').click(function(){

            $('#weather-filter').val(" ");
            $('#habitat-filter').val(" ");
            $('#activity-filter').val(" ");
            $('#datepicker-from').datepicker('setDate', '2017-10-02');
            $('#datepicker-to').datepicker('setDate', 'now');
            $('#total-count').data("ionRangeSlider").update({
                from: 0,
                to: getMax(records, "count").count
            });
            $('#female-a-count').data("ionRangeSlider").update({
                from: 0,
                to: getMax(records, "female_adult").female_adult
            });
            $('#female-sa-count').data("ionRangeSlider").update({
                from: 0,
                to: getMax(records, "female_subadult").female_subadult
            });
            $('#male-a-count').data("ionRangeSlider").update({
                from: 0,
                to: getMax(records, "male_adult").male_adult
            });
            $('#male-sa-count').data("ionRangeSlider").update({
                from: 0,
                to: getMax(records, "male_subadult").male_subadult
            });
            $('#juv-count').data("ionRangeSlider").update({
                from: 0,
                to: getMax(records, "juvenile").juvenile
            });
            $('#unidentified-count').data("ionRangeSlider").update({
                from: 0,
                to: getMax(records, "unidentified").unidentified
            });
            table.draw();
            window.scrollTo(0,0);
        });
    });
});
