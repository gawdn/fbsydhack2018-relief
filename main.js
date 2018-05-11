let map;
let locations;
let user_pos;
let user_postcode;

function mark_closest_toilets(data) {
    
    locations = data.result.records
    let bounds =  new google.maps.LatLngBounds();
    for (let loc of locations) {
        let pos = new google.maps.LatLng(loc.Latitude, loc.Longitude)
        let pin = new google.maps.Marker(
            {
                position: pos,
                map: map,
            }
        )
        bounds.extend(pos)
    }
    
    map.fitBounds(bounds);
    
}

function get_closest_toilets() {
    $.getJSON({
        url: 'https://data.gov.au/api/3/action/datastore_search?callback=?',
        data: {
            resource_id: '54566d76-a809-4959-8622-61dc30b3114d', // the resource id
            limit: 10,
            filters: `{"Male": "True", "Postcode": "${user_postcode}"}`, // query for 'jones'
            offset: 10
        },
        dataType: 'jsonp',
        success: mark_closest_toilets,
        cache: true,
    });
}

function mark_user_position() {
    let user_pos = new google.maps.Marker(
        {
            position: user_pos,
            map: map,
            label: "I am here!"
        }
    )

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
        navigator.geolocation.getCurrentPosition(geocode_user_position, error_user_position);
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


        

