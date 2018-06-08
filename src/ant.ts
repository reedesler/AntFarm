import LiveEntity from './liveEntity';
import { Colour } from './util';

export default class Ant extends LiveEntity {
  public render() {
    return {
      char: '•',
      foreground: Colour.RED,
    };
  }

  public tick() {
    function getRandomInt(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    this.move(getRandomInt(-1, 1), getRandomInt(-1, 1));
  }
}
