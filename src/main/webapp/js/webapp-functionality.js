$(document).ready( function() {
    /*** SITE NAVIGATION ***/
    /* Event listener for header nav item clicks; handles web app page navigation. */
    $('.header-nav-item').on('click', function() {
        /* If already on the clicked page, don't continue. */
        if($(this).hasClass('active')) return false;

        /* Remove active class from previous nav item and make current nav item active. */
        $('.header-nav-item.active').removeClass('active');
        $(this).addClass('active');
        /* Move header carousel to the slide associated with the page. */
        $("#carousel-header").carousel($(this).index());

        /* If navigated to GIS page hide content and show map.*/
        if ($(this).attr("id") === "nav-gis") {
            $('#content-container, #footer').fadeOut(175, function () {
                $('#map').fadeIn(175);
            })
        /* Else get target page from item's data-page attribute and load it. */
        } else {
            const page = $(this).attr("data-page");
            $('#content-container, #map').fadeOut(175).promise().done(function () {
                $('#content-container')
                    .empty()
                    .load("" + page, showContent);
            });
        }
    });

    /** Function that fades in content and footer divs and enables tooltips on the current page. */
    function showContent() {
        $('#content-container, #footer').fadeIn({duration:175, queue: false});
        $('[data-toggle="tooltip"]').tooltip();
    }


    /*** INPUT STANDARDIZATION ***/
    /** Converts yyyy-m-d date or yyyy/mm/dd formatting to yyyy-mm-dd. */
    function standardizeInputDate() {
        /* Regex will match either '-' or '/'. */
        let date = $(this).val().split(/[-\/]/);

        if (date.length === 3 && !date.some(isNaN)) {
            let year = date[0];
            let month = date[1];
            let day = date[2];

            /* Add zero if month or day is in the single digits. */
            if (month.length < 2 && month !== 0) month = '0' + month;
            if (day.length < 2 && day !== 0) day = '0' + day;
            date = year + '-' + month +  '-' + day;

            /* Set newly parsed date as input value. */
            $(this).val(date);
        }
    }

    /** Converts HHmm time formatting to HH:mm. */
    function standardizeInputTime() {
        let time = $(this).val();

        if (time.length === 4 && !isNaN(time)) {
            let hours = time.slice(0,2);
            let mins = time.slice(2,4);

            $(this).val(hours + ':' + mins);
        }
    }

    /** Converts commas in coordinates to dots and removes prepended or appended zeros. */
    function standardizeInputCoords () {
        let coord = $(this).val();

        if (!isNaN(parseFloat(coord))) {
            /* Replace any commas present with dots. */
            coord = coord.replace(/,/g, '.');
            /* Remove any prepended or appended zeros. */
            coord = parseFloat(coord);

            $(this).val(parseFloat(coord).toFixed(4));
        }
    }

    /* Event listeners for changes within standardized input fields. */
    $('.input-date').change(standardizeInputDate);
    $('.input-time').change(standardizeInputTime);
    $('.input-coord').change(standardizeInputCoords);


    /*** UTILITIES & MISC ***/
    /* Hide tooltip when datepickers are opened. */
    $('.btn-datepicker').click( function () {
        $(this).tooltip('hide');
    });
});
