//INITIALIZE AND SET THIS UP LATER

// sound.js
"use strict";
// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// define the .sound module and immediately invoke it in an IIFE
app.sound = (function(){
	var bgAudio = undefined;
	var playerGunAudio = undefined;
    var enemyGunAudio = undefined;
    var explosionAudio = undefined;
    var playerHitAudio = undefined;
    var enemyHitAudio = undefined;
	var currentEffect = 0;
	var currentDirection = 1;
	var effectSounds = ["laser1.wav","laser5.wav","explosion.mp3","enemyHit.wav", "playerHit.m4a"];
	

	function init(){
		bgAudio = document.querySelector("#bgAudio");
		bgAudio.volume=0.25;
		playerGunAudio = document.querySelector("#playerGunAudio");
		playerGunAudio.volume = 0.3;
        playerHitAudio = document.querySelector("#playerHitAudio");
		playerHitAudio.volume = 0.3;
        enemyGunAudio = document.querySelector("#enemyGunAudio");
		enemyGunAudio.volume = 0.3;
        enemyHitAudio = document.querySelector("#enemyHitAudio");
		enemyHitAudio.volume = 0.3;
        explosionAudio = document.querySelector("#explosionAudio");
        explosionAudio.volume = 0.5;
	}
		
	function stopBGAudio(){
		bgAudio.pause();
		bgAudio.currentTime = 0;
	}
	
    function playBGAudio(){
        bgAudio.play();
    }
    
    //determiens what effect is being played and through which audio element it should be played through
	function playEffect(effectNum, effect){
        switch(effect){
            case "player":
                playerGunAudio.src = "sounds/" + effectSounds[effectNum];
		        playerGunAudio.play();
                break;
            case "enemy":
                enemyGunAudio.src = "sounds/" + effectSounds[effectNum];
		        enemyGunAudio.play();
                break;
            case "explode":
                explosionAudio.src = "sounds/" + effectSounds[effectNum];
		        explosionAudio.play();
                break;
            case "enemyHit":
                enemyHitAudio.src = "sounds/" + effectSounds[effectNum];
                enemyHitAudio.play();
                break;
            case "playerHit":
                playerHitAudio.src = "sounds/" + effectSounds[effectNum];
                playerHitAudio.play();
            default:
                break;
        }
	}
		
	// export a public interface to this module
	// TODO
    return{
        init: init,
        stopBGAudio: stopBGAudio,
        playEffect: playEffect,
        playBGAudio: playBGAudio,
        playerGunAudio: playerGunAudio,
        enemyGunAudio: enemyGunAudio,
        explosionAudio: explosionAudio,
        playerHitAudio: playerHitAudio,
    };
}());