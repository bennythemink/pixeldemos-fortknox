/*global AOS */

//
// Custom Script
//=======================================

jQuery(document).ready(function($){
	var SHOW_LOADER = false;
	var SCROLL_MENU_TIMER = 150;
	var _window = $(window);
	var _body = $('body');
	var _header = $('header');
	var _lastScrollPosition;
	var _scrollTimer;



	// Global Initialisation
	//=======================================
	var initApp = function(){

		$("#main-menu-underlay").on('click', function(){
			$('body').removeClass("show-menu");
			$('.menu-toggle').removeClass("is-active");
			return false;
		});

		$('.search-icon-nav').click(function(e){
			e.preventDefault();
			if($('header').hasClass('open-search-bar')) {
				$('header').removeClass('open-search-bar');
			} else {
				$('header').addClass('open-search-bar');
			}
		})

		$('.menu-toggle').on("click", function(e){
			e.stopPropagation();
			if($("body").hasClass("show-menu")) {
				$('body').removeClass("show-menu");
				$('.menu-toggle').removeClass("is-active");
			}else {
				$('body').addClass("show-menu");
				$('.menu-toggle').addClass("is-active");
			}
			return false;
		});

		$("#main-menu .menu-item a").click(function(){
			var parent = $(this).parent();
			var submenu = parent.find(".sub-menu");
			if(submenu.length > 0) {
				parent.toggleClass("active");
				return false;
			}else {
				return true;
			}
		});


		//Side mobile menu
		$('.sidemenu-btn, .side-close').click(function () {
			$('body').toggleClass('fixed');
			$('.sidebar').toggleClass('nav-active');
		});

		//Quick menu hover icon
		$('.quick-menu a').hover(function(){
			$(this).children().removeClass('icon-blue');
			$(this).children().addClass('icon-white');
		});


		//Quick Tab
		//$('.tab-nav li').click(function(){$('body').addClass('quick-active');});
		$('.quick-tab .close').click(function(){
			$('body').removeClass('quick-active');
			$('.tab-nav li, .quick-tab .tab-pane').removeClass('active');
		});


		//Feature Panel Hovers
		$('article .fn-btn-rollover').on("mouseover", function(){
			$(this).closest("article").addClass("article--hover");
		}).on("mouseout", function(){
			$(this).closest("article").removeClass("article--hover");
		});

		$('.fn-video-popup').click(function(){
			$('body').addClass('show-popup');
			if($(this).attr("href").length > 0) {
				$('.video-popup iframe').attr("src", $(this).attr("href"));
			}
			$('.video-popup').addClass('active');
			return false;
		});
		$('.fn-contact').click(function(){
			$('body').addClass('show-popup');
			$('.contact-popup').addClass('active');
			return false;
		});
		$('.fn-popup-close').click(function(){
			$('.popup').removeClass('active');
			$('body').removeClass('show-popup');
			return false;
		});
		$('.fn-paybill').click(function(event){
			if ($(this).attr('href') == '#') {
				event.preventDefault();
			}
		});
		$('.paybill-select').change(function() {
			var url = $(this).val();
			$('.fn-paybill').attr('href',url);
		});

		$('.location-store__questions li span').click(function() {
			if($(this).parents('li').hasClass('open')) {
				$(this).parents('li').removeClass('open');
			} else {
				$('.location-store__questions li').removeClass('open');
				$(this).parents('li').addClass('open');
			}
		});

		$('.rapidstor-scroll-link').on('click', function(e) {
			e.preventDefault();
			let $element;
			if ($('#rapidstor-app').length > 0) {
				$element = $('#rapidstor-app');
			} else {
				$element = $('#rapidstor-v2-frontend');
			}
			
			const {left, top} = $element.offset();
			scrollTo(left, top - 200);
		});

		if($('#map').length > 0) {
			var mymap = L.map('map').setView([-37.840935, 144.946457], 9);

			L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
				attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
				maxZoom: 18,
				id: 'mapbox/streets-v11',
				tileSize: 512,
				zoomOffset: -1,
				accessToken: 'pk.eyJ1IjoibW9zb21hYXJ0ZW4iLCJhIjoiY2tqdDVvaGo5MmRpbzJ4bjBxMzE5MHU1MyJ9.67-RKOZuwvvikJmUeVBZEQ'
			}).addTo(mymap);

			mymap.scrollWheelZoom.disable();
		}

		
        // These secret variables are needed to authenticate the request. Get them from http://docs.traveltimeplatform.com/overview/getting-keys/ and replace 
        var APPLICATION_ID = "093cfa45";
        var API_KEY = "0974388052d007261d206f0b58895b90";

		if($('#location-search-map').length > 0) {

			document.querySelector("#location-search-map").addEventListener("submit", function(e){
				e.preventDefault();

				var locationName = e.target[0].value + ", Australia";	

				var circle = L.circle([-37.840935, 144.946457], {
					color: '#00593D',
					fillColor: '#00593D',
					fillOpacity: 0.5,
					radius: 50000
				}).addTo(mymap);

				$('#location-search-map').hide();

				///sending request    
				sendGeocodingRequest(locationName)
				.then(function(data) {
					//and if it is success drawing map and marker
					drawMarker(data)
				}) 
				.catch(function(error) {
					if(APPLICATION_ID === "place your app id here" || API_KEY ===  "place your api key here") {
					document.getElementById("error").style.display = "block";
					}
					console.error(error)
				});
			});	       
		}; 

        function drawMarker(response) {  // We need to extract the coordinates from the response.
             
            var coordinates = response.features[0].geometry.coordinates;  // The coordintaes are in a [<lng>, <lat>] format/
             
			var latLng = L.latLng([coordinates[1], coordinates[0]])  // The url template for OpenStreetMap tiles.
			
            mymap.setView(latLng, 9);  // Creates a marker for our departure location and adds it to the map.
             
            var markter = L.marker(latLng).addTo(mymap);
        };

        function sendGeocodingRequest(location) {
            return fetch(`https://api.traveltimeapp.com/v4/geocoding/search?query=` + location, {
                    method: "GET",
                    credentials: "same-origin", 
                    headers: {
                        "Content-Type": "application/json",
                        "X-Application-Id": APPLICATION_ID,
                        "X-Api-Key": API_KEY,
                        "Accept-Language": "en-US"
                    }

                })
                .then(response => response.json()); // parses JSON response into native Javascript objects 
        }

		

		// Form custom styling
        $('.gfield_checkbox').iCheck({
            checkboxClass: 'icheckbox_fortknox',
            increaseArea: '50%'
        });
        $('.gfield_radio').iCheck({
            radioClass: 'iradio_fortknox',
            increaseArea: '50%'
        });


		// tabs (used for space calculator)
	    $(".tab-list a").click(function(event) {
	        event.preventDefault();
	        $(this).parent().addClass("selected");
	        $(this).parent().siblings().removeClass("selected");
	        var tab = $(this).attr("href");
	        $(".tab-panel").not(tab).css("display", "none");
	        $(tab).css("display", "flex");
	        // $(tab).hide().fadeIn();
	    });

	    // Make content tables responsive by adding in titles to each row
	    $("table:not(.shop_table)").each(function() {
	    	//count columns
	    	var columnCount = $(this).find("tr:first > th").length;

	    	for (i = 1; i <= columnCount; i++) {
	    		//set title for use in CSS
	    		$(this).find('td:nth-child('+i+')').attr('data-title',$(this).closest('table').find('th:nth-child('+i+')').text());
	    	}
		});

	    // Whats this for?
	    (function() {
			$(this).children().addClass('icon-blue');
			$(this).children().removeClass('icon-white');
		});


	    if( $(".nav-container").children().length > 5) {
	    	$(".nav-container").slick({
	    		infinite: true,
	    		slidesToShow: 5,
	    		slidesToScroll: 5,

	    		responsive: [
	    		{
	    			breakpoint: 1200,
	    			settings: {
	    				slidesToShow: 4,
	    				slidesToScroll: 4
	    			}
	    		},
	    		{
	    			breakpoint: 992,
	    			settings: {
	    				slidesToShow: 3,
	    				slidesToScroll: 3
	    			}
	    		},
	    		{
	    			breakpoint: 768,
	    			settings: {
	    				slidesToShow: 3,
	    				slidesToScroll: 3
	    			}
	    		}
	    		]

	    	});
	    }

		if ( !$("body").hasClass("page-template-page-get-a-quote-instant") ) { // disable on instant quote page (defaults to small header)
			_window.on('scroll', initAppScroll);
		}

	};


	// App Scroll listener
	//=======================================
	var initAppScroll = function(){

		var position = $(this).scrollTop();
		//console.log(position);
		//if(position === 0) {
			if(position <= 0) {
			_header.addClass("slide-up");
			if ( _scrollTimer ) clearTimeout(_scrollTimer);
			_scrollTimer = setTimeout(function(){
			    _header.removeClass("show-header slide-up");
			    //_header.removeClass("show-header hide");
			}, 0);

		// }else if (position < _lastScrollPosition){
		// 	if(!_header.hasClass("shrink-header")) {
		// 		console.log("SCROLL UP")
		// 		_header.addClass("hide");
		// 		if ( _scrollTimer ) clearTimeout(_scrollTimer);
		// 		_scrollTimer = setTimeout(function(){
		// 		    _header.addClass("shrink-header").removeClass("hide");
		// 		}, 0);
		// 	}
		} else {
			if(!_header.hasClass("show-header")) {
				//_header.addClass("hide")
				if ( _scrollTimer ) clearTimeout(_scrollTimer);
				_scrollTimer = setTimeout(function(){
					_header.addClass("show-header");//.removeClass("hide");
				}, SCROLL_MENU_TIMER);
			}
		}

		_lastScrollPosition = position;
	};


	var initForms = function(){

		// var emailYouValidator =  $('#gform_4').validate({
		// 	ignore: ".ignore",
		// 	rules: {
		// 		"input_1": "required",
		// 		"input_2": "required",
		// 		"input_3": "required",
		// 		"input_4": "required",
		// 		"input_5": {
		// 			required: true,
		// 			email: true
		// 		},
		// 		"input_7": "required",
		// 		"input_8": "required",
		// 		"input_9": "required",

  //           },
		// 	messages: {
		// 		"input_1": "Please enter your first name",
		// 		"input_2": "Please enter your last name",
		// 		"input_3": "Please select your location",
		// 		"input_4": "Please enter your phone",
		// 		"input_5": { required: "Please enter your email address" },
		// 		"input_7": "Please enter your storage date",
		// 		"input_8": "Please enter your storage size",
		// 		"input_9": "Please enter your storage time",

		// 	},
		// 	errorPlacement: function ( error, element ) {
		// 		element.parent().append(error);
		// 	},
		// });
		var callBackValidator =  $('#gform_3').validate({
			ignore: ".ignore",
			rules: {
				"input_1": "required",
				"input_2": "required",
				"input_3": "required",
				"input_4": "required",
				"input_5": {
					required: true,
					email: true
				},
            },
			messages: {
				"input_1": "Please enter your first name",
				"input_2": "Please enter your last name",
				"input_3": "Please select your location",
				"input_4": "Please enter your phone",
				"input_5": { required: "Please enter your email address" }
			},
			errorPlacement: function ( error, element ) {
				element.parent().append(error);
			},
		});
		var callBackValidator =  $('#gform_3').validate({
			ignore: ".ignore",
			rules: {
				"input_1": "required",
				"input_2": "required",
				"input_3": "required",
				"input_4": "required",
				"input_5": {
					required: true,
					email: true
				},
            },
			messages: {
				"input_1": "Please enter your first name",
				"input_2": "Please enter your last name",
				"input_3": "Please select your location",
				"input_4": "Please enter your phone",
				"input_5": { required: "Please enter your email address" }
			},
			errorPlacement: function ( error, element ) {
				element.parent().append(error);
			},
		});
		var reserveUnitValidator =  $('#gform_5').validate({
			ignore: ".ignore",
			rules: {
				"input_1": "required",
				"input_2": "required",
				"input_3": "required",
				"input_4": "required",
				"input_5": {
					required: true,
					email: true
				},
				"input_7": "required",
				"input_10": "required",
				"input_11": "required",
				"input_12": "required",
				"input_13": "required",
				"input_14": "required",
				"input_15": "required",
            },
			messages: {
				"input_1": "Please enter your first name",
				"input_2": "Please enter your last name",
				"input_3": "Please select your location",
				"input_4": "Please enter your phone",
				"input_5": { required: "Please enter your email address" },
				"input_7": "Please enter your storage date",
				"input_10": "Please units required",
				"input_11": "Please select an option above",
				"input_12": "Please select an option above",
				"input_13": "Please select an option above",
				"input_14": "Please select an option above",
				"input_15": "Please enter how your heard about us",

			},
			errorPlacement: function ( error, element ) {
				if($(element).attr("type")=="radio") {
					element.closest("ul.gfield_radio").append(error);
				}else {
					element.parent().append(error);
				}

			},
		});


		// block links from being submitted in enquiry /contact form
		$.validator.addMethod("no_urls",function(value,element,param) {

			if(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi.test(value)) {
				return false;
			}
			return true;

		},"Links aren't allowed.");

		var blockURLs =  $('#gform_6').validate({
			// ignore: ".ignore",
			rules: {
				"input_6": "no_urls",
            },
			messages: {
				"input_6": "Links aren't allowed.",
			},
			errorPlacement: function ( error, element ) {
				element.parent().append(error);
			},
		});


		// var searchValidator =  $('#location-search').validate({
		// 	rules: {
		// 		"postcode": { required: function() { return $("#mode").val()!=="latlon" } }
  //           },
		// 	messages: {
		// 		"postcode": "Please enter your postcode",
		// 	},
		// 	errorPlacement: function ( error, element ) {
		// 		element.parent().parent().append(error);
		// 	},
		// });

	};

	var initFaqs = function(){

		//inner questions
		$(".faq h4").click(function(){
			$(this).closest(".faq").toggleClass("active");
			return false;
		});

		$(".faq .faq a.question").click(function(){
			$(this).closest(".faq").toggleClass("active");
			return false;
		});

		// tabs
		$('ul.faqs-tabs li').click(function() {
			var tab_id = $(this).attr('data-tab');
			$('ul.faqs-tabs li, .faqs-tab--content').removeClass('active');
			$(this).addClass('active');
			$("#" + tab_id).addClass('active');
			if ($(window).width() < 992) {
				$(".faqs-tabs-container").toggleClass("active");
				let categoryName = $(this).text();
				if(! (categoryName.includes("Select") || categoryName.includes("icons"))) {
					$("#faq-category-active-sm .text").text(categoryName);
					
					$('html,body').stop().animate({
						scrollTop: $("#page-header").offset().top
					}, 'linear');
		
				}
			}
		});
	};

	var initHome = function() {
        var _lat;
        var _lng;

        function getLocation() {
            if (location.protocol !== 'https:') {
                $(".current-location").hide();
            }else {
                //console.log("Geo locating");
                if (navigator.geolocation) {
                    //console.log("Geo locating: Done");
                    navigator.geolocation.getCurrentPosition(showPosition);
                    $(".current-location").show().css({opacity:1});
                } else {
                    //console.log("Cannot Geo locate");
                    $(".current-location").hide();
                }
            }
        }

        function showPosition(position) {
            _lat = position.coords.latitude;
            _lng = position.coords.longitude;
            $("#latlon").val(_lat+", " + _lng);

            console.log( "Latitude: " + position.coords.latitude +
            "<br>Longitude: " + position.coords.longitude );
        }

        $("#postcode").autocomplete({
            minLength:3,
            source: function (request, response) {

                $.ajax({
                    type: 'POST',
                    url: '/wp-content/themes/fort-knox-self-storage/actions/auspost.php',
                    dataType: 'json',
                    data: {
                        postcode: request.term
                    },
                    success: function (data) {
                        //if multiple results are returned
                        if(data.localities.locality instanceof Array) {
                            response ($.map(data.localities.locality, function (item) {
                                return {
                                    label: item.location + ', ' + item.postcode,
                                    value: item.location + ', ' + item.postcode,
                                    //value: item.latitude + ', ' + item.longitude
                                }
                            }));
                        }
                        //if a single result is returned
                        else {
                            response ($.map(data.localities, function (item) {
                                return {
                                    label: item.location + ', ' + item.postcode,
                                    value: item.location + ', ' + item.postcode,
                                }
                            }));
                        }
                    }
                });
            }
        });

        $(".current-location").on("click", function(){
        	$("#mode").val("latlon");
            $("#location-search").submit();
            return false;
        });


        getLocation();
	}

	var initVideoHeader = function() {
		setTimeout(function(){
			$('.background-container').fadeOut('', function() {
				$('.video-wrapper').addClass('video-active');
			});
		}, 2000);
	};

	var initPayBills = function() {
		$('.paybill-select').change(function() {
			var url = $(this).val();
			$(window).attr('location', url)
			$('#pay-bill').attr('src',url);
			$('.pay-intro').slideUp();
			$('#loader').fadeIn();
			$('#pay-bill').on("load", function() {
				$('#loader').fadeOut();
				$('#pay-bill').slideDown();
			});


			//$('#tenant-accounts-app.L012').css( "display", "block" );
			//$('.paybill-form').css( "display", "none" );
			//$('.pay-intro').slideUp();
			//$('#loader').fadeIn();
			//$('.'+url).on("load", function() {
			//	$('#loader').fadeOut();
			//	$('.'+url).slideDown();
			//});
		});
	};

	//Initiate AOS Animations
    AOS.init();

    initApp();
    initForms();
    initFaqs();
    if($("body").hasClass("home") || $("#location-search").length || $("#location-search-map").length) {
    	initHome();
    }

	if ($("body").hasClass("home")) {
		initVideoHeader();
	}

	if ($("body").hasClass("page-pay-your-bills")) {
		initPayBills();
	}

	// if( $("body").hasClass("single-suburb") ) {
	// 	$(window).scroll(function () {
	// 		if ($(window).scrollTop() > $('body').height() / 2 && !$('.cta--help').hasClass('opened')) {
	// 			  $('.cta--help').addClass('open opened');
	// 		}
	// 	});
    //     $(".cta--help .cta--help-close").on("click", function(){
	// 		$('.cta--help').removeClass('open');
    //         return false;
    //     });
	// }

	// allow space for anchor links and fixed header when linking to videos from sales map emails
	var hash= window.location.hash;
	if ( hash == '' || hash == '#' || hash == undefined ) return false;
	var target = $(hash);
	var type = hash.replace('#', '');
	target = target.length ? target : $('[name=' + hash.slice(1) +']');
	if (type == "video") {
	    if ($(window).width() >= 768) {
			$('html,body').stop().animate({
				scrollTop: target.offset().top - 250 //offsets for fixed desktop header
			}, 'linear');
	    } else {
			$('html,body').stop().animate({
				scrollTop: target.offset().top - 125 //offsets for fixed mobile header
			}, 'linear');
	    }
	}

});

