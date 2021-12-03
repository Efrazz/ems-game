import Phaser from 'phaser';

import GameScene from './scenes/GameScene';

const config = {
  type: Phaser.AUTO,
  width: 1600,
  height: 1200,
  physics: {
    default: 'matter',
    matter: {
      debug: false,
    },
  },
  scene: [GameScene],
};

export default new Phaser.Game(config);
