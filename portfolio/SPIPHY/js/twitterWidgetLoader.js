//file loading taken from twitter documentation page
//__________________________________________________
//https://dev.twitter.com/web/javascript/loading
//https://dev.twitter.com/web/tweet-button

window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);

  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };
  
  //sets up functionality for the tweet button    
  document.querySelector("#twitterLink").onclick = function(){
      var gifImage = document.querySelector("#gif");
      var link = "https://twitter.com/intent/tweet?text=https://people.rit.edu/nmk2485/330/project3/index.html";
        
      if(gifImage != null){
          link = "https://twitter.com/intent/tweet?text=" + gifImage.src;
      }
      
      document.querySelector("#twitterLink").href = link;
  };

  return t;
}(document, "script", "twitter-wjs"));