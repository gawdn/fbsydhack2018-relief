var map;
let locations;

function init_map() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8,
    disableDefaultUI: true,
    fullscreenControl: false,
    streetViewControl: false,
  })

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords)
        var user_pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
        var geocoder = new google.maps.Geocoder;
        
        geocoder.geocode({'location': user_pos, 'region': "au"}, function(results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    var user_suburb = results[0].address_components.filter(word => word.types[0] == "postal_code")[0].short_name
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }

            
            let pin = new google.maps.Marker(
                {
                    position: user_pos,
                    map: map,
                    label: "I am here!"
                }
            )

            map.setCenter(user_pos)

            $.getJSON({
                url: 'https://data.gov.au/api/3/action/datastore_search?callback=?',
                data: {
                    resource_id: '54566d76-a809-4959-8622-61dc30b3114d', // the resource id
                    limit: 10,
                    filters: `{"Male": "True", "Postcode": "${user_suburb}"}`, // query for 'jones'
                    offset: 10
                },
                dataType: 'jsonp',
                success: (data) => {
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

                },
                cache: true,
                // processData: false
            });

        });

        
    }, ()=>{console.log("errored")},{maximumAge:600000, timeout:5000, enableHighAccuracy: true})
  }


}


        

