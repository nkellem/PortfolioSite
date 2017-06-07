//links where I learned about FB Send and button creation
//_______________________________________________________
//https://developers.facebook.com/docs/sharing/reference/send-dialog  //for the sending method
//http://stackoverflow.com/questions/11093828/how-to-customize-a-facebook-send-button //how to use the FB.ui method to create custom FB buttons
//https://developers.facebook.com/docs/javascript/quickstart //implement and load the FB SDK
//https://developers.facebook.com/docs/sharing/messenger  //Allow sending on messenger

"use strict";

//loads the FB SDK so that sending gifs via messenger can work
window.fbAsyncInit = function() {
    FB.init({
      appId      : '802924276522337',
      xfbml      : true,
      version    : 'v2.9'
    });
    FB.AppEvents.logPageView();
    
    //when the user clicks the facebook icon, tries to send either the page or the gif loaded
    document.querySelector("#facebookIcon").onclick = function(){
        
        var gifImage = document.querySelector("#gif");
        var link = "https://people.rit.edu/nmk2485/330/project3/index.html";
        
        if(gifImage != null){
            link = gifImage.src;
        }
        
        FB.ui({
            method: 'send',
            link: link,
        });
        
        //implement this to enable messenger sharing on mobile
        //window.open('fb-messenger://share?link=' + encodeURIComponent(link) + '&app_id=' + encodeURIComponent(app_id));
    };
};

//helper function to help load the FB SDK
(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));