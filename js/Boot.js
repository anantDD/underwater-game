var Game={};
Game.Boot=function(game){
};

gameHeight= window.innerHeight;
gameWidth= window.innerWidth>400 ? 400 : window.screen.availWidth;

Game.Boot.prototype = {
	init:function(){
		// this.input.maxPointers = 1; //max nos. of inputs allowed at any one time.
		this.stage.disableVisibilityChange = true;  // doing something else does not pause the game. you cannot open a calculator midway
	},
	preload:function(){
		// this.load.image('preloaderBar','assets/preloader.png')
	},

	create:function(){
		this.state.start('Preloader');
	}
}