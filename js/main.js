let el=document.getElementById('gameDiv');
el.style.width = gameWidth + "px" ;

var backgroundVelocity = 1.5;

var currentLevel = 0;
var mainLevelDepths =[10000,7500,5000,2500]

var firstLevelDepth = finalDepth;
var secondLevelDepth = firstLevelDepth-(finalDepth+1)/4;
var thirdLevelDepth = secondLevelDepth-(finalDepth+1)/4
var fourthLevelDepth = thirdLevelDepth-(finalDepth+1)/4
var finalDepth = 9999;
var depth = finalDepth;
var enemyArray=['starfish','turtle','nemo', 'jellyfish', 'shark', 'bluewhale'];

var pearlVelocity = 50;
var monsterVelocity = 20;
var rarityOfSpawningPearls = 0.99;       // the higher the more rare. values between 0 and 1
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
var scorePositionY = 16;
var scoreColor = '#ffffff';
var scoreFontSize = '16px';
var scoreIncreasePerPearl = 10;
var score = 0;
//DEPTH Display
var depthPositionX = 0;
var depthPositionY = 16;
var depthColor = '#ffffff';
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

//oxygen
var oxygenLeft=100;
//spawning
var xBeginSpawnPoint = topX2 +3;
var xEndSpawnPoint = gameWidth -10;
var yBeginSpawnPoint = 0;

var player;
var levelLine;
var platforms;
var cursors;
var ocean;
var pearls;
var alien;

var scoreText;

var depthText;
var lineS;

function preload() {

}

function create() {

  //  We're going to be using physics, so enable the Arcade Physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);

  //  A simple background for our game
  ocean =game.add.tileSprite(0, 0, gameWidth, gameHeight, 'ocean');

  //healthbar
  var barConfig = {x: gameWidth/2, y: gameHeight-10, width:gameWidth-100, height:10};
  this.myHealthBar = new HealthBar(this.game, barConfig);
  
  // The player and its settings
  player = game.add.sprite(playerInitialPositionX, playerInitialPositionY, 'dude');
  game.physics.arcade.enable(player);
  player.body.collideWorldBounds = true;
  player.body.setSize(90, 40 , 0, 25); // setting the collision area for the enemies. setSize(height, width, offsetX, offsetY)

  //  Our two animations, swimming left and right.
  player.animations.add('left', [0, 1, 2, 3,4,5,6,7], playerFrameRate, true);  //(name,frames,frameRate,loop)
  player.animations.add('right', [8,9,10,11,12,13,14,15], playerFrameRate, true);

  //  pearls to collect
  pearls = game.add.group();
  pearls.enableBody = true;

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

  scoreText = game.add.text(scorePositionX, scorePositionY, 'Score: 0', { fontSize: scoreFontSize, fill: scoreColor });

  depthText = game.add.text(depthPositionX, depthPositionY, 'Depth: 9999m', {fontSize: depthFontSize, fill: depthColor});
  //  Our controls.
  cursors = game.input.keyboard.createCursorKeys();

  createDepthBar();
}

