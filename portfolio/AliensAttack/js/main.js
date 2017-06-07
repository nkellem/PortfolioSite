//main.js
//dependencies: 
//description: singleton object
//This will be the main controller class that handles state changes and drawing the game
//contains references to other scripts/objects of the game

"use strict";

//using and setting up the module pattern
var app = app || {};

/* 
    .main if is object literal of app that contains all the properties and functions
    related to drawing the game and changing states
*/

app.main = {
    Game: Object.freeze({
        WIDTH: 900,
        HEIGHT: 700,
    }),
    
    //important canvas drawing related properties
    paused: false,
    animationID: 0,
    canvas: undefined,
    ctx: undefined,
    lastTime: 0, //used by calculateDeltaTime()
    gameState: undefined,
    xOffset: undefined,
    yOffset: undefined,
    totalScore: 0,
    finalScore: 0,
    roundWon: false,
    round: 1,
    roundScoreReqBaseline: 0,
    roundScoreReq: 0,
    
    //modules to be loaded
    sound: undefined,
    enemyManager: undefined,
    inputManager: undefined,
    
    //holds the explosion sprite sheet
    explosionImage: new Image(),
    //title screen image
    titleScreenImage: new Image(),
    
    //fake enumeration to create a game finite state-machine to control drawing states
    GAME_STATE: Object.freeze({
        TITLE_SCREEN: 0,
        INSTRUCTION_SCREEN: 1,
        GAME_MAIN: 2,
        GAME_ROUND_OVER: 3,
    }),
    
    //only want one playerShip, so I made an object literal instead of function constructor
    playerShip: {
        //fill with various player ship attributes
        x: undefined,
        y: undefined,
        health: 3,
        boundingBox: {
            minX: undefined,
            minY: undefined,
            maxX: undefined,
            maxY: undefined,
        }, //object literal that holds (x,y,x+width,y+height) properties to test for AABB collisions
        spirte: undefined, //ship representation on screen
        width: 68, //try to calculate these based on sprite - http://stackoverflow.com/questions/9129028/can-we-get-the-real-image-size-through-the-canvas
        height: 68,//
        speed: 4, //how fast the ship will move left to right, up and down
        
        //sets the collision box on the player ship
        setBB: function(){
            this.boundingBox.minX = this.x + 20;
            this.boundingBox.minY = this.y;
            this.boundingBox.maxX = this.boundingBox.minX + 20;
            this.boundingBox.maxY = this.y + this.height;
        },
        
        //initializes the player ship's properties
        init: function(){
            //initialize properties of the playerShip here
            this.speed = 4;
            this.x = app.main.Game.WIDTH/2 + app.main.xOffset - this.width/2;
            this.y = app.main.Game.HEIGHT + app.main.yOffset - this.height - 20; //20 provides a buffer between the ship and the bottom of the screen
            this.boundingBox.minX = this.x;
            this.boundingBox.minY = this.y;
            this.boundingBox.maxX = this.x + this.width;
            this.boundingBox.maxY = this.y + this.height;
            this.spirte = document.querySelector("#player");
        },
        
        //draws the player ship
        draw: function(ctx){
            //draw the player ship here
            ctx.save();
            //ctx.fillStyle = "red";
            //ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.drawImage(this.spirte, this.x, this.y, this.width, this.height);
            ctx.restore();
        },
    },
    
    //function constructor that creates new bullets for the player ship
    Bullet: function(){
        this.width = 5;
        this.height = 10;
        this.x = app.main.playerShip.x + app.main.playerShip.width/2 - this.width/2;
        this.y = app.main.playerShip.y;
        this.damage = 5;
        
        this.boundingBox = {
            minX: this.x,
            minY: this.y,
            maxX: this.x + this.width,
            maxY: this.y + this.height,
        };
        
        //sets the bullet's collision box
        this.setBB = function(){
            this.boundingBox.minX = this.x;
            this.boundingBox.minY = this.y;
            this.boundingBox.maxX = this.x + this.width;
            this.boundingBox.maxY = this.y + this.height;
        };
        
        //moves the bullet across the screen
        this.moveBullet = function(ctx){
            this.y -= 10;
            this.setBB();
            if(this.y + this.height <= 0){
                var index = app.main.bullets.indexOf(this);
                app.main.bullets.splice(index, 1);
            }
            else{
                for(var i = 0; i < app.main.enemyManager.enemiesOnScreen.length; i++){
                    var enemy = app.main.enemyManager.enemiesOnScreen[i];
                    if(detectCollision(this, enemy)){
                        var index = app.main.bullets.indexOf(this);
                        app.main.bullets.splice(index, 1);
                        enemy.health -= this.damage;
                        app.sound.playEffect(3, "enemyHit");
                        app.main.totalScore += 50;
                        if(enemy.health <= 0){
                            app.sound.playEffect(2, "explode");
                            var explodeX = enemy.x;
                            var explodeY = enemy.y;
                            var thisExplosion = new app.main.Explosion(explodeX, explodeY);
                            app.main.explosions.push(thisExplosion);
                            app.enemyManager.enemiesOnScreen.splice(i, 1);
                            app.main.totalScore += 100;
                        }
                    }
                }
            }
            this.draw(ctx);
        };
        
        //draws the bullet on screen
        this.draw = function(ctx){
            ctx.save();
            ctx.fillStyle = "blue";
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.restore();
        };
    },
    
    bullets: [], //hold all the bullets
    explosions: [], //hold all the explosions to be drawn
    
    roundLength: 30,
    roundTimer: undefined, //measured in seconds, keeps track of how long the user has to play to reach the end
    
    
    //methods
    //pasues the game
    pauseGame: function(){
        this.paused = true;
        this.sound.stopBGAudio(); //stops the background music from playing
        //cancel the animation frame
        cancelAnimationFrame(this.animationID);
        //call update once so pause screen is drawn
        this.update();
    },
    
    //resumes a paused game
    resumeGame: function(){
        cancelAnimationFrame(this.animationID);
        this.paused = false;
        this.sound.playBGAudio(); //loaded from sound module
        this.update();
    },
    
    //resets the game each round so that it can keep being played
    reset: function(){
        this.playerShip.health = 3;
        this.playerShip.init();
        this.enemyManager.init(this.ctx);
        this.bullets = [];
        this.explosions = [];
        if(this.roundWon){
            this.roundLength += 30;
            this.enemyManager.spawnTimerLimit *= 0.7;
            this.round++;
        }
        else{
            this.roundLength = 30;
            this.totalScore = 0;
            this.round = 1;
            this.enemyManager.spawnTimerLimit = 3.0;
            this.roundScoreReqBaseline = 0;
        }
        this.determineRoundScoreRequirement();
        this.roundTimer = this.roundLength;
        this.enemyManager.enemiesOnScreen = [];
        this.enemyManager.bullets = [];
        this.enemyManager.init(this.ctx);
    },
    
    //draws the pause screen on screen
    drawPauseScreen: function(ctx){
        ctx.save();
        //ctx.clearRect(0,0,this.Game.WIDTH, this.Game.HEIGHT);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        this.fillText(ctx,"...PAUSED...", this.Game.WIDTH/2., this.Game.HEIGHT/2, "30pt gameFont", "black");
        this.fillText(ctx,"...PAUSED...", this.Game.WIDTH/2., this.Game.HEIGHT/2, "30pt gameFont", "white");
        ctx.restore();
    },
    
    //function constructor that creates new explosion sprites so they can be drawn
    Explosion: function(x, y){
        this.startingX = 0;
        this.startingY = 0;
        this.x = x;
        this.y = y;
        this.completed = false;
        //animates the sprite
        this.update = function(){
            this.startingX += 64;
            
            if(this.startingX > 64*4){
                this.startingX = 0;
                this.startingY += 64;
                if(this.startingY > 64*4){
                    this.startingY = 0;
                    this.completed = true;
                }
            }
        }
    },
    
    //initializes all of the properties of app.main
    init: function(){
        //initializing properties
        this.canvas = document.querySelector("canvas");
        this.canvas.width = this.Game.WIDTH;
        this.canvas.height = this.Game.HEIGHT;
        this.ctx = this.canvas.getContext('2d');
        
        //find how far the canvas is offset on the x and y axes in the window
        this.xOffset = this.canvas.clientLeft;
        this.yOffset = this.canvas.clientTop;
        
        //start playing background music
        this.sound.playBGAudio();
        
        //load the splash screen image
        this.titleScreenImage = document.querySelector("#splashScreen");
        
        //load the sprite sheet for explosion
        this.explosionImage = document.querySelector("#explosionImg");
        
        //initialize playerShip
        this.playerShip.init();
        //initialize enemy spawns
        this.enemyManager.init(this.ctx);
        this.roundTimer = this.roundLength;
        
        //set round score requirement
        this.determineRoundScoreRequirement();
        
        window.addEventListener("keyup", function(e){
            if(e.keyCode == 76){
                var b = new app.main.Bullet();
                app.main.bullets.push(b);
                app.sound.playEffect(0, "player");
            }
        });
        
        window.addEventListener("keydown", function(e){
            app.main.onEnterDown();
        });
        
        this.gameState = this.GAME_STATE.TITLE_SCREEN //starting by default on the game due to MVP
                                                    //change to TITLE_SCREEN for more proven implementation
        this.update();
    },
    
    //checks to see if enter is being pressed and executes how to handle it
    onEnterDown: function(){
        //debugger;
        if(this.gameState == this.GAME_STATE.TITLE_SCREEN){
            if(app.main.inputManager.myKeys.keydown[app.main.inputManager.myKeys.KEYBOARD.KEY_ENTER]){
                this.sound.stopBGAudio();
                document.querySelector("#bgAudio").src = "sounds/GameBGM.mp3";
                this.sound.playBGAudio();
                app.main.gameState = app.main.GAME_STATE.GAME_MAIN;
            }
        }
        if(this.gameState == this.GAME_STATE.GAME_ROUND_OVER){
            if(app.main.inputManager.myKeys.keydown[app.main.inputManager.myKeys.KEYBOARD.KEY_ENTER]){
                this.reset();
                if(this.roundWon){
                    this.gameState = this.GAME_STATE.GAME_MAIN;
                }
                else{
                    this.sound.stopBGAudio();
                    document.querySelector("#bgAudio").src = "sounds/TitleScreenBGM.mp3";
                    this.sound.playBGAudio();
                    app.main.gameState = app.main.GAME_STATE.TITLE_SCREEN;
                }
            }
        }
    },
    
    //detects when roundTimer goes to 0
    validateRoundTimer: function(){
        if(this.roundTimer <= 0){
            this.roundTimer = 0;
            return true;
        }
        else{
            return false;
        }
    },
    
    //the game loop
    update: function(){
        //1) LOOP
        //schedule a call to update()
        this.animationID = requestAnimationFrame(this.update.bind(this));
        
        //2)PAUSED?
        //if so, bail out of the loop
        if(this.paused){
            this.drawPauseScreen(this.ctx);
            return;
        }
        
        //3) HOW MUCH TIME HAS GONE BY?
        var dt = this.calculateDeltaTime();
        
        //4) DRAW
        this.determineRoundOver();
        
        //i) Draw HUD
        this.drawHUD(this.ctx, dt);
    },
    
    //helper method to draw text on canvas
    fillText: function(ctx,string, x, y, css, color) {
		ctx.save();
		// https://developer.mozilla.org/en-US/docs/Web/CSS/font
		ctx.font = css;
		ctx.fillStyle = color;
		ctx.fillText(string, x, y);
		ctx.restore();
	},
    
    //gets the time inbetween frames
    calculateDeltaTime: function(){
		var now,fps;
		now = performance.now(); 
		fps = 1000 / (now - this.lastTime);
		fps = clamp(fps, 12, 60);
		this.lastTime = now; 
		return 1/fps;
	},
    
    //draws the game during each state
    drawHUD: function(ctx, dt){
        //draw the HUD elements
        
        //drawing the different screens
        //title screen
        if(this.gameState == this.GAME_STATE.TITLE_SCREEN){
            //debugger;
            ctx.save();
            ctx.clearRect(0,0,this.Game.WIDTH, this.Game.HEIGHT);
            ctx.drawImage(this.titleScreenImage, 0,0);
            
            ctx.restore();
            
        }
        //game screen
        if(this.gameState == this.GAME_STATE.GAME_MAIN){
            ctx.save();
            //i) Draw Background
            ctx.fillStyle = "black";//getRandomColor();
            ctx.fillRect(0,0,this.Game.WIDTH, this.Game.HEIGHT);
            
            //ii) Draw playerShip
            this.playerShip.draw(this.ctx);
            
            //iii) Draw enemies
            this.enemyManager.update(this.ctx);
            
            //iv) move bullets
            for(var i = 0; i < this.bullets.length; i++){
                this.bullets[i].moveBullet(this.ctx);
            }
            
            //v)draw explosions if there are any
            for(var i = 0; i < this.explosions.length; i++){
                this.explosions[i].update();
                if(this.explosions[i].completed){
                    this.explosions.splice(i, 1);
                    return;
                }
                this.ctx.drawImage(this.explosionImage, this.explosions[i].startingX, this.explosions[i].startingY, 64, 64, this.explosions[i].x, this.explosions[i].y, 64, 64);
            }
            
            //vi) update HUD
            if(!this.validateRoundTimer()){
                this.roundTimer -= dt;
            }
            //draw the timer
            this.fillText(this.ctx, "Time Left: " + Math.abs(this.roundTimer.toFixed(0)), this.xOffset + 10, this.yOffset + 20, "10pt gameFont", "white");
            //draw the score
            this.ctx.textAlign = "right";
            this.fillText(this.ctx, "Score: " + this.totalScore, this.xOffset + this.Game.WIDTH - 10, this.yOffset + 20, "10pt gameFont", "white");
            //draw the score requirement
            this.fillText(this.ctx, "Score Needed: " + this.roundScoreReqBaseline, this.xOffset + this.Game.WIDTH - 10, this.yOffset + 50, "10pt gameFont", "white")
            //draw round counter
            this.fillText(this.ctx, "Round: " + this.round, this.xOffset + this.Game.WIDTH - 10, this.yOffset + this.Game.HEIGHT - 20, "10pt gameFont", "white");
            
            this.ctx.textAlign = "left";
            this.fillText(this.ctx, "Lives: " + this.playerShip.health, this.xOffset + 10, this.yOffset + this.Game.HEIGHT - 20, "15pt gameFont", "white");
            //checks to if the current game state is the play state
            if(this.gameState == this.GAME_STATE.GAME_MAIN){
                this.inputManager.controlShipMovement();
            }
            
            ctx.restore();
        }
        //round over screen
        if(this.gameState == this.GAME_STATE.GAME_ROUND_OVER){
            ctx.save();
            
            //i)draw background
            //this.ctx.globalAlpha = 0.7;
            //this.ctx.fillStyle = "black";
            //this.ctx.fillRect(0,0,this.Game.WIDTH, this.Game.HEIGHT);
            
            //ii)determine round over screen
            ctx.fillStyle = "black";//getRandomColor();
            ctx.fillRect(0,0,this.Game.WIDTH, this.Game.HEIGHT);
            ctx.fillStyle = "red";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            if(app.main.validateRoundTimer() && this.totalScore >= this.roundScoreReqBaseline){
                this.fillText(this.ctx, "You Won! Press enter to continue", this.Game.WIDTH/2, this.Game.HEIGHT/2 - 50, "20pt gameFont", "blue");
                this.roundWon = true;
            }
            if(app.main.playerShip.health <= 0 || (this.validateRoundTimer() && this.totalScore < this.roundScoreReqBaseline)){
                this.fillText(this.ctx, "You lost.", this.Game.WIDTH/2, this.Game.HEIGHT/2 - 150, "20pt gameFont", "red");
                this.fillText(this.ctx, "Your final score was: " + this.totalScore, this.Game.WIDTH/2, this.Game.HEIGHT/2 - 100, "20pt gameFont", "red");
                this.fillText(this.ctx, "The score you needed was: " + this.roundScoreReqBaseline, this.Game.WIDTH/2, this.Game.HEIGHT/2 - 50, "20pt gameFont", "red");
                this.fillText(this.ctx, "Press enter to restart", this.Game.WIDTH/2, this.Game.HEIGHT/2 + 50, "20pt gameFont", "red");
                this.fillText(this.ctx, "You survived " + this.round + " round(s)", this.Game.WIDTH/2, this.Game.HEIGHT/2, "20pt gameFont", "red");
                this.roundWon = false;
            }
            
            ctx.restore();
        }
    },
    
    //checks to see if the round is over and changes the game's state
    determineRoundOver: function(){
        this.validateRoundTimer();
        if(app.main.playerShip.health <= 0 || app.main.validateRoundTimer()){
            this.sound.playEffect(2, "explode");
            app.main.gameState = app.main.GAME_STATE.GAME_ROUND_OVER;
        }
    },
    
    //method that sets the score the player needs in order to advance
    determineRoundScoreRequirement: function(){
        var enemiesInRound = Math.floor(this.roundLength/this.enemyManager.spawnTimerLimit);
        this.roundScoreReq = Math.floor(enemiesInRound * 250 * 0.65); //amount of enemies being spawned times the score you get to kill them
        this.roundScoreReqBaseline += this.roundScoreReq;
    }
};