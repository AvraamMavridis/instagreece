<?php

require('twitteroauth.php');

session_start();

$twitter = new TwitterOAuth("KfJn3sb26feoblwgjen62fIV5", "aZUAdCj0mMtZflQ65KuYPe6AssVeC99fpeIE1DtbYrFHpXkbkN");
$request_token = $twitter->getRequestToken("");

$_SESSION['oauth_token'] = $request_token['oauth_token'];
$_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];

$twitteroauth = new TwitterOAuth("KfJn3sb26feoblwgjen62fIV5", "aZUAdCj0mMtZflQ65KuYPe6AssVeC99fpeIE1DtbYrFHpXkbkN"  );


$tweets = $twitteroauth->get('search/tweets', array('q' => '#greece','count' =>'100'));

$text ="";
$lat = 0;
$long = 0;

$results = array();

foreach ($tweets->{'statuses'} as $value) {


    if($value->{'geo'}!=null){
        $text = $value->{'text'};
        $prop = get_object_vars($value->{'geo'});
        $lat = $prop['coordinates'][0];
        $long = $prop['coordinates'][1];

        $results []= array(
            'username'=>$value->user->name,
            'profile_image'=>$value->user->profile_image_url,
            'text' => $value->{'text'},
            'lat' => $prop['coordinates'][0],
            'long' => $prop['coordinates'][1]
        );
    }


}


$datajson = json_encode($results);

echo($datajson);



?>