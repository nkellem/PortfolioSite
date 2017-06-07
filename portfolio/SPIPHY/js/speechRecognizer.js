//links that helped with Web Speech implementation
//________________________________________________
//https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API   //Web Speech API Documentation
//https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API  //more documentation
//https://shapeshed.com/html5-speech-recognition-api/ //Web Speech API Demo
//https://github.com/GoogleChrome/webplatform-samples/blob/master/webspeechdemo/webspeechdemo.html //Web Speech API Demo

"use strict";

(function(){
    //create new speech recognizer object
    var recognition = new webkitSpeechRecognition();
    
    //get related buttons and fields
    var searchField = document.querySelector("#searchField");
    var micButton = document.querySelector("#micIcon");
    
    //once the recognizer has finished listenning, updated the field
    recognition.onresult = function(e){
        if(e.results.length > 0){
            searchField.value = e.results[0][0].transcript;
            //search for the gif once speech has ended
            document.querySelector("#searchButton").click();
        }
    };
    
    //start voice recognition on button click
    micButton.onclick = function(){
        recognition.start();
    }
    
})()