function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 15,
		scrollwheel: false,
		center: {
			lat: jQuery('#map').data('lat'),
			lng: jQuery('#map').data('lng')
		},

	});
	var image = {
		url: '/wp-content/themes/fort-knox-self-storage/assets/img/icons/icon-marker.svg',
		size: new google.maps.Size(71, 71),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(17, 34),
		scaledSize: new google.maps.Size(60, 60)
	};
	var marker = new google.maps.Marker({
		position: {
			lat: jQuery('#map').data('lat'),
			lng: jQuery('#map').data('lng')
		},
		map: map,
		icon: image
	});
}

function initMapMultiple() {
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 20,
		scrollwheel: false
	});

    var bounds = new google.maps.LatLngBounds();
    var infowindow = new google.maps.InfoWindow();

	var image = {
		url: '/wp-content/themes/fort-knox-self-storage/assets/img/icons/icon-marker.svg',
		size: new google.maps.Size(71, 71),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(17, 34),
		scaledSize: new google.maps.Size(60, 60)
	};

    var locations = jQuery('#map').data('locations');

    locations.forEach(function(value, i, myArray) {

        var marker = new google.maps.Marker({
            position: {
                lat: value.lat,
                lng: value.lng
            },
            map: map,
            icon: image
        });

        //extend the bounds to include each marker's position
        bounds.extend(marker.position);

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
              infowindow.setContent("<div class='info-container'><h3>"+locations[i].name+"</h3><p class='address'><svg id='Solid' xmlns='http://www.w3.org/2000/svg' width='216' height='216' viewBox='0 0 216 216'><title>x</title><path d='M108,114a26.88,26.88,0,1,1,26.88-26.88A26.62,26.62,0,0,1,108,114Zm0-86A59,59,0,0,0,48.87,87.13C48.87,119.91,108,200,108,200s59.13-80.09,59.13-112.87A59,59,0,0,0,108,28Z'></path></svg>"+locations[i].address+"</p><p class='phone'><svg id='Solid' xmlns='http://www.w3.org/2000/svg' width='216' height='216' viewBox='0 0 216 216'><title>x</title><g><path d='M55.54,41.26a4.11,4.11,0,0,0-2.7,1.52c-1.76,1.73-3.55,3.54-5.28,5.29-2.73,2.76-5.55,5.61-8.46,8.38a12.11,12.11,0,0,0-3.87,8.45c-.5,6.62.82,13.72,4.27,23,5.86,15.77,14.9,30.8,27.64,45.95,3.19,3.8,6.62,7.55,10.2,11.15h0a171.24,171.24,0,0,0,46.72,33.39c11.39,5.54,20.49,8.23,29.52,8.72,5.89.34,9.76-1.05,13-4.64,2.82-3.15,5.78-6,8.64-8.82,1.43-1.39,2.78-2.71,4.11-4.05,2.25-2.27,2.26-3.5.08-5.7-7.25-7.3-14.58-14.63-21.78-21.76-2.07-2-3.26-2.05-5.32,0l-1.74,1.73c-3.87,3.83-7.86,7.79-11.67,11.73l-.12.12a17,17,0,0,1-1.42,1.28l-2.6,2.59A10,10,0,0,1,133,161a12.49,12.49,0,0,1-13,.27c-.91-.49-1.94-1-3-1.53a68.16,68.16,0,0,1-6.36-3.42,137.1,137.1,0,0,1-24.66-20c-4-4-7.94-8.44-11.78-13.15-6.3-7.75-10.63-14.73-13.65-22A12.64,12.64,0,0,1,61.8,88.49a10,10,0,0,1,1-1.21l2.67-2.67a13.61,13.61,0,0,1,1.14-1.22c1.17-1.13,2.55-2.47,3.89-3.81,2.16-2.15,4.28-4.28,6.4-6.41l3-3c2.29-2.3,2.28-3.44-.06-5.8C76.4,60.9,73,57.51,69.22,53.75L65.9,50.42c-2.5-2.51-5.09-5.11-7.64-7.61A4.18,4.18,0,0,0,55.54,41.26Z'></path><path d='M155.16,198.17q-1.08,0-2.21-.06c-10.53-.58-20.94-3.6-33.7-9.81a182.2,182.2,0,0,1-49.71-35.53c-3.79-3.82-7.43-7.8-10.82-11.83C45.16,124.81,35.5,108.72,29.19,91.75c-4-10.86-5.55-19.39-4.93-27.67a23,23,0,0,1,7.25-15.59c2.78-2.64,5.51-5.41,8.16-8.08,1.83-1.85,3.66-3.7,5.45-5.46,3.16-3.11,6.66-4.68,10.41-4.68A14.85,14.85,0,0,1,66,35c2.52,2.47,5.07,5,7.54,7.52l.18.18L77,46c3.77,3.76,7.19,7.17,10.66,10.66,6.64,6.7,6.66,14.66.05,21.3L84.63,81c-2.1,2.11-4.21,4.23-6.35,6.36-1.36,1.36-2.78,2.74-4,3.91l-.08.07-.22.23-.34.41-3,3c-.33.49-.42.95,0,2,2.59,6.22,6.41,12.34,12,19.24,3.6,4.43,7.32,8.58,11.05,12.35a126.2,126.2,0,0,0,22.7,18.38,58.61,58.61,0,0,0,5.35,2.86c1.18.58,2.35,1.15,3.44,1.74s1.5.37,1.81.19l2.95-2.94.48-.38a6.1,6.1,0,0,0,.5-.45l0,0c3.84-4,7.87-8,11.77-11.84l1.76-1.74c6.31-6.26,14.48-6.26,20.8,0,7.25,7.2,14.6,14.54,21.84,21.83,6.46,6.52,6.43,14.64-.07,21.19-1.38,1.4-2.78,2.75-4.25,4.19-2.73,2.66-5.55,5.41-8.12,8.27C169.73,195.43,163.31,198.17,155.16,198.17Zm-19-26.41a56,56,0,0,0,18,4.38c3.12.18,3.58-.34,4.17-1,2.76-3.08,5.55-5.84,8.26-8.48q-5.82-5.84-11.67-11.67c-2.75,2.74-5.51,5.5-8.14,8.23l-.21.21c-.63.63-1.23,1.19-1.84,1.7l-2.22,2.22a21.05,21.05,0,0,1-3.55,2.85A24,24,0,0,1,136.15,171.76ZM55.57,55.63l-.18.19-.07.07c-2.76,2.79-5.62,5.68-8.63,8.54-.35.33-.41.39-.48,1.29-.37,5,.74,10.64,3.61,18.37q.36,1,.73,1.93a24.14,24.14,0,0,1,2.34-4A21,21,0,0,1,55,79.51l2.36-2.36c.51-.59,1.05-1.16,1.62-1.7,1.13-1.09,2.44-2.36,3.73-3.65,1.52-1.51,3-3,4.49-4.49l-5.79-5.77-3.35-3.36L57.92,58Z'></path></g></svg><a href='tel:"+locations[i].phone+"'>"+locations[i].phone+"</a></p><p class='email'><svg id='Solid' xmlns='http://www.w3.org/2000/svg' width='216' height='216' viewBox='0 0 216 216'><title>fortknox-icons-export</title><g><polygon points='201.06 55.84 149.2 105.98 201.06 159.56 201.06 55.84'></polygon><polygon points='108 145.82 74.58 113.51 22.3 167.51 193.7 167.51 141.42 113.51 108 145.82'></polygon><polygon points='14.94 159.56 66.8 105.99 14.94 55.84 14.94 159.56'></polygon><polygon points='108 130.77 193.09 48.49 22.91 48.49 108 130.77'></polygon></g></svg><a href='mailto:"+locations[i].email+"'>Send an Email</a></p></div>");
              infowindow.open(map, marker);
            }
          })(marker, i));

    });

    map.fitBounds(bounds);

}