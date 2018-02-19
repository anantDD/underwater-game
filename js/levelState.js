var scoreWhenLevelBegins = [0,0,0,0];
var scoreInLevels = [0,0,0,0];

Game.levelState=function(game){
  // this.levelIndex= 0;
  //values in this will not be refreshed by loading a new level or restarting the current level.
  this.currentLevel = 0;
  this.depth = 0;
  // this.scoreInLevels = [0,0,0,0];

  this.oxygenLeft;
  this.score;
  this.depthIncrease;

  this.currentDepthMarker= lengthOfBar+topY;
  this.oldDepthMarker =gameHeight -100 ;

  this.player;
  this.levelLine;
  this.platforms;
  this.cursors;
  this.ocean;
  this.pearls;
  this.alien;

  this.scoreText;
  this.levelText;

  this.depthText;
  this.lineS;
  this.levelparams;

};
var startTime,endTime,x;

Game.levelState.prototype={
  levelIndex: 0,

  loadLevel:function(){
    this.levelparams = lvlData[this.levelIndex];    
    this.depth = this.levelparams.startingDepth;
    this.oxygenLeft= 100;
    this.depthIncrease = this.levelparams.depthIncrease;
    this.distanceBetweenOxygenStops = Math.round(2500/this.levelparams.numberOfStops);
    for(let i=0; i<this.levelIndex; i++){
      scoreWhenLevelBegins[this.levelIndex]+= scoreInLevels[i];
    }
    this.score = scoreWhenLevelBegins[this.levelIndex];

    // this.numOfEnemies = levelparams.
  },
  nextLevel:function() {
    console.log(this.score, 'a', scoreInLevels[this.levelIndex])
    scoreInLevels[this.levelIndex]= this.score;
    this.levelIndex++;
    this.state.start('main'); // just restart the same state
  },

  restartLevel:function(){
    this.state.start('main')
  },

  create:function(){
    console.log(this);
    this.loadLevel();
        console.log(this.distanceBetweenOxygenStops);

    this.physics.startSystem(Phaser.Physics.ARCADE);

    this.ocean =this.add.tileSprite(0, 0, gameWidth, gameHeight, 'ocean');

    //healthbar
    this.barConfig = {x: gameWidth/2, y: gameHeight-10, width:gameWidth-100, height:10};
    this.myHealthBar = new HealthBar(this.game, this.barConfig);

    // this.barConfigDepth = {x: gameWidth/2, y: gameHeight, width:gameWidth-100, height:10};
    // this.myDepthBar = new HealthBar(this.game, this.barConfigDepth);

    // this.barConfigDepth ={x:100, y:gameHeight/2, width:10, height:lengthOfBar};
    // this.myDepthBar=  new HealthBar(this.game,this.barConfigDepth);

    
    // The player and its settings
    this.player = this.add.sprite(playerInitialPositionX, playerInitialPositionY, 'dude');
    this.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true;
    this.player.body.setSize(90, 40 , 0, 25); // setting the collision area for the enemies. setSize(height, width, offsetX, offsetY)

    //  Our two animations, swimming left and right.
    this.player.animations.add('left', [0, 1, 2, 3,4,5,6,7], playerFrameRate, true);  //(name,frames,frameRate,loop)
    this.player.animations.add('right', [8,9,10,11,12,13,14,15], playerFrameRate, true);

    //  pearls to collect
    this.pearls = this.add.group();
    this.pearls.enableBody = true;
    this.pearls.outOfBoundsKill = true;

    //  Enemies
    enemies= this.add.group();
    enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.ARCADE;
    // enemies.createMultiple(1, 'jellyfish');
    // enemies.createMultiple(1, 'starfish');

    // enemies.createMultiple(1, 'turtle');

    // enemies.createMultiple(1, 'nemo');

    // enemies.createMultiple(1, 'bluewhale');

    // // enemies.createMultiple(1, 'shark');

    // enemies.setAll('anchor.x',0.5);
    // enemies.setAll('anchor.y',0.5);
    // enemies.setAll('outOfBoundsKill',true);
    // enemies.setAll('checkWorldBounds',true);
    
    // Lines
    this.levelLines = this.add.group();
    this.levelLines.enableBody = true;
    //  Oxygen
    // oxygenTanks = this.add.group();
    // oxygenTanks.enableBody = true;
    // oxygenTanks.physicsBodyType = Phaser.Physics.ARCADE; 

    scoreText = this.add.text(scorePositionX, scorePositionY, 'Score:' + scoreWhenLevelBegins[this.levelIndex], { fontSize: scoreFontSize, fill: scoreColor });
    this.levelText = this.add.text(depthPositionX, 0,'Level: '+ (this.levelIndex+1), {fontSize:depthFontSize, fill: depthColor});
    depthText = this.add.text(depthPositionX, depthPositionY, 'Depth: 9999m', {fontSize: depthFontSize, fill: depthColor});
    //  Our controls.
    cursors = this.input.keyboard.createCursorKeys();

    this.createDepthBar();

    if(this.levelIndex>=1){
      let graphics = this.add.graphics(100,100);
      // let rect = new Rectangle(topX1, this.currentDepthMarker, topX1-topX2, lengthOfBar/4);
      graphics.drawRect(topX1, this.currentDepthMarker, topX1-topX2, lengthOfBar/4);
    }
        // setInterval(function(){ alert("Hello"); }, 3000);
// 
  },
  createDepthBar:function(){
    let graphics = game.add.graphics(0,0);
    graphics.lineStyle(1, 0x000066, 2);
    graphics.moveTo(topX1,topY);
    graphics.lineTo(topX1,lengthOfBar+topY);

    game.add.text(0, lengthOfBar+topY+10, '0 m', { fontSize: '8px', fill: '#000000' });
    game.add.text(0, topY-10, '9999 m',{fontSize: '8px', fill: '#000000'});
    let n=0;
    for(let i=topY; i<=lengthOfBar+topY;i=i+5){
      if(i<this.currentDepthMarker){
        graphics.moveTo(topX1,i);
        graphics.lineTo(topX2,i);
      }else{
        graphics.lineStyle(1,0x009999,2);
        graphics.moveTo(topX1,i);
        graphics.lineTo(topX2,i);

      }
    }
    console.log(n);
  },

  update:function(){

    this.depth +=this.depthIncrease;
    this.oxygenLeft= clampOxygen(this.oxygenLeft-0.05);
    this.ocean.tilePosition.y += backgroundVelocity;
    this.player.body.velocity.x = 0;
    depthText.text= 'Depth: ' + Math.round(this.depth) + 'm';

    //when oxygen reaches 0
    if(this.oxygenLeft===0){
      console.log('restarting');
      this.restartLevel();
    }
    //when the depth in levels 1,2 and 3 becomes equal to the starting depth of the next level
    if(this.depth>=finalDepth){
        game.paused = true;
        alert('Congratulations adventurer. You have reached the surface.');
    }
    if(this.levelIndex<(lvlData.length-1) && this.depth >= lvlData[(this.levelIndex + 1)].startingDepth){
      this.nextLevel();
    }
    //game finished
    

    //filling up the depth bar
    this.currentDepthMarker = lengthOfBar +topY - Math.round(lengthOfBar*(this.depth/finalDepth)) ;
          // console.log(this.currentDepthMarker);

    // if(this.currentDepthMarker == this.oldDepthMarker-5){
    if(Math.round(this.depth)%10==0){
      // console.log(this.currentDepthMarker);
      createLine(topX1-1, this.currentDepthMarker-1, topX2-1 , this.currentDepthMarker-1, 0,2, 0xffd955);
      this.oldDepthMarker = this.currentDepthMarker;
    }
    // if(this.depth>=9999){
    //   alert('Congratulations adventurer. You have reached the surface.');
    //   this.paused = true;
    // }
    if(Math.round(this.depth)%10==0){
      this.myHealthBar.setPercent(this.oxygenLeft);
    }
    // if(Math.round(this.depth)%100==0){
    //   // this.myDepthBar.setPercent((this.depth/finalDepth)*100);
    //       this.myDepthBar.setPercentHeight((this.depth/finalDepth)*100);

    // }

    // this.myDepthBar.setPercentHeight((this.depth/finalDepth)*100);
    // if(depthsOfLevels.includes(this.depth)){
    //   levelUp();
    // }

    //oxygenStation line appears
    if(Math.round(this.depth)%this.distanceBetweenOxygenStops == 0){
      this.levelLine = createLine(0,0,gameWidth,0,100,4, 0xffd9ff);
    }

    // Checks to see if the player overlaps with any of the pearls or enemies or oxygen tanks or lines
    game.physics.arcade.overlap(this.player, this.pearls, collectPearl, null, this);
    game.physics.arcade.overlap(this.player, enemies, damagedByEnemies, null, this);
    this.physics.arcade.overlap(this.player, this.levelLine, oxygenStationReached, null, this);
    
    // creating pearls    
    if(Math.random() > rarityOfSpawningPearls){
      this.pearl = this.pearls.create(Math.random()*(xEndSpawnPoint - xBeginSpawnPoint) + xBeginSpawnPoint, yBeginSpawnPoint, 'pearl');       
      this.pearl.body.velocity.y = 50;
    }
    //creating enemies
    if(Math.random() > rarityOfSpawningEnemies){
      let monsterSelector=this.levelIndex + Math.floor(Math.random()*3);
      createEnemy(Math.random()*(xEndSpawnPoint - xBeginSpawnPoint) + xBeginSpawnPoint, yBeginSpawnPoint, typesOfEnemies[monsterSelector]);
    }

    //  Keys for player movement.
    if (cursors.left.isDown )
    {
        //  Move to the left
      this.player.body.velocity.x = playerVelocityLeft;
      this.player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
      //  Move to the right
      this.player.body.velocity.x = playerVelocityRight;
      this.player.animations.play('right');
    }

    // movement in touch screens
    if (game.input.pointer1.isDown) {
      if (game.input.x < (game.width / 2)) { //  Move to the left     
        this.player.body.velocity.x = -150;
        this.player.animations.play('left');
      }
      if (game.input.x >= (game.width / 2) ) { //  Move to the right    
        this.player.body.velocity.x = 150;
        this.player.animations.play('right');
      }
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

function createEnemy (x, y, typeOfEnemy, velocity) {
  enemy = enemies.create(x, y, typeOfEnemy);
  enemy.anchor.setTo(0.5,0.5);

  enemy.x= x;
  enemy.y= y;
  enemy.body.velocity.y = 100;
  enemy.outOfBoundsKill=true;

  enemy.checkWorldBounds=true;
  // enemy.setAll('outOfBoundsKill',true);
  // enemy.setAll('checkWorldBounds',true);
  
  enemy.body.setSize(32, 32 , 16, 16); // setting the collision area for the enemies. setSize(height, width, offsetX, offsetY)
}


function collectPearl (player, pearl) {
  pearl.kill();
  //  Add and update the score
  this.oxygenLeft=clampOxygen(this.oxygenLeft+20);
  this.score += scoreIncreasePerPearl;
  scoreText.text = 'Score: ' + this.score;
}

function damagedByEnemies (player, enemy){
  enemy.kill();
  this.oxygenLeft=clampOxygen(this.oxygenLeft-20);
}

function onSwipe() {
  return (Phaser.Point.distance(game.input.activePointer.position, game.input.activePointer.positionDown) > 150 &&
   game.input.activePointer.duration > 100 &&
   game.input.activePointer.duration < 250);
}

function oxygenStationReached(){
  this.levelLine.kill();
  console.log('asd');
  // el = document.getElementById("overlay");
  // openMathsProblemScreen();
  // game.paused = true;
}
function clampOxygen(val) {
    let max=100;
    let min=0;
    return  val > max ? max : val < min ? min : val;
}

