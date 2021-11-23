import Phaser from "phaser";

import characterImage from "../../public/images/ball.png";

let character, keys, world;

let isMoving = false,
  isJumping = false,
  jumpCount = 0,
  flip = true;

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("hello-world");
  }

  preload() {
    this.load.image("character", characterImage);
  }

  create() {
    world = {
      width: this.physics.world.bounds.width,
      height: this.physics.world.bounds.height,
    };
    character = this.physics.add.sprite(
      world.width / 2,
      world.height,
      "character"
    );
    character.setCollideWorldBounds(true);

    keys = this.input.keyboard.addKeys({
      up: "w",
      down: "s",
      left: "a",
      right: "d",
    });
  }

  update() {
    isMoving = false;

    if (keys.left.isDown || keys.right.isDown) {
      isMoving = true;
    }

    // Character movement
    if (isMoving || isJumping) {
      if (keys.left.isDown) {
        character.setVelocityX(-200);
      } else if (keys.right.isDown) {
        character.setVelocityX(200);
      }
      // Stop horizontal movement
      // else if (keys.down.isDown) {
      //   character.setVelocityX(0);
      // }
    } else {
      character.setVelocityX(0);
    }
    // Character jump
    if (character.body.blocked.down) {
      jumpCount = 0;
      isJumping = false;
    }
    if (keys.up.isDown && flip === true) {
      jump();
      flip = false;
    }
    if (keys.up.isUp) {
      flip = true;
    }
  }
}

function jump() {
  isJumping = true;
  if (jumpCount < 2) {
    character.setVelocityY(-300);
    jumpCount++;
  }
}
