/**
 * @file Contains core web app code to be used in multiple web app functionalities.
 *       Contains logic for web app navigation and responsiveness (when not handled
 *       through CSS).
 * @author Niels van der Vegt
 */

/*** GLOBAL FUNCTIONS - DATABASE INTERACTIONS ***/
/** Gets (and when required sets) the sighting data in the session storage,
 *  then returns the sightings as part of a promise resolve.
 *      If no sightings data is present in the session storage it is requested
 *  from the server and set in the session storage.
 *
 *  @returns {promise} - A promise that resolves after sighting data is retrieved
 *                       from session storage.
 */
function getSightingData() {
    /* Return sightings from session storage if present. */
    if (sessionStorage.getItem('sightings')) {
        return new Promise(function (resolve) {
            resolve(JSON.parse(sessionStorage.getItem('sightings')));
        });
    /* Request sighting records from server and set to session storage. */
    } else {
        return new Promise(function (resolve) {
            $.get('records', function (sightings) {
                sessionStorage.setItem('sightings', sightings);}, 'text')
                .done(function () {
                    resolve(JSON.parse(sessionStorage.getItem('sightings')));
                })
                .fail(function () {
                    /* Should the GET request fail cover the screen with a content lock. */
                    jqueryCache.get('#content').append('<div id="content-lock" style="display:none;"></div>');
                    $('#submit-lock').fadeIn();
                });
        });
    }
}

/*** GLOBAL FUNCTIONS - INPUT STANDARDIZATION ***/
/** Converts yyyy-m-d date or yyyy/mm/dd formatting to yyyy-mm-dd. */
function standardizeInputDate() {
    /* Regex will match either '-' or '/'. */
    let date = $(this).val().split(/[-/]/);

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

/*** GLOBAL FUNCTIONS - JQuery Selector Cache ***/
/** Creates a collection of JQuery selectors that would benefit from caching to
 *  improve performance. DOM elements that do not get moved should be selected
 *  using jqueryCache.get('#element') for efficiency.
 *
 * @author Eric https://ttmm.io/tech/selector-caching-jquery/
 * @constructor
 */
function jquerySelectorCache() {
    let collection = {};

    function getSelector(selector) {
        if (collection[selector] === undefined) {
            collection[ selector ] = $( selector );
        }
        return collection[selector];
    }

    return {get: getSelector};
}
let jqueryCache = new jquerySelectorCache();


$(document).ready( function() {
    /*** SITE NAVIGATION - BANNER ***/
    /* Banner description constants. */
    const descriptions = [['GIS', 'Geographic information system of Soysambu.'],
        ['Add Sighting', 'Add an organism sighting to the Soysambu database.'],
        ['View Sightings', 'View past organism sightings in Soysambu conservancy.']];
    const descriptionBackgrounds = ['#fab1a0', '#f7d794', '#BBDEFB', '#f8c291'];
    const borderColors = ['#e08283', '#f5cd79', '#90CAF9', '#eea381'];


    /** Hides the current banner description and adds the banner description with the given index.
     *  Nav-items and banners share the same indexes for the web pages they represent.
     *
     *  @param {String} bannerIndex - Index of the banner that should be displayed.
     */
    function showBannerDescription(bannerIndex) {
        /* Define temporary JQuery Selectors. */
        let $bannerDescription = $('#banner-description');
        let $bannerTitle = $('#banner-description h2');
        let $bannerSubtitle = $('#banner-description p');
        let $bannerImage = $('#banner-image');

        /* If target description is identical to current description, don't continue. */
        if ($bannerTitle.text() === descriptions[bannerIndex][0]) return false;

        /* Fade out the currently active banner description. */
        $bannerDescription.children().fadeOut('fast').promise().done(function () {
            /* Set new description values correlating to the hovered nav item. */
            $bannerTitle.text(descriptions[bannerIndex][0]);
            $bannerSubtitle.text(descriptions[bannerIndex][1]);

            /* Fade in description text and change css of banner description div.
               CSS transitions are handled by CSS animations. */
            $bannerDescription.children().fadeIn('fast');
            $bannerDescription.css('background-color', descriptionBackgrounds[bannerIndex]);
            $bannerImage.css('box-shadow', '-25px 0 0 0' + borderColors[bannerIndex]);
        });
    }

    /* On mouse enter of nav items, toggle the appropriate banner.
       Using setTimeOut to only fire banner logic when mouse stays in nav-item for 'x' amount of ms. */
    jqueryCache.get('.header-nav-item').mouseenter(function() {
        const hoveredNavItemIndex = jqueryCache.get('.header-nav-item').index(this);
        changeBannerTimer = setTimeout(function () {
            showBannerDescription(hoveredNavItemIndex);
        }, 200);
    }).mouseleave(function () {
        /* If mouse leaves early clear the bannerTimer. */
        if (typeof changeBannerTimer !== undefined) {
            clearTimeout(changeBannerTimer);
        }
    });

    /* On mouse leave of main navbar, toggle the banner of the active page.
       Using debounce to limit the amount of times the banner change is fired. */
    function lazyNavBarMouseLeave() {
        const activeIndex = $('.header-nav-item.active').index();
        showBannerDescription(activeIndex);
    }
    jqueryCache.get('#header-nav-item-container').mouseleave(_.debounce(lazyNavBarMouseLeave, 220));


    /*** SITE NAVIGATION - BANNER - RESPONSIVENESS***/
    /** Hides the banner when on a small (<768px) screen and visiting the GIS page.
     *  Displays banner when screen size is >768 pixels.
     */
    function responsiveGISPage() {
        if ($(window).width() < 768) {
            if ($('.header-nav-item.active').attr('id') === 'nav-gis') {
                jqueryCache.get('#banner').add(jqueryCache.get('#footer')).hide();
            }
        } else {
            jqueryCache.get('#banner').add(jqueryCache.get('#footer')).show();
        }
    }
    /* Throttle the amount of times responsiveGISBanner is called after a window.resize event. */
    let lazyResponsiveGISPage = _.throttle(responsiveGISPage, 75);


    /*** SITE NAVIGATION - NAVBAR ***/
    /* Event listener for header nav item clicks; handles web app page navigation. */
    jqueryCache.get('.header-nav-item').on('click', function() {
        /* If already on the clicked page, don't continue. */
        if($(this).hasClass('active')) return false;

        /* Remove active class from previous nav item and make current nav item active. */
        $('.header-nav-item.active').removeClass('active');
        $(this).addClass('active');

        const page = $(this).attr('data-page');

        /* Fade out page's current content. */
        jqueryCache.get('#content-container').add(jqueryCache.get('#map')).fadeOut(175).promise().done(function() {
            jqueryCache.get('#content-container').empty();

            if (page === 'gis') {
                /* If map is not yet loaded, run arcgis.js. */
                if (jqueryCache.get('#map').is(':empty')) {
                    $.getScript('arcgis.js');
                }
                jqueryCache.get('#map').fadeIn(175);
            } else {
                /* Load each page's respective HTML and JS based on the nav-item's data-page attribute. */
                jqueryCache.get('#content-container').load('' + page + '.html', showContent);
                $.getScript('js/' + page + '.js');
            }
        });
    });

    /** Function that fades in content, shows banner and footer divs and enables tooltips on the current page. */
    function showContent() {
        jqueryCache.get('#content-container').fadeIn({duration:175, queue: false});
        jqueryCache.get('#banner').add(jqueryCache.get('#footer')).show();
        $('[data-toggle="tooltip"]').tooltip();
    }
});
