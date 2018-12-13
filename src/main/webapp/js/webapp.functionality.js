$(document).ready( function() {
    // Function to make navbar adjust carousel header on navigation
    $('#carousel-header').on('slide.bs.carousel', function(event) {
        // Get indexes of current and clicked nav items.
        var from = $('.nav-link.active').index();
        var to = $(event.relatedTarget).index();
        // Remove active class from previous nav item and add to clicked nav item.
        $('.nav-link').removeClass('active');
        $('.nav-link').eq(to).addClass('active');
    });
});