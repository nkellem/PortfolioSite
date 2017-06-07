//inputManager.js
//dependencies
//description: contains methods that deal with user input, singleton object

"use strict";

var app = app || {};

app.inputManager = {
    //get reference to keys class
    myKeys: undefined,
    
    //allows the player to move the ship using WASD
    controlShipMovement: function(){
        if(this.myKeys.keydown[this.myKeys.KEYBOARD.KEY_W]){
            app.main.playerShip.y -= app.main.playerShip.speed;
            if(app.main.playerShip.y <= app.main.yOffset){
                app.main.playerShip.y = app.main.yOffset;
            }
        }
        if(this.myKeys.keydown[this.myKeys.KEYBOARD.KEY_S]){
            app.main.playerShip.y += app.main.playerShip.speed;
            if(app.main.playerShip.y >= app.main.yOffset + app.main.Game.HEIGHT - app.main.playerShip.height){
                app.main.playerShip.y = app.main.yOffset + app.main.Game.HEIGHT - app.main.playerShip.height;
            }
        }
        if(this.myKeys.keydown[this.myKeys.KEYBOARD.KEY_A]){
            app.main.playerShip.x -= app.main.playerShip.speed;
            if(app.main.playerShip.x <= app.main.xOffset){
                app.main.playerShip.x = app.main.xOffset;
            }
        }
        if(this.myKeys.keydown[this.myKeys.KEYBOARD.KEY_D]){
            app.main.playerShip.x += app.main.playerShip.speed;
            if(app.main.playerShip.x >= app.main.xOffset + app.main.Game.WIDTH - app.main.playerShip.width){
                app.main.playerShip.x = app.main.xOffset + app.main.Game.WIDTH - app.main.playerShip.width;
            }
        }
        
        app.main.playerShip.setBB();
    },
    
};