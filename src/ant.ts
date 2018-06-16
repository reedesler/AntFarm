import LiveEntity from './liveEntity';
import { Colour, getRandomInt } from './util';

export default class Ant extends LiveEntity {
  private dead = false;
  public render() {
    return {
      char: '•',
      foreground: this.dead ? Colour.BLACK : Colour.RED,
    };
  }

  public tick() {
    if (this.dead) return;
    this.move(getRandomInt(-1, 1), getRandomInt(-1, 1));
    if (Math.random() < 0.001) {
      this.dead = true;
    }
    if (Math.random() < 0.0001) {
      this.destroy();
    }
  }
}
