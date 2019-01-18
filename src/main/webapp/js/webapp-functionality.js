$(document).ready( function() {
    /*** RESPONSIVE HEADER ***/
    /* Initial header set depending on screen size. */
    if (window.innerWidth < 750) {
        $("#carousel-header").hide();
    }

    /* Remove bootstrap's initial hidden styling on the headers.
       From here on this is handled by JS through the checkWidth function. */
    $('#gis-header').removeClass('d-none d-sm-block');

    /** Function that checks if the user is on the GIS page and if the user is on
     *  a small screen, then shows or hides the header carousel accordingly.
     */
    function checkWidth() {
        if (window.innerWidth < 750 && $('#gis-header').hasClass('active')) {
            $("#carousel-header").slideUp()
        } else {
            $("#carousel-header").slideDown()
        }
    }

    /* Throttle the amount of times checkWidth is called when resize event is fired. */
    const throttled = _.throttle(checkWidth, 100, {leading: false});
    $(window).resize(throttled);


    /*** NAVBAR ***/
    /* Make appropriate navbar item active depending on carousel sliding. */
    $('#carousel-header').on('slide.bs.carousel', function(event) {
        /* Get indexes of current and clicked nav items. */
        let from = $('.nav-item.active').index();
        let to = $(event.relatedTarget).index();

        /* Remove active class from previous nav item and add to clicked nav item. */
        $('.nav-item').eq(from).removeClass('active');
        $('.nav-item').eq(to).addClass('active');
    });


    /*** DYNAMIC PAGE CONTENTS ***/
    /** Function that fades in content and footer divs and enables tooltips on the current page. */
    function showContent() {
        /* Slide down carousel in case a small-screen user is coming from the GIS page */
        $('#carousel-header').slideDown(function() {
            $('#content, #footer').fadeIn({duration:175, queue: false});
        });
        $('[data-toggle="tooltip"]').tooltip();
    }

    /*** DYNAMIC PAGE CONTENTS - EVENT LISTENERS***/
    /* Dynamically load GIS page when navigated to using AJAX. */
    $('#nav-gis').click(function() {
        /* If already on the GIS page, don't continue. */
        if($('#nav-gis').hasClass('active')) return false;

        $('#content, #footer').fadeOut(175, function () {
            /* Slide up header carousel when on small screen. */
            if (window.innerWidth < 750) {
                $("#carousel-header").slideUp()
            }
            $('#map').fadeIn(175);
        });
    });

    /* Dynamically load other pages when navigated to using AJAX. */
    $('#nav-statistics, #nav-addrecord, #nav-viewrecords').click(function() {
        /* If already on the clicked page, don't continue. */
        if($(this).hasClass('active')) return false;
        /* Get target page from <li>'s data-page attribute */
        const page = $(this).attr("data-page");

        $('#content, #map').fadeOut(175).promise().done(function () {
            /* Empty content div.
               Load appropriate page and fade into content div. */
            $('#content').empty().load("" + page, showContent);
        });
    });
});
