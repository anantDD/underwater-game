var gameHeight= 600;
var gameWidth= 400;
var backgroundVelocity = 1.5;

var starVelocity = 50;
var monsterVelocity = 20;
var rarityOfSpawningStars = 0.99;       // the higher the more rare. values between 0 and 1
var rarityOfSpawningEnemies = 0.99;     // the higher the more rare. values between 0  and 1
var rarityOfSpawningOxygenTanks = 0.999;
//PLAYER
var playerFrameHeight = 90;  //depends on the tileSprite
var playerFrameWidth = 90;   //depends on the tileSprite
var playerInitialPositionX = gameWidth/2;
var playerInitialPositionY = gameHeight - 100;
var playerFrameRate = 10;
var playerVelocityLeft = -250;
var playerVelocityRight = 250;
var playerVelocityUp = -40;
var playerVelocityDown= 500;
var playerGravity = 20;

//SCORE
var scorePositionX = 16;
var scorePositionY = 16;
var scoreColor = '#aaa';
var scoreFontSize = '32px';
var scoreIncreasePerStar = 10;
var line;
var counter=0;


var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'gameDiv', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('ocean', 'assets/591.jpg');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.image('diamond','assets/diamond.png');
    game.load.image('bsquadron', 'assets/3703.png');
    game.load.image('oxygen','assets/firstaid.png');
    game.load.spritesheet('dude', 'assets/scuba3.png', playerFrameWidth, playerFrameHeight);  //https://www.artstation.com/artwork/e4eED

}

var player;
var platforms;
var cursors;
var ocean;
var stars;
var alien;
var score = 0;
var scoreText;
var depth = 9999;
var depthText;
var lineS;

function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    ocean =game.add.tileSprite(0, 0, gameWidth, gameHeight, 'ocean');
    // ocean.anchor.setTo(100,100);
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();
    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // The player and its settings
    player = game.add.sprite(playerInitialPositionX, playerInitialPositionY, 'dude');
    //  We need to enable physics on the player
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    // player.body.gravity.y = 50;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3,4,5,6,7], playerFrameRate, true);  //(name,frames,frameRate,loop)
    player.animations.add('right', [8,9,10,11,12,13,14,15], playerFrameRate, true);

    //  Stars to collect
    stars = game.add.group();
    stars.enableBody = true;

    //  Enemies
    enemies= game.add.group();
    enemies.enableBody = true;

    // Lines
    lineS =game.add.group();
    lineS.enableBody = true;

    //  Oxygen
    oxygenTanks = game.add.group();
    oxygenTanks.enableBody = true;
    oxygenTanks.physicsBodyType = Phaser.Physics.ARCADE; 

    //  The score
    scoreText = game.add.text(scorePositionX, scorePositionY, 'score: 0', { fontSize: scoreFontSize, fill: scoreColor });
    //  The depth
    depthText = game.add.text(gameWidth - 200, scorePositionY, 'Depth: 9999m', {fontSize: '32px', fill: '#aa0'});
    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
/*
    // create a group for our lines
    linesGroup = game.add.group();
    linesGroup.enableBody = true;
    linesGroup.physicsBodyType = Phaser.Physics.ARCADE;
    // linesGroup.body.velocity.y= 30;

// created on the world
    let graphics = this.game.add.graphics(0,10); // adds to the world stage
    graphics.lineStyle(2, 0xFFFFFF, 1);
    graphics.lineTo(gameWidth, 1);
    linesGroup.add(graphics) // moves from world stage to group as a child
// create an instance of graphics, then add it to a group
    let graphics2 = this.game.make.graphics();
    graphics2.lineStyle(2, 0xFFFFFF, 1);
//graphics2.drawRect(500, 200, 250, 250);
    linesGroup.add(graphics2); // added directly to the group as a child
    */
}
function createLine(){
     var graphics = game.add.graphics(0,0);
    graphics.lineStyle(2, 0xffd9ff,1);
   // graphics.moveTo(0,50);
    graphics.lineTo(gameWidth ,0);
     levelLine = game.add.sprite(0,0, graphics.generateTexture());
    // levelLine.anchor.set(0);
    graphics.destroy();
    game.physics.arcade.enable(levelLine);
     levelLine.body.velocity.y = 30;

}
function createOxygenTank () {

    
    oxygenTank = oxygenTanks.create( 0,  0, 'oxygen');
    oxygenTank.anchor.setTo(0.5, 0.5);
    //oxygenTank.body.collideWorldBounds = true;
    oxygenTank.x = Math.random() * 798 + 1;
    
    //var tween = game.add.tween(oxygenTank).to( { x: gameWidth+1000 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    oxygenTank.body.velocity.y = 50;
}

function createEnemy (x, y, typeOfEnemy) {
    enemy = enemies.create(x, y, typeOfEnemy);
    enemy.anchor.setTo(0.5,0.5);

    enemy.x= x;
    enemy.y= y;

//    var tween = game.add.tween(enemy).to( {x: x+400 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    //enemy.body.collideWorldBounds = true;
    enemy.body.velocity.y = 100;
}


