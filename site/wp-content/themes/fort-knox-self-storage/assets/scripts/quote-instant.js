var _gst = 1.1;
var contentserver = "https://www.fortknoxselfstorage.com.au/";

var apiserver = "https://fortknoxsitelink.studiomoso.com.au/";
//var apiserver = "https://fortknoxsitelink.studiomoso.com.au/staging/";
//var apiserver = "http://fortknox.local/";

var _units = null;
var _mobileunits = null;
var _spaces = null;
var _locationcode = null;
var _unit = null;

var matched, browser;

jQuery.uaMatch = function (ua) {
  ua = ua.toLowerCase();

  var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
    /(webkit)[ \/]([\w.]+)/.exec(ua) ||
    /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
    /(msie) ([\w.]+)/.exec(ua) ||
    ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
    [];

  return {
    browser: match[1] || "",
    version: match[2] || "0"
  };
};

matched = jQuery.uaMatch(navigator.userAgent);
browser = {};

if (matched.browser) {
  browser[matched.browser] = true;
  browser.version = matched.version;
}

// Chrome is Webkit, but Webkit is also Safari.
if (browser.chrome) {
  browser.webkit = true;
} else if (browser.webkit) {
  browser.safari = true;
}

jQuery.browser = browser;

function generateQuote(data) {
  jQuery("#quote-result--generated").html(tmpl("tmpl-quote-instant", data));
}

function replaceURLDomain(urlstr) {
  var url = urlstr.replace("http://fortknox.local/", contentserver);
  return url;
}

function getUpsizeVacantUnit(units, from){
	var size = units[from].dcArea;
	for (var i = from; i < units.length; i++) {
		if(units[i].itotalVacant>0 && units[i].dcArea > size){
      		return units[i];
		}
	}
	return null;
}

function getDownsizeVacantUnit(units, from){
	var size = units[from].dcArea;
	for (var i = from; i >= 0; i--) {
		if(units[i].itotalVacant>0 && units[i].dcArea < size){
      		//return units[i];
      		return getUnitWithType(units, units[i].stypeName + units[i].dcWidthStr + units[i].dcLengthStr);
		}
	}
	return null;
}

function getNextVacantUnit(units, from){
	for (var i = from; i < units.length; i++) {
		if(units[i].itotalVacant>0){
      		return units[i];
		}
	}
	return null;
}

function getUnitWithType(units, unittype) {
  for (var i = 0; i < units.length; i++) {
    if (
      units[i].stypeName + units[i].dcWidthStr + units[i].dcLengthStr ==
      unittype
    ) {
    	if(units[i].itotalVacant>0){
      		return units[i];
      	}
      	else{
      		return getNextVacantUnit(units, i);
      	}
    }
  }
  return null;
}

function getRoomWithID(spaces, id) {
  if (id == winestorage.ID) {
    return winestorage;
  } else if (id == mobilestorage.ID) {
  	return mobilestorage;
  } else if (id == carstorage.ID) {
    return carstorage;
  }

  for (var i = 0; i < spaces.length; i++) {
    if (spaces[i].ID == id) {
      return spaces[i];
    }
  }
  return null;
}

function getSpaceTitle(room, unit) {
  if( room && ("Self Storage" == unit.stypeName || unit.stypeName.toLowerCase().indexOf("mobile storage")>=0)){
    return room.post_title
  }
  return unit.stypeName;
}

function getSpaceDetails(room, unit) {
  // return round(unit.dcWidth, 1) + " x " + round(unit.dcLength, 1) + " - " +
  // round(unit.dcWidth * unit.dcLength, 1) + "m<sup>2</sup>";
  return round(unit.dcWidth * unit.dcLength, 1) + "m<sup>2</sup>"; // only
  // show
  // total
  // space
  // return unit.dcWidth + "m × " + unit.dcLength + "m";
}

function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

function submitform(path, params, method) {
  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);

  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      var hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", key);
      hiddenField.setAttribute("value", params[key]);

      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  //console.log(form);
  form.submit();
}

function translateSize(size) {
  if (size == "1 Bedroom Apartment") {
    // return '1-2 Bedroom Apartment/House';
    return "1 bedroom flat";
  } else if (size == "1-2 Bedroom Flat Contents") {
    return "1 - 2 bedroom flat";
  } else if (size == "3 Bedroom Flat or 2 Bedroom House") {
    return "3 bedroom flat or 2 bedroom house";
  } else if (size == "3 - 4 Bedroom House") {
    return "3 - 4 bedroom house";
  } else if (
    size.toLowerCase().indexOf("commercial") >= 0 ||
    size.toLowerCase().indexOf("business") >= 0
  ) {
    return "Importers/Commercial/Large House";
  } else if (size.toLowerCase().indexOf("car") >= 0) {
    return "Car / Boat / Caravan";
  } else if (size.toLowerCase().indexOf("locker") >= 0) {
    return "small items";
  } else if (size.toLowerCase().indexOf("small") >= 0) {
    return "small items";
  }
  return "";
}

