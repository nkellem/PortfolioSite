//links to resources used to embed GIPHY
//______________________________________
//https://giphy.com/posts/how-to-embed-giphy-gifs-on-your-website //embed GIPHY via iFrame
//https://github.com/Giphy/GiphyAPI#search-endpoint //GIPHY API Documentation

//replace spaces in string with +, done so the same searchTerm can be used for both GIPHY and Flickr
//http://stackoverflow.com/questions/3794919/replace-all-spaces-in-a-string-with

"use strict";

(function(){
    //controls whether the user is searching GIPHY or Flickr
    var searchingGiphy = true;
    //button that intitiates the search
    var searchButton = document.querySelector("#searchButton");
    //typical search url for GIPHY
    //doesn't contain API key or search term - need to add those later
    var GIPHY_URL = "https://api.giphy.com/v1/gifs/search?q=";
    //contains the url portion needed for the API paramater as well as the key
    //the url is seperated because the search term is sandwiched in-between GIPHY_URL and API_KEY
    var API_KEY = "&api_key=" + "dc6zaTOxFJmzC";
    var searchField = document.querySelector("#searchField");
    var linkField = document.querySelector("#picLink");
    //saves the url of a GIPHY returned image so that it can be saved
    var giphyImageSaveURL;
    
    //EX flickr search
    //https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=b65ca651e921dd888d95488589c88a74&tags=money&format=json&nojsoncallback=1
    
    //Flickr search URL
    var FLICKR_URL = "https://api.flickr.com/services/rest/?method=flickr.photos.search";
    //Flickr API Key
    var FLICKR_API_KEY = "&api_key=753b6964ff00f137e21baa65ea35e46a&tags=";
    //ensures we get JSON format back
    var FLICKR_RESPONSE_FORMAT = "&format=json&nojsoncallback=1";
    
    //holds what the user wants to search
    var searchTerm = "";
    
    //holds the div on the page that will be displaying the gif
    var gifDiv = document.querySelector("#gifDiv");
    
    //holds info as to which gif the user has chosen to use
    var selectedGif;
    var selectedGifIndex = 0;
    
    //set up event handler
    searchButton.onclick = function(){
        searchGiphy();
    }
    
    //search GIPHY and parse the JSON object, get the gif
    function searchGiphy(){
        //example giphy search request
        //http://api.giphy.com/v1/gifs/search?q=funny+cat&api_key=dc6zaTOxFJmzC 
        //returns a JSON object
        
        //get the value from the form field
        searchTerm = searchField.value;
        
        //get rid of leading or trailing spaces
        searchTerm.trim();
        
        //if there is nothing to search, bail out
        if(searchTerm.length === 0){
            return;
        }
        
        //replace the spaces the user typed in the middle of the term with %20
        //searchTerm = encodeURI(searchTerm);
        var searchTermReplaced = searchTerm.replace(/ /g, '+');
        
        //concatenate the search request
        var searchRequest;
        
        //makes sure the correct search request is being sent to the appropriate APIs
        if(searchingGiphy === true){
            searchRequest = GIPHY_URL + searchTermReplaced + API_KEY;
        }
        else{
            console.log(FLICKR_API_KEY);
            searchRequest = FLICKR_URL + FLICKR_API_KEY + searchTermReplaced + FLICKR_RESPONSE_FORMAT;
            console.log(FLICKR_API_KEY);
        }
        
        //send a call out to GIPHY and download the JSON file
        console.log("Getting " + searchRequest);
        //$("#gifDiv").fadeOut(1000);
        $.ajax({
            dataType: "json",
            url: searchRequest,
            data: null,
            success: jsonLoaded
        });
    }
    
    //function for loading and parsing the actual JSON file
    function jsonLoaded(obj){
        //console.log("obj = " +obj);
        //console.log("obj stringified = " + JSON.stringify(obj));
        
        gifDiv.style.width = "inherit";
        gifDiv.style.border = "none";
        
        //if there's an error, pring a message and return
        if(obj.error){
            var status = obj.status;
            var description = obj.description;
            document.querySelector("#gifDiv").innerHTML = "<h3><b>Error!</b></h3>" + "<p><i>" + status+ "</i></p>" + "<p><i>" + description + "</i></p>";
            $("#gifDiv").fadeIn(1000);
            return; //bail out
        }
        
        var searchArr;
        if(searchingGiphy === true){
            searchArr = obj.data;
        }
        else{
            searchArr = obj.photos.photo;
        }
        
        //check to see if we're getting back at least 1 result
        //if not, bail out
        if(searchArr.length === 0){
            alert("No gifs or images returned with that search. Try another one!");
            return;
        }
        
        //create a new page and load the first 10 results from the query here
        var newView = document.createElement("DIV");
        newView.id = "newView";
        //newView.style.display = "block";
        newView.style.zIndex = 1000;
        newView.style.top = 0;
        newView.style.left = 0;
        newView.style.width = "100%";
        newView.style.position = "fixed";
        newView.style.backgroundColor = "white";
        newView.style.padding = "1.5em";
        newView.style.maxHeight = "100%";
        newView.style.overflowY = "scroll";
        newView.style.display = "hidden";
        newView.style.height = "100%";
        
        //represents the current row gifs are being loaded into
        var currentRow = document.createElement("DIV");
        currentRow.style.marginLeft = "auto";
        currentRow.style.marginRight = "auto";
        currentRow.style.textAlign = "center";
        
        //creates the continue button so gif can be selected and used
        var continueButton = document.createElement("BUTTON");
        continueButton.innerHTML = " Continue ";
        continueButton.style.top = currentRow.style.top + "px";
        continueButton.style.position = "fixed";
        
        currentRow.appendChild(continueButton);
        newView.appendChild(currentRow);
        
        //load the gifs here
        //load gifs in each row until width has been exceeded
        //create new row after
        var displayNumber = 12;
        if(displayNumber > searchArr.length){
            displayNumber = searchArr.length;
        }
        
        //displays the returned gifs/images depending on which API has been called
        if(searchingGiphy === true){
            for(var i = 0; i < displayNumber; i++){
                var wrapper = document.createElement("SPAN");
                wrapper.innerHTML = "<iframe class='picGif gif-embed' src='" + searchArr[i].embed_url + "'width='300' height='300' frameBorder='0'></iframe>";
                currentRow.appendChild(wrapper);
            
            }
        }
        else{
            for(var i = 0; i < displayNumber; i++){
                var wrapper = document.createElement("SPAN");
                "https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg"
                wrapper.innerHTML = "<img src='" + "https://farm" + searchArr[i].farm + ".staticflickr.com/" + searchArr[i].server + "/" + searchArr[i].id + "_" + searchArr[i].secret + ".jpg' class='picGif' width='300' height='300'>";
                currentRow.appendChild(wrapper);
            
            }
        }
        
        //append the window to the page
        document.body.appendChild(newView);
        $(newView).slideDown(1000);
        //position the continueButton appropriately
        continueButton.style.left = screen.width - continueButton.clientWidth - 35 + "px";
        
        //sets up the continue button functionality
        continueButton.onclick = function(){
            //lastly, once it has passed all checks, display the first gif
            if(searchingGiphy === true){
                document.querySelector("#gifDiv").innerHTML = "<iframe id='gif' src='" + searchArr[selectedGifIndex].embed_url + "'width='" + searchArr[selectedGifIndex].images.original.width + "' height='" + searchArr[selectedGifIndex].images.original.height + "' frameBorder='0' class='giphy-embed' allowFullScreen></iframe><p><a href='" + searchArr[selectedGifIndex].url + "'></a></p>";
                linkField.value = searchArr[selectedGifIndex].bitly_url;
                giphyImageSaveURL = searchArr[selectedGifIndex].images.original.url;
            }
            else{
                document.querySelector("#gifDiv").innerHTML = "<img src='" + "https://farm" + searchArr[selectedGifIndex].farm + ".staticflickr.com/" + searchArr[selectedGifIndex].server + "/" + searchArr[selectedGifIndex].id + "_" + searchArr[selectedGifIndex].secret + ".jpg' id='gif'>";
                linkField.value = document.querySelector("#gif").src;
            }
            
            //checks to position things in relation to each other
            if(document.querySelector("#gif").clientHeight * 0.063 > 20){ //0.063 is the conversion rate from em to px
                gifDiv.style.height = "inherit";
            }
            else{
                gifDiv.style.height = "20em";
            }
            
            $(newView).slideUp(1000);
            setTimeout(function(){
                newView.parentNode.removeChild(newView);
            }, 1000);
        };
        
        //set up onclick event to confirm gif selection and then place on the original screen
        var spans = document.querySelectorAll("span");
        console.dir(spans);
        for(var i = 0; i < spans.length; i++){
            spans[i].clicked = false;
            spans[i].onclick = function(){
                if(selectedGif != null){
                    selectedGif.clicked = false;
                }
                this.querySelector(".picGif").style.border = "2px solid blue";
                this.clicked = true;
                selectedGif = this;
                maintainSelectedGif(spans);
            }
        }
    }
    
    //loops through the current displayed gifs on the page and makes sure only one is selected
    function maintainSelectedGif(spans){
        for(var i = 0; i < spans.length; i++){
            if(spans[i].clicked === false){
                spans[i].querySelector(".picGif").style.border = "2px solid black";
            }
            else{
                selectedGifIndex = i;
            }
        }
    }
    
    //adds click events for the toggle so the user can switch between searching Giphy or Flickr
    document.querySelector("#giphyToggle").onchange = function(){
        this.checked = true;
        searchingGiphy = true;
        flickrToggle.checked = false;
    };
    document.querySelector("#flickrToggle").onchange = function(){
        console.log("checked");
        this.checked = true;
        searchingGiphy = false;
        giphyToggle.checked = false;
    };
    
    //allows images to be saved    
    document.querySelector("#saveLink").onclick = function(e){
        if(document.querySelector("#gif") === null){
            e.preventDefault();
        }
        else{
            if(searchingGiphy){
                document.querySelector("#saveLink").href = giphyImageSaveURL;
            }
            else{
                document.querySelector("#saveLink").href = document.querySelector("#gif").src;
            }
        }
    };
    
})()