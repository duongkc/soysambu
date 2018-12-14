$(document).ready( function() {
    // Function to make navbar adjust carousel header on navigation.
    $('#carousel-header').on('slide.bs.carousel', function(e) {
        // Get indexes of current and clicked nav items.
        var from = $('.nav-item.active').index();
        var to = $(e.relatedTarget).index();
        // Remove active class from previous nav item and add to clicked nav item.
        $('.nav-item').removeClass('active');
        $('.nav-item').eq(to).addClass('active');
    });

    /* --- Load GIS page when navigated to using AJAX. --- */
    $('#nav-gis').click(function() {
        // If already on the GIS page, don't continue.
        if($('#nav-gis').hasClass('active')) return false;

        // Fadeout current content page.
        $('#content').fadeOut(175, function () {
            // Empty content div; Load gis.html and fade into content div.
            $('#content').empty().load("gis.html", function() {
                $(this).fadeIn(175);
            });
        });
    });

    /* --- Load Add Record page when navigated to using AJAX. --- */
    $('#nav-addrecord').click(function() {
        // If already on the Add Record page, don't continue.
        if($('#nav-addrecord').hasClass('active')) return false;

        // Fadeout current content page.
        $('#content').fadeOut(175, function () {
            // Empty content div; Load addrecord.html and fade into content div.
            $('#content').empty().load("addrecord.html", function() {
                $(this).fadeIn(175);
            });
        });
    });

    /* --- Load View Records page when navigated to using AJAX. --- */
    $('#nav-viewrecords').click(function() {
        // If already on the Add Record page, don't continue.
        if($('#nav-viewrecords').hasClass('active')) return false;

        // Fadeout current content page.
        $('#content').fadeOut(175, function () {
            // Empty content div; Load viewrecords.html and fade into content div.
            $('#content').empty().load("viewrecords.html", function() {
                $(this).fadeIn(175);
            });
        });
    });
});