import Block from './block';
import Tile from './tile';
import World from './world';
const Simplex = require('perlin-simplex'); // tslint:disable-line

export default class Generator {
  private simplex: any;
  private world: World;
  constructor(world: World) {
    this.simplex = new Simplex();
    this.world = world;
  }
  public generate(tile: Tile) {
    const n = this.noise(tile.x, tile.y, 0.002, 8, 0.7);
    if (n > 0) {
      tile.setEntity(new Block(this.world));
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
