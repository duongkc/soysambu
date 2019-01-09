$(document).ready(function () {
    $.getJSON('records', function(records) {
        console.log(records);
        var view_records = '';
        $.each(records, function(key, value){
            view_records += '<tr>';
            view_records += '<td>' + value.date + '</td>';
            view_records += '<td>' + value.time + '</td>';
            view_records += '<td>' + value.count + '</td>';
            view_records += '</tr>';
        });
        $('#records_table').append(view_records);
    });
});