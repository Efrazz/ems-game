import Phaser from 'phaser';

import GameScene from './scenes/GameScene';
import GameLanding from './scenes/GameLanding';
import GameOver from './scenes/GameOver';

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
  transparent: true,

  pixelArt: true,
  scene: [GameLanding, GameScene, GameOver],
};

export default new Phaser.Game(config);
