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
        var user_pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
        var geocoder = new google.maps.Geocoder;
        
        geocoder.geocode({'location': user_pos, 'region': "au"}, function(results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    var user_suburb = results[0].address_components.filter(word => word.types[0] == "postal_code")[0].short_name
                    console.log(user_suburb);
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
                    filters: '{"Town": "Sydney"}'
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

                        mapData = data;

                        let i = 0;
                        mapData.result.records.forEach(function(item) {
                            cities.push([item.Address1, item.Latitude, item.Longitude]);
                            console.log(cities[i]);
                            i++;
                        });
            
                    }
                    
                    map.fitBounds(bounds);

                    nearestToilet(-33.8689358, 151.20661159999997);
                },
                cache: true,
                // processData: false
            });

        });

        
    }, ()=>{console.log("errored")},{maximumAge:600000, timeout:5000, enableHighAccuracy: true})
  }


}

// https://data.gov.au/api/3/action/datastore_search_sql?sql=SELECT%20*%20from%20"54566d76-a809-4959-8622-61dc30b3114d"%20as%20a%20WHERE%20CAST(a."Female"%20as%20BOOL)%20=%20True
let mapData;
let cities = [[]];

// $(() => {
//     $.getJSON({
//         url: 'https://data.gov.au/api/3/action/datastore_search?callback=?',
//         data: {
            // resource_id: '54566d76-a809-4959-8622-61dc30b3114d', // the resource id
            // filters: '{"Town": "Sydney"}'
//         },
//         dataType: 'jsonp',
//         success: (data) => {
//             console.log('Total results found: ' + data.result.total);
            // mapData = data;
    
            // let i = 0;
            // mapData.result.records.forEach(function(item) {
            //     cities.push([item.Address1, item.Latitude, item.Longitude]);
            //     console.log(cities[i]);
            //     i++;
            // });

            // nearestToilet(-34.397, 150.644);
//         },
//         cache: true,
//         // processData: false
//     });

//     console.log("done");
//     // storeData(mapData);
// }
// );

function UserLocation(position) {
    nearestToilet(position.coords.latitude, position.coords.longitude);
}

// Convert Degress to Radians
function Deg2Rad(deg) {
    return deg * Math.PI / 180;
}

//
function pythagorasEquirectangular(lat1, lon1, lat2, lon2) {
    lat1 = Deg2Rad(lat1);
    lat2 = Deg2Rad(lat2);
    lon1 = Deg2Rad(lon1);
    lon2 = Deg2Rad(lon2);
    var R = 6371; // km
    var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
    var y = (lat2 - lat1);
    var d = Math.sqrt(x * x + y * y) * R;
    return d;
}

// var lat = -34.397; // user's latitude
// var lon = 150.644; // user's longitude

function nearestToilet(latitude, longitude) {
    var mindif = 99999;
    var closest;

    for (index = 0; index < cities.length; ++index) {
        var dif = pythagorasEquirectangular(latitude, longitude, cities[index][1], cities[index][2]);
        if (dif < mindif) {
        closest = index;
        mindif = dif;
        }
    }
    // echo the nearest city
    alert(cities[closest]);
}