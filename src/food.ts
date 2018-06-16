import LiveEntity from './liveEntity';
import { Colour } from './util';

export default class Food extends LiveEntity {
  public render() {
    return {
      char: '≈',
      foreground: Colour.GREEN,
    };
  }

  public tick() {
    if (Math.random() < 0.0005) {
      this.destroy();
    }
  }
}
