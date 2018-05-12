let map;
let locations;
let user_pos;
let user_postcode;
let user_circle;
let accuracy_radius;

let info_card_context = new Hammer(document.getElementById("info-card"));
$("#map").on("click", slideUpBothCards)

$("#direction-btn").on("click", (e)=> {
    let toilet = locations.filter(toilet => toilet.ToiletID == tid)[0]
    window.location = `https://www.google.com/maps/dir/?api=1&origin=${user_pos.toUrlValue()}&destination=${toilet.Latitude},${toilet.Longitude}&travelmode=walking`
})

$("#save-btn").on("click", (e) => {
    $("#save-btn").text("Saved")
})

$(".star-rating").on("click", (e) => {
    let comment = $("#toilet-review").val();
    $(".reviews").append('<div class="col-8"><p class="review-item">' + comment + '</p></div>');
    $("#toilet-review").val("");
});

info_card_context.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
info_card_context.on('swipe', function(ev) {
    tid = $("#info-card").data("tid")

    if (ev.direction == Hammer.DIRECTION_UP) {
        slideUpFullCard(tid)
    } else if (ev.direction == Hammer.DIRECTION_DOWN) {
      
        if ($("#info-page").hasClass("full")) {
            slideDownFullCard(tid)
        } else{
            slideDownHalfCard(tid)
        }
    }
});

function slideUpBothCards() {
    $("#info-card").removeClass("full")
    $("#info-page").removeClass("full")

}

function slideUpFullCard(tid) {
    $("#info-page").addClass("full")
}

function slideDownFullCard(tid) {
    $("#info-page").removeClass("full")
}

function slideDownHalfCard(tid){
    $("#info-card").removeClass("full")
}
function slideUpInfo(tid) {
    $("#info-card").data("tid", tid);
    let toilet = locations.filter(toilet => toilet.ToiletID == tid)[0]
    $("#info-card").removeClass("full")
    $(".icons").html("<h5>Features and Facilities</h5>");
    console.log(toilet);
    setTimeout(() => {
        $(".rating").text(`4.5 ★`);
        $(".address").text(toilet.Name);
        if (toilet.OpeningHoursSchedule != "") {
            $("#opening-hours").text(toilet.OpeningHoursSchedule);
        } else if (toilet.OpeningHoursNote != "") {
            $("#opening-hours").text(toilet.OpeningHoursNote);
        } else {
            $("#opening-hours").text("Open");
        }
        showFeatures(toilet);
        $(".reviews").html('<div class="col-8"><p class="review-item">Wow I love this toilet!</p></div><div class="col-4"><p class="rating-small"><b>4.5 <span class="fa fa-star checked fa-small"></span></div>');
        $("#info-card").addClass("full")
    }, 300);

    // $ ★

}

function showFeatures(toilet) {
    if (toilet.Female == "True") {
        $(".icons").append('<i class="feature-icon fas fa-female fa-2x"></i>');
    }
    if (toilet.Male == "True") {
        $(".icons").append('<i class="feature-icon fas fa-male fa-2x"></i>');
    }
    if (toilet.AccessibleFemale == "True" && toilet.AccessibleMale == "True") {
        $(".icons").append('<i class="feature-icon fas fa-wheelchair fa-2x"></i>');
    }
    if (toilet.Showers == "True") {
        $(".icons").append('<i class="feature-icon fas fa-shower fa-2x"></i>');
    }
    if (toilet.BabyChange == "True") {
        $(".icons").append('<i class="feature-icon fas fa-child fa-2x"></i>');
    }
    if (toilet.PaymentRequired == "False") {
        $(".icons").append('<i class="material-icons md-36">money_off</i>');
    }
    if (toilet.Parking == "True") {
        $(".icons").append('<i class="feature-icon fas fa-parking fa-2x"></i>');
    }
    if (toilet.DrinkingWater == "True") {
        $(".icons").append('<i class="feature-icon fas fa-tint fa-2x"></i>');
    }
    if (toilet.SharpsDisposal == "True") {
        $(".icons").append('<i class="feature-icon fas fa-syringe fa-2x"></i>');
    }
}

