$(document).ready(function () {
    // Initiate datepicker plugin for date input.
    $('#datepicker').datepicker({
        format: 'yyyy/mm/dd',
        todayHighlight: true,
        autoclose: true,
        showOnFocus: false
    });

    // Set current date as default value for date field.
    $('#datepicker').datepicker('update', new Date());

    // Set current time as default value for time field.
    // Function to add a zero when hours/minutes are in single digits.
    function addZero(time) {
        if (time < 10) { time = "0" + time; }
        return time;
    }
    var date = new Date($.now());
    var time = addZero(date.getHours()) + ":" + addZero(date.getMinutes());
    $('#time').val(time)
});