function update() {
    //  scrolling the background
    // levelLine.rotation += 0.01;

    counter= counter+1;
    ocean.tilePosition.y += backgroundVelocity;
    depth -= 1;
    depthText.text= 'Depth: ' + depth + 'm';
    if(depth == 9900){
        console.log("answer this question");
        createLine();
        // el = document.getElementById("overlay");
        openMathsProblemScreen(depth);
        game.paused = true;
    }
    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    //  Collide the player and the stars with the platforms
    // var hitPlatform = game.physics.arcade.collide(player, platforms);
    // game.physics.arcade.collide(stars, platforms);

    //  Checks to see if the player overlaps with any of the stars or enemies or oxygen tanks
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    game.physics.arcade.overlap(player, enemies, deathByEnemies, null, this);
    game.physics.arcade.overlap(player, oxygenTanks, collectOxygen, null, this);

    //  creating stars    
    if(Math.random() > rarityOfSpawningStars){
      var star = stars.create(Math.random()*gameWidth + 2, 0, 'star');       
      star.body.velocity.y = 50;
    }
    //creating enemies
    if(Math.random() > rarityOfSpawningEnemies){
      createEnemy(Math.random()*gameWidth, 0, 'bsquadron');
    }
    //creating OxygenTanks
    if(Math.random() >rarityOfSpawningOxygenTanks){
       createOxygenTank();
    }

   
    //  Keys for player movement.
    if (cursors.left.isDown)
    {
        //  Move to the left
      player.body.velocity.x = playerVelocityLeft;
      player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
      player.body.velocity.x = playerVelocityRight;
      player.animations.play('right');
    }
    else
    {
        //  Stand still
      // player.animations.stop();
      // player.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground.
    // if (cursors.up.isDown)
    // {
      // player.body.velocity.y = playerVelocityUp;
    // }else if(cursors.down.isDown){
        // player.body.velocity.y = playerVelocityDown;
    // }

}

function collectStar (player, star) {
    
    // Removes the star from the screen
    star.kill();
    //  Add and update the score
    score += scoreIncreasePerStar;
    scoreText.text = 'Score: ' + score;

}

function deathByEnemies (player, enemy){
    enemy.kill();
    console.log("YOU DIED.")
}

function collectOxygen (player, oxygen){
    oxygen.kill();
    console.log("Oxygen increased by 10%");
}

function openMathsProblemScreen(){
    /*$canvas = document.getElementsByTagName('canvas')[0];
    console.log($canvas);
    x= document.createElement('div');
    x.innerHTML = 'content';

    // $canvas.append("<h1> hi</h1>");
    $canvas.appendChild(x);
    */
    var html = "<button class = 'close' onclick = 'overlay()'></button><ul>";
 
    //Note: this is using code that is not present in this example file. Please see
    //http://www.joshmorony.com/how-to-create-ios-in-app-purchases-with-phonegap-build/
    //For information on how to include In App Purchases. Otherwise you can just remove this
   
    //Add all the normal items
    html += "<li>" +
    "<h3>Pink Headband</h3>" +
    "<p><img src = 'assets/buypinkheadband.png' /> Real ninjas wear pink! Let the colour of femininity and tenderness guide you on your path to greatness.</p>" +
    "<button id='pinkHeadband' type='button' " +
    "onclick='purchaseHeadband(\"pinkHeadband\", 5)'>5 <img class = 'shurikenPrice' src = 'assets/shurikenscore.png' /></button>" +
    "</li>"; 
 
    html += "<li>" +
    "<h3>Blue Headband</h3>" +
    "<p><img src = 'assets/buyblueheadband.png' /> It is said that the colour blue brings depth and stability. Maybe this headband will stop you falling off the rope so much?</p>" +
    "<button id = 'blueHeadband' type='button' " +
    "onclick='purchaseHeadband(\"blueHeadband\", 5)'>5 <img class = 'shurikenPrice' src = 'assets/shurikenscore.png' /></button>" +
    "</li>";
 
    html += "<li>" +
    "<h3>Level Pack</h3>" +
    "<p><img src = 'assets/buylevels.png' /> A ninja gets bored playing on the same old levels all the time. Purchase this to unlock 4 new levels to play on!</p>" +
    "<button id = 'levels' type='button' " +
    "onclick='purchaseLevels(5)'>5 <img class = 'shurikenPrice' src = 'assets/shurikenscore.png' /></button>" +
    "</li>"; 
 
    html += "<li>" +
    "<h3>Gold Ninja</h3>" +
    "<p><img src = 'assets/buygoldninja.png' /> The Gold Ninja is legend. It is prophecy that those who control the Gold Ninja will rise to the top of the leaderboards.</p>" +
    "<button id = 'goldninja' type='button' " +
    "onclick='purchaseNinja(5)'>5 <img class = 'shurikenPrice' src = 'assets/shurikenscore.png' /></button>" +
    "</li>";                 
 
    html += "</ul>";
    
 
    overlay(html);

}