function update() {
  depth -= 1;
  counter= counter+1;
  oxygenLeft= clampOxygen(oxygenLeft-0.1);
  if(oxygenLeft===0){
    oxygenReachedZero();
  }
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
  if(depth%10==0){
    this.myHealthBar.setPercent(oxygenLeft);
  }
  if(mainLevelDepths.includes(depth)){
    levelUp();
  }
  
  //  scrolling the background
  ocean.tilePosition.y += backgroundVelocity;

  //  Reset the players velocity (movement)
  player.body.velocity.x = 0;

  //  displaying depth
  depthText.text= 'Depth: ' + depth + 'm';

  //line denoting the level appears
  if((depth)%500 == 0){
    levelLine = createLine(0,0,gameWidth,0,100,4, 0xffd9ff);
  }

  // Checks to see if the player overlaps with any of the pearls or enemies or oxygen tanks or lines
  game.physics.arcade.overlap(player, pearls, collectPearl, null, this);
  game.physics.arcade.overlap(player, enemies, deathByEnemies, null, this);
  // game.physics.arcade.overlap(player, oxygenTanks, collectOxygen, null, this);
  game.physics.arcade.overlap(player, levelLine, oxygenStationReached, null, this);
  
  // creating pearls    
  if(Math.random() > rarityOfSpawningPearls){
    var pearl = pearls.create(Math.random()*(xEndSpawnPoint - xBeginSpawnPoint) + xBeginSpawnPoint, yBeginSpawnPoint, 'pearl');       
    pearl.body.velocity.y = 50;
  }
  //creating enemies
  if(Math.random() > rarityOfSpawningEnemies){
    let monsterSelector=Math.floor(Math.random()*(3+currentLevel));
    createEnemy(Math.random()*(xEndSpawnPoint - xBeginSpawnPoint) + xBeginSpawnPoint, yBeginSpawnPoint, enemyArray[monsterSelector]);
  }
  //creating OxygenTanks
  // if(Math.random() >rarityOfSpawningOxygenTanks){
     // createOxygenTank();
  // }
 
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

function render() {

    // var p = game.input.getLocalPosition(image);
    // var p = game.input.getLocalPosition(image2);
    // var p = game.input.getLocalPosition(enemy, game.input.activePointer);


    // game.debug.pointInfo(p, 32, 32);
    // game.debug.point(p);
    // game.debug.text();
    // game.debug.spriteInfo(enemies, 32, 32);

    // game.debug.circle(enemies.hitArea);

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

function createEnemy (x, y, typeOfEnemy, velocity) {
  enemy = enemies.create(x, y, typeOfEnemy);
  enemy.anchor.setTo(0.5,0.5);

  enemy.x= x;
  enemy.y= y;
  enemy.body.velocity.y = 100;
  
  enemy.body.setSize(32, 32 , 16, 16); // setting the collision area for the enemies. setSize(height, width, offsetX, offsetY)
  //making the enemies patrol horizontally
  //var tween = game.add.tween(enemy).to( {x: x+400 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
  //enemy.body.collideWorldBounds = true;
}




function collectPearl (player, pearl) {
  pearl.kill();
  //  Add and update the score
  oxygenLeft=clampOxygen(oxygenLeft+20);
  score += scoreIncreasePerPearl;
  scoreText.text = 'Score: ' + score;

}

function deathByEnemies (player, enemy){
  enemy.kill();
  oxygenLeft=clampOxygen(oxygenLeft-20);
}

function onSwipe() {
  return (Phaser.Point.distance(game.input.activePointer.position, game.input.activePointer.positionDown) > 150 &&
   game.input.activePointer.duration > 100 &&
   game.input.activePointer.duration < 250);
}

function oxygenStationReached(){

  levelLine.kill();
  // el = document.getElementById("overlay");
  openMathsProblemScreen();
  game.paused = true;
}

function createDepthBar(){
  let graphics = game.add.graphics(0,0);
  graphics.lineStyle(1, 0x000066, 2);
  graphics.moveTo(topX1,topY);
  graphics.lineTo(topX1,lengthOfBar+topY);

  game.add.text(0, lengthOfBar+topY+10, '9999 m', { fontSize: '8px', fill: '#000000' });
  game.add.text(0, topY-10, '0 m',{fontSize: '8px', fill: '#000000'});

  for(let i=topY; i<=lengthOfBar+topY;i=i+5){
    graphics.moveTo(topX1,i);
    graphics.lineTo(topX2,i);
  }
}

function clampOxygen(val) {
    let max=100;
    let min=0;
    return  val > max ? max : val < min ? min : val;
}

function oxygenReachedZero(){
  // graphics.destroy();
  alert('Valar Morghulis');

  game.paused = true;
}

function levelUp(){
  currentLevel++;
  monsterVelocity+=20;
  changeSoundFile();
  // setupLevel();
}

function setupLevel(level){
  switch (currentLevel){
    case 1:
        monsterVelocity+= 20;
        break;
    case 2:
        break;
  }
}

function changeSoundFile(){

}