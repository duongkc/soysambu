$(document).ready( function() {
    /* Make carousel header responsive to screen size */
    // Initial slide up of carousel header by default when on a small screen.
    if (window.innerWidth < 750) {
        $("#carousel-header").slideUp();
    }
    // Remove bootstrap's hidden on small screen styling on the GIS-header.
    // From here on this is handled by JS through the checkwidth function.
    $('#gis-header').removeClass('d-none d-sm-block');

    // Makes the GIS carousel header slide up when on a small screen and on the GIS page.
    function checkWidth() {
        if (window.innerWidth < 750 && $('#gis-header').hasClass('active')) {
            $("#carousel-header").slideUp();
        } else {
            $("#carousel-header").slideDown();
        }
    }
    // Throttle the amount of times checkWidth is called when resize is thrown.
    var throttled = _.throttle(checkWidth, 100);
    $(window).resize(throttled);

    // Function to fade in content div and footer and enable tooltips.
    function showContent() {
        $('#carousel-header').slideDown(function() {
            $('#content, #footer').fadeIn(175);
        })
        $('[data-toggle="tooltip"]').tooltip();
    }

    /* --- Make navbar adjust carousel header on navigation. --- */
    $('#carousel-header').on('slide.bs.carousel', function(e) {
        // Get indexes of current and clicked nav items.
        var from = $('.nav-item.active').index();
        var to = $(e.relatedTarget).index();
        // Remove active class from previous nav item and add to clicked nav item.
        $('.nav-item').eq(from).removeClass('active');
        $('.nav-item').eq(to).addClass('active');
    });

    /* --- Load GIS page when navigated to using AJAX. --- */
    $('#nav-gis').click(function() {
        // If already on the GIS page, don't continue.
        if($('#nav-gis').hasClass('active')) return false;
        // Fadeout current content page.
        $('#content, #footer').fadeOut(175, function () {
            // Slide up carousel header when on small screen.
            if (window.innerWidth < 750) { $('#carousel-header').slideUp() }
            $('#map').fadeIn(175)
        });
    });

    /* --- Load Add Record page when navigated to using AJAX. --- */
    $('#nav-addrecord').click(function() {
        // If already on the Add Record page, don't continue.
        if($('#nav-addrecord').hasClass('active')) return false;

        // Fadeout current content page.
        $('#content, #map').fadeOut(175).promise().done(function () {
            // Empty content div; Load addrecord.html and fade into content div.
            $('#content').empty().load("addrecord.html", showContent);
        });
    });

    /* --- Load View Records page when navigated to using AJAX. --- */
    $('#nav-viewrecords').click(function() {
        // If already on the Add Record page, don't continue.
        if($('#nav-viewrecords').hasClass('active')) return false;

        // Fadeout current content page.
        $('#content, #map').fadeOut(175).promise().done(function () {
            // Empty content div; Load viewrecords.html and fade into content div.
            $('#content').empty().load("viewrecords.html", showContent);
        });
    });
});