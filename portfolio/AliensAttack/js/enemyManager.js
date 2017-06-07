//enemyManager.js
//dependencies: 
//description: singleton object
//This is the main enemy class that contains function constructors for enemies as well as all the functions that they require
"use strict";

var app = app || {};

app.enemyManager = {
    enemiesOnScreen: [],
    bullets: [],
    //function constructor for a grunt enemy
    spawnTimer: 0,
    spawnTimerLimit: 3,
    //function constructor for basic types of enemies
    GruntEnemy: function(x, y){
        this.health = 15;
        this.width = 68;
        this.height = 94;
        this.x = x;
        this.y = y;
        this.fireTimer = 1;
        this.fireCooldown = 3000;
        this.parent = this;
        this.sprite = document.querySelector("#enemy");
        this.boundingBox = {
            minX: this.parent.x,
            minY: this.parent.y,
            maxX: this.parent.width + this.parent.x,
            maxY: this.parent.height + this.parent.y
        };
        this.color = "green";
        //draws the enemy on screen
        this.draw = function(ctx){
            ctx.save();
            
            ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
            
            ctx.restore();
            
            this.setBB();
        };
        //method that keeps track of bounding box on the enemy
        this.setBB = function(){
            this.boundingBox.minX = this.x;
            this.boundingBox.minY = this.y,
            this.boundingBox.maxX = this.width + this.x,
            this.boundingBox.maxY = this.height + this.y
        }
        //function that manages movement of movement of enemies
        this.moveEnemy = function(){
            this.y += 3;
            this.setBB();
            if(this.y - this.height >= app.main.Game.HEIGHT + app.main.yOffset){
                var index = app.enemyManager.enemiesOnScreen.indexOf(this);
                app.enemyManager.enemiesOnScreen.splice(index, 1);
            }
        },
        //method that allows the grunts to fire
        this.fire = function(){
            this.fireTimer += app.main.calculateDeltaTime();
            if(this.fireTimer >= 1.5){
                var b = new app.enemyManager.Bullet(this);
                app.enemyManager.bullets.push(b);
                this.fireTimer = 0;
                app.sound.playEffect(1, "enemy");
            }
        }
    },
    
    //function constructor that spawns bullets for the enemies
    Bullet: function(enemy){
        this.width = 5;
        this.height = 10;
        this.x = enemy.x + enemy.width/2 - this.width/2;
        this.y = enemy.y + enemy.height - 20;
        this.damage = 1;
        
        this.boundingBox = {
            minX: this.x,
            minY: this.y,
            maxX: this.x + this.width,
            maxY: this.y + this.height,
        };
        
        //sets the collision box for the bullets
        this.setBB = function(){
            this.boundingBox.minX = this.x;
            this.boundingBox.minY = this.y;
            this.boundingBox.maxX = this.x + this.width;
            this.boundingBox.maxY = this.y + this.height;
        };
        
        //moves the bullets across the screen
        this.moveBullet = function(ctx){
            this.y += 10;
            this.setBB();
            if(this.y - this.height >= app.main.Game.HEIGHT + app.main.yOffset){
                var index = app.enemyManager.bullets.indexOf(this);
                app.enemyManager.bullets.splice(index, 1);
            }
            else{
                var player = app.main.playerShip;
                if(detectCollision(this, player)){
                    app.sound.playEffect(4, "playerHit");
                    var index = app.enemyManager.bullets.indexOf(this);
                    app.enemyManager.bullets.splice(index, 1);
                    player.health -= this.damage;
                }
            }
            this.draw(ctx);
        };
        
        //draws the bullets on the screen
        this.draw = function(ctx){
            ctx.save();
            ctx.fillStyle = "red";
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.restore();
        };
    },
    
    //loops through the enemies array and draws them on screen
    drawEnemies: function(ctx){
        ctx.save();
        
        for(var i = 0; i < this.enemiesOnScreen.length; i++){
            if(this.enemiesOnScreen[i].health > 0){
                this.enemiesOnScreen[i].draw(ctx);
                this.enemiesOnScreen[i].moveEnemy();
            }
            else{
                this.enemiesOnScreen.splice(i, 1);
            }
        }
        
        ctx.restore();
    },
    
    //spawns enemies
    spawnEnemies: function(){
        //var enemy = new this.GruntEnemy(100, 100);
        this.spawnTimer += app.main.calculateDeltaTime();
        if(this.spawnTimer >= this.spawnTimerLimit){
            var enemy = new this.GruntEnemy(getRandom(app.main.xOffset, app.main.xOffset + app.main.Game.WIDTH - 50), -94);
            this.enemiesOnScreen.push(enemy);
            this.spawnTimer = 0;
        }
    },
    
    //init method that spawns the first round of enemies
    init: function(ctx){
        this.spawnEnemies();
        
        this.drawEnemies(ctx);
    },
    
    //update method that keeps track of enemies on screen
    update: function(ctx){
        
        //update position
        this.spawnEnemies();
        this.drawEnemies(ctx);
        
        //fire bullets
        for(var i = 0; i < this.enemiesOnScreen.length; i++){
            this.enemiesOnScreen[i].fire();
            this.enemiesOnScreen[i].move
        }
        
        //draw bullets
        for(var i = 0; i < this.bullets.length; i++){
            this.bullets[i].moveBullet(ctx);
        }
        
    },
};