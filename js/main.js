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


var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('ocean', 'assets/591.jpg');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.image('diamond','assets/diamond.png');
    game.load.image('bsquadron', 'assets/bsquadron1.png');
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

function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    ocean =game.add.tileSprite(0, 0, gameWidth, gameHeight, 'ocean');

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
    counter= counter+1;
    ocean.tilePosition.y += backgroundVelocity;
    depth -= 1;
    depthText.text= 'Depth: ' + depth + 'm';
    if(depth == 9000){
        line = new Phaser.Line(0,0, gameWidth,0);
        console.log("answer this question");
      // var ledge= platforms.create(0, 32, 'ground');
      // oxygenTank = oxygenTanks.create( 0,  0, 'oxygen');
      // ledge.body.immovable = true;
      // ledge.body.velocity.y=33;
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
