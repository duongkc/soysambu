$(document).ready(function () {
    $.getJSON('records', function(records) {
        var view_records = '<tbody class="table-scroll">';
        $.each(records, function(key, value){
            view_records += '<tr>';
            view_records += '<td>' + value.date + '</td>';
            view_records += '<td>' + value.time + '</td>';
            view_records += '<td>' + value.count + '</td>';
            view_records += '</tr>';
        });
        view_records += '</tbody>';
        $('#records_table').append(view_records);
    });
});