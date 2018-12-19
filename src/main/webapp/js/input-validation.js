$(document).ready(function () {
    /* Function to get the current time in HH:mm format. */
    function setTime() {
        var date = new Date($.now());
        var time = addZero(date.getHours()) + ":" + addZero(date.getMinutes());

        $('#time').val(time);
        // Check validation with JQuery validator after time is converted.
        $('#time').valid();
    }

    /* Function to add a zero when hours/minutes are in single digits when acquired through JS. */
    function addZero(time) {
        if (time < 10) { time = "0" + time; }
        return time;
    }

    /* Function to change giraffe counter after input from corresponding - + buttons. */
    function updateGiraffeCount(){
        // Get button's corresponding input field and button type (-+).
        var dataField = $(this).attr('data-field');
        var type      = $(this).attr('data-type');
        var input = $("input[name='"+dataField+"']");
        // Get current val of inout field.
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
    }

    /* Function to validate giraffe counters. */
    function validateGiraffeCount() {
        var name = $(this).attr('name');
        // Converts counter's value to a number, also removes whitespace.
        var currentVal = Number($(this).val().replace(/\s+/g, ''));
        // Remove whitespace from input field.
        $(this).val(currentVal);

        // Check if previously parsed currentVal returns NaN, if so set input field value to 0.
        if (isNaN(currentVal) || !isFinite(currentVal)) {
            // Enable plus button and disable min button for input field.
            $(".btn-plusmin[data-type='plus'][data-field='" + name + "']").attr('disabled', false);
            $(".btn-plusmin[data-type='minus'][data-field='" + name + "']").attr('disabled', true);

            $(this).val(0);
            updateOrganismTotal();
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
            $(this).val(minValue);
        }

        // Check if max value rule is followed, if not set value to max value,  disable max button.
        if (currentVal < maxValue) {
            $(".btn-plusmin[data-type='plus'][data-field='" + name + "']").attr('disabled', false);
        } else if (currentVal >= maxValue) {
            $(".btn-plusmin[data-type='plus'][data-field='" + name + "']").attr('disabled', true);
            $(this).val(maxValue);
        }

        // Update total giraffe count.
        updateOrganismTotal();
    };

    /* Function to update total number of giraffes, by summing all giraffe count fields. */
    function updateOrganismTotal() {
        var sum = 0;
        $(".giraffe-count").each(function(){
            sum += +$(this).val();
        });
        $('#count-total').empty();
        $('#count-total').append(sum);
    }

    /* Function to convert (yyyy-m-d date formatting to yyyy-mm-dd) (yyyy/mm/dd formatting to yyyy-mm-dd) */
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

            d = year + '-' + month +  '-' + day
            $(this).val(d);
        }

        // Check validation with JQuery validator after date is converted.
        $('#date').valid();
    }

    /* Function that converts HHmm time formatting to HH:mm */
    function convertTime () {
        var time = $(this).val()

        if (time.length == 4 && !isNaN(time)) {
            var hours = time.slice(0,2);
            var mins = time.slice(2,4);

            $(this).val(hours + ':' + mins);
        }
    }


    /* ----- VALIDATION ----- */
    // Validate change in giraffe count field, assists user when invalid values are given.
    $('.giraffe-count').change(validateGiraffeCount);
    // Convert manual date input, yyyy-m-d will be converted to yyyy-mm-dd.
    $('#date').change(convertDate);
    // Convert manual time input, Hhmm will be converted to HH:mm.
    $('#time').focusout(convertTime);
    // Validate giraffe counters when -+ buttons are pressed.
    $('.giraffe-count').change(function () {
        $('#form-addrecord').valid();
    });

    /* JQuery Validator Plugin */
    /* Sighting form validation */
    // Change message of the valid date rule.
    $.validator.messages.date = 'Please enter a valid date in year-month-day format, e.g. 2018-06-17';
    // Add rule to only allow dates following ISO-8601 standards.
    $.validator.addMethod('dateFormat',
        function(value) {
            // yyyy-mm-dd or yyyy-m-d
            const re = /^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}$/;
            return re.test(value);
        },'Please enter a valid date in year-month-day format, e.g. 2018-06-17'
    );
    // Add rule to only allow military (24h) time.
    $.validator.addMethod('timeFormat',
        function(value) {
            // hh:mm or hhmm
            const re = /^([01]\d|2[0-3]):?([0-5]\d)$/;
            return re.test(value);
        },'Time must be given in military time (24h), e.g. 15:20'
    );
    // Add rule to only allow organism groups with more than 1 animal.
    $.validator.addMethod('minGroupSize',
        function(value, element) {
            var sum = 0;
            var elementDataType = $(element).attr("data-type");

            // For every input element with data-type of the same type of the given element,
            // add input element's value to sum of all elements of its type.
            $('input[data-type="' + elementDataType + '"').each( function () {
                    sum += $(this).val();
                }
            );

            return (sum > 0);
        }
    );

    // Initiate validating add-record form.
    validator = $('#form-addrecord').validate({
        onkeyup: false,
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
        errorPlacement: function(error, element) {
            if (element.attr("data-type") == "count") {
                // Place errors before total organism counter.
                error.insertBefore($('.organism-counter').parents('.form-row'));
            } else {
                // Place error after form row containing input field.
                error.insertAfter(element.parents('.form-row'));
            }
        }
    });

    // Add rules for giraffe tab validation.
    if ($('#giraffes').hasClass('active')) {
        // For every counter add them to the giraffes group and add minGroupSize validation rule.
        $('.giraffe-count').each(function () {
            var name = $(this).attr('name');
            validator.groups[name] = 'giraffes';

            $('#' + name).rules('add', {
                minGroupSize: true,
                messages: {
                    minGroupSize: "Giraffe group sightings should contain at least 1 giraffe"
                }
            });
        });
    }

    // On key-release, clicks and focus-out events check the entire form.
    // If valid enable the submit button, when invalid disable the submit button.
    $('#form-addrecord').on('keyup click blur', function() {
        if (validator.checkForm()) {
            $('#submit').prop('disabled', false);
        } else {
            $('#submit').prop('disabled', true);
        }
    });

    /* ----- INITIALIZATION ----- */
    /* Datepicker */
    $('#datepicker').datepicker({
        format: 'yyyy-mm-dd',
        endDate: '0d',
        forceparse: true,
        todayHighlight: true,
        autoclose: true,
        showOnFocus: false,
        todayBtn: "linked"
    });
    // Set current date as default value for date field.
    $('#datepicker').datepicker('setDate', 'now');
    // Hide tooltip when calendar is opened.
    $('#calendar').click( function () {
        $(this).tooltip('hide')
    });
    /* Time input */
    // Set current time as default value for time field.
    setTime();
    // Set current time when settime button is pressed.
    $('#settime').click(setTime);

    /* Giraffe count buttons (-+) */
    // Update giraffe count field.
    $('.btn-plusmin').click(updateGiraffeCount);
});