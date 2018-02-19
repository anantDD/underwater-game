const backgroundVelocity = 1.5;

const finalDepth = 9999;
const depthsOfLevels = [0,2500,5000,7500];

const soundFile = ['a','b','c','d'];

const numberOfStops = [4,5,6,7];
const timeBetweenStops = [60,50,40,30];

//Enemies and Pearls
const pearlVelocity = 50;
const monsterVelocity = 20;
const rarityOfSpawningPearls = 0.99;       // the higher the more rare. values between 0 and 1
const rarityOfSpawningEnemies = 0.99;     // the higher the more rare. values between 0  and 1
const typesOfEnemies = ['starfish','turtle','nemo', 'jellyfish', 'shark', 'bluewhale'];
const numberOfEnemies = [3,4,5,6];

const enemyDamage = [30,35,40,50]; 
const increaseInOxygenByPearls = [30,35,40,50];


//PLAYER
const playerFrameHeight = 90;  //depends on the tileSprite
const playerFrameWidth = 90;   //depends on the tileSprite
const playerInitialPositionY = gameHeight - 100;
const playerInitialPositionX = gameWidth/2;
const playerFrameRate = 10;
const playerVelocityLeft = -250;
const playerVelocityRight = 250;

//SCORE DISPLAY
const scorePositionX = gameWidth - 100;
const scorePositionY = 16;
const scoreColor = '#ffffff';
const scoreFontSize = '16px';
const scoreIncreasePerPearl = 10;


//DEPTH Display
const depthPositionX = 0;
const depthPositionY = 16;
const depthColor = '#ffffff';
const depthFontSize = '16px';

//levelLine
const levelLineSpeed = 900;      

//depthBar
const topX1 = 5;
const topX2 = 15;
const topY = 50;
const lengthOfBar = gameHeight-150;


//spawning
const xBeginSpawnPoint = topX2 +3;
const xEndSpawnPoint = gameWidth -10;
const yBeginSpawnPoint = 0;



// 2500/60*4=depth/current time

  

  var currentLevel = 0;
  var depth = 0;
  

  var oxygenLeft= 100;
  var score = 0;

  var currentDepthMarker;
  var oldDepthMarker =gameHeight -100 ;

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
  var levelparams;