function striphtml(str) {
  return str.replace(/<\/?[^>]+(>|$)/g, "");
}

function getNotes(instantquoteform) {
  var notes =
    "Space Required: " +
    instantquoteform.find("input[name=space]").val() +
    " " +
    striphtml(instantquoteform.find("input[name=size]").val());
  notes =
    notes + " \r\nLength: " + instantquoteform.find("input[name=length]").val();
  // var extrainsurance =
  // instantquoteform.find('input[name=extrainsurance]').val();
  // if('yes' == extrainsurance){
  // notes = notes + " \r\nAdd extra insurance";
  // }
  // var packingsupplies =
  // instantquoteform.find('input[name=packingsupplies]').val();
  // if('yes' == packingsupplies){
  // notes = notes + " \r\nAdd packing supplies";
  // }
  return notes;
}

function goToWeWillEmailYou() {
  var instantquoteform = jQuery("#quote-instant");

  var data = {
    loc: instantquoteform.find("input[name=location]").val(),
    storage: translateSize(instantquoteform.find("input[name=space]").val()),
    space: instantquoteform.find("input[name=space]").val(),
    size: striphtml(instantquoteform.find("input[name=size]").val()),
    storagelength: instantquoteform.find("input[name=length]").val(),
    price: instantquoteform.find("input[name=webprice]").val(),
    // 'insurance' : 'yes' ==
    // instantquoteform.find('input[name=extrainsurance]').val() ? 'Yes' :
    // '',
    // 'supplies' : 'yes' ==
    // instantquoteform.find('input[name=packingsupplies]').val() ? 'Yes' :
    // '',
    quote: getNotes(instantquoteform),
  };

  submitform("/online-reservation-instant-quote/", data, "get");
  // submitform('/reserve-a-unit/online-reservation/', data, 'get');
  // submitform('/quote/well-email-you/', data, 'get');
}

function displayPrice() {
  var space_pushprice = Number(
    jQuery("#quote-instant input[name=pushprice]").val()
  );
  var space_stdprice = Number(
    jQuery("#quote-instant input[name=stdprice]").val()
  );
  var space_webprice = Number(
    jQuery("#quote-instant input[name=webprice]").val()
  );

  var discountplan = [];

  var discountplan251 =[
    "25% Off 1st Month",
    "(Min 1 month)",
    "0.75",
    "Unit prices may vary due to accessibility & location. Prices include GST. 25% off 1st month special requires the 1st month to be paid when you move-in."
  ];

  var discountplan25 =[
    "25% Off 1st 4 Months",
    "(Min 1 month)",
    "0.75",
    "Unit prices may vary due to accessibility & location. Prices include GST. 25% off 1st 4 months special requires the 1st month to be paid when you move-in."
  ];

  var discountplanfree1st =[
    "Free 1st Month",
    "(Min 2 months)",
    "0",
    "Unit prices may vary due to accessibility & location. Prices include GST. Free 1st months special requires minimum 2 months, 2nd month must be paid up front."
  ];

  if(_locationcode === "L012") {
  	//Braybrook
  	discountplan = discountplanfree1st;
  }
  else if(_locationcode === "L011") {
  	//Coburg
  	discountplan = discountplan25;
  }
  else{
  	discountplan = discountplan251;
  }

  if (space_webprice == '') {
    space_webprice = space_pushprice;
  }
  // update pricing panel
  jQuery(".quote-instant__quote_price").removeClass(
    "quote-instant__quote_disabled"
  );
  if(discountplan.length>0)
  {
  	jQuery(".quote-instant__quote_price-special h3").text(discountplan[0]);
  	jQuery(".quote-instant__quote_price-special p").text(discountplan[1]);
  }

  // set pricing
  jQuery("#quote-pricing-regular-container").show();
  jQuery(".quote-instant__quote_price-regular .quote-pricing-animate").text(
    space_webprice
  );
  jQuery(".quote-instant__quote_price-regular img").addClass('show');

  if (discountplan.length>0 && space_stdprice != space_webprice) {
    jQuery(".quote-instant__quote_price-regular #quote-pricing-standard-crossed").text(space_stdprice);
    jQuery(".quote-instant__quote_price-regular .quote-pricing-standard-crossed-container").show();

    jQuery(".special-price-label .btn--price").addClass('isSpecialPrice');
  }
  else {
    jQuery(".quote-instant__quote_price-regular #quote-pricing-standard-crossed").text("");
    jQuery(".quote-instant__quote_price-regular .quote-pricing-standard-crossed-container").hide();
    jQuery(".isSpecialPrice").removeClass('isSpecialPrice');
  }

  if(discountplan.length>0)
  {
      jQuery("#quote-pricing-special-container").show();
	  setTimeout(function () {
	    var discount = (space_webprice * discountplan[2]).toFixed(2);
	    jQuery(".quote-instant__quote_price-special .quote-pricing-animate").text(
	      discount
	    );
	  }, 250);

	  jQuery('.discounttc').html(discountplan[3]);
  }
  else{
  	jQuery('.discounttc').html("");
  	jQuery("#quote-pricing-special-container").hide();
  }

  jQuery(".fn-button-book-now").on("click", function () {
    goToWeWillEmailYou();
    return false;
  });

  // jQuery('.quote-add-extra-insurance').on('click', function(){
  // var button = jQuery(this);
  // var instantquoteform = jQuery('#quote-instant');

  // if(button.hasClass('active')){
  // button.removeClass('active')
  // instantquoteform.find('input[name=extrainsurance]').val('');
  // }
  // else{
  // button.addClass('active')
  // instantquoteform.find('input[name=extrainsurance]').val('yes');
  // }
  // return false;
  // });

  // jQuery('.quote-add-packing-supplies').on('click', function(){
  // var button = jQuery(this);
  // var instantquoteform = jQuery('#quote-instant');

  // if(button.hasClass('active')){
  // button.removeClass('active')
  // instantquoteform.find('input[name=packingsupplies]').val('');
  // }
  // else{
  // button.addClass('active')
  // instantquoteform.find('input[name=packingsupplies]').val('yes');
  // }
  // return false;
  // });
}

