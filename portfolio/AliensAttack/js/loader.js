/*
loader.js
despendencies:
description: loads all the necessary modules and fires them
*/

"use strict";

var app = app || {};

window.onload = function(){
    //load modules into app.main here
    app.inputManager.myKeys = app.myKeys;
    app.main.inputManager = app.inputManager;
    app.main.enemyManager = app.enemyManager;
    app.sound.init();
    app.main.sound =  app.sound;
    //call init
    app.main.init();
}

//set up pause and resume events

window.onblur = function(){
    if(app.main.gameState === app.main.GAME_STATE.GAME_MAIN){
        app.main.pauseGame();
    }
}

window.onfocus = function(){
    if(app.main.gameState === app.main.GAME_STATE.GAME_MAIN){
        app.main.resumeGame();
    }
}