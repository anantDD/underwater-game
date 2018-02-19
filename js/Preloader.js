Game.Preloader=function(game){
};
Game.Preloader.prototype ={
	preload:function(){
		this.load.image('ocean', 'assets/591.jpg');
		this.load.image('ground', 'assets/platform.png');
		this.load.image('pearl', 'assets/star.png');
		this.load.spritesheet('dude', 'assets/scuba3.png', playerFrameWidth, playerFrameHeight);  //https://www.artstation.com/artwork/e4eED
		this.load.image('starfish', 'assets/starfish.png');
		this.load.image('turtle','assets/turtle.jpg');
		this.load.image('nemo','assets/nemo.jpg');
		this.load.image('jellyfish','assets/jellyfish.jpg');
		this.load.image('shark','assets/shark.png');
		this.load.image('bluewhale','assets/bluewhale.jpg');
		this.load.image('titleScreen','assets/scary-jellyfish.gif');
		this.load.image('button','assets/button.png');

	},
	create:function(){

		this.state.start('MainMenu');
	}
}