function enableUpDownSizeButtons(unit) {

	var units = (isInArray(mobilestorage.ID, unit._rangeids)) ? _mobileunits : _units;

	  if (getDownsizeVacantUnit(units, unit._index)==null) {
	    jQuery('.fn-button-downsize').hide();
	  }
	  else {
	    jQuery('.fn-button-downsize').show();
	  }

	  if (getUpsizeVacantUnit(units, unit._index)!=null) {
	    jQuery('.fn-button-upsize').show();
	  }
	  else {
	    jQuery('.fn-button-upsize').hide();
	  }

}

function selectUnit(unit) {
  _unit = unit; //set currently selected unit

  enableUpDownSizeButtons(unit);

  var room = unit._room;


  // update step value

  var space_title = getSpaceTitle(room, unit);
  var space_details = getSpaceDetails(room, unit);
  if(_locationcode === "L009") {
    // if()
    //   jQuery("#quote-unit-select").find('li[data-unittype="Mobile Storage3.62.2"] a').attr("href", "https://www.youtube.com/embed/fD7u35HlJEU");
    //   jQuery("#quote-unit-select").find('li[data-unittype="Mobile Storage4.82.2"] a').attr("href", "https://www.youtube.com/embed/PpW7Qt4NyXs");
    var space_video = "";
    if(space_details === "7.9m<sup>2</sup>") {
      space_video ="https://www.youtube.com/embed/fD7u35HlJEU";
    } else if (space_details === "10.6m<sup>2</sup>") {
      space_video ="https://www.youtube.com/embed/PpW7Qt4NyXs";
    }
  } else {
    var space_video =
      "https://player.vimeo.com/video/" +
      room.customfields.video_id +
      "";
  }
  var space_thumb = replaceURLDomain(room.post_thumbnail_medium);
  var space_stdprice = unit.dcStdRateStrWithGST;
  var space_pushprice = unit.dcPushRateStrWithGST;
  var space_webprice = unit.dcWebRateStrWithGST;
  //var space_left = unit.itotalVacant - unit.itotalReserved;
  var space_left = unit.itotalVacant;

  var form = jQuery("#quote-instant");
  form.find("input[name=pushprice]").val(space_pushprice);
  form.find("input[name=stdprice]").val(space_stdprice);
  form.find("input[name=webprice]").val(space_webprice);
  form.find("input[name=space]").val(space_title);
  form.find("input[name=size]").val(space_details);

/*
  if (space_left <= 1) {
    space_left = 1;
  } else if (space_left > 10) {
    space_left = 10;
  }
*/

  var spacecontainer = jQuery(".quote-instant__step-space");
  var spacecontainerOverview = jQuery(".space-container__meta");

  //spacecontainer.find(".quote-instant__step-result p small.space_title").text(space_title);
  //spacecontainer.find(".quote-instant__step-result p small.space_details span").html(space_details);

  spacecontainer
    .find(".quote-instant__step-result .selected-value")
    .html(space_details);
  spacecontainer
    .find(".quote-instant__step-result .selected-range")
    .html(space_title);

  spacecontainerOverview
    .find(".space-container__space")
    .html(space_details);
  spacecontainerOverview
    .find(".space-container__title")
    .html(space_title);

  jQuery("#quote-units-left").html(space_left);
  spacecontainer.removeClass("quote-instant__step-expanded");
  spacecontainer.addClass("quote-instant__step-selected");
  spacecontainer.find(".quote-instant__step-select").slideUp("fast");

  // set up next step
  // jQuery('.quote-instant__quote_length').addClass('quote-instant__step-highlight');

  if (
    jQuery(".quote-instant__step-length").hasClass(
      "quote-instant__step-disabled"
    )
  ) {
    jQuery(".quote-instant__step-length").removeClass(
      "quote-instant__step-disabled"
    );
    // jQuery('.quote-instant__quote_space').removeClass('quote-instant__step-highlight');
    jQuery(".quote-instant__step-length").addClass(
      "quote-instant__step-selected"
    );

    jQuery(".quote-instant__step-length").toggleClass(
      "quote-instant__step-expanded"
    );
    jQuery(
      ".quote-instant__step-length .quote-instant__step-select"
    ).slideToggle("fast");
  }

  // update details result - pricing
  // jQuery('.quote-instant__quote_space').removeClass('quote-instant__quote_disabled');
  // jQuery('.quote-instant__quote_space a').attr("href", space_video);
  // jQuery('.quote-instant__quote_space a img').attr("src", space_thumb);
  // jQuery('.quote-instant__quote_space p
  // small.space_title').text(space_title);
  // jQuery('.quote-instant__quote_space p small.space_details
  // span').html(space_details);

  // update video thumb selection if available
  if (room.customfields.video_id != "") {
    jQuery(
      ".quote-instant__step-space .quote-instant__step-result .video-thumb"
    ).css("display", "inline-flex");
    jQuery(
      ".quote-instant__step-space .quote-instant__step-result .video-thumb a"
    ).attr("href", space_video);
    jQuery(
      ".quote-instant__step-space .quote-instant__step-result .video-thumb  a span"
    ).css("background-image", "url(" + space_thumb + ")");
    jQuery(
      ".space-container__thumb"
    ).css("background-image", "url(" + space_thumb + ")");
  } else {
    jQuery(
      ".quote-instant__step-space .quote-instant__step-result .video-thumb"
    ).css("display", "none");
  }

  if (
    !jQuery(".quote-instant__quote_price").hasClass(
      "quote-instant__quote_disabled"
    )
  ) {
    displayPrice();
  }

}

