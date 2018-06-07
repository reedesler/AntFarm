import Block from './block';
import Tile from './tile';
const Simplex = require('perlin-simplex'); // tslint:disable-line

export default class Generator {
  private simplex;
  constructor() {
    this.simplex = new Simplex();
  }
  public generate(tile: Tile) {
    const n = this.noise(tile.x, tile.y, 0.002, 8, 0.7);
    if (n > 0) {
      tile.setEntity(new Block());
      tile.setCovered(true);
    }
  }

  private noise(x: number, y: number, frequency: number, octaves: number, persistence: number) {
    let total = 0;
    let amplitude = 1;
    let maxValue = 0;
    for (let i = 0; i < octaves; i++) {
      total += this.simplex.noise(x * frequency, y * frequency) * amplitude;

      maxValue += amplitude;

      amplitude *= persistence;
      frequency *= 2;
    }

    return total / maxValue;
  }
}
