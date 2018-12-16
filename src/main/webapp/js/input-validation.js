$(document).ready(function () {
    /* Function to get the current time in HH:mm format. */
    function getTime() {
        var date = new Date($.now());
        var time = addZero(date.getHours()) + ":" + addZero(date.getMinutes());
        return time;
    };

    /* Function to add a zero when hours/minutes are in single digits when acquired through JS. */
    function addZero(time) {
        if (time < 10) { time = "0" + time; }
        return time;
    };

    /* Function to change giraffe counter after input from corresponding - + buttons. */
    function updateGiraffeCount(){
        // Get button's corresponding input field and button type (-+).
        var dataField = $(this).attr('data-field');
        var type      = $(this).attr('data-type');
        var input = $("input[name='"+dataField+"']");
        var currentVal = parseInt(input.val());

        // Add or subtract 1 for min or max buttons respectively.
        if(type == 'minus') {
            if(currentVal > input.attr('min')) {
                input.val(currentVal - 1).change();
            }
        } else if(type == 'plus') {
            if(currentVal < input.attr('max')) {
                input.val(currentVal + 1).change();
            }
        }
    };

    /* Function to validate giraffe counters. */
    function validateGiraffeCount() {
        var name = $(this).attr('name');
        var currentVal = Number($(this).val());

        // Check if previously parsed currentVal returns NaN, if so set input field value to 0.
        if (isNaN(currentVal) || !isFinite(currentVal)) {
            // Enable plus button and disable min button for input field.
            $(".btn-plusmin[data-type='plus'][data-field='" + name + "']").attr('disabled', false);
            $(".btn-plusmin[data-type='minus'][data-field='" + name + "']").attr('disabled', true);

            $(this).val(0);
            updateGiraffeTotal();
            return;
        }

        // Check if current value is a float, if so round down to an integer.
        if (currentVal % 1 != 0) {
            currentVal = Math.floor(currentVal);
            $(this).val(currentVal);
        }

        var minValue = parseInt($(this).attr('min'));
        var maxValue = parseInt($(this).attr('max'));

        // Check if min value rule is followed, if not set value to min value,  disable min button.
        if (currentVal > minValue) {
            $(".btn-plusmin[data-type='minus'][data-field='" + name + "']").attr('disabled', false);
        } else if (currentVal <= minValue) {
            $(".btn-plusmin[data-type='minus'][data-field='" + name + "']").attr('disabled', true);
            $(this).val(0);
        }

        // Check if max value rule is followed, if not set value to max value,  disable max button.
        if (currentVal < maxValue) {
            $(".btn-plusmin[data-type='plus'][data-field='" + name + "']").attr('disabled', false);
        } else if (currentVal >= maxValue) {
            $(".btn-plusmin[data-type='plus'][data-field='" + name + "']").attr('disabled', true);
            $(this).val(100);
        }

        updateGiraffeTotal();
    };

    /* Function to update total number of giraffes, by summing all giraffe count fields. */
    function updateGiraffeTotal() {
        var sum = 0;
        $(".giraffe-count").each(function(){
            sum += +$(this).val();
        });
        $('#giraffe-count-total').empty();
        $('#giraffe-count-total').append(sum);
    };

    /* Function to convert yyyy-m-d date formatting to yyyy-mm-dd */
    function convertDate() {
        var d = $(this).val().split('-');

        if (d.length == 3 && !d.some(isNaN)) {
            var year = d[0];
            var month = d[1];
            var day = d[2];

            if (month.length < 2 && month != 0) month = '0' + month;
            if (day.length < 2 && day != 0) day = '0' + day;

            d = year + '-' + month +  '-' + day
            $(this).val(d);
        }

        // Check validation after date is converted.
        $('#form-sighting').valid();
    };

    /* Function that converts HHmm time formatting to HH:mm */
    function convertTime () {
        var time = $(this).val()

        if (time.length == 4 && !isNaN(time)) {
            var hours = time.slice(0,2);
            var mins = time.slice(2,4);

            $(this).val(hours + ':' + mins);
        }
    }


    /* ----- INITIALIZATION ----- */
    /* Datepicker */
    $('#datepicker').datepicker({
        format: 'yyyy-mm-dd',
        endDate: '0d',
        forceparse: true,
        todayHighlight: true,
        autoclose: true,
        showOnFocus: false
    });
    // Set current date as default value for date field.
    $('#datepicker').datepicker('setDate', 'now');

    /* Time input */
    // Set current time as default value for time field.
    $('#time').val(getTime());
    // Set current time when settime button is pressed.
    $('#settime').click(function () {
        $('#time').val(getTime())
    });

    /* Giraffe count buttons (-+) */
    // Update giraffe count field.
    $('.btn-plusmin').click(updateGiraffeCount);


    /* ----- VALIDATION ----- */
    // Validate change in giraffe count field, assists user when invalid values are given.
    $('.giraffe-count').change(validateGiraffeCount);
    // Convert manual date input, yyyy-m-d will be converted to yyyy-mm-dd.
    $('#date').change(convertDate);
    // Convert manual time input, Hhmm will be converted to HH:mm.
    $('#time').focusout(convertTime);

    /* JQuery Validator Plugin */
    // Change message of the valid date rule.
    $.validator.messages.required = 'Please enter a valid date in year-month-day format, e.g. 2018-06-17';
    // Add rule to only allow dates following ISO-8601 standards.
    $.validator.addMethod('dateFormat',
        function(value) {
            // yyyy-mm-dd or yyyy-m-d
            const re = /^\d{4}-\d{1,2}-\d{1,2}$/;
            return re.test(value);
        },'Date must be given in a year-month-day format, e.g. 2018-06-17'
    );
    // Add rule to only allow military (24h) time.
    $.validator.addMethod('timeFormat',
        function(value) {
            // hh:mm or hhmm
            const re = /^([01]\d|2[0-3]):?([0-5]\d)$/;
            return re.test(value);
        },'Time must be given in military time (24h), e.g. 15:20'
    );

    // Initiate validating form-sighting form.
    $('#form-sighting').validate({
        rules: {
            date: {
                required: true,
                date: true,
                dateFormat: true
            },
            time: {
                required: true,
                timeFormat: true
            }
        },
        // Highlight: add styling to input fields that contain errors.
        highlight: function(element) {
            formGroup = $(element.closest('.form-group'));
            formGroup.addClass('has-error');
        },
        // Unhighlight: remove previously applied styling when errors are absent.
        unhighlight: function(element) {
            formGroup = $(element.closest('.form-group'));
            formGroup.removeClass('has-error');
        },
        // Place error after form row containing input field.
        errorPlacement: function(error, element) {
            error.insertAfter(element.parents('.form-row'));
        }
    })
});