import Phaser from 'phaser';

import playerImage from '../../public/images/ball.png';

let player, keys, world;

let isMoving = false,
  isJumping = false,
  jumpCount = 0,
  btnDown = false;

// global game options
let gameOptions = {
  // platformStartSpeed: 350,
  // spawnRange: [100, 350],
  // platformSizeRange: [50, 250],
  // playerGravity: 900,
  playerSpeed: 200,
  jumpForce: 300,
  playerStartPosition: 200,
  jumps: 2,
};

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super('hello-world');
  }

  preload() {
    this.load.image('player', playerImage);
  }

  create() {
    keys = this.input.keyboard.addKeys({
      up: 'w',
      down: 's',
      left: 'a',
      right: 'd',
    });

    world = {
      width: this.physics.world.bounds.width,
      height: this.physics.world.bounds.height,
    };

    player = this.physics.add.sprite(world.width / 2, world.height, 'player');
    player.setCollideWorldBounds(true);
  }

  update() {
    isMoving = false;

    if (keys.left.isDown || keys.right.isDown) {
      isMoving = true;
    }

    // player movement
    if (isMoving || isJumping) {
      if (keys.left.isDown) {
        player.setVelocityX(-gameOptions.playerSpeed);
      } else if (keys.right.isDown) {
        player.setVelocityX(gameOptions.playerSpeed);
      }
      // Stop horizontal movement
      // else if (keys.down.isDown) {
      //   player.setVelocityX(0);
      // }
    } else {
      player.setVelocityX(0);
    }
    // # player jump
    // # btnDown is used to only allow on press of button
    // Reset jump when landing
    if (player.body.blocked.down) {
      jumpCount = 0;
      isJumping = false;
    }
    if (keys.up.isDown && btnDown === false) {
      jump();
      btnDown = true;
    }
    if (keys.up.isUp) {
      btnDown = false;
    }
  }
}

function jump() {
  isJumping = true;
  if (jumpCount < gameOptions.jumps) {
    player.setVelocityY(-gameOptions.jumpForce);
    jumpCount++;
  }
}

// What I've done
// Jump
// Movement left and right (should probably me changed to world moving for endless runner)
// Added variables for game settings, same could be done for player settings
