$(document).ready(function () {
    /* --- Sighting Input Fields --- */
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


    /* --- Giraffe Input Fields --- */
    // Update total number of giraffes, by summing all giraffe count fields.
    // Giraffe count buttons (-+).
    $('.btn-number').click(function(e){
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
    });

    // Validate count inputs.
    $('.giraffe-count').change(function() {
        var name = $(this).attr('name');
        var minValue =  parseInt($(this).attr('min'));
        var maxValue =  parseInt($(this).attr('max'));
        var currentVal = Number($(this).val());

        // Check if previously parsed currentVal returns NaN, if so set input value to 0.
        if (isNaN(currentVal) || !isFinite(currentVal)) {
            // Enable plus button and disable min button for input field.
            $(".btn-number[data-type='plus'][data-field='" + name + "']").attr('disabled', false);
            $(".btn-number[data-type='minus'][data-field='" + name + "']").attr('disabled', true);
            $(this).val(0);
            updateGiraffeTotal();
            return;
        }

        // Check if current value is a float, if so round down to an integer.
        if (currentVal % 1 != 0) {
            currentVal = Math.floor(currentVal);
            $(this).val(currentVal);
        }

        // Check if min value rule is followed, if not set value to min value,  disable min button.
        if (currentVal > minValue) {
            $(".btn-number[data-type='minus'][data-field='"+name+"']").attr('disabled', false);
        } else if (currentVal <= minValue) {
            $(".btn-number[data-type='minus'][data-field='" + name + "']").attr('disabled', true);
            $(this).val(0);
        }

        // Check if max value rule is followed, if not set value to max value,  disable max button.
        if (currentVal < maxValue) {
            $(".btn-number[data-type='plus'][data-field='" + name + "']").attr('disabled', false);
        } else if (currentVal >= maxValue){
            $(".btn-number[data-type='plus'][data-field='" + name + "']").attr('disabled', true);
            $(this).val(100);
        }

        updateGiraffeTotal();
    });

    function updateGiraffeTotal() {
        var sum = 0;
        $(".giraffe-count").each(function(){
            sum += +$(this).val();
        });
        $('#giraffe-count-total').empty();
        $('#giraffe-count-total').append(sum);
    };
});