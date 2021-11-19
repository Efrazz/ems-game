import Phaser from "phaser";

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("hello-world");
  }

  preload() {
    this.load.image("ball", "./images/ball.png");
  }

  create() {
    this.add.image(400, 300, "ball");

    this.physics.add.image(400, 100, "ball");
  }
}

console.log("hello");
