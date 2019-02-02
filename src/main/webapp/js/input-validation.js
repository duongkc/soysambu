$(document).ready(function () {
    /*** FUNCTIONS - TIME ***/
    /** Function to get the current time in HH:mm format and set it as the default value. */
    function setTime() {
        const date = new Date($.now());
        let time = addZero(date.getHours()) + ':' + addZero(date.getMinutes());

        /* Set new time value; Check validation with JQuery validator after time is converted. */
        $('#time').val(time).valid();
    }

    /** Function to add a zero when hours/minutes are in single digits when acquired through JS.
     *  @param {number} time - The time previously generated and spliced by JavaScript
     *  @returns {number} time - The time with optional added zero when argument was in single digits.
     */
    function addZero(time) {
        if (time < 10) { time = '0' + time; }
        return time;
    }

    /*** FUNCTIONS - COUNTS ***/
    /** Function to change an organism counter after input from corresponding - and + buttons. */
    function updateCounter(){
        /* Get button's corresponding input field and button type (-+). */
        let dataField = $(this).attr('data-field');
        let type = $(this).attr('data-type');
        let input = $('input[name="'+dataField+'"]');
        /* Get current value of input field. */
        let currentVal = parseInt(input.val());

        /* Add or subtract 1 for min or max buttons respectively. */
        if(type === 'minus') {
            if(currentVal > input.attr('min')) {
                input.val(currentVal - 1).change();
            }
        } else if(type === 'plus') {
            if(currentVal < input.attr('max')) {
                input.val(currentVal + 1).change();
            }
        }
    }

    /** Function to remove whitespace and prepended zeros in organism counters.
     *  Sets values to max or min value when input value out of range.
     */
    function standardizeOrganismCounter() {
        const name = $(this).attr('name');
        /* Converts counter's value to a number, also removes whitespace. */
        let currentVal = Number($(this).val().replace(/\s+/g, ''));

        /* Check if previously parsed currentVal returns NaN, if so set input field value to 0. */
        if (isNaN(currentVal) || !isFinite(currentVal)) {
            /* Enable plus button and disable min button for input field and set counter value to 0. */
            $('.btn-plusmin[data-type="plus"][data-field="' + name + '"]').attr('disabled', false);
            $('.btn-plusmin[data-type="minus"][data-field="' + name + '"]').attr('disabled', true);
            $(this).val(0);

            /* Update total giraffe count. */
            updateOrganismTotal();
            /* Let updated count be validated by JQuery Validator */
            $('#form-addsighting').valid();

            return;
        }

        /* Check if current value is a float, if so round down to an integer. */
        if (currentVal % 1 !== 0) {
            currentVal = Math.floor(currentVal);
            $(this).val(currentVal);
        }

        const minValue = parseInt($(this).attr('min'));
        const maxValue = parseInt($(this).attr('max'));

        /* Check if min value rule is followed, if not set value to min value,  disable min button. */
        if (currentVal > minValue) {
            $('.btn-plusmin[data-type="minus"][data-field="' + name + '"]').attr('disabled', false);
        } else if (currentVal <= minValue) {
            $('.btn-plusmin[data-type="minus"][data-field="' + name + '"]').attr('disabled', true);
            $(this).val(minValue);
        }
        /* Check if max value rule is followed, if not set value to max value,  disable max button. */
        else if (currentVal < maxValue) {
            $('.btn-plusmin[data-type="plus"][data-field="' + name + '"]').attr('disabled', false);
        } else if (currentVal >= maxValue) {
            $('.btn-plusmin[data-type="plus"][data-field="' + name + '"]').attr('disabled', true);
            $(this).val(maxValue);
        }
        else {
            /* Set value with removed whitespace as current value. */
            $(this).val(currentVal);
        }

        /* Update total giraffe count. */
        updateOrganismTotal();
    }

    /** Function to update total number of organisms, by summing all organism count fields. */
    function updateOrganismTotal() {
        let sum = 0;
        $('.organism-counter').each(function(){
            sum += +$(this).val();
        });
        $('#count-total').empty().append(sum);
    }

    /** Function to enable or disable the submit button based on form validity */
    function toggleSubmit() {
        if (validator.checkForm()) {
            $('#form-addsighting-submit').prop('disabled', false);
        } else {
            $('#form-addsighting-submit').prop('disabled', true);
        }
    }


    /*** JQUERY VALIDATOR ***/
    /* Change message of the valid date rule. */
    $.validator.messages.date = 'Please enter a valid date in year-month-day format, e.g. 2018-06-17';

    /* Add rule to only allow dates following ISO-8601 standards. */
    $.validator.addMethod('dateFormat',
        function(value) {
            /* yyyy-mm-dd or yyyy-m-d */
            const re = /^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}$/;
            return re.test(value);
        },'Please enter a valid date in year-month-day format, e.g. 2018-06-17'
    );
    /* Add rule to only allow military (24h) time. */
    $.validator.addMethod('timeFormat',
        function(value) {
            // hh:mm or hhmm
            const re = /^([01]\d|2[0-3]):?([0-5]\d)$/;
            return re.test(value);
        },'Time must be given in military time (24h), e.g. 15:20'
    );
    /* Add rule to only allow numbers separated by dots in coordinate fields. */
    $.validator.addMethod('coordFormat',
        function(value) {
            // [d] or [d].[d]
            const re = /^\-?\d+(\.\d+)?$/;
            return re.test(value);
        },'Coordinates must be numeric, e.g. 35.11'
    );
    /* Add rule to only allow organism groups with more than 1 animal. */
    $.validator.addMethod('minGroupSize',
        function(value, element) {
            let sum = 0;
            let elementDataType = $(element).attr('data-type');

            /* For every input element with data-type of the same type of the given element,
               add input element's value to sum of all elements of its type. */
            $('input[data-type="' + elementDataType + '"').each( function () {
                    sum += $(this).val();
            });

            return (sum > 0);
        }
    );

    /* Initiate validating add sighting form. */
    let validator = $('#form-addsighting').validate({
        onkeyup: false,
        groups: { coords: "longitude latitude" },
        rules: {
            date: {
                required: true,
                date: true,
                dateFormat: true
            },
            time: {
                required: true,
                timeFormat: true
            },
            longitude: {
                required: true,
                coordFormat: true
            },
            latitude: {
                required: true,
                coordFormat: true
            }
        },
        /* Highlight: add styling to input fields that contain errors. */
        highlight: function(element) {
            let formGroup = $(element.closest('.form-group'));
            formGroup.addClass('has-error');
        },
        /* Unhighlight: remove previously applied styling when errors are absent. */
        unhighlight: function(element) {
            let formGroup = $(element.closest('.form-group'));
            formGroup.removeClass('has-error');
        },
        errorPlacement: function(error, element) {
            if (element.attr('data-type') === 'count') {
                /* Place errors before total organism counter. */
                $('#tab-giraffes').append(error);
            } else {
                /* Place error after form row containing input field. */
                error.insertAfter(element.parents('.form-row'));
            }
        },
        submitHandler: function(form) {
            /* Serialize all input values of the form. */
            let data = $(form).serialize();

            /* Lock content behind an absolute submit-lock div covering the content div. */
            $('#content').append('<div id="submit-lock" style="display: none;"></div>');
            $('#submit-lock').animate({height: "show"});

            /* Post a new record to the database using ajax. */
            $.ajax({
                url: "submitservlet",
                type: "POST",
                data: data,
                success: function(){
                    /* Clear form and disable submit button. */
                    $(form)[0].reset();
                    toggleSubmit();
                    /* Set new default values. */
                    $('#datepicker').datepicker('setDate', 'now');
                    setTime();
                    /* Update dynamic giraffe count properties. */
                    $('.organism-counter').each(standardizeOrganismCounter);

                    /* Lift content lock after a short delay. */
                    $('#submit-lock').delay(1000).animate({
                        top: "+=100%",
                        height: "hide"
                    }).promise().done(function(){
                        $('#submit-lock').remove()
                    });
                }
            });
        }
    });

    /*** JQUERY VALIDATOR - ORGANISM TAB VALIDATIONS ***/
    /* Add rules for giraffe tab validation. */
    if ($('#tab-giraffes').hasClass('active')) {
        /* For every counter add them to the giraffes group and add minGroupSize validation rule. */
        $('.organism-counter').each(function () {
            const name = $(this).attr('name');
            validator.groups[name] = 'giraffes';

            $('#' + name).rules('add', {
                minGroupSize: true,
                messages: {
                    minGroupSize: 'Giraffe group sightings should contain at least 1 giraffe'
                }
            });
        });
    }

    /*** INPUT VALUE INITIALIZATION - DATEPICKER ***/
    $('#datepicker').datepicker({
        format: 'yyyy-mm-dd',
        endDate: '0d',
        forceparse: true,
        todayHighlight: true,
        autoclose: true,
        showOnFocus: false,
        todayBtn: 'linked'
    });
    /* Set current date as default value for date field. */
    $('#datepicker').datepicker('setDate', 'now');

    /*** INPUT VALUE INITIALIZATION - TIME ***/
    /* Set current time as default value for time field. */
    setTime();

    /*** EVENT LISTENERS - TIME ***/
    /* Set current time when settime button is pressed. */
    $('#settime').click(setTime);

    /*** EVENT LISTENERS - COUNTERS ***/
    /* Convert change in giraffe count field; assists user when invalid values are given. */
    $('.organism-counter').change(function() {
        /* Validate each counter */
        $('.organism-counter').each(function() {$(this).valid();});
    });
    $('.organism-counter').change(standardizeOrganismCounter);
    /* Update giraffe count field when its + or - buttons are pressed. */
    $('.btn-plusmin').click(updateCounter);

    /*** EVENT LISTENERS - JQUERY VALIDATOR ***/
    /* On key-release, clicks and focus-out events check the entire form.
       If valid enable the submit button, when invalid disable the submit button. */
    $('#form-addsighting').on('keyup click blur', toggleSubmit);
});