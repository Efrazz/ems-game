import Phaser from 'phaser';
import backgroundImage from '../../public/images/background/background.png';

import santaImage from '../../public/assets/santa.png'; // Sprite sheet
import santaAtlas from '../../public/assets/santa.json'; // For animations
//import sound from '../../public/assets/mario.mp3'; // For animations

import tileSheet1 from '../../public/assets/sheet1.png';
import tileSheet from '../../public/assets/sheet.png';
import tileMap from '../../public/assets/game.json';
import star from '../../public/assets/star.png';

let background, player, keys, world, soundd;

let isMoving = false,
  touchingGround = true,
  jumpCount = 0,
  alreadyPressed = false;

// Global game options
let gameOptions = {
  playerGravity: 900,
  playerSpeed: 8,
  jumpForce: 14,
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
    this.load.image('star', star);
    this.load.audio('jumpsound', '../../music/mario.mp3');

    // Tiles
    this.load.image('tiles', tileSheet);
    this.load.image('tiles', tileSheet1);
    this.load.tilemapTiledJSON('tilemap', tileMap);

    // Player
    this.load.atlas('santa', santaImage, santaAtlas);
  }

  create() {
    soundd = this.sound.add('jumpsound');
    // Getting width and height properties of the world and storing in object
    world = {
      width: this.scale.width,
      height: this.scale.height,
    };

    // Init animations
    this.createSantaAnimations();

    // Tiles
    const map = this.make.tilemap({ key: 'tilemap' });
    // "sheet" is the name of the tileset in iceworld.tmx | 'tiles' is the imported image loaded from sheet.png
    const tileset = map.addTilesetImage('sheet', 'tiles');

    const tileProperties = tileset.tileProperties;
    console.log(tileProperties);

    // "ground" comes from iceworld.tmx and is the name of the layer
    const ground = map.createLayer('ground', tileset);
    // Set collision to true for objects in ground-layer with property "collides: true"
    ground.setCollisionByProperty({ collides: true });

    // const ladders =

    const objectsLayer = map.getObjectLayer('objects');
    objectsLayer.objects.forEach((objData) => {
      const { x = 0, y = 60, name, width, height } = objData;
      switch (name) {
        case 'spawn': {
          player = this.matter.add
            .sprite(x - width * 0.5, y - height * 0.5, 'santa')
            .play('player-idle', true)
            // stops santa from rotating
            .setFixedRotation();
          //player.setBounce(1);
          break;
        }
        case 'star': {
          this.matter.add.sprite(x + 60, y + 80, 'star', undefined, {
            isStatic: true,
            isSensor: true,
          });

          break;
        }
      }
    });
    let x = 0,
      y = 0;
    this.cameras.main.startFollow(player);
    // this.matter.add.sprite(x + 70, y + 50, 'star');
    this.matter.world.convertTilemapLayer(ground);
    player.setVelocityX(50);
  }

  update() {
    isMoving = false;

    // Change isMoving to true if left or right key is pressed down
    if (keys.left.isDown || keys.right.isDown) {
      isMoving = true;
    }

    if (isMoving || !touchingGround) {
      if (keys.left.isDown) {
        player.flipX = true;
        if (!touchingGround) {
          player.setVelocityX(-gameOptions.playerSpeed);
        } else {
          player
            .setVelocityX(-gameOptions.playerSpeed)
            .play('player-walk', true);
        }
      } else if (keys.right.isDown) {
        player.flipX = false;
        if (!touchingGround) {
          player.setVelocityX(gameOptions.playerSpeed);
        } else {
          player
            .setVelocityX(gameOptions.playerSpeed)
            .play('player-walk', true);
        }
      }

      // Stop horizontal movement (Only needed if moving player instead of background)
    } else {
      player.setVelocityX(0).play('player-idle', true);
    }

    //Detect collision with ground
    this.matter.world.on('collisionactive', (left, right, top, bottom) => {
      jumpCount = 0;
      touchingGround = true;
    });

    // If button "up" is pressed down and
    if (keys.up.isDown && alreadyPressed === false) {
      this.jump();
      soundd.play();
      alreadyPressed = true;
    } else if (keys.up.isUp) {
      alreadyPressed = false;
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
