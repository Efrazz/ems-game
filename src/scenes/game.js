import Phaser from 'phaser';

import playerImage from '../../public/images/ball.png';
// import playerImage from '../../public/images/santa/Idle (1).png';
import backgroundImage from '../../public/images/background/background.png';

let background, player, keys, world;

let isMoving = false,
  isJumping = false,
  jumpCount = 0,
  alreadyPressed = false;

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

    this.load.image('background', backgroundImage);
  }

  create() {
    keys = this.input.keyboard.addKeys({
      up: 'up',
      down: 'down',
      left: 'left',
      right: 'right',
    });

    // Getting width and height properties of the world and storing in object
    world = {
      width: this.physics.world.bounds.width,
      height: this.physics.world.bounds.height,
    };

    // Background
    background = this.add.tileSprite(0, 0, 0, world.height, 'background');
    background.setOrigin(0, 0);
    // let scaleHeight = world.height / background.setTileScale(scaleX, scaleY);

    // background = this.add
    //   .image(0, world.height, 'background')
    //   .setOrigin(0, 1)
    //   .setScrollFactor(0.25);

    // Adding and positioning the player, centered horizontally and at bottom vertically.
    player = this.physics.add.sprite(world.width / 2, world.height, 'player');
    // This will make player collide with world object
    player.setCollideWorldBounds(true);
  }

  update() {
    isMoving = false;

    // Change isMoving to true if left or right key is pressed down
    if (keys.left.isDown || keys.right.isDown) {
      isMoving = true;
    }

    // # Player movement

    if (isMoving || isJumping) {
      if (keys.left.isDown) {
        // player.setVelocityX(-gameOptions.playerSpeed);
        background.tilePositionX -= 4; // Move background left, creating illusion of moving character
      }
      if (keys.right.isDown) {
        // player.setVelocityX(gameOptions.playerSpeed);
        background.tilePositionX += 4; // Move background right, creating illusion of moving character
      }
      // Stop horizontal movement (Only needed if moving player instead of background)
      // if (keys.down.isDown) {
      //   player.setVelocityX(0);
      // }
    } else {
      player.setVelocityX(0);
    }
    // # player jump
    // # alreadyPressed is used to only allow on press of button

    // If player is on ground - set variable accordingly
    if (player.body.blocked.down) {
      jumpCount = 0;
      isJumping = false;
    }
    // If button "up" is pressed down and
    if (keys.up.isDown && alreadyPressed === false) {
      jump();
      alreadyPressed = true;
    } else if (keys.up.isUp) {
      alreadyPressed = false;
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