function selectUnitWithID(unittype) {
  var unit = getUnitWithType(_units, unittype);
  if(unit == null){
  	unit = getUnitWithType(_mobileunits, unittype);
  }
  selectUnit(unit);
}

function getUnitType(unit){
	return "" + unit.stypeName + unit.dcWidthStr + unit.dcLengthStr;
}

function listContainUnit(units, unit){
	for(var i=0; i < units.length; i++){
		if(getUnitType(units[i]) == getUnitType(unit)){
			return true;
		}
	}
	return false;
}

function dedupUnits(units){
	var deduped = new Array();
	for(var i=0; i < units.length; i++){
		if(!listContainUnit(deduped, units[i])){
			deduped[deduped.length] = units[i];
		}
	}
	return deduped;
}

function displayUnitSelection(rangeid) {
  var spaces = _spaces;
  var units = rangeid == mobilestorage.ID ? _mobileunits : _units;
  jQuery("#quote-unit-select").html(
    tmpl("tmpl-quote-unit-select", {
      spaces: spaces,
      units: dedupUnits(units),
      rangeid: rangeid,
    })
  );

  if(_locationcode === "L009") {
    jQuery("#quote-unit-select").find('li[data-unittype="Mobile Storage3.62.2"] a').attr("href", "https://www.youtube.com/embed/fD7u35HlJEU");
    jQuery("#quote-unit-select").find('li[data-unittype="Mobile Storage4.82.2"] a').attr("href", "https://www.youtube.com/embed/PpW7Qt4NyXs");
  }

  if (
    jQuery(".quote-instant__step-space").hasClass(
      "quote-instant__step-disabled"
    )
  ) {
    jQuery(".quote-instant__step-space").removeClass(
      "quote-instant__step-disabled"
    );
    jQuery(".quote-instant__step-space").addClass(
      "quote-instant__step-selected"
    );

    jQuery(".quote-instant__step-space").toggleClass(
      "quote-instant__step-expanded"
    );
    jQuery(
      ".quote-instant__step-space .quote-instant__step-select"
    ).slideToggle("fast");
  }

  // select space
  jQuery(".quote-instant__step-select-space li").on("click", function (e) {
    if (e.target != this) return; // allow click for video inside li

    var ele = jQuery(this);
    selectUnitWithID(ele.attr("data-unittype"));
    setStepActive(jQuery(".quote-instant__step-length"));
  });
}

function smallerThanRoom(room, unit) {
  var w = unit.dcWidth > unit.dcLength ? unit.dcWidth : unit.dcLength;
  var l = unit.dcWidth > unit.dcLength ? unit.dcLength : unit.dcWidth;

  if (typeof room.maxsize == "undefined") {
    var roomsizestr = room.customfields.room_size;
    var roomsizeitems = roomsizestr.split(/[x-]/);
    var roomw = Number(roomsizeitems[0].trim());
    var rooml = Number(roomsizeitems[1].trim());
    //console.log("no room.maxsize");
    if (w * l <= roomw * rooml) {
      return true;
    }
    return false;
  } else {
    //console.log(w + "x" + l + " < " + room.maxsize + " " +(w * l < room.maxsize));
    return w * l <= room.maxsize;
  }
}

