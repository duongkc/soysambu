$(document).ready(function () {
    // Initiate datepicker plugin for date input.
    $('#datepicker').datepicker({
        format: 'yyyy/mm/dd',
        todayHighlight: true,
        autoclose: true,
        showOnFocus: false
    });
    // Set current date as default value for date group.
    $('#datepicker').datepicker('update', new Date());
});