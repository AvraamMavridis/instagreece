
var mymap = undefined;

var tickerobjects = {};

function InstaGreece (){


    this.parse = function(response) {


        var InstaGreecePic = {};
        if (response != undefined) {
            console.log(response.data[0]);
            for (var i = 0; i < response.data.length; i++) {


                InstaGreecePic.imgurl = response.data[i].images.standard_resolution.url;
                InstaGreecePic.id = response.data[i].id;
                InstaGreecePic.full_name = response.data[i].user.full_name;
                InstaGreecePic.profile_picture = response.data[i].user.profile_picture;
                InstaGreecePic.username = response.data[i].user.username;

                if (response.data[i].caption != null) {
                    InstaGreecePic.text = response.data[i].caption.text;
                }

                if (response.data[i].location != null) {
                    InstaGreecePic.latitude = response.data[i].location.latitude;
                    InstaGreecePic.longtitude = response.data[i].location.longitude;
                    this.addToMap(InstaGreecePic);
                }

                this.addToTicker(InstaGreecePic);
                tickerobjects[InstaGreecePic.id] = InstaGreecePic;


            }

            //$( ".map" ).append( "<div class='instaimg'><img src="+InstaGreecePic.imgurl+">Hello</img></div>" );
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
                $(".windows8").css({visibility:"hidden"});
                that.parse(json);
            },
            error: function(e) {
                console.log(e.message);
                that.parse(e.message);
            }
        });

    };


    this.addToMap = function(InstaGreecePic){

        var pin_icon = "images/instagram.png";

        var marker = new google.maps.Marker({
            position: {lat: InstaGreecePic.latitude, lng: InstaGreecePic.longtitude},
            map: mymap,
            title: 'Hello World!',
            optimized:false,
            icon:pin_icon

        });


       var infowindowhtml = "<div id='instacontainer'><img id='instaimg' src="+InstaGreecePic.imgurl+"><div id='full_name'>" +InstaGreecePic.full_name+
           "</div><div id='profile_pic' style='background-image: url("+InstaGreecePic.profile_picture+");'></div>" +
           "<a id='username' target='_blank' href='http://www.instagram.com/"+InstaGreecePic.username+"'>@"+InstaGreecePic.username+"</a>" +
           "</div>";



        var infowindow = new google.maps.InfoWindow({
            content: infowindowhtml
        });

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(mymap,marker);
        });

    }


    this.addToTicker = function(InstaGreecePic){

        if(!(InstaGreecePic.id in tickerobjects)){
            $( ".ticker" ).prepend( "<div class='col-md-12 ticker-container'><a class='ticker-a' href="+InstaGreecePic.imgurl+"><img class='ticker-img' src="+InstaGreecePic.imgurl+"></a>" +
                "<div class='ticker-instagram-icon'></div>" +
                "<div class='ticker-instagram-name'>"+InstaGreecePic.full_name+"</div>" +
                "<div class='ticker-instagram-text'>"+InstaGreecePic.text+"</div></div>");
        }
    }

    this.initializeMap = function(){
        var myLatlng = new google.maps.LatLng(38.2749497,23.8102717);
        var mapOptions = {
            zoom: 7,
            center: myLatlng
        }
        mymap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        refresh();
    }

};



function TwitterGreece(){


    this.addToMap = function(TwitterGreece){



        var pin_icon = "images/twitter.png";

        var marker = new google.maps.Marker({
            position: {lat: TwitterGreece.latitude, lng: TwitterGreece.longtitude},
            map: mymap,
            title: 'Hello World!',
            optimized:false,
            icon:pin_icon

        });


        var infowindowhtml = "<div id='twittercontainer'><div id='twittertext'>"+TwitterGreece.tweet+"</div>" +
            "<div id='twitter-profile-pic' style='background-image: url("+TwitterGreece.profile_image+");'></div></div>";

        var infowindow = new google.maps.InfoWindow({
            content: infowindowhtml
        });

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(mymap,marker);
        });

        //$(".windows8").css({visibility:"hidden"});




    }

    this.parse = function(response){

        console.log(response);

        var TwitterGreece = {};


        for (var i = 0; i < response.length; i++) {
            if(response!=undefined){
                TwitterGreece.tweet = response[i].text;
                TwitterGreece.latitude = response[i].lat;
                TwitterGreece.longtitude = response[i].long;
                TwitterGreece.username = response[i].username;
                TwitterGreece.profile_image = response[i].profile_image;
                this.addToMap(TwitterGreece);
            }

            //$( ".map" ).append( "<div class='instaimg'><img src="+InstaGreecePic.imgurl+">Hello</img></div>" );
        }
    }

    this.requestPhotos = function(){
        var url = "http://localhost/instagreece/twitter.php";
        var that = this;

        $.ajax({
            type: 'GET',
            url: url,
            async: false,
            jsonpCallback: 'jsonCallback',
            contentType: "application/json",
            dataType: 'json',
            success: function(json) {
                that.parse(json);
            },
            error: function(e) {
                console.log("error");

            }
        });

    };
}



$( function()
{
    $( '.ticker-a' ).imageLightbox();
});

$(document).ready(function() {
    $('.ticker').enscroll();
});

var makis = new InstaGreece();
var makis2 = new TwitterGreece();

function refresh(){
    $(".windows8").css({visibility:"visible"});
    makis.requestPhotos();
    makis2.requestPhotos();
}



setInterval(refresh, 60000);


google.maps.event.addDomListener(window, 'load', makis.initializeMap);

