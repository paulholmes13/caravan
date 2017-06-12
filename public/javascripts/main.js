$(function() {
    
    $('.readmore').on('click', function(){
        if ( $('.w3-hide-small').is(':hidden') ) {
            this.innerHTML = 'Read Less'
            $('.w3-hide-small').fadeIn('slow').attr('style', 'display: block !important');
            $("html, body").animate({scrollTop: $('#anchor').offset().top }, 2000);
        }
        else {
            this.innerHTML = 'Read More';
            $('.w3-hide-small').fadeOut('slow').removeAttr('style');
            $("html, body").animate({scrollTop: $('body').offset().top }, 2000);
        }
    });
    $('.w3-opennav').on('click', function(){
        if ( $('#mySidenav').is(':hidden') ) {
            $('#mySidenav').attr('style', 'display: block !important');
        }
        else {
            $('#mySidenav').fadeOut('slow').removeAttr('style');
        }
    });

    var closedToBooked = [];
    var closedToPending = [];
    var closedToAvailable = [];
    var availableToBooked = [];
    var availableToClosed = [];
    var bookedToAvailable = [];
    var bookedToClosed = [];
    var bookedToPending = [];
    var pendingToClosed = [];



    $.each($('div.day'), function(key, currentElement) {

      if ( $(currentElement) && $(currentElement).hasClass('closed') && $(currentElement).next().hasClass('booked') ) {
        if ( $(currentElement) && $(currentElement).next().find('span').html().match(/Mon|Fri/)) {
          closedToBooked.push($(currentElement).next());
        }
      }
      
      if ( $(currentElement) && $(currentElement).hasClass('closed') && $(currentElement).next().hasClass('pending') ) {
        if ( $(currentElement) && $(currentElement).next().find('span').html().match(/Mon|Fri/)) {
          closedToPending.push($(currentElement).next());
        }
      }

      if ( $(currentElement) && $(currentElement).hasClass('closed') && $(currentElement).next().hasClass('available') ) {
        //if ( $(currentElement) && $(currentElement).next().find('span').html().match(/Mon|Fri/)) {
          closedToAvailable.push($(currentElement).next());
        //}
      }

      if ( $(currentElement) && $(currentElement).hasClass('booked') && $(currentElement).next().hasClass('pending') ) {
        if ( $(currentElement) && $(currentElement).next().find('span').html().match(/Mon|Fri/)) {
          bookedToPending.push($(currentElement).next());
        }
      }

      if ( $(currentElement) && $(currentElement).hasClass('booked') && $(currentElement).next().hasClass('closed') ) {
        if ( $(currentElement) && $(currentElement).next().find('span').html().match(/Mon|Fri/)) {
          bookedToClosed.push($(currentElement).next());
        }
      }

      if ( $(currentElement) && $(currentElement).hasClass('available') && $(currentElement).next().hasClass('booked') ) {
        if ( $(currentElement) && $(currentElement).next().find('span').html().match(/Mon|Fri/)) {
          availableToBooked.push($(currentElement).next());
        }
      }

      if ( $(currentElement) && $(currentElement).hasClass('available') && $(currentElement).next().hasClass('closed') ) {
        if ( $(currentElement) && $(currentElement).next().find('span').html().match(/Mon|Fri/)) {
          availableToClosed.push($(currentElement).next());
        }
      }

      if ( $(currentElement) && $(currentElement).hasClass('booked') && $(currentElement).next().hasClass('available') ) {
        if ( $(currentElement) && $(currentElement).next().find('span').html().match(/Mon|Fri/)) {
          bookedToAvailable.push($(currentElement).next());
        }
      }
      
      if ( $(currentElement) && $(currentElement).hasClass('pending') && $(currentElement).next().hasClass('closed') ) {
        if ( $(currentElement) && $(currentElement).next().find('span').html().match(/Mon|Fri/)) {
          pendingToClosed.push($(currentElement).next());
        }
      }

    });

    closedToBooked.reverse();
    closedToPending.reverse();
    bookedToAvailable.reverse();
    bookedToPending.reverse();
    availableToClosed.reverse();
    pendingToClosed.reverse();

    //loop the arrays and remove _+ add some classes
    $.each(closedToBooked, function(key, element) {
      $(element).removeClass('booked').addClass('closedbooked start');
    });
    
    $.each(closedToPending, function(key, element) {
      $(element).removeClass('closed').addClass('closedpending start');
    });

    $.each(closedToAvailable, function(key, element) {
      $(element).removeClass('available').addClass('closedavailable start');
    });

    $.each(availableToClosed, function(key, element) {
      $(element).removeClass('closed').addClass('availableclosed start');
    });

    $.each(pendingToClosed, function(key, element) {
      $(element).removeClass('closed').addClass('pendingclosed start');
    });

    $.each(bookedToPending, function(key, element) {
      $(element).removeClass('pending').addClass('bookedpending start');
    });

    $.each(bookedToClosed, function(key, element) {
      //$(element).removeClass('closed').addClass('bookedclosed start');
    });

    $.each(availableToBooked, function(key, element) {
      $(element).removeClass('booked').addClass('availablebooked start');
    });

    $.each(bookedToAvailable, function(key, element) {
      $(element).removeClass('available').addClass('bookedavailable start');
    });


    //if ( $('div.day.closed').next().hasClass('booked')

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-4298042-9', 'auto');
  ga('send', 'pageview');

});
