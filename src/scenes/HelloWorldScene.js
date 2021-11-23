/** @format */
import Phaser from "phaser";
let center,
	text,
	ball,
	player1,
	player2,
	player1Controls,
	player2Controls,
	startGame;

export default class HelloWorldScene extends Phaser.Scene {
	constructor() {
		super("hello-world");
	}

	preload() {
		this.load.image("ball", "./images/ball.png");
		this.load.image("track", "./images/track.png");
	}

	create() {
		center = {
			x: this.physics.world.bounds.width / 2,
			y: this.physics.world.bounds.height / 2,
		};
		this.add.image(500, 300, "ball");
		this.add.image(500, 200, "track");
		this.add.image(400, 100, "track");
		player1 = this.physics.add.sprite(19, center.y, "track");
        ball = this.physics.add.sprite(center.x, center.y, "ball");
        ball = this.physics.add.sprite(center.x, center.y, "ball");
       
        ball.setCollideWorldBounds(true)
        ball.setBounce(1);
        player1.setBounce(1);
		player1.setScale(1);
		player1.setCollideWorldBounds(true);
		player1.setImmovable(false);
		player1Controls = this.input.keyboard.createCursorKeys();
		// this.physics.add.image(400, 100, "ball");
	}
}
// update();
// {
// 	if (player1Controls.space.isDown) {ut 
// 		startGame = true;
// 		ball.setVelocityX(-100);
// 	}

// 	if (startGame) {
// 		this.physics.add.collider(player1, ball, bounce, null, this);
// 		this.physics.add.collider(player2, ball, bounce, null, this);

// 		if (player1Controls.up.isDown) {
// 			player1.setVelocity(0, -200);
// 		}
// 		if (player1Controls.down.isDown) {
// 			player1.setVelocity(0, 200);
// 		}
// 	}

// 	console.log("update");
// }

// function bounce(player, ball) {
// 	if (ball.body.velocity.x < 500) {
// 		ball.setVelocityX(ball.body.velocity.x * 1.2);
// 	}
// 	if (ball.y < player.y) {
// 		ball.setVelocityY(ball.body.velocity.y + 70);
// 	} else {
// 		ball.setVelocityY(ball.body.velocity.y - 70);
// 	}
// }

console.log("hello");
