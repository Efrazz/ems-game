import Phaser from 'phaser';
import dieSanta from '../../public/assets/diesanta.png'; // For play button
import dieText from '../../public/assets/die.png'; // game name
import play from '../../public/assets/play.png'; // For play button

let save,
  diesanta,
  x = 0,
  y = 0,
  height = window.innerWidth,
  width = window.innerWidth;

export default class GameLanding extends Phaser.Scene {
  constructor() {
    super('GameLanding');
  }

  init() {}

  preload() {
    // santa
    this.load.image('diesanta', dieSanta);
    // Game name
    this.load.image('dietext', dieText);

    // play button
    this.load.image('play', play);
  }

  create() {
    // save = this.matter.add.sprite(x - width * 0.5, y - height * 0.5, 'save');
    // save = this.matter.add.sprite(x - width * 0.5, y - height * 0.5, 'play');
    this.backgroundColor = '#182d3b';
    this.santa = this.add
      .sprite(width / 2 - 230, 200, 'diesanta')
      .setScale(0.3);
    this.save = this.add.sprite(width / 2 - 250, 280, 'dietext').setScale(0.7);
    var play = this.add.sprite(400, 450, 'play').setInteractive();

    play.on('pointerdown', function (pointer) {
      console.log('hi1');
      this.scene.scene.start('GameScene');
    });
  }

  update() {}
}