var spacelabels = [
  {
    ID: 1,
    post_title: "Locker",
    post_thumbnail_medium:
      "https://www.fortknoxselfstorage.com.au/wp-content/uploads/2019/08/icon-locker-green-300x300.png",
    maxsize: 2.0,
    customfields: {
      video_id: "",
    },
  },
  {
    ID: 2,
    post_title: "Small Space - Seasonal Declutter",
    post_thumbnail_medium:
      "https://www.fortknoxselfstorage.com.au/wp-content/uploads/2017/07/1-5x1-5-300x300.jpg",
    maxsize: 3.0,
    customfields: {
      video_id: "414651501",
    },
  },
  {
    ID: 3,
    post_title: "1 Bedroom Apartment",
    post_thumbnail_medium:
      "https://www.fortknoxselfstorage.com.au/wp-content/uploads/2017/07/3-0x1-5-1-300x300.jpg",
    maxsize: 5.9,
    customfields: {
      video_id: "414651517",
    },
  },
  {
    ID: 4,
    post_title: "1-2 Bedroom Apartment",
    post_thumbnail_medium:
      "https://www.fortknoxselfstorage.com.au/wp-content/uploads/2017/07/3-0x2-0-1-300x300.jpg",
    maxsize: 7.9,
    customfields: {
      video_id: "414651548",
    },
  },
  {
    ID: 5,
    post_title: "2 Bed House / 3 Bed Apt",
    post_thumbnail_medium:
      "https://www.fortknoxselfstorage.com.au/wp-content/uploads/2017/07/3-0x3-0-300x300.jpg",
    maxsize: 9.5,
    customfields: {
      video_id: "414651586",
    },
  },
  {
    ID: 6,
    post_title: "3 Bedroom House",
    post_thumbnail_medium:
      "https://www.fortknoxselfstorage.com.au/wp-content/uploads/2017/07/4-0x3-0-300x300.jpg",
    maxsize: 12.0,
    customfields: {
      video_id: "414651619",
    },
  },
  {
    ID: 7,
    post_title: "4 Bedroom House",
    post_thumbnail_medium:
      "https://www.fortknoxselfstorage.com.au/wp-content/uploads/2017/07/6-0x3-0-300x300.jpg",
    maxsize: 18.0,
    customfields: {
      video_id: "414651695",
    },
  },
  {
    ID: 8,
    post_title: "Large House, Importers or Commercial",
    post_thumbnail_medium:
      "https://www.fortknoxselfstorage.com.au/wp-content/uploads/2017/07/7-5x3-0-300x300.jpg",
    maxsize: 1000.0,
    customfields: {
      video_id: "414651753",
    },
  },
];

var winestorage = {
  ID: 9,
  post_title: "Wine Storage",
  post_thumbnail_medium:
    "https://www.fortknoxselfstorage.com.au/wp-content/uploads/2019/08/icon-locker-green-300x300.png",
  maxsize: 2.0,
  customfields: {
    video_id: "",
  },
};

var carstorage = {
  ID: 10,
  post_title: "Car / Boat Storage",
  post_thumbnail_medium:
    "https://www.fortknoxselfstorage.com.au/wp-content/uploads/2017/07/6-0x3-0-300x300.jpg",
  maxsize: 19.0,
  customfields: {
    video_id: "414651695",
  },
};

var mobilestorage = {
  ID: 11,
  post_title: "Mobile Storage",
  post_thumbnail_medium:
    "https://www.fortknoxselfstorage.com.au/wp-content/uploads/2017/07/6-0x3-0-300x300.jpg",
  maxsize: 19.0,
  customfields: {
    video_id: "414651695",
  },
};

function getSpaceForUnit(spaces, unit, locationcode) {
  // use the longer measurement as width
  var w = unit.dcWidth > unit.dcLength ? unit.dcWidth : unit.dcLength;
  var l = unit.dcWidth > unit.dcLength ? unit.dcLength : unit.dcWidth;

  var spacelist = [];

  //console.log(unit.stypeName);
  if (unit.stypeName && unit.stypeName == "Wine Storage") {
    spacelist[spacelist.length] = winestorage;
    return spacelist;
  }
  else if (unit.stypeName && unit.stypeName.toLowerCase().indexOf("mobile storage")>=0) {
    spacelist[spacelist.length] = mobilestorage;
    return spacelist;
  } else if (
    (locationcode == "L006" && w == 6.1 && l == 2.4) || //Moorabbin
    (locationcode == "L008" && w == 6.1 && l == 2.4) || //Dandenong
    (locationcode == "L005" && w == 6 && l == 3) || //Ringwood
    (locationcode == "L007" && w == 6 && l == 3) || //Scoresby
    (locationcode == "L010" && w == 6 && l == 3) || //Keysborough
    (locationcode == "L011" && w == 6 && l == 3) //Coburg
  ) {
    spacelist[spacelist.length] = carstorage;
  }

  for (var i = 0; i < spaces.length; i++) {
    if (smallerThanRoom(spaces[i], unit)) {
      // unit is smaller than smallest room
      if (i == 0) {
        spacelist[spacelist.length] = spaces[i];
      }
    } else if (i + 1 < spaces.length && smallerThanRoom(spaces[i + 1], unit)) {
      // unit is bigger than current room but smaller than the next one
      spacelist[spacelist.length] = spaces[i + 1];
    }
  }
  if (spaces.length == 0) {
    spacelist[spacelist.length] = spaces[spaces.length - 1];
  }
  return spacelist;
}

