let map;
let locations;
let user_pos;
let user_postcode;
let user_circle;
let accuracy_radius;

let info_card_context = new Hammer(document.getElementById("info-card"));
$("#map").on("click", slideUpBothCards)

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
    $("#info-card").data("tid", tid)
    let toilet = locations.filter(toilet => toilet.ToiletID == tid)[0]
    $("#info-card").removeClass("full")
    setTimeout(() => {    
        $(".rating").text(`/./ ★`)
        $(".address").text(toilet.Name) 
        $("#info-card").addClass("full")
    }, 300);

    // $ ★

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

function get_closest_toilets() {
    // GEOCACHING METHOD
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


        

