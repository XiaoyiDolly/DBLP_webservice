function conf(){
    conf = document.getElementById('conf.name').value;
    start = document.getElementById('start_year').value;
    end = document.getElementById('end_year').value;

    $.ajax({
        type: 'GET',
        url: 'http://hawking.sv.cmu.edu:9055/'+conf+'/'+start+'/'+end+'/',
        dataType: 'json',
        contentType: 'text/plain',
        success: function(data) {
            var locations = [];
            for (i = 0; i < data.length; i++) {
                locations.push(data[i][0]);
                codeAddress(data[i]);
                
            }
            // console.log(locations);
        },
        error: function() {
        }
    });   
}
var geocoder, map, infoWindow;
var _FreeApiBaseURL = 'http://api.worldweatheronline.com/premium/v1/';
var _FreeApiKey = '738f1f1432aa4796b9292149171602';

function initMap() {
        var myLatLng = {lat: 38.856740, lng: -95.455193};
        geocoder = new google.maps.Geocoder();
        infoWindow = new google.maps.InfoWindow({
                        content: ""
                    });
        map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: myLatLng
        });
      }

function codeAddress(info) {
    address = info[0]
    geocoder.geocode({ 'address': address }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        position = results[0].geometry.location;
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: address
        });
        console.log(address+" position: "+position);
        marker.setMap(map);

        city = address.split(' ')[0].replace(" ","+");
        var input={};
        input.query = city;
        var url = _FreeApiBaseURL + 'weather.ashx?q=' + city + '&format=' +'&num_of_days=1' +  '&key=' + _FreeApiKey;
        
        
        google.maps.event.addListener(marker, 'click', (function(marker, infoWindow, input,info) {
            return function() {
                if(infoWindow) {
                    infoWindow.close();
                }
                infoWindow.open(map, marker);
                infoWindow.setContent(info.toString());
                JSONP_LocalWeather(input, function(data) {
                    console.log(JSON.stringify(data));
                });
            };
        })(marker, infoWindow, input, info));
        
        } else {
        alert("Geocode unsuccessful");
        }
    });
    };    

function JSONP_LocalWeather(input, callback) {
    var url = _FreeApiBaseURL + 'weather.ashx?q=' + input.query + '&format=json' +'&num_of_days=1' +  '&key=' + _FreeApiKey;
// return $.ajax({
//         url: '/map-info-ajax.html?id=' + mkID
//     })
//     .done(callback)
    return $.ajax({
        type: 'GET',
        url: url,
        async: false,
    }).done(callback)
    .fail(function(jqXHR, textStatus, errorThrown) {
        alert(errorThrown);
    });
}


      
      
