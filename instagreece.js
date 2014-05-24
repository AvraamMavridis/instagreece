


function InstaGreece (){

    this.mymap = undefined;

    this.parse = function(response){

        var InstaGreecePic = {};

        console.log(response.data[0]);

        for (var i = 0; i < response.data.length; i++) {
            InstaGreecePic.imgurl = response.data[i].images.standard_resolution.url;
            InstaGreecePic.id = response.data[i].id;
            if(response.data[i].location!=undefined){
                InstaGreecePic.latitude = response.data[i].location.latitude;
                InstaGreecePic.longtitude = response.data[i].location.longitude;
                this.addToMap(InstaGreecePic);
            }


            $( ".map" ).append( "<div class='instaimg'><img src="+InstaGreecePic.imgurl+">Hello</img></div>" );
        }
    }

    this.requestPhotos = function(){
        var url = "https://api.instagram.com/v1/tags/greece/media/recent?client_id=0599ffc97f88409da6e4707af7e7ef17";
        var that = this;

        $.ajax({
            type: 'GET',
            url: url,
            async: false,
            jsonpCallback: 'jsonCallback',
            contentType: "application/json",
            dataType: 'jsonp',
            success: function(json) {
                that.parse(json);
            },
            error: function(e) {
                that.parse(e.message);
            }
        });

    };


    this.addToMap = function(InstaGreecePic){



        var marker = new google.maps.Marker({
            position: {lat: InstaGreecePic.latitude, lng: InstaGreecePic.longtitude},
            map: mymap,
            title: 'Hello World!',
            optimized:false

        });


       $.get("instagram-marker-template.html",function(data){

           var infowindow = new google.maps.InfoWindow({
               content: data
           });

           google.maps.event.addListener(marker, 'click', function() {

               infowindow.open(mymap,marker);
           });

       });


    this.initializeMap = function(){
        var myLatlng = new google.maps.LatLng(38.2749497,23.8102717);
        var mapOptions = {
            zoom: 6,
            center: myLatlng
        }
        this.mymap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    }




};

var makis = new InstaGreece();

function refresh(){
    makis.requestPhotos();
}



google.maps.event.addDomListener(window, 'load', makis.initializeMap);

