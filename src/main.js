import Phaser from 'phaser';

import HelloWorldScene from './scenes/game';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: true,
    },
  },
  scene: [HelloWorldScene],
};

export default new Phaser.Game(config);