function setStepActive(container) {
  container.addClass("quote-instant__step-expanded");
  container.removeClass("quote-instant__step-disabled");
  container.find(".quote-instant__step-select").slideDown("fast");

  if (window.location.hash) {
    container
      .find(".chosen-select")
      .val(window.location.hash.replace("#", ""))
      .trigger("change");
    container.find(".chosen-select").trigger("chosen:updated");
  }
}

function setStepSelected(container, text) {
  if (typeof text != "undefined" && text) {
    container.find(".quote-instant__step-result p small").text(text);
    container.removeClass("quote-instant__step-expanded");
    container.find(".quote-instant__step-select").slideToggle("fast");
    container.addClass("quote-instant__step-selected");
  }

  container.removeClass("quote-instant__step-flash");
}

function isInArray(item, list) {
  if (item && list) {
    for (var i = 0; i < list.length; i++) {
      if (list[i] == item) {
        return true;
      }
    }
  }
  return false;
}

function rangeHasUnits(rangeid, units) {
  for (var i = 0; i < units.length; i++) {
    //console.log(units[i]._title);
    if (isInArray(rangeid, units[i]._rangeids)) {
      return true;
    }
  }
  return false;
}

function getIDsForRanges(ranges) {
  var ids = [];
  for (var i = 0; i < ranges.length; i++) {
    ids[ids.length] = ranges[i].ID;
  }
  return ids;
}

function setupUnits(units, locationcode) {
  for (var i = 0; i < units.length; i++) {
    var unit = units[i];
    var ranges = getSpaceForUnit(spacelabels, unit, locationcode);
    unit._room = ranges[0];
    unit._title = getSpaceTitle(unit._room, unit);
    unit._rangeids = getIDsForRanges(ranges);
    unit._index = i;
  }
  return units;
}

function loadRanges(locationcode) {
  jQuery.ajax({
    url: apiserver + "api/get-pricelist.jsp",
    data: {
      locationcode: locationcode,
    },
    jsonp: "callback",
    dataType: "jsonp",
    success: function (data) {
      //console.log("loadRanges data:" + JSON.stringify(data));
      var units = setupUnits(data.units, locationcode);
      //console.log("loadRanges units:" + JSON.stringify(units));
      var mobileunits = setupUnits(data.mobile, locationcode);

      _locationcode = locationcode;
      _units = units;
      _mobileunits = mobileunits;

      displayRanges();
    },
  });
}

function displayRanges() {
  var locationcode = _locationcode;
  jQuery(".quote-instant__quote_unit").addClass(
    "quote-instant__step-highlight"
  );
  setStepActive(jQuery(".quote-instant__step-range"));

  var rangecontainer = jQuery("#quote-range-select");
  var labels = (locationcode != "L009") ? spacelabels.slice() : new Array();

  labels[labels.length] = mobilestorage;
  //console.log("mobile storage");

  if (locationcode != "L009"){

	  // Eltham, Ringwood,  Scoresby
	  if (
	    locationcode == "L004" ||
	    locationcode == "L005" ||
	    locationcode == "L007"
	  ) {
	    labels[labels.length] = winestorage;
	    //console.log("added wine");
	  }
	  //Moorabbin, Dandenong, Ringwood, Scoresby, Keysborough, Coburg
	  if (
	    locationcode == "L006" ||
	    locationcode == "L008" ||
	    locationcode == "L005" ||
	    locationcode == "L007" ||
	    locationcode == "L010" ||
	    locationcode == "L011"
	  ) {
	    labels[labels.length] = carstorage;
	    //console.log("added car");
	  }
  }
  rangecontainer.html(
    tmpl("tmpl-quote-range-select", { spacelabels: labels, units: _units, mobileunits: _mobileunits })
  );

  if (!jQuery.browser.device) {
    chosen(rangecontainer);
  } else {
    chosenMobileFallback(rangecontainer);
  }

  rangecontainer.find("select").on("change", function () {
    // update step value
    var selectedoption = jQuery(this).find("option:selected");
    var range = selectedoption.text();
    var value = selectedoption.val();

    if (range) {
      setStepSelected(jQuery(".quote-instant__step-range"), range);
      loadUnitList(value);
    }
  });
  console.log('locationcode = ' + _locationcode);

  if(_locationcode == 'L009'){
  	console.log('_locationcode L009');
  	rangecontainer.find('select').val(mobilestorage.ID).trigger('change');
  }
}

function loadUnitList(rangeid) {

  setStepActive(jQuery(".quote-instant__step-space"));
  displayUnitSelection(rangeid);
}

