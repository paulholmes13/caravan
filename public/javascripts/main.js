$(window).on("load", function() {

    var isMobile = false; //initiate as false
    // device detection
    try{ 
        document.createEvent("TouchEvent"); isMobile = true;}
    catch(e){}

    var mainSection = $('div#leftBody');
    var defaultsettings = { 
                            '/availability' : { "height" : "16"}
                          };
    var modal = $('#myModal');


    if ( !isMobile && $(mainSection).height() > 400 ) {
        minuscalc = (location.pathname in defaultsettings) ? defaultsettings[location.pathname].height : 0;
        $('div#facebookContainer').find('div').css('height',(Math.round($(mainSection).height() - minuscalc)));
        $('div.fb-page').attr('data-height',(Math.round($(mainSection).height() - minuscalc)));
    }

    if ( isMobile ) {
        $('.w3-opennav').on('click', function(){
            if ( $('#mySidenav').is(':hidden') ) {
                
                $('#mySidenav').attr('style', 'display: block !important');

                $('div.w3-row').on('click', function() {
                    $('#mySidenav').fadeOut('slow').removeAttr('style');
                });

            }
            else {
                $('#mySidenav').fadeOut('slow').removeAttr('style');
            }
        });

        $(window).scroll(function() {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                document.getElementById("myBtn").style.display = "block";
            } else {
                document.getElementById("myBtn").style.display = "none";
            }
        }); 

        $('#myBtn').bind('click', function() {
            $('html,body').animate({ scrollTop: 0 }, 'slow');
        });
    }


    if ( !isMobile ) {
        $('#photos img').click( function(event) {
            if ( typeof modal === "object" ) {
                $(modal).css('display', 'block');
                var imgEle = $(modal).find('img');
                $(imgEle).attr('src',this.src);

                var span = document.getElementsByClassName("close")[0];

                $('#myModal span').click(function() { 
                    $(modal).css('display', 'none');
                });
            };
        });
    }


    //resize FB plugin
    $( window ).resize(function() {
        $('div.fb-page').attr('data-height',$(mainSection).height());
        FB.XFBML.parse();
    });

    var closedToBooked = [];
    var closedToPending = [];
    var closedToAvailable = [];
    var availableToBooked = [];
    var availableToClosed = [];
    var availableToPending = [];
    var bookedToAvailable = [];
    var bookedToClosed = [];
    var bookedToPending = [];
    var pendingToClosed = [];
    var pendingToAvailable = [];

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
        if ( $(currentElement) && $(currentElement).next().find('span').html().match(/Mon|Fri/)) {
          ( $(currentElement).next().find('span').html().match(/Tue/) ) ? closedToAvailable.push($(currentElement)) : closedToAvailable.push($(currentElement).next());
        }
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

      if ( $(currentElement) && $(currentElement).hasClass('booked') && $(currentElement).next().hasClass('available') ) {
        if ( $(currentElement) && $(currentElement).next().find('span').html().match(/Mon|Fri/)) {
          ( $(currentElement).next().find('span').html().match(/Tue/) ) ? bookedToAvailable.push($(currentElement)) : bookedToAvailable.push($(currentElement).next());
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

      if ( $(currentElement) && $(currentElement).hasClass('available') && $(currentElement).next().hasClass('pending') ) {
        if ( $(currentElement) && $(currentElement).next().find('span').html().match(/Mon|Fri/)) {
          availableToPending.push($(currentElement).next());
        }
      }


      if ( $(currentElement) && $(currentElement).hasClass('pending') && $(currentElement).next().hasClass('closed') ) {
        if ( $(currentElement) && $(currentElement).next().find('span').html().match(/Mon|Fri/)) {
          pendingToClosed.push($(currentElement).next());
        }
      }

      if ( $(currentElement) && $(currentElement).hasClass('pending') && $(currentElement).next().hasClass('available') ) {
        if ( $(currentElement) && $(currentElement).next().find('span').html().match(/Mon|Fri/)) {
          pendingToAvailable.push($(currentElement).next());
        }
      }
    });

    closedToBooked.reverse();
    closedToPending.reverse();
    closedToAvailable.reverse();
    bookedToAvailable.reverse();
    bookedToPending.reverse();
    availableToClosed.reverse();
    availableToPending.reverse();
    pendingToClosed.reverse();
    pendingToAvailable.reverse();

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

    $.each(bookedToAvailable, function(key, element) {
      $(element).removeClass('booked').addClass('bookedavailable start');
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

    $.each(pendingToAvailable, function(key, element) {
      $(element).removeClass('available').addClass('pendingavailable start');
    });
    
    $.each(availableToPending, function(key, element) {
      $(element).removeClass('pending').addClass('availablepending start');
    });

    //if ( $('div.day.closed').next().hasClass('booked')

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-4298042-9', 'auto');
  ga('send', 'pageview');

});
