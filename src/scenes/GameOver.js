import Phaser from 'phaser';
import gameOver from '../../public/assets/gameOver.png'; // For play button

import playAgain from '../../public/assets/playAgain.png'; // For play Again button

let x = 0,
  y = 0,
  width = window.innerWidth;

export default class GameLanding extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  init() {}

  preload() {
    // santa
    this.load.image('gameover', gameOver);

    // play again button
    this.load.image('playagain', playAgain);
  }

  create() {
    // save = this.matter.add.sprite(x - width * 0.5, y - height * 0.5, 'save');
    // save = this.matter.add.sprite(x - width * 0.5, y - height * 0.5, 'play');
    this.backgroundColor = '#182d3b';
    this.santa = this.add.sprite(width / 2 - 230, 200, 'gameover').setScale(1);

    var play = this.add
      .sprite(400, 400, 'playagain')
      .setInteractive()
      .setScale(0.8);

    play.on('pointerdown', function (pointer) {
      console.log('hi1');
      this.scene.scene.start('GameScene');
    });
  }

  update() {}
}
