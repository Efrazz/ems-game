import Phaser from 'phaser';

import GameScene from './scenes/GameScene';
import GameLanding from './scenes/GameLanding';
import GameOver from './scenes/GameOver';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'matter',
    matter: {
      debug: true,
    },
  },
  // transparent: true,
  pixelArt: true,
  scene: [GameLanding, GameScene, GameOver],
};

export default new Phaser.Game(config);