function mark_closest_toilets_no_cookie(data) {
    
    locations = data.result.records
    let bounds =  new google.maps.LatLngBounds();
    for (let loc of locations) {
        let pos = new google.maps.LatLng(loc.Latitude, loc.Longitude)
        let pin = new google.maps.Marker(
            {
                position: pos,
                map: map,
                toilet_id: loc.ToiletID
            }
        )

        google.maps.event.addListener(pin, "click", () => {
            slideUpInfo(pin.toilet_id)
        })

        bounds.extend(pos)
    }
    
    map.fitBounds(bounds);
    
}

function mark_closest_toilets(data) {
    
    locations = data.result.records
    let bounds =  new google.maps.LatLngBounds();
    for (let loc of locations) {
        let pos = new google.maps.LatLng(loc.Latitude, loc.Longitude)
        let pin = new google.maps.Marker(
            {
                position: pos,
                map: map,
                toilet_id: loc.ToiletID
            }
        )

        google.maps.event.addListener(pin, "click", () => {
            slideUpInfo(pin.toilet_id)
        })

        bounds.extend(pos)
    }
    
    map.fitBounds(bounds);
    
}

function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

function get_closest_toilets() {
    // GEOCACHING METHOD

    filters = decodeURIComponent(getCookie("real_filters"))
    console.log()
    if (filters != "null") {
        toiletFilters = JSON.parse(filters)
        $.getJSON({
            url: 'https://data.gov.au/api/3/action/datastore_search?callback=?',
            data: {
                resource_id: '54566d76-a809-4959-8622-61dc30b3114d', // the resource id
                limit: 10,
                //filters: '{"Unisex":"True", "Town":"Sydney","PaymentRequired":"False"}' // query for 'jones'
                filters:JSON.stringify(toiletFilters)
                //filters.push({key:"Unisex", value:"True"});
            },
            dataType: 'jsonp',
            success: mark_closest_toilets,
            cache: true,
            // processData: false
        });

    } else {
        $.getJSON({
            url: 'https://data.gov.au/api/3/action/datastore_search?callback=?',
            data: {
                resource_id: '54566d76-a809-4959-8622-61dc30b3114d', // the resource id
                limit: 10,
                filters: `{"Male": "True", "Postcode": "${user_postcode}"}`, // query for 'jones'
                offset: 0
            },
            dataType: 'jsonp',
            success: mark_closest_toilets,
            cache: true,
        });
    }

}

function mark_user_position() {

    let user_dot = {
        url: "img/dot.png",
        size: new google.maps.Size(32, 32),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(15, 15)
    }

    new google.maps.Marker(
        {
            position: user_pos,
            map: map,
            icon: user_dot
        }
    )

    user_circle = new google.maps.Circle({
        strokeColor: "#1569C7",
        fillColor: "#5FCDE4",
        strokeOpacity: 0.9,
        fillOpacity: 0.4,
        strokeWeight: 2,
        map: map,
        center: user_pos,
        radius: accuracy_radius
    })

    map.setCenter(user_pos)

    get_closest_toilets()
}


function get_user_postcode(results, status) {
    if (status === 'OK') {
        if (results[0]) {
            user_postcode = results[0].address_components.filter(word => word.types[0] == "postal_code")[0].short_name
        } else {
            console.log("Something went wrong. Here's what we know: GEOCODER_FAILED_TO_FIND_ADDRESS");
        }
    } else {
        console.log("Something went wrong. Here's what we know: GEOCODER_FAILED_RETURN");
    }

    mark_user_position()
}

function error_geocode_user_position() {
    console.error("Something went wrong. Here's what we know: GEOCODING SERVICE FAILED.")
}

function geocode_user_position(position) {
    accuracy_radius = position.coords.accuracy/2
    user_pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
    let geocoder = new google.maps.Geocoder;
    let geocoder_opts = {
        maximumAge:600000, 
        timeout:5000, 
        enableHighAccuracy: true
    }

    // Use REGION: AU to bias location searches to Australia
    geocoder.geocode({'location': user_pos, 'region': "au"}, get_user_postcode, error_geocode_user_position, geocoder_opts)
}


function error_user_position() {
    console.error("Something went wrong: ERR_FAILED_USER_POSITION")
}

function get_user_position() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geocode_user_position, error_user_position)
    }
}

function init_map() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8,
    disableDefaultUI: true,
    fullscreenControl: false,
    streetViewControl: false,
  })

  get_user_position()
}




