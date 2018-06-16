import { CHUNK_SIZE, getRandomInt } from '../util';
import Generator from './generator';
import Tile from './tile';
import World from './world';

export default class Chunk {
  private tiles: Tile[][];
  private world: World;
  private col: number;
  private row: number;

  constructor(row: number, col: number, generator: Generator, world: World) {
    this.world = world;
    this.col = col;
    this.row = row;

    const xOffset = col * CHUNK_SIZE;
    const yOffset = row * CHUNK_SIZE;
    const arr: Tile[][] = [];

    for (let y = 0; y < CHUNK_SIZE; y++) {
      arr[y] = [];
      for (let x = 0; x < CHUNK_SIZE; x++) {
        const globX = xOffset + x;
        const globY = yOffset + y;
        const t = new Tile(globX, globY);
        generator.generate(t);
        arr[y][x] = t;
      }
    }

    this.tiles = arr;
  }

  public getTile(x: number, y: number) {
    return this.tiles[y][x];
  }

  public setTile(x: number, y: number, tile: Tile) {
    this.tiles[y][x] = tile;
  }

  public tick(): any {
    if (Math.random() < 0.001) {
      const { x, y } = this.globalCoords(
        getRandomInt(0, CHUNK_SIZE - 1),
        getRandomInt(0, CHUNK_SIZE - 1)
      );
      this.world.spawnFood(x, y);
    }
  }

  private globalCoords(x: number, y: number) {
    return {
      x: x + this.col * CHUNK_SIZE,
      y: y + this.row * CHUNK_SIZE,
    };
  }
}
