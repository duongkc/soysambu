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


$(document).ready( function() {
    /*** SITE NAVIGATION - BANNER ***/
    /* Banner description constants. */
    const descriptions = [['GIS', 'Geographic information system of Soysambu.'],
        ['Add Sighting', 'Add an organism sighting to the Soysambu database.'],
        ['View Sightings', 'View past organism sightings in Soysambu conservancy.']];
    const descriptionBackgrounds = ['#f19066', '#f5cd79', '#778beb'];
    const borderColors = ['#f3a683', '#f7d794', '#546de5'];

    /** Hides the current banner description and adds the banner description with the given index.
        Nav-items and banners share the same indexes for the web pages they represent. */
    function showBannerDescription(bannerIndex) {
        /* If target description is identical to current description, don't continue. */
        if ($('.banner-description h2').text() === descriptions[bannerIndex][0]) return false;

        /* Fade out the currently active banner description. */
        $('.banner-description').children().fadeOut('fast').promise().done(function () {
            /* Set new description values correlating to the hovered nav item. */
            $('.banner-description h2').text(descriptions[bannerIndex][0]);
            $('.banner-description p').text(descriptions[bannerIndex][1]);

            /* Fade in description text and change css of banner description div.
               CSS transitions are handled by CSS animations. */
            $('.banner-description').children().fadeIn('fast');
            $('.banner-description').css('background-color', descriptionBackgrounds[bannerIndex]);
            $('.banner-image').css('box-shadow', '0 0 0 25px ' + borderColors[bannerIndex]);
        })
    }

    /* On mouse enter of nav items, toggle the appropriate banner.
       Using setTimeOut to only fire banner logic when mouse stays in nav-item for 'x' amount of ms. */
    $('.header-nav-item').mouseenter(function() {
        const hoveredNavItemIndex = $('.header-nav-item').index(this);
        bannerTimer = setTimeout(function () {
            showBannerDescription(hoveredNavItemIndex)
        }, 200);
    }).mouseleave(function () {
        /* If mouse leaves early clear the bannerTimer. */
        clearTimeout(bannerTimer);
    });

    /* On mouse leave of main navbar, toggle the banner of the active page.
       Using debounce to limit the amount of times the banner change is fired. */
    $('#header-nav-items').mouseleave(_.debounce(lazyNavBarMouseLeave, 220));
    function lazyNavBarMouseLeave() {
        const activeIndex = $('.header-nav-item.active').index();
        showBannerDescription(activeIndex);
    }

    /*** SITE NAVIGATION - NAVBAR ***/
    /* Event listener for header nav item clicks; handles web app page navigation. */
    $('.header-nav-item').on('click', function() {
        /* If already on the clicked page, don't continue. */
        if($(this).hasClass('active')) return false;

        /* Remove active class from previous nav item and make current nav item active. */
        $('.header-nav-item.active').removeClass('active');
        $(this).addClass('active');

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
