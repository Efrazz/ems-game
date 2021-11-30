import Phaser from 'phaser';
import backgroundImage from '../../public/images/background/background.png';

import santaImage from '../../public/assets/santa.png'; // Sprite sheet
import santaAtlas from '../../public/assets/santa.json'; // For animations

import snowmanImage from '../../public/assets/snowman.png'; // snowman Sprite sheet
import snowmanAtlas from '../../public/assets/snowman.json'; // snowman For animations

import tileSheet from '../../public/assets/sheet.png';
import tileMap from '../../public/assets/game.json';

let snowman, player, keys, world;

let isMoving = false,
  isClimbing = false,
  touchingGround = true,
  jumpCount = 0,
  alreadyPressed = false;

// Global game options
let gameOptions = {
  playerGravity: 500,
  playerSpeed: 5,
  jumpForce: 5,
  playerStartPosition: 200,
  jumps: 2,
};

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene');
  }

  init() {
    keys = this.input.keyboard.addKeys({
      up: 'up',
      down: 'down',
      left: 'left',
      right: 'right',
    });
  }

  preload() {
    // Background
    this.load.image('background', backgroundImage);

    // Tiles
    this.load.image('tiles', tileSheet);
    this.load.tilemapTiledJSON('tilemap', tileMap);

    // Player
    this.load.atlas('santa', santaImage, santaAtlas);
    // Snowman
    this.load.atlas('snowman', snowmanImage, snowmanAtlas);
  }

  create() {
    // Getting width and height properties of the world and storing in object
    world = {
      width: this.scale.width,
      height: this.scale.height,
    };

    // Init animations
    this.createSantaAnimations();
    this.createSnowmanAnimations();

    // Background
    // this.background = this.add.tileSprite(
    //   world.width * 0.5,
    //   world.height * 0.5,
    //   0,
    //   world.height,
    //   'background'
    // );

    // Tiles
    const map = this.make.tilemap({ key: 'tilemap' });
    // "sheet" is the name of the tileset in iceworld.tmx | 'tiles' is the imported image loaded from sheet.png
    const tileset = map.addTilesetImage('sheet', 'tiles');

    // "ground" comes from iceworld.tmx and is the name of the layer
    const ground = map.createLayer('ground', tileset);
    // Set collision to true for objects in ground-layer with property "collides: true"
    ground.setCollisionByProperty({ collides: true });

    const objectsLayer = map.getObjectLayer('objects');
    objectsLayer.objects.forEach((objData) => {
      const { x = 0, y = 0, name, width, height } = objData;
      switch (name) {
        case 'spawn': {
          player = this.matter.add
            .sprite(x - width * 0.5, y - height * 0.5, 'santa')
            .setRectangle(32, 50)
            .setFixedRotation()
            .setOrigin(0.4, 0.5)
            .play('player-idle', true);
          break;
        }
        case 'enemy-spawn': {
          snowman = this.matter.add
            .sprite(x, y + 30, 'snowman', null, {
              label: 'enemy',
            })
            .setScale(0.5)
            .play('snowman-left', true)
            .setFixedRotation();

          break;
        }
        case 'ladder': {
          this.ladder = this.matter.add.rectangle(
            x + width * 0.5,
            y + height * 0.5,
            width,
            height,
            {
              isStatic: true,
              isSensor: true,
              label: 'ladder',
            }
          );
          break;
        }
      }
    });

    this.cameras.main.startFollow(player);

    this.matter.world.convertTilemapLayer(ground);
  }

  update() {
    isMoving = false;

    // Change isMoving to true if left or right key is pressed down
    if (keys.left.isDown || keys.right.isDown) {
      isMoving = true;
    }

    // # Player movement
    if (isMoving || !touchingGround) {
      if (keys.left.isDown) {
        // Adjust origin for hitbox alignment
        player.setOrigin(0.6, 0.5);

        player.flipX = true;
        if (!touchingGround) {
          player.setVelocityX(-gameOptions.playerSpeed);
        } else {
          player
            .setVelocityX(-gameOptions.playerSpeed)
            .play('player-walk', true);
        }
      } else if (keys.right.isDown) {
        // Adjust origin for hitbox alignment
        player.setOrigin(0.4, 0.5);

        player.flipX = false;
        if (!touchingGround) {
          player.setVelocityX(gameOptions.playerSpeed);
        } else {
          player
            .setVelocityX(gameOptions.playerSpeed)
            .play('player-walk', true);
        }
      }
      // Stop horizontal movement
    } else {
      player.setVelocityX(0).play('player-idle', true);
    }

    //Detect collisions
    player.setOnCollide((obj) => {
      jumpCount = 0;
      touchingGround = true;
      isClimbing = false;

      const collisionObj = obj.bodyB;

      if (collisionObj.label === 'enemy') {
        // Do this when colliding with enemy
        // ...
      }
      if (collisionObj.label === 'food') {
        // Do this when colliding with food
        // ...
      }
    });

    player.setOnCollideActive((data) => {
      const collisionObj = data.bodyB;

      // If colliding with ladder
      if (collisionObj.label === 'ladder' && !touchingGround) {
        console.log('climbing');
        player.setIgnoreGravity(true);
        isClimbing = true;
      }
    });

    player.setOnCollideEnd((data) => {
      const collisionObj = data.bodyB;

      // If colliding with ladder
      if (collisionObj.label === 'ladder') {
        console.log('climb end');
        player.setIgnoreGravity(false);
        isClimbing = false;
      }
    });

    // # Player jump
    // If player is not climbing, button "up" is pressed down button has not
    if (!isClimbing && keys.up.isDown && alreadyPressed === false) {
      this.jump();
      alreadyPressed = true;
    } else if (keys.up.isUp) {
      alreadyPressed = false;
    }

    // # climbing
    if (isClimbing) {
      this.climb();
    }
  }
  jump() {
    touchingGround = false;

    // Equal jump height
    if (jumpCount < gameOptions.jumps) {
      player.play('player-jump');
      player.setVelocityY(-gameOptions.jumpForce);
      jumpCount++;
    }

    // Reduced height second jump
    // if (jumpCount == 0) {
    //   player.play('player-jump');
    //   player.setVelocityY(-gameOptions.jumpForce);
    //   jumpCount++;
    // } else if (jumpCount == 1) {
    //   player.play('player-jump');
    //   player.setVelocityY(-gameOptions.jumpForce * 0.9);
    //   jumpCount++;
    // }
  }
  climb() {
    // gameOptions.playerGravity = 0;
    if (keys.up.isDown) {
      player.setVelocity(0, -5);
      player.setVelocity(0, 5);
    } else {
      player.setVelocity(0, 0);
    }
  }

  createSantaAnimations() {
    this.anims.create({
      key: 'player-idle',
      frameRate: 10,
      frames: this.anims.generateFrameNames('santa', {
        start: 1,
        end: 16,
        prefix: 'Idle (',
        suffix: ').png',
      }),
      repeat: -1,
    });
    this.anims.create({
      key: 'player-walk',
      frameRate: 20,
      frames: this.anims.generateFrameNames('santa', {
        start: 1,
        end: 11,
        prefix: 'Run (',
        suffix: ').png',
      }),
      repeat: -1,
    });
    this.anims.create({
      key: 'player-jump',
      frameRate: 30,
      frames: this.anims.generateFrameNames('santa', {
        start: 1,
        end: 16,
        prefix: 'Jump (',
        suffix: ').png',
      }),
    });
  }

  createSnowmanAnimations() {
    this.anims.create({
      key: 'snowman-left',
      frameRate: 10,
      frames: this.anims.generateFrameNames('snowman', {
        start: 1,
        end: 2,
        prefix: 'snowman_left_',
        suffix: '.png',
      }),
      repeat: -1,
    });

    this.anims.create({
      key: 'snowman-right',
      frameRate: 10,
      frames: this.anims.generateFrameNames('snowman', {
        start: 1,
        end: 2,
        prefix: 'snowman_right_',
        suffix: '.png',
      }),
      repeat: -1,
    });
  }

  // addPlatform(x, y, width) {
  //   let platform = this.physics.add.sprite(x, y, 'tile');
  //   platform.displayWidth = width;
  //   platform.setImmovable(true);
  //   platform.setScale(0.2);

  //   platformGroup.add(platform);
  // }
}

// What I've done
// Jump
// Movement left and right (should probably me changed to world moving for endless runner)
// Added variables for game settings, same could be done for player settings
