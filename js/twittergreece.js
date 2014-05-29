/**
 * Created by avraam on 25/05/14.
 */
function TwitterGreece(mymap){


    this.addToMap = function(TwitterGreece){

        var pin_icon = "images/pin_icon_32.png";

        var marker = new google.maps.Marker({
            position: {lat: TwitterGreece.latitude, lng: TwitterGreece.longtitude},
            map: mymap,
            title: 'Hello World!',
            optimized:false,
            icon:pin_icon

        });


        /*var infowindowhtml = "<div id='instacontainer'><div id='instaimg' style='background-image: url("+InstaGreecePic.imgurl+"); " +
         "'></div><div id='full_name'>" +InstaGreecePic.full_name+
         "</div><div id='profile_pic' style='background-image: url("+InstaGreecePic.profile_picture+");'></div>" +
         "<a id='username' target='_blank' href='http://www.instagram.com/"+InstaGreecePic.username+"'>@"+InstaGreecePic.username+"</a></div>";



         var infowindow = new google.maps.InfoWindow({
         content: infowindowhtml
         });

         google.maps.event.addListener(marker, 'click', function() {
         infowindow.open(mymap,marker);
         });*/

        //$(".windows8").css({visibility:"hidden"});


    }

    this.parse = function(response){



        var TwitterGreece = {};


        for (var i = 0; i < response.length; i++) {
            if(response!=undefined){
                TwitterGreece.tweet = response[i].text;
                TwitterGreece.latitude = response[i].lat;
                TwitterGreece.longtitude = response[i].long;

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