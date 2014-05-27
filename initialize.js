/**
 * Created by avraam on 25/05/14.
 */


var mymap = undefined;


this.initializeMap = function(){
    var myLatlng = new google.maps.LatLng(38.2749497,23.8102717);
    var mapOptions = {
        zoom: 7,
        center: myLatlng
    }
    mymap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    refresh();
}

var makis = new InstaGreece(mymap);
var makis2 = new TwitterGreece(mymap);


function refresh(){
    $(".windows8").css({visibility:"visible"});
    makis.requestPhotos();
    makis2.requestPhotos();
}



setInterval(refresh, 10000);


google.maps.event.addDomListener(window, 'load', initializeMap);