function chosen(container) {
  if (typeof container == "undefined") {
    container = jQuery("BODY");
  }

  container
    .find(".chosen-select")
    .chosen({
      disable_search_threshold: 100,
      inherit_select_classes: true,
      width: "100%",
    })
    .on("chosen:showing_dropdown", function (evt, params) {
      jQuery(this).parent().addClass("is-active");
      jQuery.js("custom-scroll").find(".chosen-results").niceScroll({
        cursorcolor: "#ccc",
        cursorwidth: "10px",
        background: "#f9f9f9",
        cursorborder: "1px solid #eeeeee",
        cursorborderradius: 0,
        cursoropacitymin: 1,
      });
    })
    .on("chosen:hiding_dropdown", function (evt, params) {
      jQuery(this).parent().removeClass("is-active");
    });
}

function chosenMobileFallback(container) {
  if (typeof container == "undefined") {
    container = jQuery("BODY");
  }
  container.find(".chosen-select").addClass("chosen-mobile-fallback");
}

function upsize() {
  //console.log("upsize");
  var units = (isInArray(mobilestorage.ID, _unit._rangeids)) ? _mobileunits : _units;
  var upunit = getUpsizeVacantUnit(units, _unit._index);
  selectUnit(upunit);
}

function downsize() {
  //console.log("downsize");
  var units = (isInArray(mobilestorage.ID, _unit._rangeids)) ? _mobileunits : _units;
  var downunit = getDownsizeVacantUnit(units, _unit._index);
  selectUnit(downunit);
}

