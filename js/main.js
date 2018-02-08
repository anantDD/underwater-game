var gameHeight= window.innerHeight;
var gameWidth= window.innerWidth>400 ? 400 : window.screen.availWidth;

let el=document.getElementById('gameDiv');
el.style.width = gameWidth + "px" ;

var backgroundVelocity = 1.5;

var firstLevelDepth = 900;
var secondLevelDepth = 200;
var finalDepth = 9999;


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
var scorePositionX = gameWidth - 100;
var scorePositionY = gameHeight-16;
var scoreColor = '#ffff00';
var scoreFontSize = '16px';
var scoreIncreasePerStar = 10;

//DEPTH Display
var depthPositionX = 0;
var depthPositionY = gameHeight-16;
var depthColor = '#00ff00';
var depthFontSize = '16px';

var line;
var counter=0;

//LINE
var levelLineSpeed = 900;      

//depthBar
var topX1 = 5;
var topX2 = 15;
var topY = 50;
var lengthOfBar = gameHeight-150;
var currentDepthMarker;
var oldDepthMarker =gameHeight -100 ;

//spawning
var xBeginSpawnPoint = topX2 +3;
var xEndSpawnPoint = gameWidth -10;
var yBeginSpawnPoint = 0;
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
var levelLine;
var platforms;
var cursors;
var ocean;
var stars;
var alien;
var score = 0;
var scoreText;
var depth = finalDepth;
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
  levelLines = game.add.group();
  levelLines.enableBody = true;
  //  Oxygen
  oxygenTanks = game.add.group();
  oxygenTanks.enableBody = true;
  oxygenTanks.physicsBodyType = Phaser.Physics.ARCADE; 

  //  The score
  scoreText = game.add.text(scorePositionX, scorePositionY, 'Score: 0', { fontSize: scoreFontSize, fill: scoreColor });
  //  The depth
  depthText = game.add.text(depthPositionX, depthPositionY, 'Depth: 9999m', {fontSize: depthFontSize, fill: depthColor});
  //  Our controls.
  cursors = game.input.keyboard.createCursorKeys();

  // createLine(10,50,10,(gameHeight-200), 0);
  // createLine(20,gameHeight-100,30,gameHeight-100,0,1);
  // createLine(topX1, currentDepthMarker, topX2 , currentDepthMarker, 0,1);
  // createLine(0,gameHeight-100, 10, 50, 0,20);
  let graphics = game.add.graphics(0,0);

  graphics.lineStyle(1, 0x000066, 2);
  graphics.moveTo(topX1,topY);
  graphics.lineTo(topX1,lengthOfBar+topY);
  // graphics.lineTo(topX2+1,lengthOfBar+topY);
  // graphics.moveTo(topX2+1,topY);
  // graphics.lineTo(topX1,topY);
  for(let i=topY; i<=lengthOfBar+topY;i=i+5){
    graphics.moveTo(topX1,i);
    graphics.lineTo(topX2,i);
    console.log(i);
  }
  // graphics.destroy();
}

function update() {
  depth -= 1;
  counter= counter+1;
  currentDepthMarker = Math.round((lengthOfBar/finalDepth)*depth + topY);
  if(currentDepthMarker == oldDepthMarker-5){
    // console.log(currentDepthMarker);
    createLine(topX1, currentDepthMarker, topX2 , currentDepthMarker, 0,2, 0x00d955);
    oldDepthMarker = currentDepthMarker;
  }
  if(depth<=0){
    alert('Congratulations adventurer. You have reached the surface.');
    game.paused = true;
  }
  
  //  scrolling the background
  ocean.tilePosition.y += backgroundVelocity;

  //  Reset the players velocity (movement)
  player.body.velocity.x = 0;

  //  displaying depth
  depthText.text= 'Depth: ' + depth + 'm';

  //line denoting the level appears
  if(depth ==firstLevelDepth+50 || depth ==secondLevelDepth){
    levelLine = createLine(0,0,gameWidth,0,100,4, 0xffd9ff);
  }

  // Checks to see if the player overlaps with any of the stars or enemies or oxygen tanks or lines
  game.physics.arcade.overlap(player, stars, collectStar, null, this);
  game.physics.arcade.overlap(player, enemies, deathByEnemies, null, this);
  game.physics.arcade.overlap(player, oxygenTanks, collectOxygen, null, this);
  game.physics.arcade.overlap(player, levelLine, levelReached, null, this);
  
  // creating stars    
  if(Math.random() > rarityOfSpawningStars){
    var star = stars.create(Math.random()*(xEndSpawnPoint - xBeginSpawnPoint) + xBeginSpawnPoint, yBeginSpawnPoint, 'star');       
    star.body.velocity.y = 50;
  }
  //creating enemies
  if(Math.random() > rarityOfSpawningEnemies){
    createEnemy(Math.random()*(xEndSpawnPoint - xBeginSpawnPoint) + xBeginSpawnPoint, yBeginSpawnPoint, 'bsquadron');
  }
  //creating OxygenTanks
  if(Math.random() >rarityOfSpawningOxygenTanks){
     createOxygenTank();
  }
 
  //  Keys for player movement.
  if (cursors.left.isDown )
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
  if (game.input.pointer1.isDown) {
    if (game.input.x < (game.width / 2)) { //  Move to the left     
      player.body.velocity.x = -150;
      player.animations.play('left');
    }
    if (game.input.x >= (game.width / 2) ) { //  Move to the right    
      player.body.velocity.x = 150;
      player.animations.play('right');
    }
  }
}

function createLine(initialX, initialY, finalX, finalY, speed, width, color){
  let graphics = game.add.graphics(0,0);
  let line;
  graphics.lineStyle(width, color,2);
  graphics.moveTo(initialX,initialY);
  graphics.lineTo(finalX , finalY);  //gamewidth, 0
  line = game.add.sprite(initialX,initialY, graphics.generateTexture());
  // line.anchor.set(0,0);
  // levelLines.add(levelLine);
  graphics.destroy();
  if(speed){
    game.physics.arcade.enable(line);
    line.body.velocity.y = speed;
  }
  return line;
  
}

function createOxygenTank () {  
  oxygenTank = oxygenTanks.create( 0,  0, 'oxygen');
  oxygenTank.anchor.setTo(0.5, 0.5);
  oxygenTank.x = Math.random() * 798 + 1;
  oxygenTank.body.velocity.y = 50;
  //making the oxygenTanks patrol horizontally
  //var tween = game.add.tween(oxygenTank).to( { x: gameWidth+1000 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
  //oxygenTank.body.collideWorldBounds = true;
}

function createEnemy (x, y, typeOfEnemy) {
  enemy = enemies.create(x, y, typeOfEnemy);
  enemy.anchor.setTo(0.5,0.5);

  enemy.x= x;
  enemy.y= y;
  enemy.body.velocity.y = 100;
  //making the enemies patrol horizontally
  //var tween = game.add.tween(enemy).to( {x: x+400 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
  //enemy.body.collideWorldBounds = true;
}




function collectStar (player, star) {
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

function onSwipe() {
  return (Phaser.Point.distance(game.input.activePointer.position, game.input.activePointer.positionDown) > 150 &&
   game.input.activePointer.duration > 100 &&
   game.input.activePointer.duration < 250);
}

function levelReached(){
  console.log("answer this question");
  levelLine.kill();
  // el = document.getElementById("overlay");
  openMathsProblemScreen();
  game.paused = true;
}


