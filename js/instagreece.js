
var mymap = undefined;

var Insta = new InstaGreece();
var Tweet = new TwitterGreece();
var Flickr = new FlickrGreece();
var tickerobjects = {}


function InstaGreece (){


    this.parse = function(response) {


        var InstaGreecePic = {};
        if (response != undefined) {
            for (var i = 0; i < response.data.length; i++) {


                InstaGreecePic.imgurl = response.data[i].images.standard_resolution.url;
                InstaGreecePic.id = response.data[i].id;
                InstaGreecePic.full_name = response.data[i].user.full_name;
                InstaGreecePic.profile_picture = response.data[i].user.profile_picture;
                InstaGreecePic.username = response.data[i].user.username;

                var date = new Date(response.data[i].created_time*1000);
                var hours = date.getHours();
                var minutes = date.getMinutes();
                var seconds = date.getSeconds();

                var formattedTime = hours + ':' + minutes + ':' + seconds;

                InstaGreecePic.create_time = formattedTime;

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
                that.parse(json);
                Tweet.requestPhotos();
            },
            error: function(e) {
                Tweet.requestPhotos();
                that.parse(e.message);
            }
        });

    };


    this.addToMap = function(InstaGreecePic){

        var pin_icon = "img/instagram.png";

        var marker = new google.maps.Marker({
            position: {lat: parseFloat(InstaGreecePic.latitude), lng: parseFloat(InstaGreecePic.longtitude)},
            map: mymap,
            title: 'Hello World!',
            optimized:false,
            icon:pin_icon

        });


       var infowindowhtml = "<div id='instacontainer'><a class='image-lightbox' href="+InstaGreecePic.imgurl+"><img id='instaimg' src="+InstaGreecePic.imgurl+"></a><div id='full_name'>" +InstaGreecePic.full_name+
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
            $( ".ticker" ).prepend( "<div class='col-md-12 ticker-container'><a class='image-lightbox' href="+InstaGreecePic.imgurl+"><img class='ticker-img' src="+InstaGreecePic.imgurl+"></a>" +
                "" +
                "<div class='ticker-instagram-name'><i class='fa fa-instagram'></i>"+" "+InstaGreecePic.full_name+"</div>" +
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



        var pin_icon = "img/twitter.png";

        var marker = new google.maps.Marker({
            position: {lat: parseFloat(TwitterGreece.latitude), lng: parseFloat(TwitterGreece.longtitude)},
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


        var TwitterGreece = {};


        for (var i = 0; i < response.length; i++) {
            if(response!=undefined){
                TwitterGreece.id = response[i].id;
                TwitterGreece.tweet = response[i].text;
                TwitterGreece.latitude = response[i].lat;
                TwitterGreece.longtitude = response[i].long;
                TwitterGreece.username = response[i].username;
                TwitterGreece.profile_image = response[i].profile_image;
                this.addToMap(TwitterGreece);
                this.addToTicker(TwitterGreece);
                tickerobjects[TwitterGreece.id] = TwitterGreece;

            }

            //$( ".map" ).append( "<div class='instaimg'><img src="+InstaGreecePic.imgurl+">Hello</img></div>" );
        }
    }

    this.requestPhotos = function(){
        var url = "http://localhost/instagreece/js/twitter.php";
        var that = this;

        $.ajax({
            type: 'GET',
            url: url,
            async: false,
            jsonpCallback: 'jsonCallback',
            contentType: "application/json",
            dataType: 'json',
            success: function(json) {
                $( "#circularG" ).hide( 2000);
                that.parse(json);
                Flickr.requestPhotos();
            },
            error: function(e) {
                console.log("error");

            }
        });

    };

    this.addToTicker = function(TwitterGreece){
        if(!(TwitterGreece.id in tickerobjects)){
            $( ".ticker" ).prepend( "<div class='col-md-12 ticker-twitter-container'><a href="+TwitterGreece.profile_image+"><img class='ticker-twitter-img' src="+TwitterGreece.profile_image+"></a>" +
                "" +
                "<div class='ticker-twitter-name'><i class='fa fa-twitter twitter-ticker-icon'></i>"+TwitterGreece.username+"</div>" +
                "<div class='ticker-twitter-text'>"+TwitterGreece.tweet+"</div></div>");
        }
    }



}



function FlickrGreece(){


    this.parse = function(response){

        FlickrGreecePic = {};

        for(var i=0; i<response.length; i++){
            FlickrGreecePic.id = response[i].id;
            FlickrGreecePic.owner = response[i].owner;
            FlickrGreecePic.ownername = response[i].ownername;
            FlickrGreecePic.title = response[i].title;
            FlickrGreecePic.lat = response[i].latitude;
            FlickrGreecePic.lot = response[i].longtitude;
            FlickrGreecePic.img = 'http://farm'+response[i].farm+'.staticflickr.com/'+response[i].server+'/'+response[i].id+'_'+response[i].secret+'_b.jpg'
            this.addToTicker(FlickrGreecePic);
            tickerobjects[FlickrGreecePic.id] = FlickrGreecePic;
        }

    }



    this.requestPhotos = function(){
        var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=cc1eb78b0a27dbb2c66cf986b2e48caf&format=json&text=greece&extras=owner_name,geo&jsoncallback=?";
        var that = this;
        $.ajax({
            type: 'GET',
            url: url,
            async: false,
            contentType: "application/json",
            dataType: 'jsonp',
            success: function(json) {
                that.parse(json.photos.photo);

            },
            error: function(e) {
                console.log(e);
            }
        });

    };


    this.addToTicker = function(FlickrGreecePic){

        if(!(FlickrGreecePic.id in tickerobjects)){
            $( ".ticker" ).prepend( "<div class='col-md-12 ticker-container'><a class='image-lightbox' href="+FlickrGreecePic.img+"><img class='ticker-img' src="+FlickrGreecePic.img+"></a>" +
                "" +
                "<div class='ticker-instagram-name'><i class='fa fa-flickr'></i>"+" "+FlickrGreecePic.ownername+"</div>" +
                "<div class='ticker-instagram-text'>"+FlickrGreecePic.title+"</div></div>");
        }
    }

    this.addToMap = function(FlickrGreecePic){
        var pin_icon = "img/twitter.png";
        var marker = new google.maps.Marker({
            position: {lat: parseFloat(FlickrGreecePic.lat), lng: parseFloat(FlickrGreecePic.lot)},
            map: mymap,
            title: 'Hello World!',
            optimized:false,
            icon:pin_icon

        });

        var infowindowhtml = "<div id='instacontainer'><a class='image-lightbox' href="+FlickrGreecePic.img+"><img id='instaimg' src="+FlickrGreecePic.img+"></a><div id='full_name'>" +FlickrGreecePic.ownername+
            "</div></div>" +
            "<a id='username' target='_blank' href='http://www.flickr.com/"+FlickrGreecePic.owner+"'>"+FlickrGreecePic.ownername+"</a>" +
            "</div>";


        var infowindow = new google.maps.InfoWindow({
            content: infowindowhtml
        });

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(mymap,marker);
        });
    }

}



$( function()
{
    $( '.image-lightbox' ).imageLightbox();
});

$(document).ready(function() {
    $('.ticker').enscroll();
});



function refresh(){
    $( "#circularG" ).show(500);
    Insta.requestPhotos();
}



setInterval(refresh, 3000000);


google.maps.event.addDomListener(window, 'load', Insta.initializeMap);

