var gameHeight= 600;
var gameWidth= 800;
var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('ocean', 'assets/just.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.image('diamond','assets/diamond.png')
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

}

var player;
var platforms;
var cursors;
var ocean;
var stars;
var score = 0;
var scoreText;

function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    ocean =game.add.tileSprite(0, 0, 800, 600, 'ocean');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    //var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    //ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    //ground.body.immovable = true;

    //  Now let's create two ledges
    // var ledge = platforms.create(400, 400, 'ground');
    // ledge.body.immovable = true;

    // ledge = platforms.create(-150, 250, 'ground');
    // ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 90, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    //player.body.bounce.y = 0.2;
    //player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    diamonds=game.add.group();
    diamonds.enableBody = true;
    

    //  The score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    
}

function update() {
    ocean.tilePosition.y += 2;
    //  Collide the player and the stars with the platforms
    var hitPlatform = game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    game.physics.arcade.overlap(player, diamonds, deathByDiamonds, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if(Math.random()>0.99){
      var star = stars.create(Math.random()*799 + 2, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 100;
    }
    if(Math.random()>0.99){
      var diamond = diamonds.create(Math.random()*799 + 2, 0, 'diamond');

        //  Let gravity do its thing
        diamond.body.gravity.y = 150;
    }
    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -250;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 250;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground.
    //if (cursors.up.isDown && player.body.touching.down && hitPlatform)
    //{
     //   player.body.velocity.y = -350;
    //}

}

function collectStar (player, star) {
    
    // Removes the star from the screen
    star.kill();
    
    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

}

function deathByDiamonds (player, diamond){
    diamond.kill();
    alert("YOU DIED. NOOOOOB!!")
}
