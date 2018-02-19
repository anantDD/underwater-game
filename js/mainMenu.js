Game.MainMenu=function(){

};

Game.MainMenu.prototype={
	create:function(game){
		this.createButton(game, 'PLAY', game.world.centerX, game.world.centerY, 300, 100, function(){
			this.state.start('main');
		})
		this.createButton(game, 'ABOUT', game.world.centerX, game.world.centerY + 100, 300, 100, function(){
			console.log('about the game');
		})

		 titleScreen = game.add.sprite(game.world.centerX,game.world.centerY - 192, 'titleScreen');
		 titleScreen.scale.setTo(0.5,0.5);
		 titleScreen.anchor.setTo(0.5,0.5);
		
		},
		update:function(game){
		},

		createButton:function(game, string, x, y , w, h, callback){
			var button1 = game.add.button(x,y,'button',callback,this,2,1,0);
			button1.anchor.setTo(0.5,0.5);
			button1.width = w;
			button1.height = h;

			var txt = game.add.text(button1.x, button1.y, string, {
				font:'14px Arial',
				fill: '#fff',
				align:'center'}
				);
			txt.anchor.setTo(0.5,0.5);
		}	


}