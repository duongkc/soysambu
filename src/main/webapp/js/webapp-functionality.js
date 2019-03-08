/**
 * @file Contains global web app functions to be used in multiple web app scripts.
 *       Contains logic for web app navigation.
 * @author Niels van der Vegt
 */

/*** GLOBAL FUNCTIONS - DATABASE INTERACTIONS ***/
/** Gets (and additionally sets) the sighting data in the session storage,
 *  then returns the sightings as part of a promise resolve.
 *      If no sightings data is present in the session storage it is requested
 *  from the server and set in the session storage.
 *
 *  @returns {promise} - A promise that resolves after sighting data is retrieved
 *                       from session storage.
 */
function getSightingData() {
    /* Return sightings from session storage if present. */
    if (sessionStorage.getItem("sightings")) {
        return new Promise(function (resolve) {
            resolve(JSON.parse(sessionStorage.getItem("sightings")))
        });
        /* Request sighting records from server and set to session storage. */
    } else {
        return new Promise(function (resolve) {
            $.get("records", function (sightings) {
                sessionStorage.setItem("sightings", sightings);
            }, 'text').done(function () {
                resolve(JSON.parse(sessionStorage.getItem("sightings")));
            })
        })
    }
}

/*** GLOBAL FUNCTIONS - INPUT STANDARDIZATION ***/
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

/** Converts commas in coordinates to dots and removes prepended or appended zeros.*/
function standardizeInputCoordinate () {
    let coordinate = $(this).val();

    if (!isNaN(parseFloat(coordinate))) {
        /* Replace any commas present with dots. */
        coordinate = coordinate.replace(/,/g, '.');
        /* Remove any prepended or appended zeros. */
        coordinate = parseFloat(coordinate);

        $(this).val(parseFloat(coordinate).toFixed(4));
    }
}


/*** SITE NAVIGATION ***/
$(document).ready( function() {
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
            $('#content-container').fadeOut(175, function () {
                $('#map').fadeIn(175);
            })
        /* Else get target page from item's data-page attribute and load it. */
        } else {
            const page = $(this).attr("data-page");
            $('#content-container, #map').fadeOut(175).promise().done(function () {
                $('#content-container')
                    .empty()
                    .load("" + page + ".html", showContent);
                /* Load the javascript functionality of the appropriate page. */
                $.getScript("js/" + page + ".js");
            });
        }
    });

    /** Function that fades in content and footer divs and enables tooltips on the current page. */
    function showContent() {
        $('#content-container, #footer').fadeIn({duration:175, queue: false});
        $('[data-toggle="tooltip"]').tooltip();
    }
});
