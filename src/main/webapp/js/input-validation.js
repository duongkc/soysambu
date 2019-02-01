$(document).ready(function () {
    /*** FUNCTIONS - DATE ***/
    /** Function to convert [yyyy-m-d date formatting to yyyy-mm-dd | yyyy/mm/dd formatting to yyyy-mm-dd]. */
    function convertDate() {
        /* Regex will match either '-' or '/'. */
        let d = $(this).val().split(/[-\/]/);

        if (d.length === 3 && !d.some(isNaN)) {
            let year = d[0];
            let month = d[1];
            let day = d[2];

            /* Add zero if month or day is in the single digits. */
            if (month.length < 2 && month !== 0) month = '0' + month;
            if (day.length < 2 && day !== 0) day = '0' + day;

            d = year + '-' + month +  '-' + day;
            /* Set newly parsed date as input value. */
            $(this).val(d);
        }

        /* Check validation with JQuery validator after date is converted. */
        $('#date').valid();
    }

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

    /** Function that converts HHmm time formatting to HH:mm. */
    function convertTime () {
        let time = $(this).val();

        if (time.length === 4 && !isNaN(time)) {
            let hours = time.slice(0,2);
            let mins = time.slice(2,4);

            $(this).val(hours + ':' + mins);
        }
    }

    /*** FUNCTIONS - COORDINATES ***/
    /** Function that converts commas in coordinates to dots and removes prepended or appended zeros. */
    function convertCoord () {
        let coord = $(this).val();

        if (!isNaN(parseFloat(coord))) {
            /* Replace any commas present with dots. */
            coord = coord.replace(/,\s+/g, '.');
            /* Remove any prepended or appended zeros. */
            coord = parseFloat(coord);

            $(this).val(parseFloat(coord).toFixed(4));
            $(this).valid()
        }
    }

    /*** FUNCTIONS - GIRAFFE COUNTS ***/
    /** Function to change a giraffe counter after input from corresponding - and + buttons. */
    function updateGiraffeCount(){
        /* Get button's corresponding input field and button type (-+). */
        let dataField = $(this).attr('data-field');
        let type = $(this).attr('data-type');
        let input = $('input[name="'+dataField+'"]');
        /* Get current val of inout field. */
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

    /** Function to remove whitespace, prepended zeros.
     *  Sets values to max or min value when input value out of range.
     */
    function convertGiraffeCount() {
        const name = $(this).attr('name');
        /* Converts counter's value to a number, also removes whitespace. */
        let currentVal = Number($(this).val().replace(/\s+/g, ''));
        /* Set value with removed whitespace as current value. */
        $(this).val(currentVal);

        /* Check if previously parsed currentVal returns NaN, if so set input field value to 0. */
        if (isNaN(currentVal) || !isFinite(currentVal)) {
            // Enable plus button and disable min button for input field.
            $('.btn-plusmin[data-type="plus"][data-field="' + name + '"]').attr('disabled', false);
            $('.btn-plusmin[data-type="minus"][data-field="' + name + '"]').attr('disabled', true);
            $(this).val(0);

            /* Update total giraffe count. */
            updateOrganismTotal();
            /* Let updated count be validated by JQuery Validator */
            $('#form-addrecord').valid();

            return
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
        if (currentVal < maxValue) {
            $('.btn-plusmin[data-type="plus"][data-field="' + name + '"]').attr('disabled', false);
        } else if (currentVal >= maxValue) {
            $('.btn-plusmin[data-type="plus"][data-field="' + name + '"]').attr('disabled', true);
            $(this).val(maxValue);
        }
        /* Update total giraffe count. */
        updateOrganismTotal();
    }

    /** Function to update total number of organisms, by summing all organism count fields. */
    function updateOrganismTotal() {
        let sum = 0;

        $('.giraffe-count').each(function(){
            sum += +$(this).val();
        });
        $('#count-total').empty().append(sum);
    }

    /** Function to enable or disable the submit button based on form validity */
    function toggleSubmit() {
        if (validator.checkForm()) {
            $('#submit').prop('disabled', false);
        } else {
            $('#submit').prop('disabled', true);
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

    /* Initiate validating form. */
    validator = $('#form-addrecord').validate({
        onkeyup: false,
        groups: {
            coords: "longitude latitude"
        },
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
                error.insertBefore($('.organism-counter').parents('.form-row'));
            } else {
                /* Place error after form row containing input field. */
                error.insertAfter(element.parents('.form-row'));
            }
        },
        submitHandler: function(form) {
            /* Serialize all input values of the form. */
            let data = $(form).serialize();

            /* Lock content behind a absolute div covering the page body. */
            $('#page').append('<div id="submit-lock" style="display: none;"></div>');
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
                    $('.giraffe-count').each(convertGiraffeCount);

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

    /* Add rules for giraffe tab validation. */
    if ($('#giraffes').hasClass('active')) {
        /* For every counter add them to the giraffes group and add minGroupSize validation rule. */
        $('.giraffe-count').each(function () {
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


    /*** EVENT LISTENERS - DATE ***/
    /* Hide tooltip when calendar is opened. */
    $('#calendar').click( function () {
        $(this).tooltip('hide');
    });
    /* Convert manual date input, yyyy-m-d will be converted to yyyy-mm-dd. */
    $('#date').change(convertDate);

    /*** EVENT LISTENERS - COORDINATES ***/
    /* Convert commas (36,55) to points (36.55) and remove prepended or appended zeros. */
    $('#longitude').focusout(convertCoord);
    $('#latitude').focusout(convertCoord);

    /*** EVENT LISTENERS - TIME ***/
    /* Set current time when settime button is pressed. */
    $('#settime').click(setTime);
    /* Convert manual time input, Hhmm will be converted to HH:mm. */
    $('#time').focusout(convertTime);

    /*** EVENT LISTENERS - GIRAFFE COUNT ***/
    /* Convert change in giraffe count field; assists user when invalid values are given. */
    $('.giraffe-count').change(convertGiraffeCount);
    $('.giraffe-count').change(function (){
        /* Validate each giraffe count field. */
        $('.giraffe-count').each(function() {
            $(this).valid() });
    });
    /* Update giraffe count field when its + or - buttons are pressed. */
    $('.btn-plusmin').click(updateGiraffeCount);

    /*** EVENT LISTENERS - JQUERY VALIDATOR ***/
    /* On key-release, clicks and focus-out events check the entire form.
       If valid enable the submit button, when invalid disable the submit button. */
    $('#form-addrecord').on('keyup click blur', toggleSubmit);
});