jQuery(document).ready(function ($) {
  $("#begin-btn, #begin-btn--mobile").on("click", function (e) {
    e.preventDefault();

    $("#header").addClass("show-header");
    $("body").addClass("quote-start");

    // scroll to section to begin
    if ($(window).width() >= 768) {
      // $('#quote-result').animate({
      // scrollTop: $("#begin").offset().top - 180
      // }, 1000);
    } else {
      $("html, body").animate(
        {
          scrollTop: $(".quote-instant__steps").offset().top - 605,
        },
        1000
      );
    }
    $("#quote-result--generated").fadeIn();
    $(".quote-intro").addClass("quote-begin");
    $(".quote-intro h1 .icon").addClass("collapse");
    $(".quote-intro .intro").slideUp();
    $("#begin-btn").slideUp();

    // set up first step

    $(".quote-instant__step-location").addClass("quote-instant__step-flash");
    setStepActive($(".quote-instant__step-location"));

    $(".quote-instant__quote_location").addClass(
      "quote-instant__step-highlight"
    );
  });

  if ($(".quote-instant__step").length) {
    // init quote panel with bank values
    generateQuote({});

    // toggle steps selection
    $(".tooltip").on("click", function (e) {
      e.stopPropagation();
    });

    $(".quote-instant__step")
      .find(".quote-instant__step-header")
      .click(function (e) {
        if (!$(e.target).is(".quote-instant__step-header span")) {
          var selectedvalue = $(this).parent().find(".selected-value").html();
          //console.log(selectedvalue);
          if (typeof selectedvalue != "undefined" && selectedvalue != "") {
            $(this).parent().toggleClass("quote-instant__step-expanded");
            $(this).next().slideToggle("fast");
            //$(".quote-instant__step-select").not($(this).next()).slideUp("fast");
            //$(".quote-instant__step").not($(this).parent()).removeClass("quote-instant__step-expanded");
          }
        }
      });
    // click result to change selection
    $(".quote-instant__step")
      .find(".quote-instant__step-result p")
      .click(function (e) {
        $(this).parent().parent().toggleClass("quote-instant__step-expanded");
        $(this).parent().prev().slideToggle("fast");
        $(".quote-instant__step-select")
          .not($(this).parent().prev())
          .slideUp("fast");
        $(".quote-instant__step")
          .not($(this).parent().parent())
          .removeClass("quote-instant__step-expanded");
      });

    // select location
    $(".quote-instant__step-select").on("click", function () {
      $(".quote-instant__step-location").removeClass(
        "quote-instant__step-flash"
      );
    });
    $(".quote-instant__step-location select").on("change", function () {
      // console.log("change");
      var selectedoption = $("option:selected", this);
      var locationcode = selectedoption.val();
      var location = selectedoption.text();
      jQuery("#quote-instant input[name=location]").val(location.trim());

      $.ajax({
        url: "/wp-content/themes/fort-knox-self-storage/api/get-location.php",
        data: {
          location_code: locationcode,
        },
        dataType: "json",
        success: function (data) {
          // load location into template
          generateQuote({
            location: data,
          });

          setStepSelected($(".quote-instant__step-location"), data.post_title);

          loadRanges(locationcode);

          // update details result - location
          $(".quote-instant__quote_location .quote-instant__quote_placeholder")
            .fadeOut()
            .promise()
            .done(function () {
              $(".quote-instant__quote_location").removeClass(
                "quote-instant__quote_disabled"
              );
              $(".quote-instant__quote_location-address-details").fadeIn();
              $(".quote-instant__quote_location-features").delay(250).fadeIn();
              $(".quote-instant__quote_reviews").removeClass(
                "quote-instant__quote_reviews_disabled"
              );

              // show reviews
              if (data.post_title == "Alphington") {
                $("#reviews").html($("#review-alphington").html());
              } else if (data.post_title == "Coburg") {
                $("#reviews").html($("#review-coburg").html());
              } else if (data.post_title == "Dandenong") {
                $("#reviews").html($("#review-dandenong").html());
              } else if (data.post_title == "Eltham") {
                $("#reviews").html($("#review-eltham").html());
              } else if (data.post_title == "Keysborough") {
                $("#reviews").html($("#review-keysborough").html());
              } else if (data.post_title == "Melbourne") {
                $("#reviews").html($("#review-melbourne").html());
              } else if (data.post_title == "Moorabbin") {
                $("#reviews").html($("#review-moorabbin").html());
              } else if (data.post_title == "Ringwood") {
                $("#reviews").html($("#review-ringwood").html());
              } else if (data.post_title == "Scoresby") {
                $("#reviews").html($("#review-scoresby").html());
              } else if (data.post_title == "Vermont") {
                $("#reviews").html($("#review-vermont").html());
              } else if (data.customfields.location_code == "L009") {
                $("#reviews").html($("#review-gobox").html());
              }
            });

          $(".fn-button-downsize").on("click", function () {
            //console.log(".fn-button-downsize");
            downsize();
            return false;
          });

          $(".fn-button-upsize").on("click", function () {
            //console.log(".fn-button-upsize");
            upsize();
            return false;
          });
        },
      });

      // update details result - location
      $(".quote-instant__quote_location .quote-instant__quote_placeholder")
        .fadeOut()
        .promise()
        .done(function () {
          $(".quote-instant__quote_location").removeClass(
            "quote-instant__quote_disabled"
          );
          $(".quote-instant__quote_location-address-details").fadeIn();
          $(".quote-instant__quote_location-features").delay(250).fadeIn();
        });

      // auto scroll desktop to pricing panel
      if ($(window).width() >= 768) {
        // $('#quote-result').animate({
        // scrollTop: $("#quote-result--generated").offset().top + 200
        // }, 1000);
      }
    });

    // select length
    $(".quote-instant__step-length select").on("change", function () {
      if (
        jQuery(".quote-instant__quote_price").hasClass(
          "quote-instant__quote_disabled"
        )
      ) {
        displayPrice();
      }

      // update step value
      $(".quote-instant__step-length .quote-instant__step-result p small").text(
        this.value
      );
      $("#quote-instant").find("input[name=length]").val(this.value);

      // set up next step
      $(".quote-instant__step-length").toggleClass(
        "quote-instant__step-expanded"
      );
      $(".quote-instant__step-length .quote-instant__step-select").slideToggle(
        "fast"
      );
      // $('.quote-instant__quote_length').removeClass('quote-instant__step-highlight');

      // update details result - pricing
      // $('.quote-instant__quote_length').removeClass('quote-instant__quote_disabled');
      // $('.quote-instant__quote_length p small').text(this.value);

      // display includes and CTA buttons
      $(".quote-instant__quote_includes").removeClass(
        "quote-instant__quote_disabled"
      );
      $(".quote-instant__quote_actions").removeClass(
        "quote-instant__quote_disabled"
      );
      $(".quote-instant__steps-ctas").removeClass(
        "quote-instant__steps-ctas_disabled"
      );

      // auto scroll mobile to pricing panel
      if ($(window).width() < 768) {
        $("html,body").animate(
          {
            scrollTop: $(".quote-instant__quote_price").offset().top - 150,
          },
          1000
        );
      } else {
        // $('#quote-result').animate({
        // scrollTop: $("#quote-result--generated").offset().top + 200
        // }, 1000);
      }
    });

    // custom tooltips
    $(".tooltip").tooltipster({
      theme: ["tooltipster-shadow", "tooltipster-shadow-quote"],
      trigger: "click",
      delay: 0,
    });

    // pricing animation effect
    var odRegular = document.querySelector(
      ".quote-instant__quote_price-regular .quote-pricing-animate"
    );
    var odSpecial = document.querySelector(
      ".quote-instant__quote_price-special .quote-pricing-animate"
    );

    odRegular = new Odometer({
      el: odRegular,
      value: 0,
      format: "d",
      theme: "default",
      // duration: 500,
      // animation: 'count'
    });
    odSpecial = new Odometer({
      el: odSpecial,
      value: 0,
      format: "(,ddd).dd",
      theme: "default",
      // duration: 500,
      // animation: 'count'
    });

    // Init custom select / scroll
    $.js = function (el) {
      return $("[data-js=" + el + "]");
    };

    $.browser.device = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      navigator.userAgent.toLowerCase()
    );
    if (!$.browser.device) {
      chosen();
    } else {
      chosenMobileFallback();
    }
  }
});
